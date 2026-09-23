const { Core } = require('@adobe/aio-sdk')
const libDb = require('@adobe/aio-lib-db')
const {
  validateUserToken
} = require('../utils')

async function main (params) {
  let client

  try {
    const { token } = params

    // Pagination params sent by the frontend.
    // Defaults keep old "load everything" behaviour if omitted.
    const page = Math.max(
      1,
      parseInt(params.page, 10) || 1
    )

    const limit = Math.max(
      1,
      parseInt(params.limit, 10) || 6
    )

    const skip = (page - 1) * limit

    const search = (params.search || '').trim()
    const category = (params.category || 'all').trim()
    const sortOption = params.sort || 'default'

    // Build the Mongo-style filter from the
    // search/category params sent by the frontend.
    const filter = {}

    if (search) {
      filter.title = {
        $regex: search,
        $options: 'i'
      }
    }

    if (category && category !== 'all') {
      filter.category = category
    }

    // Map the frontend sort option to a Mongo sort spec.
    const sortMap = {
      'price-low': { price: 1 },
      'price-high': { price: -1 },
      'rating-low': { 'rating.rate': 1 },
      'rating-high': { 'rating.rate': -1 },
      'name-az': { title: 1 },
      'name-za': { title: -1 }
    }

    const sortSpec = sortMap[sortOption]

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

    const totalCount =
      await products.countDocuments(filter)

    // Categories are collected from the full
    // collection, not just the current page/filter.
    const categories =
      await products.distinct('category')

    let productsQuery = products
        .find(filter)
        .skip(skip)
        .limit(limit)

    if (sortSpec) {
      productsQuery = productsQuery.sort(sortSpec)
    }

    const productList = await productsQuery.toArray()

    return {
      statusCode: 200,
      body: {
        success: true,
        authenticated: true,
        products: productList,
        count: productList.length,
        totalCount,
        page,
        limit,
        totalPages: Math.ceil(
          totalCount / limit
        ),
        categories
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