const { Core } = require('@adobe/aio-sdk')
const libDb = require('@adobe/aio-lib-db')
const {
  validateUserToken
} = require('../utils')

async function main (params) {
  let client

  try {
    const { token } = params

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

    const productList =
      await products.find({}).toArray()

    return {
      statusCode: 200,
      body: {
        success: true,
        authenticated: true,
        products: productList,
        count: productList.length
      }
    }
  } catch (error) {
    console.log(
      'Get products failed:',
      error
    )

    return {
      statusCode: 500,
      body: {
        success: false,
        message:
          error.message ||
          'Unable to get products',
        products: []
      }
    }
  } finally {
    if (client) {
      await client.close()
    }
  }
}

exports.main = main