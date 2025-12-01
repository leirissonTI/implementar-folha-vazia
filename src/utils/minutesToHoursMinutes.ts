

// Adicione esta função junto com as outras funções (timeToMinutes, minutesToTime)


export function minutesToHoursMinutes(totalMinutes: number): string {
  // Arredonda para o minuto mais próximo
  const total = Math.round(totalMinutes);
  
  const sign = total < 0 ? '-' : '';
  const absoluteTotal = Math.abs(total);

  const hours = Math.floor(absoluteTotal / 60);
  const minutes = absoluteTotal % 60;

  // Formata sempre com 2 dígitos, usando padStart
  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');

  return `${sign}${formattedHours}h:${formattedMinutes}min`;
}

