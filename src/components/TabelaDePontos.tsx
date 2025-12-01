import { useEffect, useState } from 'react'
import type { RegistroPonto } from '../types/RegistroPonto'
import useAuth from '../hooks/useAuth'
import { EspelhoPontoHtml } from './EspelhoPontoHtml'
import { timeToMinutes } from '../utils/timeToMinutes';
import { formatarHora } from '../utils/formatarHora';
import type { PontoDiario } from '../types/PontoDiario';

// Interface para o acumulador
interface Totais {
    credito: number;
    debito: number;
    horasNormais: number;
    bancoDeHoras: number; // Corrigido: era bancoDeHoas
    horasAlmoco: number;
    horasExtras: number;
    horasTrabalhadas: number;
    saldo: number;
}

// Função auxiliar para garantir número
const toNumber = (value: unknown): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {

        return timeToMinutes(value) || 0
    };
    return 0;
};


export function TabelaDePontos() {
    const [dados, setDados] = useState<RegistroPonto[]>([])
    const [mes, setMes] = useState<string>('')
    const [ano, setAno] = useState<string>('')
    const [origens, setOrigens] = useState<string[]>([])

    const totais = dados.reduce<Totais>((acc, item) => {
        // Só processa itens com status válido
        // if (!['Presente', 'Parcial', 'Ausente', undefined].includes(item.status)) {
        if (!['Presente', 'Parcial', 'Sem Registro', undefined].includes(item.status)) {
            return acc;
        }

        // Processa todos os campos de uma vez
        return {
            credito: acc.credito + toNumber(item.credito),
            debito: acc.debito + toNumber(item.debito),
            horasNormais: acc.horasNormais + toNumber(item.horasNormais),
            horasAlmoco: acc.horasAlmoco + toNumber(item.horasAlmoco),
            horasExtras: acc.horasExtras + toNumber(item.horasExtras),
            bancoDeHoras: acc.bancoDeHoras + timeToMinutes(toNumber(item.bancoDeHoras)),
            horasTrabalhadas: acc.horasTrabalhadas + toNumber(item.horasTrabalhadas),
            saldo: acc.saldo + toNumber(item.saldo),
        }
    }, {
        credito: 0,
        debito: 0,
        horasNormais: 0,
        bancoDeHoras: 0,
        horasAlmoco: 0,
        horasExtras: 0,
        horasTrabalhadas: 0,
        saldo: 0,
    });

    const pontoDia: RegistroPonto = {
        credito: formatarHora(String(timeToMinutes(totais.credito))),
        debito: formatarHora(String(timeToMinutes(totais.debito))),
        horasNormais: formatarHora(String(timeToMinutes(totais.horasNormais))),
        horasExtras: formatarHora(String(timeToMinutes(totais.horasExtras))),
        horasTrabalhadas: formatarHora(String(timeToMinutes(totais.horasTrabalhadas))),
        saldo: formatarHora(String(timeToMinutes(totais.saldo))),
        horasAlmoco: formatarHora(String(timeToMinutes(totais.horasAlmoco))),
        bancoDeHoras: formatarHora(timeToMinutes(String(totais.bancoDeHoras))),
    }





    const { cargo, cpf, matricula, nome, setor, setorSigla } = useAuth()

    // Crie um objeto com os dados do usuário para passar como prop
    const userData = { cargo, cpf, matricula, nome, setor, setorSigla };


    // Datas atuais
    const hoje = new Date()
    const mesAtual = String(hoje.getMonth() + 1).padStart(2, '0')
    const anoAtual = hoje.getFullYear()

    // Definindo valores iniciais como mês e ano atuais
    useEffect(() => {
        setMes(mesAtual)
        setAno(String(anoAtual))
    }, [anoAtual, mesAtual])

    // Meses disponíveis (limita aos meses passados se for o ano atual)
    const mesesDisponiveis = () => {
        const todosMeses = [
            { numero: '01', nome: 'Janeiro' },
            { numero: '02', nome: 'Fevereiro' },
            { numero: '03', nome: 'Março' },
            { numero: '04', nome: 'Abril' },
            { numero: '05', nome: 'Maio' },
            { numero: '06', nome: 'Junho' },
            { numero: '07', nome: 'Julho' },
            { numero: '08', nome: 'Agosto' },
            { numero: '09', nome: 'Setembro' },
            { numero: '10', nome: 'Outubro' },
            { numero: '11', nome: 'Novembro' },
            { numero: '12', nome: 'Dezembro' },
        ]

        if (ano === String(anoAtual)) {
            return todosMeses.filter((m) => Number(m.numero) <= Number(mesAtual))
        }



        return todosMeses
    }

    // Anos disponíveis (últimos 3 anos)
    const anosDisponiveis = Array.from({ length: 3 }, (_, i) =>
        String(anoAtual - 1 + i)
    )

    // Efeito para ajustar o mês automaticamente quando mudar o ano
    useEffect(() => {
        if (!ano) return
        // Se o ano for o atual e o mês estiver vazio ou inválido, define como mês atual
        if (ano === String(anoAtual) && (!mes || Number(mes) > Number(mesAtual))) {
            setMes(mesAtual)
        }
    }, [ano, anoAtual, mes, mesAtual])

    useEffect(() => {
        if (!mes || !ano) return

        async function fetchData() {
            try {

                const [responsePonDoMes] = await Promise.all([
                    fetch(`http://172.19.3.52:3333/api/v1/espelho/resgatar-espelho-diario-mes/${cpf}/${mes}-${ano}`),
                ])

                const resultPontosDoMesConvertido = await responsePonDoMes.json()
                const resultPontosDoMes = await resultPontosDoMesConvertido.data
                const origin = (Array.isArray(resultPontosDoMes) ? resultPontosDoMes : []).map((o: RegistroPonto) => o.origem)

                if (!resultPontosDoMes || (Array.isArray(resultPontosDoMes) && resultPontosDoMes.length === 0)) {
                    const diasNoMes = new Date(Number(ano), Number(mes), 0).getDate()
                    const nomesDias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
                    const mesEmBranco: RegistroPonto[] = Array.from({ length: diasNoMes }, (_, i) => {
                        const dia = i + 1
                        const date = new Date(Number(ano), Number(mes) - 1, dia)
                        const diaSemana = nomesDias[date.getDay()]
                        return {
                            diaDoMes: `${String(dia).padStart(2, '0')} - ${diaSemana}`,
                            primeiraEntrada: '',
                            primeiraSaida: '',
                            segundaEntrada: '',
                            segundaSaida: '',
                            credito: '0',
                            debito: '0',
                            horasNormais: '0',
                            horasExtras: '0',
                            horasTrabalhadas: '0',
                            saldo: '0',
                            observacoes: '',
                            status: 'Sem Registro',
                            motivoReajuste: '',
                            horasAlmoco: '0',
                            bancoDeHoras: '0',
                            origem: ''
                        }
                    })

                    setDados(mesEmBranco)
                    setOrigens([])
                } else {
                    setDados(resultPontosDoMes || [])
                    setOrigens(origin || '')
                    setDados(resultPontosDoMes || [])
                }
        
            } catch (error) {
                console.error('Erro ao buscar registros:', error)
                setDados([])
            }
        }
        fetchData()
    }, [ano, cpf, mes])

    return (
        <div className="overflow-x-auto shadow-md rounded-lg p-4">
            {/* Filtros */}
            <div className="mb-4 flex gap-4 items-center ">
                <label className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">Mês</span>
                    <select
                        value={mes}
                        onChange={(e) => setMes(e.target.value)}
                        className="mt-1 px-3 py-2 border rounded-md"
                    >
                        {mesesDisponiveis().map((m) => (
                            <option key={m.numero} value={m.numero}>
                                {m.nome}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">Ano</span>
                    <select
                        value={ano}
                        onChange={(e) => setAno(e.target.value)}
                        className="mt-1 px-3 py-2 border rounded-md"
                    >
                        {anosDisponiveis.map((a) => (
                            <option key={a} value={a}>
                                {a}
                            </option>
                        ))}
                    </select>

                </label>

                <div className='mt-6  rounded-md  duration-200'>
                    <div className='p-2 flex items-center  gap-2 cursor-pointer'>
                        <EspelhoPontoHtml
                            data={dados}
                            total={
                                pontoDia
                                    ? {
                                        ...totais,
                                        credito: totais.credito?.toString(),
                                        debito: totais.debito?.toString(),
                                        horasNormais: totais.horasNormais?.toString(),
                                        horasExtras: totais.horasExtras?.toString(),
                                        horasTrabalhadas: totais.horasTrabalhadas?.toString(),
                                        saldo: totais.saldo?.toString(),
                                        horasAlmoco: totais.horasAlmoco?.toString(),
                                        bancoDeHoras: totais.bancoDeHoras?.toString()
                                    }
                                    : undefined
                            }
                            dataUser={userData}
                            origem={origens}
                            competencia={`${mesesDisponiveis().find(m => m.numero === mes)?.nome.toUpperCase()} DE ${ano}`}
                        />
                    </div>
                </div>
            </div>





            {/* Tabela */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white divide-y divide-gray-200">
                    <thead className="bg-blue-600 text-white">
                        <tr>
                            <th className="px-4 py-3 text-center text-sm font-semibold uppercase whitespace-nowrap">Dia</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold uppercase whitespace-nowrap">1ª Entrada</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold uppercase whitespace-nowrap">1ª Saída</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold uppercase whitespace-nowrap">2ª Entrada</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold uppercase whitespace-nowrap">2ª Saída</th>
                            {/* <th className="px-4 py-3 text-center text-sm font-semibold uppercase whitespace-nowrap">Crédito</th> */}
                            {/* <th className="px-4 py-3 text-center text-sm font-semibold uppercase whitespace-nowrap">Débito</th> */}
                            <th className="px-4 py-3 text-center text-sm font-semibold uppercase whitespace-nowrap">Horas Normais</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold uppercase whitespace-nowrap">horas Almoço</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold uppercase whitespace-nowrap">horas Trabalhadas</th>
                            {/* <th className="px-4 py-3 text-center text-sm font-semibold uppercase whitespace-nowrap">Banco Horas</th> */}
                            <th className="px-4 py-3 text-center text-sm font-semibold uppercase whitespace-nowrap">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {dados.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                <td className={`px-4 py-3 border-x border-gray-200 text-center text-sm font-medium
                                  ${item.diaDoMes?.includes('Dom') || item.diaDoMes?.includes('Sáb')
                                        ? 'bg-gray-100 text-gray-500'
                                        : 'text-gray-900'
                                    }`}>
                                    {item.diaDoMes}
                                </td>
                                <td className={`px-4 py-3 border-x border-gray-200 text-center text-sm font-bold
                                    ${item.diaDoMes?.includes('Dom') || item.diaDoMes?.includes('Sáb')
                                        ? 'bg-gray-100 text-gray-500'
                                        : 'text-gray-700'
                                    }`}>
                                    {item.primeiraEntrada || '—'}
                                </td>
                                <td className={`px-4 py-3 border-x  border-gray-200 text-center text-sm  font-bold 
                                    ${item.diaDoMes?.includes('Dom') || item.diaDoMes?.includes('Sáb')
                                        ? 'bg-gray-100 text-gray-500'
                                        : 'text-gray-700'
                                    }`}>
                                    {item.primeiraSaida || '—'}
                                </td>
                                <td className={`px-4 py-3 border-x border-gray-200 text-center text-sm  font-bold
                                    ${item.diaDoMes?.includes('Dom') || item.diaDoMes?.includes('Sáb')
                                        ? 'bg-gray-100 text-gray-500'
                                        : 'text-gray-700'
                                    }`}>
                                    {item.segundaEntrada || '—'}
                                </td>
                                <td className={`px-4 py-3 border-x border-gray-200 text-center text-sm  font-bold 
                                    ${item.diaDoMes?.includes('Dom') || item.diaDoMes?.includes('Sáb')
                                        ? 'bg-gray-100 text-gray-500'
                                        : 'text-gray-700'
                                    }`}>
                                    {item.segundaSaida || '—'}
                                </td>

                                {/* Crédito */}
                                {/* <td className={`px-4 py-3 text-center border-x border-gray-200 text-sm font-bold ${Number(item.credito ?? 0) > 0 ? "text-gray-700" : "text-gray-400"}`}>
                                    {Number(item.credito ?? 0) > 0 ? formatarHora(String(item.credito)) : ''}
                                </td> */}

                                {/* Débito */}
                                {/* <td className={`px-4 py-3 text-center border-x border-gray-200 text-sm ${Number(item.debito ?? 0) > 0 ? "font-bold text-gray-700" : "text-gray-400"}`}>
                                    {Number(item.debito ?? 0) > 0 && item.status !== "Ausente" ? formatarHora(String(item.debito)) : ''}
                                </td> */}

                                {/* Horas Normais */}
                                <td className={`px-4 py-3 text-center border-x border-gray-200 text-sm font-bold 
                                    ${item.diaDoMes?.includes('Dom') || item.diaDoMes?.includes('Sáb')
                                        ? 'bg-gray-100 text-gray-500'
                                        : 'text-gray-700'
                                    }
                                    `}>
                                    {Number(item.horasNormais ?? 0) > 0 ? formatarHora(String(item.horasNormais)) : ''}
                                </td>

                                {/* Horas Almoço */}
                                <td className={`px-4 py-3 text-center border-x border-gray-200 text-sm 
                                    ${Number(item.horasAlmoco ?? 0) > 0 ? "font-bold text-gray-700" : "text-gray-400"}
                                    ${item.diaDoMes?.includes('Dom') || item.diaDoMes?.includes('Sáb')
                                        ? 'bg-gray-100 text-gray-500'
                                        : 'text-gray-700'
                                    }
                                    `}>
                                    {Number(item.horasAlmoco ?? 0) > 0 ? formatarHora(String(item.horasAlmoco)) : ''}
                                </td>

                                {/* Horas Trabalhadas */}
                                <td className={`px-4 py-3 text-center border-x border-gray-200 text-sm font-medium 
                        ${Number(item.horasTrabalhadas ?? 0) >= 8
                                        ? 'text-green-600'
                                        : Number(item.horasTrabalhadas ?? 0) >= 7
                                            ? 'text-green-600'
                                            : 'text-red-600'}
                                            
                                            ${item.diaDoMes?.includes('Dom') || item.diaDoMes?.includes('Sáb')
                                        ? 'bg-gray-100 text-gray-500'
                                        : 'text-gray-700'
                                    }
                                            `}>
                                    {Number(item.horasTrabalhadas ?? 0) > 0 ? formatarHora(String(item.horasTrabalhadas)) : ''}
                                </td>

                                {/* Banco de Horas
                                <td className="px-4 py-3 text-center border-x border-gray-200 text-sm text-blue-600 font-medium">
                                    {Number(item.bancoDeHoras ?? 0) > 0 ? formatarHora(timeToMinutes(String(item.bancoDeHoras))) : ''}
                                </td> */}

                                {/* Status */}
                                <td className={`px-4 py-3 text-center  border-gray-200 border-r 
                                    ${item.diaDoMes?.includes('Dom') || item.diaDoMes?.includes('Sáb')
                                        ? 'bg-gray-100 text-gray-500'
                                        : 'text-gray-700'}
                                    `}>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === 'Presente'
                                        ? 'bg-green-100 text-green-800'
                                        : item.status === 'Parcial'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            // : item.status === 'Ausente' ? "bg-red-100 text-red-800" : "bg-blue-700 text-white"
                                            : item.status === 'Sem Registro' ? "bg-red-100 text-red-800" : "bg-blue-700 text-white"
                                        }
                                        
                                        
                                        
                                        `}>
                                        {item.status}
                                    </span>
                                </td>
                            </tr>
                        ))}

                        {/* Linha de Totais */}
                        {/* {pontoDia && (
                            <tr className="bg-gray-50 font-bold border-t-2 border-blue-500">
                                <td className="px-4 py-3 text-center text-sm text-gray-700">Totais</td>
                                <td className="px-4 py-3 text-center text-sm text-gray-300">—</td>
                                <td className="px-4 py-3 text-center text-sm text-gray-300">—</td>
                                <td className="px-4 py-3 text-center text-sm text-gray-300">—</td>
                                <td className="px-4 py-3 text-center text-sm text-gray-300">—</td>

                                <td className="px-4 py-3 text-center text-sm text-gray-700">
                                    {pontoDia.credito && pontoDia.credito !== "00h:00min" ? pontoDia.credito : '00h:00min'}
                                </td>

                                <td className={`px-4 py-3 text-center text-sm ${Number(timeToMinutes(pontoDia.debito ?? 0)) > 0 ? 'text-gray-700' : 'text-red-600'}`}>
                                    {pontoDia.debito ? pontoDia.debito : ''}
                                </td>

                                <td className="px-4 py-3 text-center text-sm text-gray-700">
                                    {pontoDia.horasNormais ? pontoDia.horasNormais : ''}
                                </td>

                                <td className="px-4 py-3 text-center text-sm text-gray-700">
                                    {pontoDia.horasAlmoco ? pontoDia.horasAlmoco : ''}
                                </td>

                                <td className="px-4 py-3 text-center text-sm text-gray-700">
                                    {pontoDia.horasTrabalhadas ? pontoDia.horasTrabalhadas : ''}
                                </td>

                                <td className="px-4 py-3 text-center text-sm text-gray-700">
                                    {formatarHora(String(pontoDia.bancoDeHoras !== "00h:00min")) ? formatarHora(String(pontoDia.bancoDeHoras ?? 0)) : '00min'}
                                </td>

                                <td className="px-4 py-3 text-center text-sm text-gray-700">
                                    {pontoDia.status || ''}
                                </td>
                            </tr>
                        )} */}
                    </tbody>
                </table>
            </div>

            {dados.length === 0 && (
                <div className="flex items-center justify-center h-64">
                    <p className="text-gray-500">Nenhum registro encontrado.</p>
                </div>
            )}


        </div>
    )
}
