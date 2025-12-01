import axios from 'axios'

// URL da API
const url = 'http://sarh.api.am.trf1.gov.br/servidores/'

// Função para buscar dados do servidor
export async function buscarDadosServidor(matricula: string) {
    try {
        matricula = matricula.toUpperCase()

        const response = await axios.get(`${url}/${matricula}`)

        return response.data
    } catch (error) {
        console.error('Erro na requisição:', error)
        // Opcional: retornar um valor padrão ou lançar o erro
        // return null  
        throw error  // ou relança o erro para quem chamar a função tratar
    }
}