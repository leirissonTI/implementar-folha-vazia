import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://pontojus.api.am.trf1.gov.br/auth', // Substitua pela URL da sua API
  timeout: 10000,
})



// Interceptor opcional para adicionar token em requisições futuras
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = token
  }
  return config
})

export default apiClient 