import React, { useState } from 'react'
import {
  ActionButton,
  Button,
  Flex,
  Text,
  View
} from '@adobe/react-spectrum'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import User from '@spectrum-icons/workflow/User'
import ShowMenu from '@spectrum-icons/workflow/ShowMenu'
import Close from '@spectrum-icons/workflow/Close'

import { useAuth } from './AuthContext'
import './SiteHeader.css'

const HEADER_ROUTES = new Set([
  '/',
  '/actions',
  '/account',
  '/about'
])

function shouldShowHeader (pathname) {
  return (
    HEADER_ROUTES.has(pathname) ||
    pathname.startsWith('/products/')
  )
}

export function SiteHeader () {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  if (!shouldShowHeader(pathname)) {
    return null
  }

  function goToAccount () {
    setMenuOpen(false)
    navigate('/account')
  }

  function goToHome () {
    setMenuOpen(false)
    navigate('/')
  }

  function toggleMenu () {
    setMenuOpen((isOpen) => !isOpen)
  }

  function handleLogout () {
    setMenuOpen(false)
    logout()
    navigate('/login')
  }

  return (
    <View
      UNSAFE_className="site-header"
      UNSAFE_style={{
        width: '100%',
        boxSizing: 'border-box',
        borderBottom:
          '1px solid #e5e5e5',
        backgroundColor: '#ffffff',
        padding: '14px 32px',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}
    >
      <Flex
        justifyContent="space-between"
        alignItems="center"
        width="100%"
        UNSAFE_style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}
      >
        <ActionButton
          isQuiet
          onPress={goToHome}
          aria-label="Go to Home"
        >
          <Text
            UNSAFE_className="site-header-logo"
            UNSAFE_style={{
              fontSize: '26px',
              fontWeight: '700',
              lineHeight: '1'
            }}
          >
            Ecommerce
          </Text>
        </ActionButton>

        <Flex
          alignItems="center"
          gap="size-300"
        >
          <nav className="site-header-nav">
            <NavLink
              to="/actions"
              className={({ isActive }) =>
                `site-header-nav-link ${isActive ? 'is-active' : ''}`
              }
            >
              Actions
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `site-header-nav-link ${isActive ? 'is-active' : ''}`
              }
            >
              About
            </NavLink>
          </nav>

          <ActionButton
            isQuiet
            aria-label="Account"
            onPress={goToAccount}
          >
            <User size="L" />
          </ActionButton>

          <Button
            variant="secondary"
            onPress={handleLogout}
          >
            Logout
          </Button>

          <ActionButton
            isQuiet
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onPress={toggleMenu}
            UNSAFE_className="site-header-menu-toggle"
          >
            {menuOpen ? <Close size="M" /> : <ShowMenu size="M" />}
          </ActionButton>
        </Flex>
      </Flex>

      {menuOpen && (
        <nav className="site-header-mobile-nav">
          <NavLink
            to="/actions"
            className={({ isActive }) =>
              `site-header-nav-link ${isActive ? 'is-active' : ''}`
            }
            onClick={() => setMenuOpen(false)}
          >
            Actions
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `site-header-nav-link ${isActive ? 'is-active' : ''}`
            }
            onClick={() => setMenuOpen(false)}
          >
            About
          </NavLink>
        </nav>
      )}
    </View>
  )
}