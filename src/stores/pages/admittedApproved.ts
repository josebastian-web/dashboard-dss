import type { Project } from '@/types/project'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useMainStore } from '@/stores/main'

export const useAdmittedApprovedStore = defineStore('admittedApproved', () => {
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
   * Prepara los datos para el gráfico de barras que muestra la cantidad de proyectos
   * ingresados y aprobados por año, basándose en los proyectos filtrados.
   */
  const chartData = computed(() => {
    // Objeto para almacenar la cuenta de proyectos por año y estado (ingresados/aprobados).
    const dataByYear: { [year: number]: { entered: number, approved: number } } = {}

    for (const project of filteredProjects.value) {
      // Extrae el año de la fecha de ingreso del proyecto.
      const projectYear = new Date(project.fecha.split('-').reverse().join('-')).getFullYear()
      if (!dataByYear[projectYear]) {
        // Inicializa contadores para un nuevo año.
        dataByYear[projectYear] = { entered: 0, approved: 0 }
      }
      // Incrementa el contador de proyectos ingresados.
      dataByYear[projectYear].entered++
      if (project.estado === 'Aprobado') {
        // Incrementa el contador de proyectos aprobados si el estado es 'Aprobado'.
        dataByYear[projectYear].approved++
      }
    }

    // Extrae los años, los ordena y convierte a cadenas para las etiquetas del eje X.
    const years = Object.keys(dataByYear).map(Number).sort((a, b) => a - b).map(String)
    // Mapea los años a sus respectivos conteos de proyectos ingresados.
    const entered = years.map(year => dataByYear[Number.parseInt(year)].entered)
    // Mapea los años a sus respectivos conteos de proyectos aprobados.
    const approved = years.map(year => dataByYear[Number.parseInt(year)].approved)

    return { years, entered, approved }
  })

  /**
   * Calcula el número total de proyectos ingresados según el filtro de región actual.
   */
  const totalEnteredProjects = computed(() => filteredProjects.value.length)

  /**
   * Calcula el número total de proyectos aprobados según el filtro de región actual.
   */
  const totalApprovedProjects = computed(() =>
    filteredProjects.value.filter(p => p.estado === 'Aprobado').length,
  )

  /**
   * Calcula la tasa de aprobación (proyectos aprobados divididos por proyectos ingresados),
   * expresada como un porcentaje con dos decimales. Maneja la división por cero.
   */
  const approvalRate = computed(() => {
    const total = totalEnteredProjects.value
    const approved = totalApprovedProjects.value
    return total > 0 ? ((approved / total) * 100).toFixed(2) : '0.00'
  })

  /**
   * Prepara los datos para la tabla que muestra el resumen anual de proyectos
   * ingresados, aprobados y su tasa de aprobación.
   */
  const projectsTableData = computed(() => {
    // Objeto para almacenar datos anuales.
    const annualData: { [year: string]: { entered: number, approved: number, rate: string } } = {}

    for (const project of filteredProjects.value) {
      // Extrae el año de la fecha de ingreso.
      const projectYear = new Date(project.fecha.split('-').reverse().join('-')).getFullYear().toString()
      if (!annualData[projectYear]) {
        // Inicializa los contadores para el año si es la primera vez que se encuentra.
        annualData[projectYear] = { entered: 0, approved: 0, rate: '0.00' }
      }
      annualData[projectYear].entered++
      if (project.estado === 'Aprobado') {
        annualData[projectYear].approved++
      }
    }

    // Calcula la tasa de aprobación para cada año.
    for (const year in annualData) {
      const data = annualData[year]
      data.rate = data.entered > 0 ? ((data.approved / data.entered) * 100).toFixed(2) : '0.00'
    }

    // Convierte el objeto anual en un array de objetos, ordenado por año.
    return Object.keys(annualData)
      .sort()
      .map(year => ({
        year: Number.parseInt(year),
        entered: annualData[year].entered,
        approved: annualData[year].approved,
        approvalRate: Number.parseFloat(annualData[year].rate),
      }))
  })

  return {
    selectedRegion,
    chartData,
    // Resumen del total de proyectos ingresados.
    totalEnteredProjects,
    // Resumen del total de proyectos aprobados.
    totalApprovedProjects,
    // Resumen de la tasa de aprobación.
    approvalRate,
    // Datos para la tabla de detalle.
    projectsTableData,
  }
})
