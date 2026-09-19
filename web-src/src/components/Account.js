import React from 'react'
import {
  Button,
  Heading,
  Text,
  View
} from '@adobe/react-spectrum'
import { useNavigate } from 'react-router-dom'

import { useAuth } from './AuthContext'

export function Account () {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout () {
    logout()

    navigate('/login')
  }

  if (!user) {
    return (
      <View maxWidth="size-4600" margin="auto">
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
    <View
      maxWidth="size-4600"
      margin="auto"
    >
      <Heading level={1}>
        Account
      </Heading>

      <View marginTop="size-400">
        <Heading level={3}>
          Name
        </Heading>

        <Text>
          {user.name}
        </Text>
      </View>

      <View marginTop="size-300">
        <Heading level={3}>
          Email
        </Heading>

        <Text>
          {user.email}
        </Text>
      </View>

      <View marginTop="size-500">
        <Button
          variant="negative"
          onPress={handleLogout}
        >
          Logout
        </Button>
      </View>
    </View>
  )
}