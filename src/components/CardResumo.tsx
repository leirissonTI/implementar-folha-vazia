import React from "react"


type Props = {
    totalDeHorasTrabalhadas: string | number,
    legenda: string
    children: React.ReactNode
}

export default function CardResumo({ totalDeHorasTrabalhadas, legenda, children }: Props) {
    return (
        <>
            <div className="bg-white p-4 shadow shadow-gray-600 rounded-sm">
                <p className="text-sm text-gray-600">{legenda}</p>
                <div className="flex items-center justify-between mt-1">
                    <span className="text-2xl font-bold">{totalDeHorasTrabalhadas}</span>
                    {children}
                </div>
            </div>
        </>
    )
}