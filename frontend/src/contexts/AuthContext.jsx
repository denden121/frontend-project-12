import { createContext, useContext, useState, useCallback } from 'react'
import axios from 'axios'
import apiRoutes from '../routes/apiRoutes'

const STORAGE_KEY = 'chat_token'
const USERNAME_KEY = 'chat_username'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEY))
  const [username, setUsername] = useState(() => localStorage.getItem(USERNAME_KEY))

  const applyAuthData = useCallback((data) => {
    localStorage.setItem(STORAGE_KEY, data.token)
    localStorage.setItem(USERNAME_KEY, data.username)
    setToken(data.token)
    setUsername(data.username)
  }, [])

  const login = useCallback(async (loginUsername, password) => {
    const { data } = await axios.post(apiRoutes.login(), {
      username: loginUsername,
      password,
    })
    applyAuthData(data)
  }, [applyAuthData])

  const signup = useCallback(async (newUsername, password) => {
    const { data } = await axios.post(apiRoutes.signup(), {
      username: newUsername,
      password,
    })
    applyAuthData(data)
  }, [applyAuthData])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(USERNAME_KEY)
    setToken(null)
    setUsername(null)
  }, [])

  const isAuthenticated = !!token

  const value = {
    token,
    username,
    login,
    signup,
    logout,
    isAuthenticated,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
