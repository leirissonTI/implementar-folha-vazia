export function formatarHora(input: string | number | null): string {
  let totalMinutes = 0;

  // 1. Conversão para minutos
  if (input == null || input === '' || input === '—') {
    totalMinutes = 0;
  } else if (typeof input === 'number') {
    totalMinutes = input; // já está em minutos
  } else if (typeof input === 'string') {
    input = input.trim(); // Remove espaços
    
    // Caso '9.45' => 9h45min
    const decimalMatch = input.match(/^(\d+)\.(\d{1,2})$/);
    if (decimalMatch) {
      const hours = parseInt(decimalMatch[1], 10);
      const minutes = parseInt(decimalMatch[2].padEnd(2, '0'), 10);
      totalMinutes = hours * 60 + minutes;
    } else {
      // Caso '09:45' ou '9:45'
      const parts = input.split(':');
      if (parts.length >= 1) {
        const hours = parseInt(parts[0], 10) || 0;
        const minutes = parts[1] ? parseInt(parts[1], 10) : 0;
        totalMinutes = hours * 60 + minutes;
      }
    }
  }

  // 2. Formatação de saída
  const total = Math.round(totalMinutes);
  const sign = total < 0 ? '-' : '';
  const abs = Math.abs(total);
  const hours = Math.floor(abs / 60);
  const minutes = abs % 60;

  // Formato solicitado: 06h:20min
  return `${sign}${hours}h:${minutes.toString().padStart(2, '0')}min`;
}