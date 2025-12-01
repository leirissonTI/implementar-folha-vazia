import React from 'react'

interface Props {
    diasUteis: number
    diasTrabalhados: number
    horasTrabalhadas: number
    cargaHorariaMes: number
}

// Componente reutilizável para barra de progresso
interface ProgressBarProps {
    label: string
    value: number
    total: number
    color?: 'green' | 'blue' | 'red' | 'yellow'
    suffix?: string
}

const ProgressBar: React.FC<ProgressBarProps> = ({
    label,
    value,
    total,
    color = 'blue',
    suffix = ''
}) => {
    const percentage = total > 0 ? parseFloat(((value * 100) / total).toFixed(2)) : 0

    return (
        <div className="mb-4">
            <p className="text-sm text-gray-600 mb-1">
                {label} - {value}
                {suffix} ({percentage}%)
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                    className={`h-2 bg-${color}-500`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    )
}

export default function ResumoDePresenca({
    diasUteis,
    diasTrabalhados,
    horasTrabalhadas,
    cargaHorariaMes
}: Props) {
    return (
        <div className="bg-white p-4 shadow-xs shadow-gray-600 rounded-sm">
            <h2 className="text-lg font-bold mb-2">Resumo de Presença</h2>
            <p className="text-sm text-gray-600 mb-4">Estatísticas do mês atual</p>

            <ProgressBar
                label="Horas Trabalhadas"
                value={horasTrabalhadas}
                total={cargaHorariaMes}
                color="green"
                suffix=""
            />

            <ProgressBar
                label="Taxa de Presença"
                value={diasTrabalhados}
                total={diasUteis}
                color="blue"
                suffix="%"
            />
        </div>
    )
}