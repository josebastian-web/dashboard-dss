import type { Project } from '@/types/project'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useMainStore } from '@/stores/main'

export const useInvestmentStore = defineStore('investment', () => {
  const mainStore = useMainStore()
  const selectedRegion = ref<string>('Todas')

  // FUNCIONES DE AYUDA
  const parseInvestment = (investmentStr: string): number => {
    const cleanedStr = investmentStr.replace(/\./g, '').replace(/,/g, '.')
    return Number.parseFloat(cleanedStr)
  }

  // GETTERS
  const filteredProjects = computed<Project[]>(() => {
    if (selectedRegion.value === 'Todas') {
      return mainStore.allProjects
    }
    return mainStore.allProjects.filter(project => project.region === selectedRegion.value)
  })

  // Chart: total por año, segmentada por tipo de proyecto (DIA/EIA).
  const chartData = computed(() => {
    // Objeto para acumular la inversión por año y tipo de proyecto.
    const dataByYearAndType: { [year: number]: { DIA: number, EIA: number } } = {}

    for (const project of filteredProjects.value) {
      // Extrae el año de la fecha del proyecto.
      const projectYear = new Date(project.fecha.split('-').reverse().join('-')).getFullYear()
      // Parsea el valor de inversión del proyecto.
      const investmentValue = parseInvestment(project.inversion)

      // Si el valor de inversión no es un número válido, se ignora el proyecto.
      if (Number.isNaN(investmentValue)) {
        continue
      }

      if (!dataByYearAndType[projectYear]) {
        // Inicializa las inversiones para DIA y EIA para un nuevo año.
        dataByYearAndType[projectYear] = { DIA: 0, EIA: 0 }
      }

      // Acumula la inversión según el tipo de proyecto.
      if (project.tipo === 'DIA') {
        dataByYearAndType[projectYear].DIA += investmentValue
      } else if (project.tipo === 'EIA') {
        dataByYearAndType[projectYear].EIA += investmentValue
      }
    }

    // Extrae y ordena los años.
    const sortedYears = Object.keys(dataByYearAndType).map(Number).sort((a, b) => a - b)
    // Convierte los años a cadenas para usar como etiquetas del eje X.
    const yearsLabels = sortedYears.map(year => year.toString())
    // Mapea los años a sus respectivas inversiones DIA.
    const diaInvestments = sortedYears.map(year => dataByYearAndType[year].DIA)
    // Mapea los años a sus respectivas inversiones EIA.
    const eiaInvestments = sortedYears.map(year => dataByYearAndType[year].EIA)

    return { years: yearsLabels, diaInvestments, eiaInvestments }
  })

  /**
   * Calcula la suma total de inversión de todos los proyectos filtrados históricamente.
   */
  const totalHistoricalInvestment = computed(() => {
    return filteredProjects.value.reduce((sum, project) => {
      const investmentValue = parseInvestment(project.inversion)
      return sum + (Number.isNaN(investmentValue) ? 0 : investmentValue)
    }, 0)
  })

  /**
   * Calcula la inversión promedio por proyecto, basándose en los proyectos filtrados.
   * Devuelve 0 si no hay proyectos para evitar divisiones por cero.
   */
  const averageInvestmentPerProject = computed(() => {
    const totalProjects = filteredProjects.value.length
    if (totalProjects === 0) {
      return 0
    }
    return totalHistoricalInvestment.value / totalProjects
  })

  /**
   * Calcula la inversión total para todos los proyectos de tipo 'DIA' filtrados.
   */
  const totalDiaInvestment = computed(() => {
    return filteredProjects.value.reduce((sum, project) => {
      if (project.tipo === 'DIA') {
        const investmentValue = parseInvestment(project.inversion)
        return sum + (Number.isNaN(investmentValue) ? 0 : investmentValue)
      }
      return sum
    }, 0)
  })

  /**
   * Calcula la inversión total para todos los proyectos de tipo 'EIA' filtrados.
   */
  const totalEiaInvestment = computed(() => {
    return filteredProjects.value.reduce((sum, project) => {
      if (project.tipo === 'EIA') {
        const investmentValue = parseInvestment(project.inversion)
        return sum + (Number.isNaN(investmentValue) ? 0 : investmentValue)
      }
      return sum
    }, 0)
  })

  // Resumo la inversión DIA, EIA y total por cada año.
  const investmentTableData = computed(() => {
    type AnnualInvestment = {
      year: number
      dia_investment: number
      eia_investment: number
      total_investment: number
    }
    // Objeto para almacenar datos anuales.
    const annualData: { [year: number]: AnnualInvestment } = {}

    for (const project of filteredProjects.value) {
      const projectYear = new Date(project.fecha.split('-').reverse().join('-')).getFullYear()
      const investmentValue = parseInvestment(project.inversion)

      // Ignora proyectos con inversión inválida.
      if (Number.isNaN(investmentValue)) {
        continue
      }

      if (!annualData[projectYear]) {
        // Inicializa los contadores para un nuevo año.
        annualData[projectYear] = {
          year: projectYear,
          dia_investment: 0,
          eia_investment: 0,
          total_investment: 0,
        }
      }

      // Acumula la inversión por tipo y en el total anual.
      if (project.tipo === 'DIA') {
        annualData[projectYear].dia_investment += investmentValue
      } else if (project.tipo === 'EIA') {
        annualData[projectYear].eia_investment += investmentValue
      }
      annualData[projectYear].total_investment += investmentValue
    }

    // Convierte el objeto de datos anuales en un array, ordenado por año.
    return Object.values(annualData).sort((a, b) => a.year - b.year)
  })

  return {
    selectedRegion,
    chartData,
    // Resumen de la inversión histórica total.
    totalHistoricalInvestment,
    // Resumen de la inversión promedio por proyecto.
    averageInvestmentPerProject,
    // Resumen de la inversión total DIA.
    totalDiaInvestment,
    // Resumen de la inversión total EIA.
    totalEiaInvestment,
    // Datos para la tabla de detalle.
    investmentTableData,
  }
})
