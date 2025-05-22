import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../store/authSlice'
import api from '../services/api'

export default function useAuth() {
  const dispatch = useDispatch()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { user, token, refreshToken } = response.data
      
      dispatch(setCredentials({ user, token, refreshToken }))
      setIsAuthenticated(true)
      
      // Store tokens in secure HTTP-only cookies via backend
      await api.post('/auth/store-tokens', { token, refreshToken }, {
        withCredentials: true
      })
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed')
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await api.post('/auth/register', { name, email, password })
      const { user, token, refreshToken } = response.data
      
      dispatch(setCredentials({ user, token, refreshToken }))
      setIsAuthenticated(true)
      
      await api.post('/auth/store-tokens', { token, refreshToken }, {
        withCredentials: true
      })
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed')
    }
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout', {}, { withCredentials: true })
      dispatch(setCredentials({ user: null, token: null, refreshToken: null }))
      setIsAuthenticated(false)
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Logout failed')
    }
  }

  return { isAuthenticated, login, register, logout }
}