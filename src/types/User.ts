import { useState } from 'react'

interface AuthContextType {
  isAuthenticated: boolean
  login: (token: string) => void
  logout: () => void
}

const useAuth = (): AuthContextType => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'))

  const login = (token: string) => {
    localStorage.setItem('token', token)
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
  }

  return { isAuthenticated, login, logout }
}

export default useAuth 