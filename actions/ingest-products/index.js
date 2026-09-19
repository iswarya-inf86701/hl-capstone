const { Core } = require('@adobe/aio-sdk')
const libDb = require('@adobe/aio-lib-db')
const productsData = require('../data/products.json')

async function main (params) {
  let client

  try {
    const tokenResponse =
      await Core.AuthClient.generateAccessToken(params)

    const accessToken =
      tokenResponse.access_token

    const db = await libDb.init({
      token: accessToken,
      region: 'apac'
    })

    client = await db.connect()

    const products =
      await client.collection('products')

    if (
      !Array.isArray(productsData) ||
      productsData.length === 0
    ) {
      return {
        statusCode: 200,
        body: {
          success: true,
          message: 'No products found to ingest',
          count: 0
        }
      }
    }

    // Remove existing products so ingestion
    // always creates a clean product catalog.
    await products.deleteMany({})

    const documents = productsData.map(
      (product) => ({
        productId: product.id,
        title: product.title,
        price: product.price,
        description: product.description,
        category: product.category,
        image: product.image,
        rating: product.rating,
        ingestedAt:
          new Date().toISOString()
      })
    )

    const result =
      await products.insertMany(documents)

    return {
      statusCode: 200,
      body: {
        success: true,
        message:
          'Products ingested successfully',
        count: result.insertedCount
      }
    }
  } catch (error) {
    console.log(
      'Product ingestion failed:',
      error
    )

    return {
      statusCode: 500,
      body: {
        success: false,
        message:
          error.message ||
          'Unable to ingest products'
      }
    }
  } finally {
    if (client) {
      await client.close()
    }
  }
}

exports.main = main