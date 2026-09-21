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
          variant="secondary"
          UNSAFE_className="btn-logout"
          marginTop="size-400"
          onPress={handleLogout}
        >
          Logout
        </Button>
      </View>
    </View>
  )
}

export default Account
