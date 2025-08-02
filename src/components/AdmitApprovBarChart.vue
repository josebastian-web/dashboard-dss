<template>
  <v-card class="pa-4" elevation="1">
    <v-card-title class="text-h5 text-center text-md-start">
      Proyectos Ingresados y Aprobados por Año
    </v-card-title>
    <v-card-text>
      <v-chart autoresize class="chart" :option="chartOptions" />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
  import type { AdmitApprovChartData } from '@/types/chart'
  import { computed } from 'vue'

  const props = defineProps<{
    chartData: AdmitApprovChartData
  }>()

  // Opciones
  const chartOptions = computed(() => {
    // Retorna objeto vacío si no hay datos
    if (props.chartData.years.length === 0) {
      return {}
    }
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: any[]) => {
          let tooltipContent = `<div style="font-weight: bold;">${params[0].name}</div>`
          for (const item of params) {
            tooltipContent += `${item.marker} ${
              item.seriesName
            }: <strong>${item.value.toLocaleString('es-CL')}</strong><br/>`
          }
          return tooltipContent
        },
      },
      legend: {
        data: ['Proyectos Ingresados', 'Proyectos Aprobados'],
        bottom: 0,
        textStyle: {
          fontSize: 16,
          fontFamily: 'Inter',
        },
      },
      grid: { left: '5%', right: '0%', bottom: '20%', containLabel: true },
      xAxis: {
        type: 'category',
        data: props.chartData.years,
        axisLabel: {
          interval: 0,
          rotate: 30,
          fontSize: 14,
          fontFamily: 'Inter',
        },
      },
      yAxis: {
        type: 'value',
        name: 'Proyectos',
        axisLabel: {
          formatter: '{value}',
          fontSize: 14,
          fontFamily: 'Inter',
        },
      },
      series: [
        {
          name: 'Proyectos Ingresados',
          type: 'bar',
          data: props.chartData.entered,
          emphasis: { focus: 'series' },
          itemStyle: { color: '#2196F3' },
        },
        {
          name: 'Proyectos Aprobados',
          type: 'bar',
          data: props.chartData.approved,
          emphasis: { focus: 'series' },
          itemStyle: { color: '#4CAF50' },
        },
      ],
      textStyle: {
        fontSize: 14,
        fontFamily: 'Inter',
      },
    }
  })

</script>

<style scoped>

</style>
