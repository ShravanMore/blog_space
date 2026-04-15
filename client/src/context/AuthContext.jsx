import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem('user')) || null
  )

  const login = async (credentials) => {
    const res = await api.post('/api/auth/login', credentials)
    setCurrentUser(res.data)
    return res.data
  }

  const logout = async () => {
    await api.post('/api/auth/logout', {})
    setCurrentUser(null)
  }

  const register = async (data) => {
    const res = await api.post('/api/auth/register', data)
    return res.data
  }

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(currentUser))
  }, [currentUser])

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
