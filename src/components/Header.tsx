import React from 'react'
import { useEffect } from 'react'
import useAuth from '../hooks/useAuth'
interface UserInfo {
  name: string
  role: string
  sector: string
  functionDescription: string
  registration: string
  workHours?: {
    monday: string
    tuesday: string
    wednesday: string
    thursday: string
    friday: string
  }
}

const Header: React.FC = () => {
  const { matricula, nome, cargo, setor, setorSigla } = useAuth()
  


  // Função principal para buscar dados
  useEffect(() => {
    async function carregarDadosHero() {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error('Erro ao carregar dados:', err)
      }
    }
    if (matricula) {
      carregarDadosHero()
    }

  }, [matricula])





  const userInfo: UserInfo = {
    name: 'Leirisson Souza',
    role: 'Desenvolvedor Senior',
    sector: 'Tecnologia da Informação',
    functionDescription: 'Desenvolvedor Full Stack',
    registration: 'am618ps',
    workHours: {
      monday: '08:00 - 15:00',
      tuesday: '08:00 - 15:00',
      wednesday: '08:00 - 15:00',
      thursday: '08:00 - 15:00',
      friday: '08:00 - 15:00',
    },
  }

  return (
    <header className="bg-white p-4 shadow-md mt-16 border-t border-gray-200">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Coluna 1: Nome, Cargo e Setor */}
          <div className="text-gray-800">
            <h1 className="text-xl font-bold mb-2">{nome}</h1>
            <p className="mb-1"><strong>Cargo:</strong> <span className="opacity-70">{cargo}</span></p>
            <p><strong>Setor:</strong> <span className="opacity-70">{setor}</span></p>
          </div>

          {/* Coluna 2: Função e Matrícula */}
          <div className="text-gray-800">
            <p className="mb-1"><strong>Sigla:</strong> <span className="opacity-70">{setorSigla}</span></p>
            <p><strong>Matrícula:</strong> <span className="opacity-70">{matricula}</span></p>
          </div>

          {/* Coluna 3: Horário de Trabalho */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <h2 className="font-medium text-sm text-gray-600 mb-2">Horário de Trabalho</h2>
            <ul className="text-xs space-y-1">
              <li className="flex justify-between"><span>Segunda:</span><span>{userInfo.workHours?.monday}</span></li>
              <li className="flex justify-between"><span>Terça:</span><span>{userInfo.workHours?.tuesday}</span></li>
              <li className="flex justify-between"><span>Quarta:</span><span>{userInfo.workHours?.wednesday}</span></li>
              <li className="flex justify-between"><span>Quinta:</span><span>{userInfo.workHours?.thursday}</span></li>
              <li className="flex justify-between"><span>Sexta:</span><span>{userInfo.workHours?.friday}</span></li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header