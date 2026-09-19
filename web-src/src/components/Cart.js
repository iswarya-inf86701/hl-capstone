import React from 'react'
import {
  Heading,
  View,
  Text,
  Flex,
  Button
} from '@adobe/react-spectrum'
import { useNavigate } from 'react-router-dom'

import { useCart } from './CartContext'

export function Cart () {
  const navigate = useNavigate()

  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    cartQuantity,
    cartTotal
  } = useCart()

  function continueShopping () {
    navigate('/')
  }

  function proceedToCheckout () {
    navigate('/checkout')
  }

  if (cartItems.length === 0) {
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
          Shopping Cart
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
        Shopping Cart
      </Heading>

      <Text
        UNSAFE_style={{
          display: 'block',
          marginTop: '8px',
          marginBottom: '32px'
        }}
      >
        {cartQuantity}{' '}
        {cartQuantity === 1
          ? 'item'
          : 'items'}{' '}
        in your cart
      </Text>

      <View
        UNSAFE_style={{
          display: 'grid',
          gridTemplateColumns:
            'minmax(0, 1fr) 320px',
          gap: '32px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}
      >
        {/* Cart Items */}
        <View>
          {cartItems.map((item) => (
            <View
              key={item.productId}
              borderWidth="thin"
              borderColor="dark"
              borderRadius="regular"
              padding="size-300"
              marginBottom="size-300"
              UNSAFE_style={{
                display: 'flex',
                gap: '24px',
                alignItems: 'center',
                boxSizing: 'border-box',
                backgroundColor: 'white'
              }}
            >
              {/* Product Image */}
              <View
                width="size-2400"
                height="size-2400"
                UNSAFE_style={{
                  flexShrink: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#f7f7f7',
                  borderRadius: '8px',
                  padding: '12px',
                  boxSizing: 'border-box'
                }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '140px',
                    objectFit: 'contain'
                  }}
                />
              </View>

              {/* Product Information */}
              <View
                UNSAFE_style={{
                  flex: 1,
                  minWidth: 0
                }}
              >
                <Text
                  UNSAFE_style={{
                    display: 'block',
                    fontSize: '18px',
                    fontWeight: '600',
                    lineHeight: '1.4',
                    marginBottom: '8px'
                  }}
                >
                  {item.title}
                </Text>

                <Text
                  UNSAFE_style={{
                    display: 'block',
                    fontSize: '18px',
                    fontWeight: '700',
                    marginBottom: '16px'
                  }}
                >
                  ${Number(item.price).toFixed(2)}
                </Text>

                {/* Quantity Controls */}
                <Flex
                  alignItems="center"
                  gap="size-200"
                  wrap
                >
                  <Button
                    variant="secondary"
                    onPress={() =>
                      decreaseQuantity(
                        item.productId
                      )
                    }
                  >
                    −
                  </Button>

                  <Text>
                    {item.quantity}
                  </Text>

                  <Button
                    variant="secondary"
                    onPress={() =>
                      increaseQuantity(
                        item.productId
                      )
                    }
                  >
                    +
                  </Button>

                  <Button
                    variant="negative"
                    onPress={() =>
                      removeFromCart(
                        item.productId
                      )
                    }
                  >
                    Remove
                  </Button>
                </Flex>
              </View>

              {/* Item Total */}
              <View
                UNSAFE_style={{
                  flexShrink: 0,
                  textAlign: 'right'
                }}
              >
                <Text
                  UNSAFE_style={{
                    display: 'block',
                    fontSize: '18px',
                    fontWeight: '700'
                  }}
                >
                  $
                  {(
                    Number(item.price) *
                    item.quantity
                  ).toFixed(2)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Cart Summary */}
        <View
          borderWidth="thin"
          borderColor="dark"
          borderRadius="regular"
          padding="size-400"
          UNSAFE_style={{
            boxSizing: 'border-box',
            height: 'fit-content',
            backgroundColor: '#f7f7f7'
          }}
        >
          <Heading level={2}>
            Order Summary
          </Heading>

          <Flex
            justifyContent="space-between"
            marginTop="size-300"
          >
            <Text>
              Items
            </Text>

            <Text>
              {cartQuantity}
            </Text>
          </Flex>

          <Flex
            justifyContent="space-between"
            marginTop="size-300"
          >
            <Text>
              Subtotal
            </Text>

            <Text
              UNSAFE_style={{
                fontWeight: '700'
              }}
            >
              ${cartTotal.toFixed(2)}
            </Text>
          </Flex>

          <Button
            variant="accent"
            width="100%"
            marginTop="size-400"
            onPress={proceedToCheckout}
          >
            Proceed to Checkout
          </Button>

          <Button
            variant="secondary"
            width="100%"
            marginTop="size-200"
            onPress={continueShopping}
          >
            Continue Shopping
          </Button>

          <Button
            variant="negative"
            width="100%"
            marginTop="size-200"
            onPress={clearCart}
          >
            Clear Cart
          </Button>
        </View>
      </View>
    </View>
  )
}

export default Cart