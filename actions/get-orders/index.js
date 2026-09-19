const { Core } = require('@adobe/aio-sdk')
const libDb = require('@adobe/aio-lib-db')
const {
  validateUserToken
} = require('../utils')

async function main (params) {
  let client

  try {
    const { token } = params

    // Validate application user token.
    // Orders are always scoped to the authenticated
    // user identified by the token, never a client-supplied id.
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

    const tokenResponse =
      await Core.AuthClient.generateAccessToken(params)

    const accessToken = tokenResponse.access_token

    const db = await libDb.init({
      token: accessToken,
      region: 'apac'
    })

    client = await db.connect()

    const orders = await client.collection('orders')

    const userOrders = await orders
      .find({ userId: authResult.user.id })
      .toArray()

    userOrders.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    )

    return {
      statusCode: 200,
      body: {
        success: true,
        orders: userOrders
      }
    }
  } catch (error) {
    console.log('Get orders failed:', error)

    return {
      statusCode: 500,
      body: {
        success: false,
        message: 'Unable to load order history. Please try again later.',
        orders: []
      }
    }
  } finally {
    if (client) {
      await client.close()
    }
  }
}

exports.main = main
