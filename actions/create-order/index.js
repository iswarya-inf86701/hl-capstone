const { Core } = require('@adobe/aio-sdk')
const libDb = require('@adobe/aio-lib-db')
const crypto = require('crypto')
const {
  validateUserToken
} = require('../utils')

async function main (params) {
  let client

  try {
    const { token, items } = params

    // Validate application user token.
    // The authenticated user identity always
    // comes from the token, never from the frontend.
    const authResult =
      await validateUserToken(params, token)

    if (!authResult.valid) {
      return {
        statusCode: 401,
        body: {
          success: false,
          message: authResult.message
        }
      }
    }

    if (!Array.isArray(items) || items.length === 0) {
      return {
        statusCode: 400,
        body: {
          success: false,
          message: 'Order must contain at least one item'
        }
      }
    }

    const orderItems = items.map((item) => ({
      productId: item.productId,
      title: item.title,
      price: Number(item.price),
      quantity: Number(item.quantity),
      image: item.image
    }))

    const totalItems = orderItems.reduce(
      (total, item) => total + item.quantity,
      0
    )

    const totalAmount = orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    )

    const orderId = `ORD-${crypto
      .randomBytes(6)
      .toString('hex')
      .toUpperCase()}`

    const tokenResponse =
      await Core.AuthClient.generateAccessToken(params)

    const accessToken = tokenResponse.access_token

    const db = await libDb.init({
      token: accessToken,
      region: 'apac'
    })

    client = await db.connect()

    const orders = await client.collection('orders')

    await orders.insertOne({
      orderId,
      userId: authResult.user.id,
      userEmail: authResult.user.email,
      items: orderItems,
      totalItems,
      totalAmount,
      status: 'Placed',
      createdAt: new Date().toISOString()
    })

    return {
      statusCode: 201,
      body: {
        success: true,
        message: 'Order placed successfully',
        orderId
      }
    }
  } catch (error) {
    console.log('Create order failed:', error)

    return {
      statusCode: 500,
      body: {
        success: false,
        message: 'Unable to place your order. Please try again.'
      }
    }
  } finally {
    if (client) {
      await client.close()
    }
  }
}

exports.main = main
