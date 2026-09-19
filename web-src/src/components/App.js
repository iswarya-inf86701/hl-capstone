/*
 * <license header>
 */

import React from 'react'
import {
  Provider,
  defaultTheme,
  View,
  Flex,
  Text,
  ActionButton
} from '@adobe/react-spectrum'
import ErrorBoundary from 'react-error-boundary'
import {
  HashRouter as Router,
  Routes,
  Route,
  useNavigate
} from 'react-router-dom'

import User from '@spectrum-icons/workflow/User'
import ShoppingCart from '@spectrum-icons/workflow/ShoppingCart'

import ActionsForm from './ActionsForm'
import { Home } from './Home'
import { About } from './About'
import { Signup } from './Signup'
import { Login } from './Login'
import { Account } from './Account'
import { ProductDetails } from './ProductDetails'
import { Cart } from './Cart'
import { Checkout } from './Checkout'
import { AuthProvider } from './AuthContext'
import { ProtectedRoute } from './ProtectedRoute'
import {
  CartProvider,
  useCart
} from './CartContext'

function App (props) {
  console.log(
    'runtime object:',
    props.runtime
  )

  console.log(
    'ims object:',
    props.ims
  )

  props.runtime.on(
    'configuration',
    ({ imsOrg, imsToken, locale }) => {
      console.log(
        'configuration change',
        {
          imsOrg,
          imsToken,
          locale
        }
      )
    }
  )

  props.runtime.on(
    'history',
    ({ type, path }) => {
      console.log(
        'history change',
        {
          type,
          path
        }
      )
    }
  )

  return (
    <ErrorBoundary
      onError={onError}
      FallbackComponent={fallbackComponent}
    >
      <AuthProvider>
        <CartProvider>
          <Router>
            <Provider
              theme={defaultTheme}
              colorScheme="light"
            >
              <View
                width="100%"
                minHeight="100vh"
                UNSAFE_style={{
                  boxSizing: 'border-box',
                  overflowX: 'hidden'
                }}
              >

                {/* Header */}
                <SiteHeader />

                {/* Page Content */}
                <View
                  gridArea="content"
                  padding="size-200"
                  UNSAFE_style={{
                    boxSizing: 'border-box',
                    width: '100%',
                    maxWidth: '100%',
                    overflowX: 'hidden'
                  }}
                >
                  <Routes>

                    {/* Home */}
                    <Route
                      path="/"
                      element={
                        <ProtectedRoute>
                          <Home />
                        </ProtectedRoute>
                      }
                    />

                    {/* Product Details */}
                    <Route
                      path="/products/:productId"
                      element={
                        <ProtectedRoute>
                          <ProductDetails />
                        </ProtectedRoute>
                      }
                    />

                    {/* Cart */}
                    <Route
                      path="/cart"
                      element={
                        <ProtectedRoute>
                          <Cart />
                        </ProtectedRoute>
                      }
                    />

                    {/* Checkout */}
                    <Route
                      path="/checkout"
                      element={
                        <ProtectedRoute>
                          <Checkout />
                        </ProtectedRoute>
                      }
                    />

                    {/* Actions */}
                    <Route
                      path="/actions"
                      element={
                        <ProtectedRoute>
                          <ActionsForm
                            runtime={
                              props.runtime
                            }
                            ims={props.ims}
                          />
                        </ProtectedRoute>
                      }
                    />

                    {/* Signup */}
                    <Route
                      path="/signup"
                      element={
                        <Signup
                          ims={props.ims}
                        />
                      }
                    />

                    {/* Login */}
                    <Route
                      path="/login"
                      element={
                        <Login
                          ims={props.ims}
                        />
                      }
                    />

                    {/* Account */}
                    <Route
                      path="/account"
                      element={
                        <ProtectedRoute>
                          <Account />
                        </ProtectedRoute>
                      }
                    />

                    {/* About */}
                    <Route
                      path="/about"
                      element={
                        <ProtectedRoute>
                          <About />
                        </ProtectedRoute>
                      }
                    />

                  </Routes>
                </View>
              </View>
            </Provider>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  )

  function onError (
    error,
    componentStack
  ) {
    console.error(
      'Application error:',
      error,
      componentStack
    )
  }

  function fallbackComponent ({
    componentStack,
    error
  }) {
    return (
      <React.Fragment>
        <h1
          style={{
            textAlign: 'center',
            marginTop: '20px'
          }}
        >
          Something went wrong
        </h1>

        <pre>
          {componentStack +
            '\n' +
            error.message}
        </pre>
      </React.Fragment>
    )
  }
}

/*
 * Header
 */
function SiteHeader () {
  const navigate = useNavigate()

  const {
    cartQuantity
  } = useCart()

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
      >

        {/* Ecommerce Logo / Home */}
        <ActionButton
          isQuiet
          onPress={goToHome}
          aria-label="Go to Home"
        >
          <Text
            UNSAFE_style={{
              fontSize: '26px',
              fontWeight: '700',
              lineHeight: '1'
            }}
          >
            Ecommerce
          </Text>
        </ActionButton>

        {/* Account + Cart */}
        <Flex
          alignItems="center"
          gap="size-200"
        >

          {/* Account */}
          <ActionButton
            isQuiet
            aria-label="Account"
            onPress={goToAccount}
          >
            <User size="L" />
          </ActionButton>

          {/* Cart */}
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

            {/* Cart Quantity Badge */}
            {cartQuantity > 0 && (
              <View
                position="absolute"
                top="-4px"
                right="-4px"
                UNSAFE_style={{
                  minWidth: '20px',
                  height: '20px',
                  padding: '0 5px',
                  borderRadius: '10px',
                  backgroundColor:
                    '#d7373f',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent:
                    'center',
                  boxSizing: 'border-box',
                  fontSize: '11px',
                  fontWeight: '700',
                  lineHeight: '20px',
                  textAlign: 'center'
                }}
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

export default App