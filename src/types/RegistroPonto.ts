export type RegistroPonto = {
    diaDoMes?: string  // Tornar opcional adicionando ?
    primeiraEntrada?: string
    primeiraSaida?: string
    segundaEntrada?: string
    segundaSaida?: string
    credito?: string | number
    debito?: string
    horasNormais?: string
    horasExtras?: string
    horasTrabalhadas?: string
    saldo?: string
    observacoes?: string
    // status?: 'Presente' | 'Parcial' | 'Ausente';
    status?: 'Presente' | 'Parcial' | 'Sem Registro';
    motivoReajuste?: string
    horasAlmoco?: number | string
    bancoDeHoras?: number | string
    origem?: string | number | undefined
}