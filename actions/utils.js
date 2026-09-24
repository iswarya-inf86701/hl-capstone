const { Core } = require('@adobe/aio-sdk')
const libDb = require('@adobe/aio-lib-db')

/**
 * Validate the application user token.
 *
 * The application token is the random token generated
 * during login and stored in the users collection.
 *
 * This is different from the Adobe IMS access token,
 * which is generated only for App Builder service access.
 */
async function validateUserToken (params, token) {
  let client

  try {
    if (!token) {
      return {
        valid: false,
        message: 'Authentication token is required'
      }
    }

    const tokenResponse =
      await Core.AuthClient.generateAccessToken(params)

    const accessToken =
      tokenResponse.access_token

    const db = await libDb.init({
      token: accessToken,
      region: 'apac'
    })

    client = await db.connect()

    const users =
      await client.collection('users')

    let user = null

    try {
      user = await users.findOne({
        userToken: token
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

    if (!user) {
      return {
        valid: false,
        message: 'Invalid authentication token'
      }
    }

    const tokenExpiryTime =
      new Date(
        user.tokenExpiresAt
      ).getTime()

    if (
      !user.tokenExpiresAt ||
      Number.isNaN(tokenExpiryTime) ||
      Date.now() >= tokenExpiryTime
    ) {
      return {
        valid: false,
        message:
          'Your session has expired. Please log in again.'
      }
    }

    return {
      valid: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      expiresAt: user.tokenExpiresAt
    }
  } catch (error) {
    console.log(
      'User token validation failed:',
      error
    )

    return {
      valid: false,
      message:
        'Unable to validate authentication token'
    }
  } finally {
    if (client) {
      await client.close()
    }
  }
}

module.exports = {
  validateUserToken
}