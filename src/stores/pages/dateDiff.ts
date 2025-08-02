import type { Project } from '@/types/project'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getDaysDiff } from '@/composables/useHelpers'
import { useMainStore } from '@/stores/main'

export const useDateDiffStore = defineStore('dateDiff', () => {
  const mainStore = useMainStore()
  const selectedRegion = ref<string>('Todas')

  // GETTERS
  const filteredProjects = computed<Project[]>(() => {
    if (selectedRegion.value === 'Todas') {
      return mainStore.allProjects
    }
    return mainStore.allProjects.filter(project => project.region === selectedRegion.value)
  })

  /**
   * Prepara los datos para un gráfico de barras mostrando el promedio de días de tramitación
   * por año de resolución y tipo de proyecto (DIA/EIA).
   */
  const chartData = computed(() => {
    const dataByYearAndType: {
      [year: number]: {
        DIA: { totalDays: number, count: number }
        EIA: { totalDays: number, count: number }
      }
    } = {}

    for (const project of filteredProjects.value) {
      // Solo considera proyectos Aprobados que tienen fecha de ingreso y de resolución.
      if (project.estado === 'Aprobado' && project.fecha_resolucion && project.fecha) {
        // Usa as string para afirmar que no son null después de la comprobación.
        const days = getDaysDiff(project.fecha as string, project.fecha_resolucion as string)
        // Si la diferencia de días es nula (fechas inválidas), salta el proyecto.
        if (days === null) {
          continue
        }

        // Usa el año de resolución del proyecto para agrupar los datos.
        const resolutionYear = new Date((project.fecha_resolucion as string).split('-').reverse().join('-')).getFullYear()

        if (!dataByYearAndType[resolutionYear]) {
          // Inicializa los contadores para un nuevo año si es la primera vez que se encuentra.
          dataByYearAndType[resolutionYear] = {
            DIA: { totalDays: 0, count: 0 },
            EIA: { totalDays: 0, count: 0 },
          }
        }

        // Acumula los días de tramitación y cuenta los proyectos según su tipo (DIA/EIA).
        if (project.tipo === 'DIA') {
          dataByYearAndType[resolutionYear].DIA.totalDays += days
          dataByYearAndType[resolutionYear].DIA.count++
        } else if (project.tipo === 'EIA') {
          dataByYearAndType[resolutionYear].EIA.totalDays += days
          dataByYearAndType[resolutionYear].EIA.count++
        }
      }
    }

    // Extrae y ordena los años de resolución.
    const sortedYears = Object.keys(dataByYearAndType).map(Number).sort((a, b) => a - b)
    // Convierte los años a cadenas para usar como etiquetas del eje X del gráfico.
    const yearsLabels = sortedYears.map(year => year.toString())
    const diaAvgDays: number[] = []
    const eiaAvgDays: number[] = []

    // Calcula el promedio de días para DIA y EIA para cada año.
    for (const year of sortedYears) {
      const diaData = dataByYearAndType[year].DIA
      const eiaData = dataByYearAndType[year].EIA
      // Calcula el promedio de días o 0 si no hay proyectos de ese tipo para el año.
      diaAvgDays.push(diaData.count > 0 ? Math.round(diaData.totalDays / diaData.count) : 0)
      eiaAvgDays.push(eiaData.count > 0 ? Math.round(eiaData.totalDays / eiaData.count) : 0)
    }

    return { years: yearsLabels, diaAvgDays, eiaAvgDays }
  })

  /**
   * Calcula el promedio general de días de tramitación para todos los proyectos aprobados filtrados.
   */
  const overallAverageProcessingTime = computed(() => {
    let totalDays = 0
    let projectCount = 0
    for (const project of filteredProjects.value) {
      if (project.estado === 'Aprobado' && project.fecha_resolucion && project.fecha) {
        // Usa as string para afirmar que no son null después de la comprobación.
        const days = getDaysDiff(project.fecha as string, project.fecha_resolucion as string)
        if (days !== null) {
          totalDays += days
          projectCount++
        }
      }
    }
    return projectCount > 0 ? Math.round(totalDays / projectCount) : 0
  })

  /**
   * Encuentra y devuelve la información del proyecto con el tiempo de tramitación más largo
   * entre los proyectos aprobados y filtrados.
   */
  const projectWithLongestProcessingTime = computed(() => {
    let longestDays = 0
    let longestProject: Project | null = null
    for (const project of filteredProjects.value) {
      if (project.estado === 'Aprobado' && project.fecha_resolucion && project.fecha) {
        // Usa as string para afirmar que no son null después de la comprobación.
        const days = getDaysDiff(project.fecha as string, project.fecha_resolucion as string)
        if (days !== null && days > longestDays) {
          longestDays = days
          longestProject = project
        }
      }
    }

    return longestProject ? { project: longestProject.nombre, id: longestProject.id, days: longestDays } : null
  })

  /**
   * Encuentra y devuelve la información del proyecto con el tiempo de tramitación más corto
   * entre los proyectos aprobados y filtrados.
   */
  const projectWithShortestProcessingTime = computed(() => {
    // Inicializa con un valor muy alto para asegurar que cualquier proyecto será más corto.
    let shortestDays = Infinity
    let shortestProject: Project | null = null
    for (const project of filteredProjects.value) {
      if (project.estado === 'Aprobado' && project.fecha_resolucion && project.fecha) {
        // Usa as string para afirmar que no son null después de la comprobación.
        const days = getDaysDiff(project.fecha as string, project.fecha_resolucion as string)
        if (days !== null && days < shortestDays) {
          shortestDays = days
          shortestProject = project
        }
      }
    }

    return shortestProject ? { project: shortestProject.nombre, id: shortestProject.id, days: shortestDays } : null
  })

  /**
   * Prepara los datos para la tabla de detalle de tiempos de tramitación,
   * incluyendo ID, nombre, año, tipo, fechas y días de tramitación para cada proyecto.
   */
  const processingTimeTableData = computed(() => {
    return filteredProjects.value
      // Filtra solo los proyectos Aprobados que tienen ambas fechas de ingreso y resolución.
      .filter(project => project.estado === 'Aprobado' && project.fecha_resolucion !== null && project.fecha !== null)
      .map(project => {
        // Usa as string para afirmar que no son null para la llamada a getDaysDiff.
        const days = getDaysDiff(project.fecha as string, project.fecha_resolucion as string)
        return {
          id: project.id,
          name: project.nombre,
          // Extrae el año de la fecha de ingreso.
          year: new Date((project.fecha as string).split('-').reverse().join('-')).getFullYear(),
          type: project.tipo,
          entry_date: project.fecha,
          resolution_date: project.fecha_resolucion,
          processing_days: days,
        }
      })
      // Ordena los datos de la tabla primero por año y luego por días de tramitación.
      .sort((a, b) => a.year - b.year || (a.processing_days || 0) - (b.processing_days || 0))
  })

  return {
    selectedRegion,
    chartData,
    // Promedio general de días de tramitación.
    overallAverageProcessingTime,
    // Información del proyecto con la tramitación más larga.
    projectWithLongestProcessingTime,
    // Información del proyecto con la tramitación más corta.
    projectWithShortestProcessingTime,
    // Datos para la tabla de detalle.
    processingTimeTableData,
  }
})
