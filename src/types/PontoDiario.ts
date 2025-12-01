export type PontoDiario = {
    mesAno: string;
    id: number;
    cpf: string;
    diaDoMes: string;
    credito: number;
    debito: number;
    horasNormais: number;
    horasExtras: number;
    saldo: number;
    motivoReajuste: string | null;
    data: string;
    primeiraEntrada: string | null;
    primeiraSaida: string | null;
    segundaEntrada: string | null;
    segundaSaida: string | null;
    horasTrabalhadas: number;
    horasAlmoco: number;
    bancoDeHoras: number;
    observacoes: string;
    status: string;
    origem: string | null;
}