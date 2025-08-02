<template>
  <v-card class="pa-4" elevation="1">
    <v-card-title class="text-h5 text-center text-md-start">
      Promedio de Días de Tramitación por Año y Tipo
    </v-card-title>
    <v-card-text>
      <v-chart autoresize class="chart" :option="chartOptions" />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
  import type { DiffTimeData } from '@/types/chart'
  import { computed } from 'vue'

  const props = defineProps<{
    chartData: DiffTimeData
  }>()

  // Opciones
  const chartOptions = computed(() => {
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
            }: <strong>${item.value.toLocaleString()} días</strong><br/>`
          }
          return tooltipContent
        },
      },
      legend: {
        data: ['Promedio Días DIA', 'Promedio Días EIA'],
        bottom: 0,
        textStyle: {
          fontSize: 16,
          fontFamily: 'Inter',
        },
      },
      grid: { left: '3%', right: '4%', bottom: '20%', containLabel: true },
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
        name: 'Días de Tramitación',
        axisLabel: {
          formatter: '{value} días',
          fontSize: 14,
          fontFamily: 'Inter',
        },
      },
      series: [
        {
          name: 'Promedio Días DIA',
          type: 'bar',
          data: props.chartData.diaAvgDays,
          emphasis: { focus: 'series' },
          itemStyle: { color: '#E91E63' },
        },
        {
          name: 'Promedio Días EIA',
          type: 'bar',
          data: props.chartData.eiaAvgDays,
          emphasis: { focus: 'series' },
          itemStyle: { color: '#9C27B0' },
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
