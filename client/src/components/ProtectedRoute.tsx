import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import type { RootState } from '../store'

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user } = useSelector((state: RootState) => state.auth)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true })
    }
  }, [user, navigate])

  return user ? children : null
}