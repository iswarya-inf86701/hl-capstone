const { Core } = require('@adobe/aio-sdk')
const libDb = require('@adobe/aio-lib-db')
const crypto = require('crypto')

async function main(params) {
  let client

  try {
    const { name, email, password } = params

    // Validate input
    if (!name || !email || !password) {
      return {
        statusCode: 400,
        body: {
          success: false,
          message: 'Name, email and password are required'
        }
      }
    }

    // Basic email validation
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

    // Generate IMS access token for Database Storage
    const token = await Core.AuthClient.generateAccessToken(params)

    // Initialize App Builder Database
    const db = await libDb.init({
      token: token.access_token,
      region: 'apac'
    })

    // Connect to database
    client = await db.connect()

    // Get users collection
    const users = await client.collection('users')

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase()

    // Check if user already exists
    const existingUser = await users.findOne({
      email: normalizedEmail
    })

    if (existingUser) {
      return {
        statusCode: 409,
        body: {
          success: false,
          message: 'User with this email already exists'
        }
      }
    }

    // Hash password before storing it
    const passwordHash = crypto
      .createHash('sha256')
      .update(password)
      .digest('hex')

    // Store user
    const result = await users.insertOne({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: passwordHash,
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
        message: 'Unable to create user'
      }
    }

  } finally {
    if (client) {
      await client.close()
    }
  }
}

exports.main = main