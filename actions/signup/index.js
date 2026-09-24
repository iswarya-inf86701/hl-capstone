const { Core } = require('@adobe/aio-sdk')
const libDb = require('@adobe/aio-lib-db')
const crypto = require('crypto')

async function main (params) {
  let client

  try {
    const { name, email, password } = params

    if (!name || !email || !password) {
      return {
        statusCode: 400,
        body: {
          success: false,
          message: 'Name, email and password are required'
        }
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        body: {
          success: false,
          message: 'Please enter a valid email address'
        }
      }
    }

    if (password.length < 6) {
      return {
        statusCode: 400,
        body: {
          success: false,
          message: 'Password must be at least 6 characters'
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

    const users = await client.collection('users')

    const normalizedEmail = email.trim().toLowerCase()

    let existingUser = null

    try {
      existingUser = await users.findOne({
        email: normalizedEmail
      })
    } catch (error) {
      if (!error.message?.includes('Document not found')) {
        throw error
      }
    }

    if (existingUser) {
      return {
        statusCode: 409,
        body: {
          success: false,
          message: 'User with this email already exists'
        }
      }
    }

    const passwordSalt = crypto
      .randomBytes(16)
      .toString('hex')

    const passwordHash = await new Promise(
      (resolve, reject) => {
        crypto.scrypt(
          password,
          passwordSalt,
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

    const result = await users.insertOne({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: passwordHash,
      passwordSalt: passwordSalt,
      createdAt: new Date().toISOString()
    })

    return {
      statusCode: 201,
      body: {
        success: true,
        message: 'User registered successfully',
        userId: result.insertedId
      }
    }
  } catch (error) {
    console.error('Signup error:', error)

    return {
      statusCode: 500,
      body: {
        success: false,
        message: error.message || 'Unable to create user'
      }
    }
  } finally {
    if (client) {
      await client.close()
    }
  }
}

exports.main = main