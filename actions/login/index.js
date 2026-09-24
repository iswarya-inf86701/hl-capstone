const { Core } = require('@adobe/aio-sdk')
const libDb = require('@adobe/aio-lib-db')
const crypto = require('crypto')

async function main (params) {
  let client

  try {
    const { email, password } = params

    if (!email || !password) {
      return {
        statusCode: 400,
        body: {
          success: false,
          message: 'Email and password are required'
        }
      }
    }

    const normalizedEmail = email.trim().toLowerCase()

    const tokenResponse =
      await Core.AuthClient.generateAccessToken(params)

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
        email: normalizedEmail
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
          message: 'Invalid email or password'
        }
      }
    }

    if (!user.passwordSalt || !user.passwordHash) {
      return {
        statusCode: 401,
        body: {
          success: false,
          message: 'Invalid email or password'
        }
      }
    }

    const passwordHash = await new Promise(
      (resolve, reject) => {
        crypto.scrypt(
          password,
          user.passwordSalt,
          64,
          (error, derivedKey) => {
            if (error) {
              reject(error)
              return
            }

            resolve(
              derivedKey.toString('hex')
            )
          }
        )
      }
    )

    const storedHashBuffer =
      Buffer.from(user.passwordHash, 'hex')

    const enteredHashBuffer =
      Buffer.from(passwordHash, 'hex')

    const passwordsMatch =
      storedHashBuffer.length ===
        enteredHashBuffer.length &&
      crypto.timingSafeEqual(
        storedHashBuffer,
        enteredHashBuffer
      )

    if (!passwordsMatch) {
      return {
        statusCode: 401,
        body: {
          success: false,
          message: 'Invalid email or password'
        }
      }
    }

    const userToken =
      crypto.randomBytes(32).toString('hex')

    const tokenExpiresAt =
      new Date(
        Date.now() + 60 * 60 * 1000
      ).toISOString()

    await users.updateOne(
      {
        _id: user._id
      },
      {
        $set: {
          userToken: userToken,
          tokenExpiresAt: tokenExpiresAt
        }
      }
    )

    return {
      statusCode: 200,
      body: {
        success: true,
        message: 'Login successful',
        token: userToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        },
        expiresAt: tokenExpiresAt
      }
    }
  } catch (error) {
    console.log('Login request failed:', error)

    return {
      statusCode: 500,
      body: {
        success: false,
        message: 'Unable to login'
      }
    }
  } finally {
    if (client) {
      await client.close()
    }
  }
}

exports.main = main