



export function timeToMinutes(time: string | number | null | undefined): number {
    if (time == null || time === '' || time === '—') return 0;

    const timeConvertido = time.toString().trim();





    if (typeof time === 'number') {
        return time; // já está em minutos
    }

    // if (typeof timeConvertido === 'string') {
    //     //  Verifica se é decimal com ponto (ex: "9.45" → 9h45min)
    //     //  Verifica se é decimal com ponto (ex: "0.22000000000000003" → 0h22min)
    //     const decimalMatch = timeConvertido.match(/^(\d+)\.(\d{1,2})$/);
    //     if (decimalMatch) {
    //         const hours = parseInt(decimalMatch[1], 10);
    //         const minutes = parseInt(decimalMatch[2].padEnd(2, '0'), 10);
    //         return hours * 60 + minutes;
    //     }

    //     // Se não for decimal, tenta interpretar como HH:MM
    //     const parts = time.split(':');
    //     const hours = parseInt(parts[0], 10) || 0;
    //     const minutes = parts[1] ? parseInt(parts[1], 10) : 0;


    //     return hours * 60 + minutes;
    // }

    if (typeof timeConvertido === 'string' || typeof timeConvertido === 'number') {
        // Converte para número com 2 casas decimais
        const timeStr = Number(timeConvertido).toFixed(2); // ← corrige 0.22000000000000003 → "0.22"

        // Verifica se é decimal com ponto (ex: "9.45" → 9h45min)
        const decimalMatch = timeStr.match(/^(\d+)\.(\d{1,2})$/);
        if (decimalMatch) {
            const hours = parseInt(decimalMatch[1], 10);
            const minutes = parseInt(decimalMatch[2].padEnd(2, '0'), 10);
            return hours * 60 + minutes;
        }

        // Se não for decimal, tenta interpretar como HH:MM
        const parts = timeStr.split(':');
        const hours = parseInt(parts[0], 10) || 0;
        const minutes = parts[1] ? parseInt(parts[1], 10) : 0;

        return hours * 60 + minutes;
    }
    return 0;
}

