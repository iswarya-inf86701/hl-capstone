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
import { useAuth } from './AuthContext'
import './Products.css'

export function ProductDetails () {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { logout } = useAuth()

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

  if (loading) {
    return (
      <View UNSAFE_className="page-container">
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
      <View UNSAFE_className="page-container">
        <Button
          variant="secondary"
          onPress={goBackToHome}
        >
          Back to Products
        </Button>

        <Text UNSAFE_className="error-text">
          {error}
        </Text>

        <View marginTop="size-300">
          <Button
            variant="accent"
            onPress={() => {
              logout()
              navigate('/login')
            }}
          >
            Login
          </Button>
        </View>
      </View>
    )
  }

  if (!product) {
    return null
  }

  return (
    <View UNSAFE_className="page-container">
      {/* Back Button */}
      <Button
        variant="secondary"
        onPress={goBackToHome}
      >
        Back to Products
      </Button>

      {/* Product Details */}
      <View
        UNSAFE_className="product-details-layout pd-layout"
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
        <View UNSAFE_className="pd-image-frame">
          <img
            src={product.image}
            alt={product.title}
            className="pd-image"
          />
        </View>

        {/* Product Information */}
        <View UNSAFE_className="pd-info">
          {/* Category */}
          <Text UNSAFE_className="pd-category">
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

          {/* Rating */}
          {product.rating && (
            <View UNSAFE_className="pd-rating">
              <Text UNSAFE_className="pd-rating-stars">
                {'★'.repeat(Math.round(product.rating.rate))}
                {'☆'.repeat(5 - Math.round(product.rating.rate))}
              </Text>

              <Text UNSAFE_className="pd-rating-count">
                {product.rating.rate} ({product.rating.count} reviews)
              </Text>
            </View>
          )}

          {/* Price */}
          <Text UNSAFE_className="pd-price">
             ₹{product.price}
          </Text>

          <View UNSAFE_className="pd-divider" />

          {/* Description */}
          <Text UNSAFE_className="pd-description">
            {product.description}
          </Text>

          {/* Product ID */}
          <Text UNSAFE_className="pd-meta">
            Product ID: {product.productId}
          </Text>

          {/* Secondary Actions */}
          <View UNSAFE_className="pd-secondary-actions">
            <Button
              variant="secondary"
              onPress={goBackToHome}
            >
              Continue Shopping
            </Button>
          </View>
        </View>
      </View>
    </View>
  )
}

export default ProductDetails