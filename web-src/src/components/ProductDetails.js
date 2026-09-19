import React, { useEffect, useState } from 'react'
import {
  Heading,
  View,
  Text,
  Flex,
  ProgressCircle,
  Button
} from '@adobe/react-spectrum'
import { useNavigate, useParams } from 'react-router-dom'

import actionWebInvoke from '../utils'
import allActions from '../config.json'
import { useCart } from './CartContext'
import './Products.css'

export function ProductDetails () {
  const { productId } = useParams()
  const navigate = useNavigate()

  const {
    addToCart,
    cartQuantity
  } = useCart()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadProductDetails()
  }, [productId])

  async function loadProductDetails () {
    setLoading(true)
    setError('')
    setProduct(null)

    try {
      const userToken =
        sessionStorage.getItem('userToken')

      if (!userToken) {
        setError(
          'Your session has expired. Please log in again.'
        )
        return
      }

      const response = await actionWebInvoke(
        allActions[
          'hl-capstone/get-product-details'
        ],
        {},
        {
          productId: productId,
          token: userToken
        }
      )

      console.log(
        'Product details response:',
        response
      )

      if (response.success === true) {
        setProduct(response.product)
      } else {
        setError(
          response.message ||
          'Product not found.'
        )
      }
    } catch (err) {
      console.log(
        'Product details request failed:',
        err
      )

      if (err.status === 401) {
        setError(
          'Your session has expired. Please log in again.'
        )
      } else if (err.status === 404) {
        setError('Product not found.')
      } else {
        setError(
          'Unable to load product details. Please try again later.'
        )
      }
    } finally {
      setLoading(false)
    }
  }

  function goBackToHome () {
    navigate('/')
  }

  function handleAddToCart () {
    addToCart(product)
  }

  function goToCart () {
    navigate('/cart')
  }

  if (loading) {
    return (
      <View
        width="100%"
        padding="size-400"
      >
        <Flex
          direction="column"
          alignItems="center"
          gap="size-200"
        >
          <ProgressCircle
            size="L"
            isIndeterminate
            aria-label="Loading product details"
          />

          <Text>
            Loading product details...
          </Text>
        </Flex>
      </View>
    )
  }

  if (error) {
    return (
      <View
        width="100%"
        padding="size-400"
        UNSAFE_style={{
          boxSizing: 'border-box',
          maxWidth: '100%',
          overflowX: 'hidden'
        }}
      >
        <Button
          variant="secondary"
          onPress={goBackToHome}
        >
          Back to Products
        </Button>

        <Heading
          level={1}
          marginTop="size-400"
        >
          Product Not Found
        </Heading>

        <Text
          UNSAFE_style={{
            display: 'block',
            color: '#d7373f',
            marginTop: '16px'
          }}
        >
          {error}
        </Text>
      </View>
    )
  }

  if (!product) {
    return null
  }

  return (
    <View
      width="100%"
      padding="size-400"
      UNSAFE_style={{
        boxSizing: 'border-box',
        maxWidth: '100%',
        overflowX: 'hidden'
      }}
    >
      {/* Back Button */}
      <Button
        variant="secondary"
        onPress={goBackToHome}
      >
        Back to Products
      </Button>

      {/* Product Details */}
      <View
        UNSAFE_className="product-details-layout"
        UNSAFE_style={{
          display: 'grid',
          gridTemplateColumns:
            'minmax(280px, 1fr) minmax(280px, 1fr)',
          gap: '48px',
          maxWidth: '1100px',
          margin: '40px auto 0'
        }}
      >
        {/* Product Image */}
        <View
          UNSAFE_style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '450px',
            backgroundColor: '#f7f7f7',
            borderRadius: '12px',
            padding: '32px',
            boxSizing: 'border-box'
          }}
        >
          <img
            src={product.image}
            alt={product.title}
            style={{
              maxWidth: '100%',
              maxHeight: '420px',
              objectFit: 'contain'
            }}
          />
        </View>

        {/* Product Information */}
        <View
          UNSAFE_style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minWidth: 0
          }}
        >
          {/* Category */}
          <Text
            UNSAFE_style={{
              display: 'block',
              fontSize: '14px',
              textTransform: 'capitalize',
              marginBottom: '12px'
            }}
          >
            {product.category}
          </Text>

          {/* Title */}
          <Heading
            level={1}
            UNSAFE_style={{
              margin: 0,
              lineHeight: '1.3'
            }}
          >
            {product.title}
          </Heading>

          {/* Price */}
          <Text
            UNSAFE_style={{
              display: 'block',
              fontSize: '28px',
              fontWeight: '700',
              marginTop: '20px',
              marginBottom: '12px'
            }}
          >
            ${product.price}
          </Text>

          {/* Rating */}
          {product.rating && (
            <Text
              UNSAFE_style={{
                display: 'block',
                fontSize: '16px',
                marginBottom: '24px'
              }}
            >
              ⭐ {product.rating.rate} (
              {product.rating.count} reviews)
            </Text>
          )}

          {/* Description */}
          <Text
            UNSAFE_style={{
              display: 'block',
              fontSize: '16px',
              lineHeight: '1.6',
              marginBottom: '28px'
            }}
          >
            {product.description}
          </Text>

          {/* Product ID */}
          <Text
            UNSAFE_style={{
              display: 'block',
              fontSize: '14px',
              marginBottom: '24px'
            }}
          >
            Product ID: {product.productId}
          </Text>

          {/* Cart Actions */}
          <Flex
            direction="column"
            gap="size-200"
          >
            <Button
              variant="accent"
              onPress={handleAddToCart}
            >
              Add to Cart
            </Button>

            <Button
              variant="secondary"
              onPress={goToCart}
            >
              View Cart ({cartQuantity})
            </Button>

            <Button
              variant="secondary"
              onPress={goBackToHome}
            >
              Continue Shopping
            </Button>
          </Flex>
        </View>
      </View>
    </View>
  )
}

export default ProductDetails