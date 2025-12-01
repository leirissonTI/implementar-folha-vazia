
// Função para pegar mês e ano atual no formato "MM-YYYY"
export const getMesAnoAtual = () => {
  const data = new Date()
  const mes = String(data.getMonth() + 1).padStart(2, '0')  // Janeiro = 0
  const ano = data.getFullYear()

  // const mes = 1
  // const ano = 2025
  return `${mes}-${ano}`
} 