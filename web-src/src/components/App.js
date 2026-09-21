/*
 * <license header>
 */

import React from 'react'
import {
  Provider,
  defaultTheme,
  View
} from '@adobe/react-spectrum'
import ErrorBoundary from 'react-error-boundary'
import {
  HashRouter as Router,
  Routes,
  Route
} from 'react-router-dom'

import ActionsForm from './ActionsForm'
import { Home } from './Home'
import { About } from './About'
import { Signup } from './Signup'
import { Login } from './Login'
import { Account } from './Account'
import { ProductDetails } from './ProductDetails'
import { NotFound } from './NotFound'
import { AuthProvider } from './AuthContext'
import { ProtectedRoute } from './ProtectedRoute'
import { SiteHeader } from './SiteHeader'
import './App.css'

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

                  {/* Actions */}
                  <Route
                    path="/actions"
                    element={
                      <ActionsForm
                        runtime={
                          props.runtime
                        }
                        ims={props.ims}
                      />
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
                    element={<About />}
                  />

                  {/* 404 - catch-all for unknown routes */}
                  <Route
                    path="*"
                    element={<NotFound />}
                  />

                </Routes>
              </View>
            </View>
          </Provider>
        </Router>
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

export default App