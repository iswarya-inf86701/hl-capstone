import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

export function ProtectedRoute ({ children }) {
  const { authenticated, authLoading } = useAuth()

  // Wait until the existing session is checked
  if (authLoading) {
    return <div>Checking session...</div>
  }

  // User is not authenticated
  if (!authenticated) {
    return <Navigate to="/login" replace />
  }

  // User is authenticated
  return children
}