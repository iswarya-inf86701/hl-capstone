import React, { useState } from 'react'
import {
  Heading,
  View,
  Text,
  Flex,
  Button,
  ProgressCircle
} from '@adobe/react-spectrum'
import { useNavigate } from 'react-router-dom'

import actionWebInvoke from '../utils'
import allActions from '../config.json'
import { useCart } from './CartContext'

export function Checkout () {
  const navigate = useNavigate()

  const {
    cartItems,
    cartQuantity,
    cartTotal,
    clearCart
  } = useCart()

  const [orderPlaced, setOrderPlaced] =
    useState(false)

  const [orderId, setOrderId] =
    useState('')

  const [placingOrder, setPlacingOrder] =
    useState(false)

  const [error, setError] = useState('')

  function goBackToCart () {
    navigate('/cart')
  }

  async function placeOrder () {
    setError('')

    const userToken =
      sessionStorage.getItem('userToken')

    if (!userToken) {
      setError(
        'Your session has expired. Please log in again.'
      )
      return
    }

    setPlacingOrder(true)

    try {
      const response = await actionWebInvoke(
        allActions['hl-capstone/create-order'],
        {},
        {
          token: userToken,
          items: cartItems.map((item) => ({
            productId: item.productId,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          }))
        }
      )

      console.log('Create order response:', response)

      if (response.success === true) {
        setOrderId(response.orderId)
        clearCart()
        setOrderPlaced(true)
      } else {
        setError(
          response.message ||
          'Unable to place your order. Please try again.'
        )
      }
    } catch (err) {
      console.log('Create order request failed:', err)

      setError(
        'Unable to place your order. Please try again.'
      )
    } finally {
      setPlacingOrder(false)
    }
  }

  function continueShopping () {
    navigate('/')
  }

  if (orderPlaced) {
    return (
      <View UNSAFE_className="page-container">
        <View
          UNSAFE_className="state-message"
          UNSAFE_style={{
            maxWidth: '600px',
            margin: '60px auto'
          }}
        >
          <Text UNSAFE_className="state-icon">
            ✓
          </Text>

          <Heading level={1}>
            Order Placed Successfully!
          </Heading>

          <Text
            UNSAFE_style={{
              display: 'block',
              marginTop: '20px',
              fontSize: '18px'
            }}
          >
            Thank you for your purchase.
          </Text>

          <Text
            UNSAFE_style={{
              display: 'block',
              marginTop: '12px',
              fontWeight: '600'
            }}
          >
            Order ID: {orderId}
          </Text>

          <Button
            variant="accent"
            marginTop="size-500"
            onPress={continueShopping}
          >
            Continue Shopping
          </Button>
        </View>
      </View>
    )
  }

  if (cartItems.length === 0) {
    return (
      <View UNSAFE_className="page-container">
        <Heading level={1}>
          Checkout
        </Heading>

        <View UNSAFE_className="state-message">
          <Text UNSAFE_style={{ display: 'block', marginBottom: '20px' }}>
            Your cart is empty.
          </Text>

          <Button
            variant="accent"
            onPress={continueShopping}
          >
            Continue Shopping
          </Button>
        </View>
      </View>
    )
  }

  return (
    <View UNSAFE_className="page-container">
      <Heading level={1}>
        Checkout
      </Heading>

      <Text
        UNSAFE_style={{
          display: 'block',
          marginTop: '8px',
          marginBottom: '32px'
        }}
      >
        Review your order before placing it.
      </Text>

      <View
        UNSAFE_style={{
          maxWidth: '900px',
          margin: '0 auto'
        }}
      >
        <View UNSAFE_className="card">
          <Heading level={2}>
            Order Summary
          </Heading>

          {cartItems.map((item) => (
            <Flex
              key={item.productId}
              justifyContent="space-between"
              alignItems="center"
              gap="size-200"
              marginTop="size-300"
              UNSAFE_style={{
                borderBottom:
                  '1px solid #e5e5e5',
                paddingBottom: '16px'
              }}
            >
              <View
                UNSAFE_style={{
                  flexShrink: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '64px',
                  height: '64px',
                  backgroundColor: '#f7f7f7',
                  borderRadius: '8px',
                  padding: '8px',
                  boxSizing: 'border-box'
                }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain'
                  }}
                />
              </View>

              <View
                UNSAFE_style={{
                  flex: 1,
                  minWidth: 0
                }}
              >
                <Text
                  UNSAFE_style={{
                    display: 'block',
                    fontWeight: '600'
                  }}
                >
                  {item.title}
                </Text>

                <Text
                  UNSAFE_style={{
                    display: 'block',
                    marginTop: '4px'
                  }}
                >
                  Quantity: {item.quantity}
                </Text>
              </View>

              <Text
                UNSAFE_style={{
                  fontWeight: '700'
                }}
              >
                $
                {(
                  Number(item.price) *
                  item.quantity
                ).toFixed(2)}
              </Text>
            </Flex>
          ))}

          <Flex
            justifyContent="space-between"
            marginTop="size-400"
          >
            <Text>
              Total Items
            </Text>

            <Text>
              {cartQuantity}
            </Text>
          </Flex>

          <Flex
            justifyContent="space-between"
            marginTop="size-300"
          >
            <Text
              UNSAFE_style={{
                fontSize: '20px',
                fontWeight: '700'
              }}
            >
              Total
            </Text>

            <Text
              UNSAFE_style={{
                fontSize: '20px',
                fontWeight: '700'
              }}
            >
              ${cartTotal.toFixed(2)}
            </Text>
          </Flex>

          {error && (
            <Text UNSAFE_className="error-text">
              {error}
            </Text>
          )}

          <Flex
            gap="size-200"
            marginTop="size-500"
            wrap
          >
            <Button
              variant="secondary"
              onPress={goBackToCart}
              isDisabled={placingOrder}
            >
              Back to Cart
            </Button>

            <Button
              variant="accent"
              onPress={placeOrder}
              isDisabled={placingOrder}
            >
              {placingOrder ? (
                <Flex alignItems="center" gap="size-100">
                  <ProgressCircle
                    size="S"
                    isIndeterminate
                    aria-label="Placing order"
                  />
                  <Text>Placing Order...</Text>
                </Flex>
              ) : (
                'Place Order'
              )}
            </Button>
          </Flex>
        </View>
      </View>
    </View>
  )
}

export default Checkout
