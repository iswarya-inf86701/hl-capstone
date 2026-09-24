import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

export function ProtectedRoute ({ children }) {
  const { authenticated, authLoading } = useAuth()

  if (authLoading) {
    return <div>Checking session...</div>
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}