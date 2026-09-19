import React, { useState } from 'react'
import {
  Heading,
  View,
  Text,
  Flex,
  Button
} from '@adobe/react-spectrum'
import { useNavigate } from 'react-router-dom'

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

  function goBackToCart () {
    navigate('/cart')
  }

  function placeOrder () {
    const newOrderId =
      `ORD-${Date.now()}`

    setOrderId(newOrderId)
    clearCart()
    setOrderPlaced(true)
  }

  function continueShopping () {
    navigate('/')
  }

  if (orderPlaced) {
    return (
      <View
        width="100%"
        padding="size-400"
        UNSAFE_style={{
          boxSizing: 'border-box',
          maxWidth: '100%',
          overflowX: 'hidden',
          textAlign: 'center'
        }}
      >
        <View
          UNSAFE_style={{
            maxWidth: '600px',
            margin: '60px auto'
          }}
        >
          <Text
            UNSAFE_style={{
              display: 'block',
              fontSize: '48px',
              marginBottom: '20px'
            }}
          >
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
      <View
        width="100%"
        padding="size-400"
      >
        <Heading level={1}>
          Checkout
        </Heading>

        <Text
          UNSAFE_style={{
            display: 'block',
            marginTop: '20px',
            marginBottom: '24px'
          }}
        >
          Your cart is empty.
        </Text>

        <Button
          variant="accent"
          onPress={continueShopping}
        >
          Continue Shopping
        </Button>
      </View>
    )
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
        <View
          borderWidth="thin"
          borderColor="dark"
          borderRadius="regular"
          padding="size-400"
        >
          <Heading level={2}>
            Order Summary
          </Heading>

          {cartItems.map((item) => (
            <Flex
              key={item.productId}
              justifyContent="space-between"
              alignItems="center"
              marginTop="size-300"
              UNSAFE_style={{
                borderBottom:
                  '1px solid #e5e5e5',
                paddingBottom: '16px'
              }}
            >
              <View>
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

          <Flex
            gap="size-200"
            marginTop="size-500"
            wrap
          >
            <Button
              variant="secondary"
              onPress={goBackToCart}
            >
              Back to Cart
            </Button>

            <Button
              variant="accent"
              onPress={placeOrder}
            >
              Place Order
            </Button>
          </Flex>
        </View>
      </View>
    </View>
  )
}

export default Checkout