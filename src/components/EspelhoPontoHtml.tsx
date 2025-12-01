import { useRef } from 'react';
import generatePDF, { Resolution, Margin } from 'react-to-pdf'


// Seus imports existentes
import { imagemBase64PretoEBranco } from '../assets/imagemBase64PretoBranco';
import type { RegistroPonto } from '../types/RegistroPonto';
import { FileText } from 'lucide-react';
import { timeToMinutes } from '../utils/timeToMinutes';
import { formatarHora } from '../utils/formatarHora';



interface UserData {
    cargo: string | null;
    cpf: string | null;
    matricula: string | null;
    nome: string | null;
    setor: string | null;
    setorSigla: string | null;
}

interface EspelhoPontoHtmlProps {
    data: RegistroPonto[];
    total?: RegistroPonto;
    dataUser: UserData;
    origem: string[];
    competencia: string;
}

function formatDate() {
    return new Date().toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
}

function formatDateMesLong() {
    const date = new Date().toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long'
    });
    return date.charAt(0).toUpperCase() + date.slice(1); // Capitaliza a primeira letra
}

// Opções com base no exemplo da documentação
const options = {
    method: 'save' as const, // ou 'open' as const para visualizar no navegador
    resolution: Resolution.HIGH,
    page: {
        format: 'A4',
        orientation: 'portrait' as const,
        margin: Margin.SMALL,

    },
    canvas: {
        mimeType: 'image/jpeg' as const,
        qualityRatio: 0.95,
    },
    overrides: {
        pdf: {
            compress: true,
            filename: `${new Date().toISOString().split('T')[0]}.pdf`

        },
        canvas: {
            useCORS: true,
        },
    },


};

