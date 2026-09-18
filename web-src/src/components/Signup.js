import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  Form,
  Heading,
  TextField,
  View,
  Text,
  Flex
} from '@adobe/react-spectrum'

import allActions from '../config.json'
import actionWebInvoke from '../utils'

export function Signup () {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState(null)
  const [loading, setLoading] = useState(false)
  const [signupSuccess, setSignupSuccess] = useState(false)
  const [registeredName, setRegisteredName] = useState('')

  function handleChange (field, value) {
    setFormData({
      ...formData,
      [field]: value
    })

    setMessage('')
    setMessageType(null)
  }

  async function handleSubmit (event) {
    event.preventDefault()

    const {
      name,
      email,
      password,
      confirmPassword
    } = formData

    // Validate name
    if (!name.trim()) {
      setMessage('Please enter your name.')
      setMessageType('error')
      return
    }

    // Validate email
    if (!email.trim()) {
      setMessage('Please enter your email address.')
      setMessageType('error')
      return
    }

    // Validate password
    if (!password) {
      setMessage('Please enter a password.')
      setMessageType('error')
      return
    }

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters.')
      setMessageType('error')
      return
    }

    // Validate confirm password
    if (!confirmPassword) {
      setMessage('Please confirm your password.')
      setMessageType('error')
      return
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match. Please try again.')
      setMessageType('error')
      return
    }

    setLoading(true)
    setMessage('')
    setMessageType(null)

    try {
      const params = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password
      }

      const headers = {}

      const response = await actionWebInvoke(
        allActions.signup,
        headers,
        params
      )

      console.log('Signup response:', response)

      if (response.success === true) {
        // Store name for the success message
        setRegisteredName(name.trim())

        // Show successful signup state
        setSignupSuccess(true)
        setMessageType('success')
        setMessage('Your account has been created successfully.')

        setLoading(false)

        return
      }

      setMessage(
        response.message ||
        'Unable to create your account. Please try again.'
      )
      setMessageType('error')
      setLoading(false)
    } catch (error) {
      console.log('Signup error:', error)

      const errorMessage = error.message || ''

      if (
        errorMessage.includes(
          'User with this email already exists'
        )
      ) {
        setMessage(
          'An account with this email already exists. Please use a different email.'
        )
      } else if (
        errorMessage.includes(
          'valid email address'
        )
      ) {
        setMessage('Please enter a valid email address.')
      } else if (
        errorMessage.includes(
          'Password must be at least 6 characters'
        )
      ) {
        setMessage(
          'Password must be at least 6 characters.'
        )
      } else {
        setMessage(
          'Unable to create your account. Please try again.'
        )
      }

      setMessageType('error')
      setLoading(false)
    }
  }

  // Successful signup screen
  if (signupSuccess) {
    return (
      <View
        maxWidth="size-4600"
        margin="auto"
        marginTop="size-2400"
      >
        <Heading level={1}>
          Hi {registeredName}! 👋
        </Heading>

        <Text>
          Your account has been created successfully.
        </Text>

        <Text>
          Please proceed with Login.
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
    <View
      maxWidth="size-4600"
      margin="auto"
    >
      <Heading level={1}>
        Create an Account
      </Heading>

      <Form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          value={formData.name}
          onChange={(value) =>
            handleChange('name', value)
          }
          isRequired
        />

        <TextField
          label="Email"
          type="email"
          value={formData.email}
          onChange={(value) =>
            handleChange('email', value)
          }
          isRequired
        />

        <TextField
          label="Password"
          type="password"
          value={formData.password}
          onChange={(value) =>
            handleChange('password', value)
          }
          isRequired
        />

        <TextField
          label="Confirm Password"
          type="password"
          value={formData.confirmPassword}
          onChange={(value) =>
            handleChange('confirmPassword', value)
          }
          isRequired
        />

        <Button
          type="submit"
          variant="accent"
          width="100%"
          isDisabled={loading}
        >
          {loading
            ? 'Creating Account...'
            : 'Sign Up'}
        </Button>
      </Form>

      {message && (
        <Flex
          marginTop="size-200"
          justifyContent="center"
        >
          <Text
            UNSAFE_style={{
              color: messageType === 'success'
                ? '#12805c'
                : '#d7373f',
              fontSize: '16px'
            }}
          >
            {message}
          </Text>
        </Flex>
      )}
    </View>
  )
}