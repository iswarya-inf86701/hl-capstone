const { Core } = require('@adobe/aio-sdk')
const libDb = require('@adobe/aio-lib-db')
const {
  validateUserToken
} = require('../utils')

async function main (params) {
  let client

  try {
    const { productId, token } = params

    // Validate product ID
    if (!productId) {
      return {
        statusCode: 400,
        body: {
          success: false,
          message: 'Product ID is required'
        }
      }
    }

    // Validate application user token
    const authResult =
      await validateUserToken(
        params,
        token
      )

    if (!authResult.valid) {
      return {
        statusCode: 401,
        body: {
          success: false,
          authenticated: false,
          message: authResult.message
        }
      }
    }

    // Generate Adobe IMS access token
    // for App Builder DB access.
    const tokenResponse =
      await Core.AuthClient.generateAccessToken(
        params
      )

    const accessToken =
      tokenResponse.access_token

    // Initialize App Builder DB
    const db = await libDb.init({
      token: accessToken,
      region: 'apac'
    })

    client = await db.connect()

    const products =
      await client.collection('products')

    let product = null

    try {
      product = await products.findOne({
        productId: Number(productId)
      })
    } catch (error) {
      if (
        !error.message?.includes(
          'Document not found'
        )
      ) {
        throw error
      }
    }

    if (!product) {
      return {
        statusCode: 404,
        body: {
          success: false,
          message: 'Product not found'
        }
      }
    }

    return {
      statusCode: 200,
      body: {
        success: true,
        authenticated: true,
        product: product
      }
    }
  } catch (error) {
    console.log(
      'Get product details failed:',
      error
    )

    return {
      statusCode: 500,
      body: {
        success: false,
        message:
          error.message ||
          'Unable to get product details'
      }
    }
  } finally {
    if (client) {
      await client.close()
    }
  }
}

exports.main = main