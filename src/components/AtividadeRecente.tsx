import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import type { PontoFuncionario } from "../types/PontoFuncionario"
import { CalendarClockIcon } from "lucide-react"
import useAuth from "../hooks/useAuth"
import { getMesAnoAtual } from "../utils/getMesAno"




// Função auxiliar para formatar a data como "DiaSemana, DD/MM/YYYY"
function formatarData(data: Date): string {
  const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const diaSemana = diasSemana[data.getDay()];
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0'); // getMonth() é 0-indexado
  const ano = data.getFullYear();
  return `${diaSemana}, ${dia}/${mes}/${ano}`;
}

// Função auxiliar para obter as últimas N datas incluindo hoje
function getUltimosNDias(n: number): string[] {
  const datas = [];
  const hoje = new Date();
  // Importante: definir hora local para evitar problemas com fuso horário
  hoje.setHours(0, 0, 0, 0); 

  for (let i = 0; i < n; i++) {
    // Cria uma nova data para cada dia
    const data = new Date(hoje);
    data.setDate(hoje.getDate() - i); // Subtrai 'i' dias
    datas.push(formatarData(data));
  }
  return datas;
}

// Função auxiliar para extrair a data no formato DD/MM/YYYY de uma string "DiaSemana, DD/MM/YYYY"
function extrairDataFormatada(dataStr: string): string {
   // Exemplo: "Ter, 01/07/2025" -> "01/07/2025"
   const partes = dataStr.split(',');
   if (partes.length > 1) {
       return partes[1].trim(); 
   }
   return dataStr; // Retorna a original se não conseguir dividir
}





export function AtividadeRecente() {
       const { cpf } = useAuth();
    const mesAno = getMesAnoAtual()
    const [, setEspelho_dia] = useState<PontoFuncionario[]>([]);
    // Estado para armazenar as datas dos últimos 7 dias
    const [datasUltimos7Dias, setDatasUltimos7Dias] = useState<string[]>([]); 
    // Estado para armazenar os dados filtrados dos últimos 7 dias
    const [ultimos7Dias, setUltimos7Dias] = useState<PontoFuncionario[]>([]);



    useEffect(() => {
        // 1. Obter as datas dos últimos 7 dias (incluindo hoje) assim que o componente montar
        const datasParaExibir = getUltimosNDias(7);
        setDatasUltimos7Dias(datasParaExibir);
     

    }, []); // Executa apenas uma vez na montagem

    useEffect(() => {
        async function carregarPontosDoMes() {
            try {
                if (cpf && mesAno) {
                    const response = await fetch(`http://172.19.3.52:3333/api/v1/espelho/resgatar-espelho-diario-mes/${cpf}/${mesAno}`);

                    if (!response.ok) {
                        throw new Error('Erro ao buscar pontos.');
                    }
                    const data = await response.json();
                    // 2. Corrigir o tipo - assumindo que seja PontoFuncionario[]
                    const espelhoDiarioDoMes: PontoFuncionario[] = data.data; 

                    // 3. Filtrar os dados para incluir apenas os últimos 7 dias
                    const dadosFiltrados = espelhoDiarioDoMes.filter((item) => {
                         // Extrair a data no formato DD/MM/YYYY do item
                         const dataItemFormatada = extrairDataFormatada(item.diaDoMes);
                         // Verificar se essa data está na lista das últimas 7
                         return datasUltimos7Dias.some(dataUltima => 
                             extrairDataFormatada(dataUltima) === dataItemFormatada
                         );
                    });


                    // 4. Atualiza o estado com os dados filtrados
                    setEspelho_dia(espelhoDiarioDoMes); // Mantém todos os dados originais, se necessário
                    setUltimos7Dias(dadosFiltrados); // Armazena os dados filtrados

                }
            } catch (error) {
                console.error('Erro ao carregar pontos do mês:', error);
                setUltimos7Dias([]); // Em caso de erro, limpa os dados filtrados
            }
        }

        // Só carrega os dados se já tivermos as datas calculadas
        if (datasUltimos7Dias.length > 0) {
             carregarPontosDoMes();
        }
    }, [cpf, mesAno, datasUltimos7Dias]); // Dependência adicionada: datasUltimos7Dias


    if (!ultimos7Dias) {
        return (
            <>
                <div className="bg-white p-4 shadow-xs shadow-gray-600 rounded-sm">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold">Atividade Recente</h2>
                        <Link to="/espelho-ponto" className="text-xs bg-blue-800 text-white px-3 py-1 rounded">
                            Ver tudo
                        </Link>
                    </div>
                    <ul className="mt-4 space-y-3">
                        <li className="bg-blue-400/20 rounded-sm h-50 w-full m-auto flex items-center justify-center">
                            <span className="mr-2">
                                <CalendarClockIcon size={32} color="gray" />
                            </span>
                            <p className="text-gray-500">Sem marcações recentes</p>
                        </li>

                    </ul>
                </div>

            </>
        )
    }

    return (
        <>
            {/* <!-- Atividade Recente --> */}
            <div className="bg-white p-4 shadow-xs shadow-gray-600 rounded-sm">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold">Atividade Recente</h2>
                    <Link to="/espelho-ponto" className="text-xs bg-blue-800 text-white px-3 py-1 rounded">
                        Ver tudo
                    </Link>
                </div>
                <ul className="mt-4 space-y-3">

                    {
                        ultimos7Dias.map((dia, index) => (
                            (index <= 6 ? (
                                <li key={`id-${dia.id}`} className="flex items-center">
                                    <span className={`${dia.status === 'Presente' ? 'w-2 h-2 bg-green-500 rounded-full mr-2 ' : 'w-2 h-2 bg-red-500 rounded-full mr-2'}`}></span>
                                    <span className="text-sm">{dia.diaDoMes}</span>
                                    <span className="ml-auto font-medium">
                                        {dia.primeiraEntrada ? dia.primeiraEntrada : <span className="text-sm text-gray-400">ponto não registrado</span>} - {dia.primeiraSaida ? dia.primeiraSaida : <span className="text-sm text-gray-400">ponto não registrado</span>}
                                    </span>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs ml-2 font-medium ${dia.status === 'Presente' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>{dia.status}</span>
                                </li>
                            ) : '')
                        ))
                    }
                </ul >
            </div >
        </>
    )

}