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
    cartItems,
    addToCart,
    increaseQuantity: increaseCartQuantity,
    decreaseQuantity: decreaseCartQuantity,
    cartQuantity
  } = useCart()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [addedToCart, setAddedToCart] = useState(false)

  useEffect(() => {
    setAddedToCart(false)
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

  // Quantity always reflects the live cart state for this product,
  // so the stepper and Add to Cart button stay in sync both ways.
  const cartItem = product
    ? cartItems.find(
        (item) => item.productId === product.productId
      )
    : null

  const quantity = cartItem ? cartItem.quantity : 0

  function decreaseQuantity () {
    if (quantity > 0) {
      decreaseCartQuantity(product.productId)
    }
  }

  function increaseQuantity () {
    if (quantity === 0) {
      addToCart(product, 1)
    } else {
      increaseCartQuantity(product.productId)
    }

    setAddedToCart(true)
  }

  function handleAddToCart () {
    increaseQuantity()
  }

  function goToCart () {
    navigate('/cart')
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

        <Heading
          level={1}
          marginTop="size-400"
        >
          Product Not Found
        </Heading>

        <Text UNSAFE_className="error-text">
          {error}
        </Text>
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

          {/* Quantity + Add to Cart */}
          <View UNSAFE_className="pd-purchase-row">
            <View
              UNSAFE_className="qty-selector"
            >
              <button
                type="button"
                onClick={decreaseQuantity}
                disabled={quantity <= 0}
                aria-label="Decrease quantity"
              >
                −
              </button>

              <span className="qty-value">
                {quantity}
              </span>

              <button
                type="button"
                onClick={increaseQuantity}
                aria-label="Increase quantity"
              >
                +
              </button>
            </View>

            <Button
              variant="accent"
              UNSAFE_className="pd-add-to-cart"
              onPress={handleAddToCart}
            >
              Add to Cart
            </Button>
          </View>

          {addedToCart && (
            <Text UNSAFE_className="pd-added-message">
              Added to cart.
            </Text>
          )}

          {/* Secondary Actions */}
          <View UNSAFE_className="pd-secondary-actions">
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
          </View>
        </View>
      </View>
    </View>
  )
}

export default ProductDetails