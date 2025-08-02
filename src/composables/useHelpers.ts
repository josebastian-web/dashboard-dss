// Función de ayuda para formatear moneda
export const formatCurrency = (value: number): string => {
  // Usar formato de Peso Chileno (CLP), ajustar según sea necesario
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    // Sin decimales para números enteros
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

// Parsear 'DD-MM-YYYY' a Date
const parseDateString = (ds: string) => {
  const [d, m, y] = ds.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export const parseInvestment = (investmentStr: string): number => {
  const cleanedStr = investmentStr.replace(/\./g, '').replace(/,/g, '.')
  return Number.parseFloat(cleanedStr)
}

/**
 * Calcula la diferencia en días entre dos fechas dadas como cadenas 'DD-MM-YYYY'.
 * @param {string} date1Str - La primera fecha en formato 'DD-MM-YYYY'.
 * @param {string} date2Str - La segunda fecha en formato 'DD-MM-YYYY'.
 * @returns {number | null} La diferencia en días (redondeada hacia arriba) o null si las fechas son inválidas.
 */
export const getDaysDiff = (date1Str: string, date2Str: string): number | null => {
  if (!date1Str || !date2Str) {
    return null
  }

  const date1 = parseDateString(date1Str)
  const date2 = parseDateString(date2Str)

  // Asegurarse de que ambas fechas sean válidas
  if (Number.isNaN(date1.getTime()) || Number.isNaN(date2.getTime())) {
    return null
  }
  const diffTime = Math.abs(date2.getTime() - date1.getTime())
  // Convierte milisegundos a días (redondeando hacia arriba).
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}
