<template>
  <v-card class="pa-4" elevation="2">
    <v-card-title class="text-h5">Proyectos Ingresados vs. Aprobados por Año</v-card-title>
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
        <v-icon color="grey-lighten-1" size="48">fa-solid fa-chart-simple</v-icon>
        <p class="mt-2 text-medium-emphasis">No hay datos disponibles para mostrar el gráfico.</p>
      </div>
      <div v-else>
        <v-chart autoresize class="chart" :option="chartOptions" />
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
  import type { AdmitApprovChartData } from '@/types/chart'
  import type { Project } from '@/types/project'
  import { computed, onMounted, ref } from 'vue'

  const props = defineProps<{
    rawData: Project[]
    isLoading: boolean
  }>()

  const error = ref<string | null>(null)
  const chartData = ref<AdmitApprovChartData>({ years: [], entered: [], approved: [] })

  // Procesamos la información
  const dataAdmittedApproved = (projects: Project[]) => {
    const dataByYear: { [year: number]: { entered: number, approved: number } } = {}

    for (const project of projects) {
      // formateamos a DD-MM-YYYY
      const [day, month, year] = project.fecha.split('-').map(Number)
      const projectDate = new Date(year, month - 1, day)

      const projectYear = projectDate.getFullYear()

      if (!dataByYear[projectYear]) {
        dataByYear[projectYear] = { entered: 0, approved: 0 }
      }

      dataByYear[projectYear].entered++

      if (project.estado === 'Aprobado') {
        dataByYear[projectYear].approved++
      }
    }

    // Ordenar los años y extraer los datos para el gráfico
    const sortedYears = Object.keys(dataByYear).map(Number).sort((a, b) => a - b)
    const yearsLabels = sortedYears.map(year => year.toString())
    const enteredCounts = sortedYears.map(year => dataByYear[year].entered)
    const approvedCounts = sortedYears.map(year => dataByYear[year].approved)

    return {
      years: yearsLabels,
      entered: enteredCounts,
      approved: approvedCounts,
    }
  }

  // Cargamos la data
  const getData = async () => {
    error.value = null
    try {
      chartData.value = dataAdmittedApproved(props.rawData)
    } catch (error_: any) {
      error.value = error_.message || 'Error desconocido al cargar los datos.'
      console.error('Error al cargar datos para el gráfico de proyectos:', error_)
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
            tooltipContent += `
              ${item.marker} ${item.seriesName}: <strong>${item.value.toLocaleString()}</strong><br/>`
          }
          return tooltipContent
        },
      },
      legend: {
        data: ['Proyectos Ingresados', 'Proyectos Aprobados'],
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
        name: 'Cantidad de Proyectos',
        axisLabel: {
          formatter: '{value}',
        },
      },
      series: [
        {
          name: 'Proyectos Ingresados',
          type: 'bar',
          data: chartData.value.entered,
          emphasis: {
            focus: 'series',
          },
          itemStyle: {
            color: '#2196F3',
          },
          barGap: '0%',
          barCategoryGap: '40%',
        },
        {
          name: 'Proyectos Aprobados',
          type: 'bar',
          data: chartData.value.approved,
          emphasis: {
            focus: 'series',
          },
          itemStyle: {
            color: '#4CAF50',
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
