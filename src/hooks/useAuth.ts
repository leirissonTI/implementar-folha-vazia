import { useState, useEffect } from 'react'

interface AuthContextType {
  isAuthenticated: boolean
  token: string | null
  matricula: string | null
  login: (token: string, matricula: string) => void
  logout: () => void
  cpf: string
  nome: string
  cargo: string
  setor: string
  setorSigla: string
}

const useAuth = (): AuthContextType => {
  const storedToken = localStorage.getItem('token')
  const storedMatricula = localStorage.getItem('matricula')

  // Recuperar dados SARH do localStorage, se existirem
  const storedCpf = localStorage.getItem('cpf') || ''
  const storedNome = localStorage.getItem('nome') || ''
  const storedCargo = localStorage.getItem('cargo') || ''
  const storedSetor = localStorage.getItem('setor') || ''
  const storedSetorSigla = localStorage.getItem('setorSigla') || ''

  const [isAuthenticated, setIsAuthenticated] = useState(!!storedToken)
  const [token, setToken] = useState<string | null>(storedToken)
  const [matricula, setMatricula] = useState<string | null>(storedMatricula)

  // Dados do servidor SARH
  const [cpf, setCpf] = useState<string>(storedCpf)
  const [nome, setNome] = useState<string>(storedNome)
  const [cargo, setCargo] = useState<string>(storedCargo)
  const [setor, setSetor] = useState<string>(storedSetor)
  const [setorSigla, setSetorSigla] = useState<string>(storedSetorSigla)



  const formatarCPF = (cpf: string | number | null | undefined): string => {
    if (cpf === null || cpf === undefined) return ''

    // Converte para string e remove qualquer caractere não numérico
    const str = String(cpf).replace(/\D/g, '')

    // Completa com zeros à esquerda até 11 dígitos
    return str.padStart(11, '0')
  }

  // Função para buscar os dados do SARH
  const fetchUserData = async (matricula: string) => {
    try {
      const resSarh = await fetch(`http://sarh.api.am.trf1.gov.br/servidores/${matricula}`)
      if (!resSarh.ok) throw new Error('Erro ao buscar dados do SARH')
      const sarhData = await resSarh.json()

      const novoCpf = formatarCPF(sarhData.cpfServidor?.cpf)

      const novoNome = sarhData.nome || ''
      const novoCargo = sarhData.lotacao?.cargo?.cargoDescricao || ''
      const novoSetor = sarhData.lotacao?.lotacao?.descricao || ''
      const novoSetorSigla = sarhData.lotacao?.lotacao?.sigla || ''

      setCpf(novoCpf)
      setNome(novoNome)
      setCargo(novoCargo)
      setSetor(novoSetor)
      setSetorSigla(novoSetorSigla)

      // Salvar no localStorage
      localStorage.setItem('cpf', novoCpf)
      localStorage.setItem('nome', novoNome)
      localStorage.setItem('cargo', novoCargo)
      localStorage.setItem('setor', novoSetor)
      localStorage.setItem('setorSigla', novoSetorSigla)

    } catch (error) {
      console.error('Erro ao buscar dados do SARH:', error)
      // Limpar dados caso falhe
      setCpf('')
      setNome('')
      setCargo('')
      setSetor('')
      setSetorSigla('')

      localStorage.removeItem('cpf')
      localStorage.removeItem('nome')
      localStorage.removeItem('cargo')
      localStorage.removeItem('setor')
      localStorage.removeItem('setorSigla')
    }
  }

  // Atualiza os dados do usuário sempre que a matricula mudar
  useEffect(() => {
    if (matricula) {
      fetchUserData(matricula)
    } else {
      // Limpa os dados se não houver matricula
      setCpf('')
      setNome('')
      setCargo('')
      setSetor('')
      setSetorSigla('')

      localStorage.removeItem('cpf')
      localStorage.removeItem('nome')
      localStorage.removeItem('cargo')
      localStorage.removeItem('setor')
      localStorage.removeItem('setorSigla')
    }
  }, [matricula])

  const login = (newToken: string, newMatricula: string) => {
    localStorage.setItem('token', newToken)
    localStorage.setItem('matricula', newMatricula)

    setToken(newToken)
    setMatricula(newMatricula)
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('matricula')
    localStorage.removeItem('cpf')
    localStorage.removeItem('nome')
    localStorage.removeItem('cargo')
    localStorage.removeItem('setor')
    localStorage.removeItem('setorSigla')

    setToken(null)
    setMatricula(null)
    setCpf('')
    setNome('')
    setCargo('')
    setSetor('')
    setSetorSigla('')

    setIsAuthenticated(false)
  }

  return {
    isAuthenticated,
    token,
    matricula,
    cpf,
    nome,
    cargo,
    setor,
    setorSigla,
    login,
    logout,
  }
}

export default useAuth