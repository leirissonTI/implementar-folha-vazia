export interface PontoFuncionario {
  cpf: string
  credito: number
  data: string  // formato "DD/MM/YYYY"
  debito: number
  diaDoMes: string  // formato "Ter, 07/01/2025"
  horasExtras: number
  horasNormais: number
  horasTrabalhadas: number
  id: number
  mesAno: string  // formato "MM/YYYY"
  motivoReajuste: string
  observacoes: string
  origem: string
  primeiraEntrada: string  // formato "HH:mm"
  primeiraSaida: string  // formato "HH:mm"
  saldo: number
  segundaEntrada: string | null
  segundaSaida: string | null
  status: string
} 