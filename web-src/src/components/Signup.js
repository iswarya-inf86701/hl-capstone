import React, { useState } from 'react'
import {
  Button,
  Form,
  Heading,
  TextField,
  View
} from '@adobe/react-spectrum'

export function Signup () {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit (event) {
    event.preventDefault()

    console.log('Signup data:', {
      name,
      email,
      password
    })
  }

  return (
    <View maxWidth="size-4600" margin="auto">
      <Heading level={1}>Create an Account</Heading>

      <Form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          value={name}
          onChange={setName}
          isRequired
        />

        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          isRequired
        />

        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          isRequired
        />

        <Button type="submit" variant="accent">
          Sign Up
        </Button>
      </Form>
    </View>
  )
}