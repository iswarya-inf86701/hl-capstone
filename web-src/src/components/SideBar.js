/*
 * <license header>
 */

import React from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from './AuthContext'

function SideBar () {
    const { authenticated } = useAuth()

    return (
        <ul className="SideNav">
            <li className="SideNav-item">
                <NavLink
                    className={({ isActive }) =>
                        `SideNav-itemLink ${isActive ? 'is-selected' : ''}`
                    }
                    aria-current="page"
                    end
                    to="/"
                >
                    Home
                </NavLink>
            </li>

            <li className="SideNav-item">
                <NavLink
                    className={({ isActive }) =>
                        `SideNav-itemLink ${isActive ? 'is-selected' : ''}`
                    }
                    aria-current="page"
                    to="/actions"
                >
                    Your App Actions
                </NavLink>
            </li>

            {authenticated && (
                <li className="SideNav-item">
                    <NavLink
                        className={({ isActive }) =>
                            `SideNav-itemLink ${isActive ? 'is-selected' : ''}`
                        }
                        aria-current="page"
                        to="/account"
                    >
                        Account
                    </NavLink>
                </li>
            )}

            <li className="SideNav-item">
                <NavLink
                    className={({ isActive }) =>
                        `SideNav-itemLink ${isActive ? 'is-selected' : ''}`
                    }
                    aria-current="page"
                    to="/about"
                >
                    About App Builder
                </NavLink>
            </li>
        </ul>
    )
}

export default SideBar