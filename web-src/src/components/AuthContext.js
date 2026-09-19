import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react'

import actionWebInvoke from '../utils'
import allActions from '../config.json'

const AuthContext = createContext(null)

export function AuthProvider ({ children }) {
  const [authenticated, setAuthenticated] =
    useState(false)

  const [user, setUser] = useState(null)

  const [authLoading, setAuthLoading] =
    useState(true)

  useEffect(() => {
    validateSession()
  }, [])

  async function validateSession () {
    const token =
      sessionStorage.getItem('userToken')

    const storedUser =
      sessionStorage.getItem('user')

    if (!token) {
      setAuthenticated(false)
      setUser(null)
      setAuthLoading(false)
      return
    }

    try {
      const response = await actionWebInvoke(
        allActions['validate-token'],
        {},
        {
          token: token
        }
      )

      console.log(
        'Token validation response:',
        response
      )

      if (
        response.success === true &&
        response.authenticated === true
      ) {
        setAuthenticated(true)

        if (response.user) {
          setUser(response.user)

          sessionStorage.setItem(
            'user',
            JSON.stringify(response.user)
          )
        } else if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } else {
        clearSession()
      }
    } catch (error) {
      console.log(
        'Token validation failed:',
        error
      )

      clearSession()
    } finally {
      setAuthLoading(false)
    }
  }

  // Called after successful login
  function login (userData) {
    setAuthenticated(true)
    setUser(userData)
  }

  function clearSession () {
    sessionStorage.removeItem('userToken')
    sessionStorage.removeItem('user')
    sessionStorage.removeItem('tokenExpiresAt')

    setAuthenticated(false)
    setUser(null)
  }

  function logout () {
    clearSession()
  }

  return (
    <AuthContext.Provider
      value={{
        authenticated,
        user,
        authLoading,
        login,
        logout,
        validateSession
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth () {
  return useContext(AuthContext)
}