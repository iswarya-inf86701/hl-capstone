import React, { useState } from 'react'
import {
  Button,
  Form,
  Heading,
  TextField,
  View,
  Text,
  Link,
  ProgressCircle
} from '@adobe/react-spectrum'
import { useNavigate } from 'react-router-dom'

import actionWebInvoke from '../utils'
import allActions from '../config.json'
import { useAuth } from './AuthContext'
import './AuthPages.css'

export function Login ({ ims }) {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit (event) {
    event.preventDefault()

    setError('')
    setSuccess('')

    if (!identifier.trim() || !password) {
      setError(
        'Please enter your email/name and password.'
      )
      return
    }

    setLoading(true)

    try {
      const response = await actionWebInvoke(
        allActions['login'],
        {},
        {
          email: identifier.trim(),
          password: password
        }
      )

      console.log('Login response:', response)

      if (response.success === true) {
        sessionStorage.setItem(
          'userToken',
          response.token
        )

        sessionStorage.setItem(
          'user',
          JSON.stringify(response.user)
        )

        sessionStorage.setItem(
          'tokenExpiresAt',
          response.expiresAt
        )

        login(response.user)

        setLoading(false)

        navigate('/')
        return
      }

      setError(
        response.message ||
        'Unable to login. Please try again.'
      )

      setLoading(false)
    } catch (err) {
      console.log('Login request failed:', err)

      if (err.status === 401) {
        setError(
          'Invalid email/name or password.'
        )
      } else if (err.status === 400) {
        setError(
          err.message ||
          'Please enter your email/name and password.'
        )
      } else {
        setError(
          'Unable to login. Please try again later.'
        )
      }

      setLoading(false)
    }
  }

  return (
    <View
      UNSAFE_className="auth-page"
    >
      <View
        UNSAFE_className="auth-card"
      >
        <Heading
          level={1}
          UNSAFE_style={{
            margin: 0,
            textAlign: 'center'
          }}
        >
          Login
        </Heading>

        <Text
          UNSAFE_style={{
            display: 'block',
            textAlign: 'center',
            marginTop: '8px'
          }}
        >
          Sign in to continue
        </Text>

        <View marginTop="size-400">
          <Form
            onSubmit={handleSubmit}
            width="100%"
          >
            <TextField
              label="Email or Name"
              value={identifier}
              onChange={(value) => {
                setIdentifier(value)
                setError('')
              }}
              isRequired
              width="100%"
            />

            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(value) => {
                setPassword(value)
                setError('')
              }}
              isRequired
              width="100%"
              marginTop="size-200"
            />

            <View
              marginTop="size-300"
              UNSAFE_style={{
                width: '100%'
              }}
            >
              <Button
                type="submit"
                variant="accent"
                isDisabled={loading}
                width="100%"
              >
                {loading ? (
                  <ProgressCircle
                    size="S"
                    isIndeterminate
                    aria-label="Logging in"
                  />
                ) : (
                  'Login'
                )}
              </Button>
            </View>

            {error && (
              <Text
                UNSAFE_style={{
                  display: 'block',
                  color: '#d7373f',
                  marginTop: '16px',
                  textAlign: 'center'
                }}
              >
                {error}
              </Text>
            )}

            {success && (
              <Text
                UNSAFE_style={{
                  display: 'block',
                  color: '#268e6c',
                  marginTop: '16px',
                  textAlign: 'center'
                }}
              >
                {success}
              </Text>
            )}

            <View
              marginTop="size-300"
              UNSAFE_style={{
                textAlign: 'center'
              }}
            >
              <Text>
                Don't have an account?{' '}
              </Text>

              <Link
                onPress={() => navigate('/signup')}
              >
                Sign Up
              </Link>
            </View>
          </Form>
        </View>
      </View>
    </View>
  )
}

export default Login