import React, { useState } from 'react'
import {
  Button,
  Form,
  Heading,
  TextField,
  View,
  Text,
  Flex,
  Link,
  ProgressCircle
} from '@adobe/react-spectrum'
import { useNavigate } from 'react-router-dom'

import actionWebInvoke from '../utils'
import allActions from '../config.json'
import './AuthPages.css'

export function Signup ({ ims }) {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] =
    useState('')

  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] =
    useState('')
  const [error, setError] = useState('')

  const [success, setSuccess] = useState('')
  const [createdName, setCreatedName] = useState('')
  const [loading, setLoading] = useState(false)

  function validateEmail (value) {
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!value.trim()) {
      return 'Email is required'
    }

    if (!emailRegex.test(value.trim())) {
      return 'Please enter a valid email address'
    }

    return ''
  }

  function handleEmailChange (value) {
    setEmail(value)
    setError('')

    if (value.trim()) {
      setEmailError(validateEmail(value))
    } else {
      setEmailError('')
    }
  }

  function handlePasswordChange (value) {
    setPassword(value)
    setError('')

    if (
      confirmPassword &&
      value !== confirmPassword
    ) {
      setPasswordError(
        'Password and confirm password do not match'
      )
    } else if (
      confirmPassword &&
      value === confirmPassword
    ) {
      setPasswordError('')
    }
  }

  function handleConfirmPasswordChange (value) {
    setConfirmPassword(value)
    setError('')

    if (value && password !== value) {
      setPasswordError(
        'Password and confirm password do not match'
      )
    } else {
      setPasswordError('')
    }
  }

  async function handleSubmit (event) {
    event.preventDefault()

    setError('')
    setEmailError('')
    setPasswordError('')

    let hasValidationError = false

    if (!name.trim()) {
      setError('Please enter your name.')
      hasValidationError = true
    }

    const emailValidationError =
      validateEmail(email)

    if (emailValidationError) {
      setEmailError(emailValidationError)
      hasValidationError = true
    }

    if (!password) {
      setError('Please enter a password.')
      hasValidationError = true
    } else if (password.length < 6) {
      setError(
        'Password must be at least 6 characters'
      )
      hasValidationError = true
    }

    if (!confirmPassword) {
      setPasswordError(
        'Please confirm your password'
      )
      hasValidationError = true
    } else if (password !== confirmPassword) {
      setPasswordError(
        'Password and confirm password do not match'
      )
      hasValidationError = true
    }

    if (hasValidationError) {
      return
    }

    setLoading(true)

    try {
      const response = await actionWebInvoke(
        allActions['signup'],
        {},
        {
          name: name.trim(),
          email: email.trim(),
          password: password
        }
      )

      console.log('Signup response:', response)

      if (response.success === true) {
        setCreatedName(name.trim())

        setSuccess(
          'Your account has been created successfully.'
        )

        setName('')
        setEmail('')
        setPassword('')
        setConfirmPassword('')
        setEmailError('')
        setPasswordError('')
        setError('')
      } else {
        setError(
          response.message ||
          'Unable to create your account.'
        )
      }
    } catch (err) {
      console.log('Signup request failed:', err)

      if (err.status === 409) {
        setEmailError(
          'An account with this email already exists.'
        )
      } else if (err.status === 400) {
        setError(
          err.message ||
          'Please check the information you entered.'
        )
      } else {
        setError(
          'Unable to create your account. Please try again later.'
        )
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
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
            Hi {createdName}! 👋
          </Heading>

          <View
            marginTop="size-300"
            UNSAFE_style={{
              textAlign: 'center'
            }}
          >
            <Text>
              Your account has been created
              successfully.
            </Text>
          </View>

          <View
            marginTop="size-200"
            UNSAFE_style={{
              textAlign: 'center'
            }}
          >
            <Text>
              Please proceed with Login.
            </Text>
          </View>

          <Flex
            marginTop="size-300"
            justifyContent="center"
            alignItems="center"
            wrap
            gap="size-100"
          >
            <Text>
              Already have an account?
            </Text>

            <Link
              onPress={() => navigate('/login')}
            >
              Login
            </Link>
          </Flex>
        </View>
      </View>
    )
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
          Create Account
        </Heading>

        <Text
          UNSAFE_style={{
            display: 'block',
            textAlign: 'center',
            marginTop: '8px'
          }}
        >
          Create your account to get started
        </Text>

        <View marginTop="size-400">
          <Form
            onSubmit={handleSubmit}
            width="100%"
          >
            <TextField
              label="Name"
              value={name}
              onChange={(value) => {
                setName(value)
                setError('')
              }}
              isRequired
              width="100%"
            />

            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              isRequired
              width="100%"
              marginTop="size-200"
              validationState={
                emailError
                  ? 'invalid'
                  : undefined
              }
              errorMessage={emailError}
            />

            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              isRequired
              width="100%"
              marginTop="size-200"
              description={
                password.length > 0 &&
                password.length < 6
                  ? 'Password must be at least 6 characters'
                  : undefined
              }
            />

            <TextField
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={
                handleConfirmPasswordChange
              }
              isRequired
              width="100%"
              marginTop="size-200"
              validationState={
                passwordError
                  ? 'invalid'
                  : undefined
              }
              errorMessage={passwordError}
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
                    aria-label="Creating account"
                  />
                ) : (
                  'Create Account'
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

            <Flex
              marginTop="size-300"
              justifyContent="center"
              alignItems="center"
              wrap
              gap="size-100"
            >
              <Text>
                Already have an account?
              </Text>

              <Link
                onPress={() => navigate('/login')}
              >
                Login
              </Link>
            </Flex>
          </Form>
        </View>
      </View>
    </View>
  )
}

export default Signup