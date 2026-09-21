import React from 'react'
import {
  ActionButton,
  Flex,
  Text,
  View
} from '@adobe/react-spectrum'
import { useLocation, useNavigate } from 'react-router-dom'
import User from '@spectrum-icons/workflow/User'
import ShoppingCart from '@spectrum-icons/workflow/ShoppingCart'

import { useCart } from './CartContext'
import './SiteHeader.css'

const HEADER_ROUTES = new Set([
  '/',
  '/cart',
  '/checkout',
  '/actions',
  '/account',
  '/about'
])

function shouldShowHeader (pathname) {
  return (
    HEADER_ROUTES.has(pathname) ||
    pathname.startsWith('/products/')
  )
}

export function SiteHeader () {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { cartQuantity } = useCart()

  if (!shouldShowHeader(pathname)) {
    return null
  }

  function goToAccount () {
    navigate('/account')
  }

  function goToCart () {
    navigate('/cart')
  }

  function goToHome () {
    navigate('/')
  }

  return (
    <View
      UNSAFE_className="site-header"
      UNSAFE_style={{
        width: '100%',
        boxSizing: 'border-box',
        borderBottom:
          '1px solid #e5e5e5',
        backgroundColor: '#ffffff',
        padding: '14px 32px',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}
    >
      <Flex
        justifyContent="space-between"
        alignItems="center"
        width="100%"
        UNSAFE_style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}
      >
        <ActionButton
          isQuiet
          onPress={goToHome}
          aria-label="Go to Home"
        >
          <Text
            UNSAFE_className="site-header-logo"
            UNSAFE_style={{
              fontSize: '26px',
              fontWeight: '700',
              lineHeight: '1'
            }}
          >
            Ecommerce
          </Text>
        </ActionButton>

        <Flex
          alignItems="center"
          gap="size-200"
        >
          <ActionButton
            isQuiet
            aria-label="Account"
            onPress={goToAccount}
          >
            <User size="L" />
          </ActionButton>

          <View
            position="relative"
          >
            <ActionButton
              isQuiet
              aria-label={
                `Shopping cart, ${cartQuantity} items`
              }
              onPress={goToCart}
            >
              <ShoppingCart size="L" />
            </ActionButton>

            {cartQuantity > 0 && (
              <View
                position="absolute"
                top="-4px"
                right="-4px"
                UNSAFE_className="site-header-cart-badge"
              >
                {cartQuantity}
              </View>
            )}
          </View>
        </Flex>
      </Flex>
    </View>
  )
}