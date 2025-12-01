import { createContext, useState, type ReactNode } from 'react'
import axios from 'axios'



// Definindo o tipo do contexto
interface UserContextType {
  user: object | null
  loading: boolean
  error: string | null
  fetchUserData: (matricula: string) => Promise<void>
}

// Criando o contexto com valores padrão
// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext<UserContextType>({
  user: null,
  loading: false,
  error: null,
  fetchUserData: async () => { },
})

interface Props {
  children: ReactNode
}

// Componente Provider
export const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState<object | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Função para buscar os dados do usuário com base na matrícula
  const fetchUserData = async (matricula: string) => {
    try {
      setLoading(true)
      setError(null)

      // Primeira API - Busca informações básicas do usuário
      const res1 = await axios.get(`http://sarh.api.am.trf1.gov.br/servidores/${matricula}`)

      // Segunda API - Busca detalhes adicionais
      const res2 = await axios.get(`http://172.19.3.52:3333/api/v1/espelho/diario`)

      // Combina os dados das duas APIs
      const userData: object = {
        ...res1.data,
        ...res2.data,
        matricula, // Garante que a matrícula esteja no objeto
      }

      setUser(userData)  // Atualiza o estado com os dados do usuário
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Erro ao buscar dados do usuário:', err)
      setError(err.response?.data?.message || 'Não foi possível carregar os dados do usuário.')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <UserContext.Provider value={{ user, loading, error, fetchUserData }}>
      {children}
    </UserContext.Provider>
  )
} 