export function EspelhoPontoHtml(props: EspelhoPontoHtmlProps) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, dataUser, origem } = props // retirando =>  totais
    const targetRef = useRef<HTMLDivElement>(null);

    const handleGeneratePDF = () => {
        if (!dataUser.nome || !data.length) {
            alert('Dados incompletos. Aguarde o carregamento completo.');
            return;
        }

        generatePDF(targetRef, options);
    };


    // Função auxiliar para formatar valores de hora
    // const formatTimeValue = (value: string | number | undefined | null): string => {
    //     if (value === null || value === undefined || value === '') {
    //         return '';
    //     }
    //     // Se for string e já estiver no formato "HHh:MMmin", retorna diretamente
    //     if (typeof value === 'string' && value.includes('h:') && value.includes('min')) {
    //         return value === "00h:00min" ? "" : value;
    //     }
    //     // Caso contrário, converte para minutos e depois formata
    //     try {
    //         const minutes = timeToMinutes(value);
    //         const formatted = formatarHora(minutes);
    //         return formatted === "00h:00min" ? "" : formatted;
    //     } catch (e) {
    //         console.warn("Erro ao formatar valor:", value, e);
    //         return '';
    //     }
    // }

    function verificaJusticaFederal(origem: string[]): string {
        const contagem: Record<string, number> = {}

        // Conta apenas os valores não vazios
        for (const num of origem) {
            if (num !== "") {
                contagem[num] = (contagem[num] || 0) + 1;
            }
        }

        // Se não houver nenhum valor válido
        if (Object.keys(contagem).length === 0) {
            return "Nenhum dado válido encontrado";
        }

        // Encontra o número mais repetido
        let maisRepetido = '';
        let maxRepeticoes = 0;

        for (const num in contagem) {
            if (contagem[num] > maxRepeticoes) {
                maxRepeticoes = contagem[num];
                maisRepetido = num;
            }
        }

        // Retorna o texto com base no número mais frequente
        return maisRepetido === "00004004330212941"
            ? "Justiça Federal - Subseção Judiciária de Tabatinga"
            : "Justiça Federal - Seção Judiciária do Amazonas";
    }

    const secao = verificaJusticaFederal(origem)

    // Função auxiliar específica para Banco de Horas (se usar minutesToHoursMinutes)
    // const formatBancoDeHoras = (value: string | number | undefined | null): string => {
    //     if (value === null || value === undefined || value === '') {
    //         return '';
    //     }
    //     try {
    //         const minutes = timeToMinutes(value);
    //         const formatted = minutesToHoursMinutes(minutes); // Ou use formatarHora se for consistente
    //         return formatted === "00h:00min" ? "" : formatted;
    //     } catch (e) {
    //         console.warn("Erro ao formatar banco de horas:", value, e);
    //         return '';
    //     }
    // };


    return (
        <div>
            <button style={{
                textDecoration: 'none',
                padding: '10px 20px',
                backgroundColor: '#1976d2',
                cursor: 'pointer',
                color: '#fff',
                borderRadius: '5px',
                fontSize: '16px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 'bold',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                transition: 'background-color 0.3s ease',
            }} onClick={handleGeneratePDF}>Gerar PDF <FileText size={24} color="white" /></button>

            {/* Conteúdo oculto, mas usado para gerar o PDF */}
            <div
                ref={targetRef}
                style={{
                    padding: '30px',
                    width: "1000px",
                    fontSize: '10px',
                    fontFamily: 'sans-serif',
                    boxSizing: 'border-box',
                    position: 'absolute',
                    left: '-9999px',
                    top: '0',
                }}
            >
                {/* Cabeçalho */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexWrap: 'nowrap',
                    marginBottom: 20,
                    paddingBottom: 10,
                    borderBottomWidth: 2,
                    borderBottomColor: '#000',
                }}>
                    <img
                        src={imagemBase64PretoEBranco}
                        alt="Logo"
                        style={{ width: '180px', height: '50px', minWidth: '180px' }}
                    />

                    <div style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        flex: 1,
                        marginInline: '20px',
                        minWidth: '200px',
                    }}>
                        {secao}

                    </div>

                    <div style={{
                        alignItems: 'center',
                        minWidth: '120px',
                    }}>
                        <div style={{
                            fontSize: 10,
                            fontWeight: 'bold',
                        }}>
                            Relatório gerado em: {formatDate()}
                        </div>
                    </div>
                </div>


                {/* Dados do Usuário */}
                <div style={{
                    marginBottom: 20,
                    paddingBottom: 10,
                    borderBottom: '1px solid #000',
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: 10,
                    fontSize: 14,
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5,
                        minWidth: '40%',
                    }}>
                        <div style={{
                            fontWeight: 'bold',
                            width: 80,
                            flexShrink: 0,
                        }}>NOME:</div>
                        <div>{dataUser.nome ?? '-'}</div>
                    </div>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5,
                        minWidth: '40%',
                    }}>
                        <div style={{
                            fontWeight: 'bold',
                            width: 80,
                            flexShrink: 0,
                        }}>CPF:</div>
                        <div>{dataUser.cpf ?? '-'}</div>
                    </div>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5,
                        minWidth: '40%',
                    }}>
                        <div style={{
                            fontWeight: 'bold',
                            marginRight: 10,
                            width: 80,
                            flexShrink: 0,
                        }}>MATRÍCULA:</div>
                        <div>{dataUser.matricula ?? '-'}</div>
                    </div>


                    {/**COMPETENCIA DO ARQUIVO */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5,
                        minWidth: '40%',
                    }}>
                        <div style={{
                            fontWeight: 'bold',
                            marginRight: 10,
                            width: 100,
                            flexShrink: 0,
                        }}>COMPETÊNCIA:</div>
                        <div>{`                      ${props.competencia}`}</div>
                    </div>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5,
                        minWidth: '40%',
                    }}>
                        <div style={{
                            fontWeight: 'bold',
                            width: 80,
                            flexShrink: 0,
                        }}>CARGO:</div>
                        <div>{dataUser.cargo ?? '-'}</div>
                    </div>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5,
                        minWidth: '40%',
                    }}>
                        <div style={{
                            fontWeight: 'bold',
                            width: 80,
                            flexShrink: 0,
                        }}>SETOR:</div>
                        <div>{dataUser.setor ? `${dataUser.setor} - (${dataUser.setorSigla})` : '-'}</div>
                    </div>
                </div>

                {/* Legenda */}
                <div style={{
                    fontSize: 12,
                    color: '#474747',
                    marginTop: 2,
                }}>
                    Sistema PONTOJUS - Relatório Mensal de Frequência
                </div>

                {/* Tabela */}
                <div style={{
                    // borderWidth: 1,
                    // borderColor: '#000',
                    // borderStyle: 'solid',
                    marginTop: 10,
                    marginLeft: 'auto',
                    marginRight: 'auto',

                }}>
                    {/* Cabeçalho da tabela */}
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <div style={{
                            backgroundColor: '#f0f0f0',
                            borderRightWidth: 1,
                            borderRightColor: '#000',
                            borderLeftWidth: 1,
                            borderLeftColor: '#000',
                            borderTopWidth: 1,
                            borderTopColor: '#000',
                            borderBottomWidth: 1,
                            borderBottomColor: '#000',
                            padding: 2,
                            paddingBottom: 8,
                            textAlign: 'center',
                            fontSize: 9,
                            fontWeight: 'bold',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: 18,
                            width: ' 10%'
                        }}>DIA</div>
                        <div style={{
                            backgroundColor: '#f0f0f0',
                            borderRightWidth: 1,
                            borderRightColor: '#000',
                            borderTopWidth: 1,
                            borderTopColor: '#000',
                            borderBottomWidth: 1,
                            borderBottomColor: '#000',
                            padding: 2,
                            paddingBottom: 8,
                            textAlign: 'center',
                            fontSize: 9,
                            fontWeight: 'bold',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: 18,
                            width: ' 10%'
                        }}>1ª ENTRADA</div>
                        <div style={{
                            backgroundColor: '#f0f0f0',
                            borderRightWidth: 1,
                            borderRightColor: '#000',
                            borderTopWidth: 1,
                            borderTopColor: '#000',
                            borderBottomWidth: 1,
                            borderBottomColor: '#000',
                            padding: 2,
                            paddingBottom: 8,
                            textAlign: 'center',
                            fontSize: 9,
                            fontWeight: 'bold',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: 18,
                            width: ' 10%'
                        }}>1ª SAÍDA</div>
                        <div style={{
                            backgroundColor: '#f0f0f0',
                            borderRightWidth: 1,
                            borderRightColor: '#000',
                            borderTopWidth: 1,
                            borderTopColor: '#000',
                            borderBottomWidth: 1,
                            borderBottomColor: '#000',
                            padding: 2,
                            paddingBottom: 8,
                            textAlign: 'center',
                            fontSize: 9,
                            fontWeight: 'bold',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: 18,
                            width: ' 10%'
                        }}>2ª ENTRADA</div>
                        <div style={{
                            backgroundColor: '#f0f0f0',
                            borderRightWidth: 1,
                            borderRightColor: '#000',
                            borderTopWidth: 1,
                            borderTopColor: '#000',
                            borderBottomWidth: 1,
                            borderBottomColor: '#000',
                            padding: 2,
                            paddingBottom: 8,
                            textAlign: 'center',
                            fontSize: 9,
                            fontWeight: 'bold',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: 18,
                            width: ' 10%'
                        }}>2ª SAÍDA</div>
                        {/* <div style={{
                            backgroundColor: '#f0f0f0',
                            borderRightWidth: 1,
                            borderRightColor: '#000',
                            borderBottomWidth: 1,
                            borderBottomColor: '#000',
                            padding: 2,
                            paddingBottom: 8,
                            textAlign: 'center',
                            fontSize: 9,
                            fontWeight: 'bold',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: 18,
                            width: ' 10%'
                        }}>CRÉDITO</div> */}
                        {/* <div style={{
                            backgroundColor: '#f0f0f0',
                            borderRightWidth: 1,
                            borderRightColor: '#000',
                            borderBottomWidth: 1,
                            borderBottomColor: '#000',
                            padding: 2,
                            paddingBottom: 8,
                            textAlign: 'center',
                            fontSize: 9,
                            fontWeight: 'bold',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: 18,
                            width: ' 10%'
                        }}>DÉBITO</div> */}
                        <div style={{
                            backgroundColor: '#f0f0f0',
                            borderRightWidth: 1,
                            borderRightColor: '#000',
                            borderTopWidth: 1,
                            borderTopColor: '#000',
                            borderBottomWidth: 1,
                            borderBottomColor: '#000',
                            padding: 2,
                            paddingBottom: 8,
                            textAlign: 'center',
                            fontSize: 9,
                            fontWeight: 'bold',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: 18,
                            width: ' 10%'
                        }}>HORAS NORMAIS</div>
                        <div style={{
                            backgroundColor: '#f0f0f0',
                            borderRightWidth: 1,
                            borderRightColor: '#000',
                            borderTopWidth: 1,
                            borderTopColor: '#000',
                            borderBottomWidth: 1,
                            borderBottomColor: '#000',
                            padding: 2,
                            paddingBottom: 8,
                            textAlign: 'center',
                            fontSize: 9,
                            fontWeight: 'bold',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: 18,
                            width: ' 10%'
                        }}>HORAS ALMOÇO</div>
                        <div style={{
                            backgroundColor: '#f0f0f0',
                            borderRightWidth: 1,
                            borderRightColor: '#000',
                            borderTopWidth: 1,
                            borderTopColor: '#000',
                            borderBottomWidth: 1,
                            borderBottomColor: '#000',
                            padding: 2,
                            paddingLeft: 6,
                            paddingRight: 6,
                            paddingBottom: 8,
                            textAlign: 'center',
                            fontSize: 9,
                            textWrap: "nowrap",
                            fontWeight: 'bold',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: 18,
                            width: ' 14%'
                        }}>HORAS TRABALHADAS</div>
                        {/* <div style={{
                            backgroundColor: '#f0f0f0',
                            borderRightWidth: 1,
                            borderRightColor: '#000',
                            borderBottomWidth: 1,
                            borderBottomColor: '#000',
                            padding: 2,
                            paddingBottom: 8,
                            textAlign: 'center',
                            fontSize: 9,
                            fontWeight: 'bold',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: 18,
                            width: ' 10%'
                        }}>BANCO HORAS</div> */}
                        <div style={{
                            backgroundColor: '#f0f0f0',
                            borderRightWidth: 1,
                            borderRightColor: '#000',
                            borderTopWidth: 1,
                            borderTopColor: '#000',
                            borderBottomWidth: 1,
                            borderBottomColor: '#000',
                            padding: 2,
                            paddingBottom: 8,
                            textAlign: 'center',
                            fontSize: 9,
                            fontWeight: 'bold',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: 18,
                            width: ' 10%'
                        }}>STATUS</div>
                    </div>

                    {/* Dados da tabela */}
                    {data.map((item, index) => (
                        <div key={index} style={{ display: 'flex', width: '100%' }}>
                            <div style={{
                                width: ' 10%',
                                borderRightWidth: 1,
                                borderRightColor: '#000',
                                borderBottomWidth: 1,
                                borderBottomColor: '#000',
                                borderLeftWidth: 1,
                                borderLeftColor: '#000',
                                padding: 2,
                                paddingBottom: 8,
                                textAlign: 'center',
                                fontSize: 9,
                                minHeight: 18,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: `${item.diaDoMes?.includes('Dom') || item.diaDoMes?.includes('Sáb') ? '#f0f0f0' : ''}`

                            }}>
                                {item.diaDoMes}
                            </div>
                            <div style={{
                                width: ' 10%',
                                borderRightWidth: 1,
                                borderRightColor: '#000',
                                borderBottomWidth: 1,
                                borderBottomColor: '#000',
                                padding: 2,
                                paddingBottom: 8,
                                textAlign: 'center',
                                fontSize: 9,
                                minHeight: 18,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: `${item.diaDoMes?.includes('Dom') || item.diaDoMes?.includes('Sáb') ? '#f0f0f0' : ''}`
                            }}>
                                {item.primeiraEntrada || ''}
                            </div>
                            <div style={{
                                width: ' 10%',
                                borderRightWidth: 1,
                                borderRightColor: '#000',
                                borderBottomWidth: 1,
                                borderBottomColor: '#000',
                                padding: 2,
                                paddingBottom: 8,
                                textAlign: 'center',
                                fontSize: 9,
                                minHeight: 18,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: `${item.diaDoMes?.includes('Dom') || item.diaDoMes?.includes('Sáb') ? '#f0f0f0' : ''}`
                            }}>
                                {item.primeiraSaida || '-'}
                            </div>
                            <div style={{
                                width: ' 10%',
                                borderRightWidth: 1,
                                borderRightColor: '#000',
                                borderBottomWidth: 1,
                                borderBottomColor: '#000',
                                padding: 2,
                                paddingBottom: 8,
                                textAlign: 'center',
                                fontSize: 9,
                                minHeight: 18,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: `${item.diaDoMes?.includes('Dom') || item.diaDoMes?.includes('Sáb') ? '#f0f0f0' : ''}`
                            }}>
                                {item.segundaEntrada || '-'}
                            </div>
                            <div style={{
                                width: ' 10%',
                                borderRightWidth: 1,
                                borderRightColor: '#000',
                                borderBottomWidth: 1,
                                borderBottomColor: '#000',
                                padding: 2,
                                paddingBottom: 8,
                                textAlign: 'center',
                                fontSize: 9,
                                minHeight: 18,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: `${item.diaDoMes?.includes('Dom') || item.diaDoMes?.includes('Sáb') ? '#f0f0f0' : ''}`
                            }}>
                                {item.segundaSaida || '-'}
                            </div>
                            {/* <div style={{
                                width: ' 10%',
                                borderRightWidth: 1,
                                borderRightColor: '#000',
                                borderBottomWidth: 1,
                                borderBottomColor: '#000',
                                padding: 2,
                                paddingBottom: 8,
                                textAlign: 'center',
                                fontSize: 9,
                                minHeight: 18,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>

                                {
                                    formatarHora(String(timeToMinutes(item.credito))) === "00h:00min" ? ""
                                        : formatarHora(String(timeToMinutes(item.credito)))
                                }
                            </div> */}
                            {/* <div style={{
                                width: ' 10%',
                                borderRightWidth: 1,
                                borderRightColor: '#000',
                                borderBottomWidth: 1,
                                borderBottomColor: '#000',
                                padding: 2,
                                paddingBottom: 8,
                                textAlign: 'center',
                                fontSize: 9,
                                minHeight: 18,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>

                                {
                                    formatarHora(String(timeToMinutes(item.debito))) !== "00h:00min" ?
                                        formatarHora(String(timeToMinutes(item.debito))) : ""
                                }
                            </div> */}
                            <div style={{
                                width: ' 10%',
                                borderRightWidth: 1,
                                borderRightColor: '#000',
                                borderBottomWidth: 1,
                                borderBottomColor: '#000',
                                padding: 2,
                                paddingBottom: 8,
                                textAlign: 'center',
                                fontSize: 9,
                                minHeight: 18,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: `${item.diaDoMes?.includes('Dom') || item.diaDoMes?.includes('Sáb') ? '#f0f0f0' : ''}`
                            }}>
                                {
                                    formatarHora(String(timeToMinutes(String(item.horasNormais)))) !== "00h:00min" ?
                                        formatarHora((timeToMinutes(String(item.horasNormais)))) : ""
                                }
                            </div>
                            <div style={{
                                width: ' 10%',
                                borderRightWidth: 1,
                                borderRightColor: '#000',
                                borderBottomWidth: 1,
                                borderBottomColor: '#000',
                                padding: 2,
                                paddingBottom: 8,
                                textAlign: 'center',
                                fontSize: 9,
                                minHeight: 18,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: `${item.diaDoMes?.includes('Dom') || item.diaDoMes?.includes('Sáb') ? '#f0f0f0' : ''}`
                            }}>

                                {
                                    formatarHora(String(timeToMinutes(item.horasAlmoco))) !== "00h:00min" ?
                                        formatarHora(String(timeToMinutes(item.horasAlmoco))) : ""
                                }
                            </div>
                            <div style={{
                                width: ' 14%',
                                borderRightWidth: 1,
                                borderRightColor: '#000',
                                borderBottomWidth: 1,
                                borderBottomColor: '#000',
                                padding: 2,
                                paddingBottom: 8,
                                textAlign: 'center',
                                fontSize: 9,
                                minHeight: 18,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: `${item.diaDoMes?.includes('Dom') || item.diaDoMes?.includes('Sáb') ? '#f0f0f0' : ''}`
                            }}>
                                {Number(item.horasTrabalhadas ?? 0) > 0 ? formatarHora(String(item.horasTrabalhadas)) : "00h:00min"}
                            </div>
                            {/* <div style={{
                                width: ' 10%',
                                borderRightWidth: 1,
                                borderRightColor: '#000',
                                borderBottomWidth: 1,
                                borderBottomColor: '#000',
                                padding: 2,
                                paddingBottom: 8,
                                textAlign: 'center',
                                fontSize: 9,
                                minHeight: 18,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                {
                                    Number(item.bancoDeHoras ?? 0) > 0 ? formatarHora(String(item.bancoDeHoras)) : "00h:00min"
                                }
                            </div> */}
                            <div style={{
                                width: ' 10%',
                                borderRightWidth: 1,
                                borderRightColor: '#000',
                                borderBottomWidth: 1,
                                borderBottomColor: '#000',
                                padding: 2,
                                paddingBottom: 8,
                                textAlign: 'center',
                                fontSize: 9,
                                minHeight: 18,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: `${item.diaDoMes?.includes('Dom') || item.diaDoMes?.includes('Sáb') ? '#f0f0f0' : ''}`,
                                // color: item.status === 'Ausente' ? 'red' : 'black',
                                color: item.status === 'Sem Registro' ? 'red' : 'black',
                            }}>{item.status}</div>
                        </div>
                    ))}
                    {/* Linha de Totais */}
                    {/* {total && (
                        <div style={{
                            display: 'flex',
                            width: '100%',
                            fontWeight: 'bold',
                            backgroundColor: '#f9f9f9',
                        }}>
                            <div style={tableCellStyle}>TOTAIS</div>
                            <div style={tableCellStyle}>-</div>
                            <div style={tableCellStyle}>-</div>
                            <div style={tableCellStyle}>-</div>
                            <div style={tableCellStyle}>-</div>

                            
                            <div style={tableCellStyle}>
                                {formatTimeValue(total.credito)}
                            </div>
                            <div style={tableCellStyle}>
                                {formatTimeValue(total.debito)}
                            </div>
                            <div style={tableCellStyle}>
                                {formatTimeValue(total.horasNormais)}
                            </div>
                            <div style={tableCellStyle}>
                                {formatTimeValue(total.horasAlmoco)} 
                            </div>
                            <div style={tableCellStyle}>
                                {formatTimeValue(total.horasTrabalhadas)}
                            </div>
                            <div style={tableCellStyle}>
                              
                                {formatBancoDeHoras(total.bancoDeHoras)}

                            </div>
                            <div style={tableCellStyle}>-</div>
                        </div>
                    )} */}
                </div>
            </div>
        </div>
    );
}

// Estilo reutilizável para células da tabela
// const tableCellStyle: React.CSSProperties = {
//     width: '8.333%', // 100% / 12 colunas
//     borderRight: '1px solid #000',
//     borderBottom: '1px solid #000',
//     padding: '2px 2px 8px 2px',
//     textAlign: 'center',
//     fontSize: 9,
//     minHeight: 18,
//     justifyContent: 'center',
//     alignItems: 'center',
//     boxSizing: 'border-box',
// };