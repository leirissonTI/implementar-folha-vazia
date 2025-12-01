import { type JSX } from 'react'
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from 'react-router-dom'

import Login from '../pages/Login/Login'
import Dashboard from '../pages/Dashboard/Dashboard'
import EspelhoPonto from '../pages/EspelhoPonto/EspelhoPonto'
import useAuth from '../hooks/useAuth'
import DefaultLayout from '../layouts/DefaultLayout'


const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

const Routes = () => (
  <BrowserRouter>
    <RouterRoutes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <DefaultLayout>
              <Dashboard />
            </DefaultLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/espelho-ponto"
        element={
          <PrivateRoute>
            <DefaultLayout>
              <EspelhoPonto />
            </DefaultLayout>
          </PrivateRoute>
        }
      />
    </RouterRoutes>
  </BrowserRouter>
)

export default Routes 