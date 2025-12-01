import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { HiHome, HiClipboardList, HiLogout } from 'react-icons/hi'
import useAuth from '../hooks/useAuth'
import logoJustica from '../assets/logo-sjam-cor-horizontal.png'

const NavBar: React.FC = () => {
  const location = useLocation()
  const { logout } = useAuth()
  const navigate = useNavigate()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const handleLogout = () => {
    if (window.confirm('Você tem certeza que deseja sair?')) {
      logout()
      navigate('/login')
    }
  }

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-30">
      <div className="flex container items-center  gap-5 justify-between mx-auto px-4">
        {/* Logo / Esquerda */}
        <div className="text-xl font-semibold text-gray-800">
          <img
            src={logoJustica}
            className="h-12"
            alt="logo da seção judiciária do amazonas"
          />
        </div>
        <div className="flex items-center  gap-5 justify-start h-16">

          {/* Menu Horizontal - Centralizado ou à Direita */}
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className={`flex items-center gap-2 px-4 py-2 rounded transition-all ${isActive('/') ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-700'}`
              }
            >
              <HiHome size={20} />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/espelho-ponto"
              className={`flex items-center gap-2 px-4 py-2 rounded transition-all ${isActive('/espelho-ponto') ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100 text-gray-700'}`
              }
            >
              <HiClipboardList size={20} />
              <span>Espelho de Ponto</span>
            </Link>
          </div>

          {/* Botão Sair - Alinhado à direita */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-800 px-4 py-2 rounded transition-colors hover:bg-gray-100"
          >
            <HiLogout size={20} />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default NavBar