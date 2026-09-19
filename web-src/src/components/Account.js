import React, { useEffect, useState } from 'react'
import {
  Button,
  Heading,
  Text,
  View,
  Flex,
  ProgressCircle
} from '@adobe/react-spectrum'
import { useNavigate } from 'react-router-dom'

import actionWebInvoke from '../utils'
import allActions from '../config.json'
import { useAuth } from './AuthContext'

export function Account () {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [ordersError, setOrdersError] = useState('')

  useEffect(() => {
    const isMountedRef = { current: true }

    if (user) {
      loadOrders(isMountedRef)
    }

    // Prevent state updates once the component
    // has unmounted (e.g. navigating away on logout).
    return () => {
      isMountedRef.current = false
    }
  }, [user])

  async function loadOrders (isMountedRef) {
    if (isMountedRef.current) {
      setLoadingOrders(true)
      setOrdersError('')
    }

    try {
      const userToken =
        sessionStorage.getItem('userToken')

      if (!userToken) {
        if (isMountedRef.current) {
          setOrdersError(
            'Your session has expired. Please log in again.'
          )
        }
        return
      }

      const response = await actionWebInvoke(
        allActions['hl-capstone/get-orders'],
        {},
        {
          token: userToken
        }
      )

      console.log('Get orders response:', response)

      if (!isMountedRef.current) {
        return
      }

      if (response.success === true) {
        setOrders(response.orders || [])
      } else {
        setOrdersError(
          response.message ||
          'Unable to load order history. Please try again later.'
        )
      }
    } catch (err) {
      console.log('Get orders request failed:', err)

      if (isMountedRef.current) {
        setOrdersError(
          'Unable to load order history. Please try again later.'
        )
      }
    } finally {
      if (isMountedRef.current) {
        setLoadingOrders(false)
      }
    }
  }

  function handleLogout () {
    logout()

    navigate('/login')
  }

  function startShopping () {
    navigate('/')
  }

  function formatDate (isoDate) {
    if (!isoDate) {
      return ''
    }

    return new Date(isoDate).toLocaleDateString(
      undefined,
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    )
  }

  if (!user) {
    return (
      <View UNSAFE_className="page-container">
        <Heading level={1}>
          Account
        </Heading>

        <Text>
          Please log in to view your account.
        </Text>

        <Button
          variant="accent"
          marginTop="size-300"
          onPress={() => navigate('/login')}
        >
          Login
        </Button>
      </View>
    )
  }

  return (
    <View UNSAFE_className="page-container">
      <Heading level={1}>
        Account
      </Heading>

      {/* Profile */}
      <View UNSAFE_className="card section">
        <Heading level={2}>
          Profile
        </Heading>

        <View marginTop="size-300">
          <Text
            UNSAFE_style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              color: '#767676'
            }}
          >
            Name
          </Text>

          <Text UNSAFE_style={{ display: 'block' }}>
            {user.name}
          </Text>
        </View>

        <View marginTop="size-300">
          <Text
            UNSAFE_style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '600',
              color: '#767676'
            }}
          >
            Email
          </Text>

          <Text UNSAFE_style={{ display: 'block' }}>
            {user.email}
          </Text>
        </View>

        <Button
          variant="negative"
          marginTop="size-400"
          onPress={handleLogout}
        >
          Logout
        </Button>
      </View>

      {/* Order History */}
      <View UNSAFE_className="section">
        <Heading level={2}>
          Order History
        </Heading>

        {loadingOrders && (
          <Flex
            direction="column"
            alignItems="center"
            gap="size-200"
            marginTop="size-300"
          >
            <ProgressCircle
              size="L"
              isIndeterminate
              aria-label="Loading orders"
            />

            <Text>
              Loading orders...
            </Text>
          </Flex>
        )}

        {!loadingOrders && ordersError && (
          <Text UNSAFE_className="error-text">
            {ordersError}
          </Text>
        )}

        {!loadingOrders && !ordersError && orders.length === 0 && (
          <View UNSAFE_className="state-message">
            <Text UNSAFE_className="state-icon">
              📦
            </Text>

            <Text UNSAFE_style={{ display: 'block', marginBottom: '4px' }}>
              No orders yet.
            </Text>

            <Text UNSAFE_style={{ display: 'block', marginBottom: '20px' }}>
              Your completed orders will appear here.
            </Text>

            <Button
              variant="accent"
              onPress={startShopping}
            >
              Start Shopping
            </Button>
          </View>
        )}

        {!loadingOrders && !ordersError && orders.length > 0 && (
          <View marginTop="size-300">
            {orders.map((order) => (
              <View
                key={order.orderId}
                UNSAFE_className="order-card"
              >
                <View UNSAFE_className="order-card-header">
                  <Text UNSAFE_className="order-id">
                    Order #{order.orderId}
                  </Text>

                  <Text>
                    {formatDate(order.createdAt)}
                  </Text>
                </View>

                <Text UNSAFE_style={{ display: 'block' }}>
                  Status: {order.status}
                </Text>

                <View UNSAFE_className="order-items-list">
                  {order.items.map((item, index) => (
                    <View
                      key={`${order.orderId}-${item.productId}-${index}`}
                      UNSAFE_className="order-item-row"
                    >
                      <Text>
                        {item.title} × {item.quantity}
                      </Text>

                      <Text>
                        $
                        {(
                          Number(item.price) * item.quantity
                        ).toFixed(2)}
                      </Text>
                    </View>
                  ))}
                </View>

                <View UNSAFE_className="order-total">
                  <Text>Total</Text>
                  <Text>${Number(order.totalAmount).toFixed(2)}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  )
}

export default Account
