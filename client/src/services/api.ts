import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})


// Add request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Add response interceptor for token refresh
api.interceptors.response.use(
  (response: any) => response,
  async (error: any) => {
    const originalRequest = error.config
    
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'}/auth/refresh`,
          {},
          { withCredentials: true }
        )
        
        const { token } = response.data
        localStorage.setItem('token', token)
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        
        return api(originalRequest)
      } catch (err) {
        localStorage.removeItem('token')
        window.location.href = '/login'
        return Promise.reject(err)
      }
    }
    
    return Promise.reject(error)
  }
)

export default api