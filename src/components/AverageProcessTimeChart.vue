<template>
  <v-card class="pa-4" elevation="2">
    <v-card-title class="text-h5">
      Promedio de Días de Tramitación por Año y Tipo de Proyecto
    </v-card-title>
    <v-card-text>
      <div v-if="isLoading" class="text-center py-5">
        <v-progress-circular color="primary" indeterminate />
        <p class="mt-2">Cargando datos del gráfico...</p>
      </div>
      <div v-else-if="error" class="text-center py-5">
        <v-icon color="error" size="48">fa-solid fa-circle-exclamation</v-icon>
        <p class="mt-2 text-error">Error al cargar el gráfico: {{ error }}</p>
      </div>
      <div v-else-if="chartData.years.length === 0" class="text-center py-5">
        <v-icon color="grey-lighten-1" size="48">fa-solid fa-clock</v-icon>
        <p class="mt-2 text-medium-emphasis">
          No hay proyectos finalizados con tiempo de tramitación para mostrar el gráfico.
        </p>
      </div>
      <div v-else>
        <v-chart autoresize class="chart" :option="chartOptions" />
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
  import type { DiffTimeData } from '@/types/chart'
  import type { Project } from '@/types/project'
  import { computed, onMounted, ref } from 'vue'

  const props = defineProps<{
    rawData: Project[]
    isLoading: boolean
  }>()

  const error = ref<string | null>(null)
  const chartData = ref<DiffTimeData>({ years: [], diaAvgDays: [], eiaAvgDays: [] })

  // --- Helper para calcular la diferencia de días ---
  const getDaysDiff = (date1Str: string, date2Str: string): number | null => {
    if (!date1Str || !date2Str) return null

    // Parsear 'DD-MM-YYYY' a Date
    const parseDateString = (dateString: string) => {
      const [day, month, year] = dateString.split('-').map(Number)
      return new Date(year, month - 1, day)
    }

    const date1 = parseDateString(date1Str)
    const date2 = parseDateString(date2Str)

    // Asegurarse de que ambas fechas sean válidas
    if (Number.isNaN(date1.getTime()) || Number.isNaN(date2.getTime())) {
      console.warn(`Fechas inválidas para cálculo de días: ${date1Str}, ${date2Str}`)
      return null
    }

    const diffTime = Math.abs(date2.getTime() - date1.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Procesar los datos de tiempo de tramitación
  const processTimeData = (projects: Project[]) => {
    const dataByYearAndType: { [year: number]: { DIA: { totalDays: number, count: number }, EIA: { totalDays: number, count: number } } } = {}

    for (const project of projects) {
      // Solo consideramos proyectos con estado "Aprobado" y fecha de resolución
      if (project.estado === 'Aprobado' && project.fecha_resolucion && project.fecha) {
        const days = getDaysDiff(project.fecha, project.fecha_resolucion)

        if (days === null) {
          // Saltar si no se pudo calcular la diferencia de días
          continue
        }

        // El año de la resolución es el relevante para este gráfico
        const [resDay, resMonth, resYear] = project.fecha_resolucion.split('-').map(Number)
        const resolutionYear = new Date(resYear, resMonth - 1, resDay).getFullYear()

        if (!dataByYearAndType[resolutionYear]) {
          dataByYearAndType[resolutionYear] = {
            DIA: { totalDays: 0, count: 0 },
            EIA: { totalDays: 0, count: 0 },
          }
        }

        if (project.tipo === 'DIA') {
          dataByYearAndType[resolutionYear].DIA.totalDays += days
          dataByYearAndType[resolutionYear].DIA.count++
        } else if (project.tipo === 'EIA') {
          dataByYearAndType[resolutionYear].EIA.totalDays += days
          dataByYearAndType[resolutionYear].EIA.count++
        }
      }
    }

    // Calcular promedios y preparar datos para ECharts
    const sortedYears = Object.keys(dataByYearAndType).map(Number).sort((a, b) => a - b)
    const yearsLabels = sortedYears.map(year => year.toString())
    const diaAvgDays: number[] = []
    const eiaAvgDays: number[] = []

    for (const year of sortedYears) {
      const diaData = dataByYearAndType[year].DIA
      const eiaData = dataByYearAndType[year].EIA

      diaAvgDays.push(diaData.count > 0 ? Math.round(diaData.totalDays / diaData.count) : 0)
      eiaAvgDays.push(eiaData.count > 0 ? Math.round(eiaData.totalDays / eiaData.count) : 0)
    }

    return {
      years: yearsLabels,
      diaAvgDays: diaAvgDays,
      eiaAvgDays: eiaAvgDays,
    }
  }

  // Cargamos data
  const getData = async () => {
    error.value = null
    try {
      chartData.value = processTimeData(props.rawData)
    } catch (error_: any) {
      error.value = error_.message || 'Error desconocido al cargar los datos de tiempo de tramitación.'
      console.error('Error al cargar datos para el gráfico de tiempo:', error_)
    }
  }

  onMounted(getData)

  // Opciones
  const chartOptions = computed(() => {
    if (chartData.value.years.length === 0) {
      return {}
    }

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: (params: any[]) => {
          // Año
          let tooltipContent = `<div style="font-weight: bold;">${params[0].name}</div>`
          for (const item of params) {
            tooltipContent += `${item.marker} ${item.seriesName}: <strong>${item.value} días</strong><br/>`
          }
          return tooltipContent
        },
      },
      legend: {
        data: ['Promedio Días DIA', 'Promedio Días EIA'],
        bottom: 0,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: chartData.value.years,
        axisLabel: {
          interval: 0,
          rotate: 30,
        },
      },
      yAxis: {
        type: 'value',
        name: 'Promedio de Días de Tramitación',
        axisLabel: {
          formatter: '{value} días',
        },
      },
      series: [
        {
          name: 'Promedio Días DIA',
          type: 'bar',
          data: chartData.value.diaAvgDays,
          emphasis: {
            focus: 'series',
          },
          itemStyle: {
            color: '#2196F3',
          },
        },
        {
          name: 'Promedio Días EIA',
          type: 'bar',
          data: chartData.value.eiaAvgDays,
          emphasis: {
            focus: 'series',
          },
          itemStyle: {
            color: '#FF9800',
          },
        },
      ],
    }
  })
</script>

<style scoped>
.chart {
  height: 400px;
  width: 100%;
}
</style>
