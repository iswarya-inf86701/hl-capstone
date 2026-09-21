/*
 * <license header>
 */

import React from 'react'
import { Heading, View, Text, Button } from '@adobe/react-spectrum'
import { useNavigate } from 'react-router-dom'

export const NotFound = () => {
  const navigate = useNavigate()

  return (
    <View UNSAFE_className="page-container">
      <View UNSAFE_className="state-message">
        <Text UNSAFE_style={{ display: 'block', marginBottom: '20px' }}>
          404 - Page Not Found
        </Text>

        <Text UNSAFE_style={{ display: 'block', marginBottom: '20px' }}>
          The page you are looking for could not be found.
        </Text>

        <Button
          variant="accent"
          onPress={() => navigate('/')}
        >
          Back to Home
        </Button>
      </View>
    </View>
  )
}
