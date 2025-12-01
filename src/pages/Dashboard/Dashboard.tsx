import { useEffect, useState } from 'react'
import { Clock, Calendar, Users, CalendarCheck2 } from 'lucide-react'

import useAuth from '../../hooks/useAuth'
import ResumoDePresenca from '../../components/ResumoDePresenca'
import { AtividadeRecente } from '../../components/AtividadeRecente'
import CardResumo from '../../components/CardResumo'
import { getMesAnoAtual } from '../../utils/getMesAno'
import LoadingScreen from '../../components/LoadingScreen'
import ErroLoading from '../../components/ErroLoading'
import { timeToMinutes } from '../../utils/timeToMinutes'



// Tipagem dos dados do SARH
interface SarhData {
  nome: string
  cpfServidor: { cpf: string }
  lotacao: {
    cargo: { cargoDescricao: string }
    lotacao: { descricao: string, sigla: string }
  }
}

// Tipagem dos dados do Espelho
interface EspelhoData {
  dias_uteis: number
  dias_trabalhados: number
  total_de_horas_devidas: number
  totoal_de_horas_trabalhadas: number
  faltas: number
}

type DashboardData = {
  sarh: SarhData | null
  espelho: EspelhoData | null
}

const CACHE_TTL = 5 * 60 * 1000  // 5 minutos

const Dashboard = () => {
  const { matricula, nome, cpf } = useAuth()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const mesAno = getMesAnoAtual()  // Ex: "04-2025"

  const cacheKey = `dashboardData-${cpf}-${mesAno}`

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       // Verifica se tem dados em cache e ainda válidos
  //       const cached = localStorage.getItem(cacheKey)
  //       if (cached) {
  //         const { timestamp, data } = JSON.parse(cached)
  //         if (Date.now() - timestamp < CACHE_TTL) {
  //           setData(data)
  //           setLoading(false)
  //           return
  //         }
  //       }

  //       setLoading(true)
  //       setError(null)

  //       // Faz as requisições em paralelo
  //       const [sarhRes, espelhoRes] = await Promise.all([
  //         fetch(`http://sarh.api.am.trf1.gov.br/servidores/${matricula}`),
  //         fetch(`http://172.19.3.52:3333/api/v1/espelho/resgatar-espelho-mes/${cpf}/${mesAno}`),
  //       ])

  //       if (!sarhRes.ok || !espelhoRes.ok) throw new Error('Erro ao buscar dados')

  //       const [sarhData, espelhoJson] = await Promise.all([
  //         sarhRes.json(),
  //         espelhoRes.json(),
  //       ])



  //       const combinedData: DashboardData = {
  //         sarh: sarhData,
  //         espelho: espelhoJson.data[0] || [],
  //       }

  //       console.log(combinedData)

  //       // Salva no estado e no cache
  //       setData(combinedData)
  //       localStorage.setItem(
  //         cacheKey,
  //         JSON.stringify({ timestamp: Date.now(), data: combinedData })
  //       )
  //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     } catch (err: any) {
  //       setError(err.message || 'Erro ao carregar dados.')
  //       console.error('Erro ao carregar dados:', err)
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   if (cpf && matricula) {
  //     fetchData()
  //   }
  // }, [cpf, matricula, mesAno, cacheKey])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Verifica se tem dados em cache e ainda válidos
        const cached = localStorage.getItem(cacheKey)
        if (cached) {
          const { timestamp, data } = JSON.parse(cached)
          if (Date.now() - timestamp < CACHE_TTL) {
            setData(data)
            setLoading(false)
            return
          }
        }

        setLoading(true)
        setError(null)

        // Verifica se os parâmetros são válidos
        if (!matricula || !cpf || !mesAno) {
          throw new Error('Parâmetros inválidos: matrícula, CPF ou mês/ano ausentes.')
        }

        // Faz as requisições em paralelo
        const [sarhRes, espelhoRes] = await Promise.all([
          fetch(`http://sarh.api.am.trf1.gov.br/servidores/${matricula}`),
          fetch(`http://172.19.3.52:3333/api/v1/espelho/resgatar-espelho-mes/${cpf}/${mesAno}`),
        ])

        if (!sarhRes.ok || !espelhoRes.ok) {
          throw new Error('Erro ao buscar dados')
        }

        const [sarhData, espelhoJson] = await Promise.all([
          sarhRes.json(),
          espelhoRes.json(),
        ])

        // Garante que os dados sejam válidos antes de continuar
        if (!sarhData || !espelhoJson || !espelhoJson.data) {
          throw new Error('Dados inválidos recebidos da API.')
        }

        const combinedData: DashboardData = {
          sarh: sarhData,
          espelho: espelhoJson.data[0] || [],
        }

        

        // Salva no estado e no cache
        setData(combinedData)
        localStorage.setItem(
          cacheKey,
          JSON.stringify({ timestamp: Date.now(), data: combinedData })
        )
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar dados.')
        console.error('Erro ao carregar dados:', err)
      } finally {
        setLoading(false)
      }
    }

    if (cpf && matricula) {
      fetchData()
    }
  }, [cpf, matricula, mesAno, cacheKey])
  
  if (loading) return (
    <LoadingScreen />
  )
  if (error) return (
    <ErroLoading >
      {error}
    </ErroLoading>
  )

  const { espelho } = data!


  return (
    <div className="bg-gray-100 font-sans p-5 antialiased text-gray-800 leading-normal tracking-wider">
      {/* Cabeçalho */}
      <header className="bg-white shadow-xs shadow-gray-600 p-4 mb-4 flex justify-between items-center rounded-sm">
        <div>
          <h1 className="text-xl font-bold">Dashboard</h1>
          <p className="text-sm text-gray-600">Bem-vindo(a): {nome}</p>
        </div>
      </header>

      {/* Cards Resumo */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <CardResumo
          legenda="Carga horária do mês já realizada"
          totalDeHorasTrabalhadas={(Number(espelho?.totoal_de_horas_trabalhadas)) || 0}
        >
          <Clock className="text-blue-500" size={24} />
        </CardResumo>

        <CardResumo
          legenda="Jornada de trabalho"
          totalDeHorasTrabalhadas={`${espelho?.total_de_horas_devidas || 0}H`}
        >
          <Calendar className="text-green-500" size={24} />
        </CardResumo>

        <CardResumo
          legenda="Dias presentes"
          totalDeHorasTrabalhadas={`${espelho?.dias_trabalhados || 0}/${espelho?.dias_uteis || 0}`}
        >
          <Users className="text-purple-500" size={24} />
        </CardResumo>

        <CardResumo
          legenda="Dias úteis"
          totalDeHorasTrabalhadas={espelho?.dias_uteis || 0}
        >
          <CalendarCheck2 className="text-yellow-500" size={24} color="green" />
        </CardResumo>
      </section>

      {/* Conteúdo Secundário */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AtividadeRecente />
        <ResumoDePresenca
          horasTrabalhadas={(timeToMinutes(Number(espelho?.totoal_de_horas_trabalhadas) * 60)) / 60 || 0}
          diasUteis={espelho?.dias_uteis || 0}
          diasTrabalhados={espelho?.dias_trabalhados || 0}
          cargaHorariaMes={espelho?.total_de_horas_devidas || 0}
        />
      </section>
    </div>
  )
}

export default Dashboard 