const { Core } = require('@adobe/aio-sdk')
const libDb = require('@adobe/aio-lib-db')

async function main (params) {
  let client

  try {
    const { token } = params

    if (!token) {
      return {
        statusCode: 400,
        body: {
          success: false,
          authenticated: false,
          message: 'Authentication token is required'
        }
      }
    }

    const tokenResponse = await Core.AuthClient.generateAccessToken(params)
    const accessToken = tokenResponse.access_token

    const db = await libDb.init({
      token: accessToken,
      region: 'apac'
    })

    client = await db.connect()

    const users = await client.collection('users')

    let user = null

    try {
      user = await users.findOne({
        userToken: token
      })
    } catch (error) {
      if (!error.message?.includes('Document not found')) {
        throw error
      }
    }

    if (!user) {
      return {
        statusCode: 401,
        body: {
          success: false,
          authenticated: false,
          message: 'Invalid authentication token'
        }
      }
    }

    const currentTime = Date.now()
    const tokenExpiryTime = new Date(user.tokenExpiresAt).getTime()

    if (
      !user.tokenExpiresAt ||
      Number.isNaN(tokenExpiryTime) ||
      currentTime >= tokenExpiryTime
    ) {
      return {
        statusCode: 401,
        body: {
          success: false,
          authenticated: false,
          message: 'Your session has expired. Please log in again.'
        }
      }
    }

    return {
      statusCode: 200,
      body: {
        success: true,
        authenticated: true,
        message: 'Token is valid',
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        },
        expiresAt: user.tokenExpiresAt
      }
    }
  } catch (error) {
    console.log('Token validation error:', error)

    return {
      statusCode: 500,
      body: {
        success: false,
        authenticated: false,
        message: 'Unable to validate authentication token'
      }
    }
  } finally {
    if (client) {
      await client.close()
    }
  }
}

exports.main = main