<template>
  <v-card class="pa-4" elevation="2">
    <v-card-title class="text-h5">
      Inversión por Año y Tipo de Proyecto
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
        <v-icon color="grey-lighten-1" size="48">fa-solid fa-chart-column</v-icon>
        <p class="mt-2 text-medium-emphasis">
          No hay datos de inversión disponibles para mostrar el gráfico.
        </p>
      </div>
      <div v-else>
        <v-chart autoresize class="chart" :option="chartOptions" />
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
  import type { InvestmentData } from '@/types/chart'
  import type { Project } from '@/types/project'
  import { computed, onMounted, ref } from 'vue'

  const props = defineProps<{
    rawData: Project[]
    isLoading: boolean
  }>()

  const error = ref<string | null>(null)
  const chartData = ref<InvestmentData>({ years: [], diaInvestments: [], eiaInvestments: [] })

  // Procesar los datos
  const processInvestmentData = (projects: Project[]) => {
    const dataByYearAndType: { [year: number]: { DIA: number, EIA: number } } = {}

    for (const project of projects) {
      // Extraer el año de la fecha
      const [day, month, year] = project.fecha.split('-').map(Number)
      const projectYear = new Date(year, month - 1, day).getFullYear()

      // Parsear la inversión, reemplazando la coma por un punto para parseFloat
      const investmentValue = Number.parseFloat(project.inversion.replace(',', '.'))

      if (Number.isNaN(investmentValue)) {
        // Manejar casos donde la inversión no es un número válido
        console.warn(`Inversión inválida para el proyecto ID ${project.id}: "${project.inversion}"`)
        continue // Saltar este proyecto si la inversión no es válida
      }

      if (!dataByYearAndType[projectYear]) {
        dataByYearAndType[projectYear] = { DIA: 0, EIA: 0 }
      }

      if (project.tipo === 'DIA') {
        dataByYearAndType[projectYear].DIA += investmentValue
      } else if (project.tipo === 'EIA') {
        dataByYearAndType[projectYear].EIA += investmentValue
      }
    }

    // Ordenar los años y extraer los datos para el gráfico
    const sortedYears = Object.keys(dataByYearAndType).map(Number).sort((a, b) => a - b)
    const yearsLabels = sortedYears.map(year => year.toString())
    const diaInvestments = sortedYears.map(year => dataByYearAndType[year].DIA)
    const eiaInvestments = sortedYears.map(year => dataByYearAndType[year].EIA)

    return {
      years: yearsLabels,
      diaInvestments: diaInvestments,
      eiaInvestments: eiaInvestments,
    }
  }

  // Obtener data
  const getData = async () => {
    error.value = null
    try {
      chartData.value = processInvestmentData(props.rawData)
    } catch (error_: any) {
      error.value = error_.message || 'Error desconocido al cargar los datos de inversión.'
      console.error('Error al cargar datos para el gráfico de inversión:', error_)
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
        // Formato personalizado para el tooltip
        formatter: (params: any[]) => {
          // Año
          let tooltipContent = `<div style="font-weight: bold;">${params[0].name}</div>`
          let totalInvestmentForYear = 0

          for (const item of params) {
            totalInvestmentForYear += item.value
            tooltipContent += `${item.marker} ${item.seriesName}: <strong>$${item.value.toLocaleString('es-CL')}</strong><br/>`
          }
          tooltipContent += `Total: <strong>$${totalInvestmentForYear.toLocaleString('es-CL')}</strong>`
          return tooltipContent
        },
      },
      legend: {
        data: ['Inversión DIA', 'Inversión EIA'],
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
        name: 'Inversión Total ($)',
        axisLabel: {
          // Moneda Chile
          formatter: (value: number) => `$${value.toLocaleString('es-CL')}`,
        },
      },
      series: [
        {
          name: 'Inversión DIA',
          type: 'bar',
          stack: 'totalInvestment',
          data: chartData.value.diaInvestments,
          emphasis: {
            focus: 'series',
          },
          itemStyle: {
            color: '#2196F3',
          },
        },
        {
          name: 'Inversión EIA',
          type: 'bar',
          stack: 'totalInvestment',
          data: chartData.value.eiaInvestments,
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
