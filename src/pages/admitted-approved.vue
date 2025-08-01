<template>
  <v-container class="pa-4" fluid>
    <h1 class="text-h4 mb-4 text-center text-md-start">Proyectos Ingresados vs. Aprobados por Año</h1>

    <v-card class="pa-4 mb-6" elevation="1">
      <v-card-title class="text-h6"> Seleccionar Región </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-select
              v-model="admittedApprovedStore.selectedRegion"
              density="compact"
              :disabled="mainStore.isLoading || mainStore.error !== null"
              hide-details
              :items="mainStore.availableRegions"
              label=""
              :loading="mainStore.isLoading"
              variant="outlined"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <div v-if="mainStore.isLoading" class="text-center py-5">
      <v-progress-circular color="primary" indeterminate />
      <p class="mt-2">Cargando datos de proyectos...</p>
    </div>
    <div v-else-if="mainStore.error" class="text-center py-5">
      <v-icon color="error" size="48">fa-solid fa-circle-exclamation</v-icon>
      <p class="mt-2 text-error">{{ mainStore.error }}</p>
    </div>
    <div
      v-else-if="admittedApprovedStore.chartData.years.length === 0"
      class="text-center py-5"
    >
      <v-icon color="grey-lighten-1" size="48">fa-solid fa-chart-simple</v-icon>
      <p class="mt-2 text-medium-emphasis">
        No hay datos de proyectos disponibles para la región seleccionada.
      </p>
    </div>
    <div v-else>
      <v-row class="mb-6">
        <v-col cols="12" md="4" sm="6">
          <v-card
            class="d-flex pa-4 text-center flex-column justify-center align-center"
            elevation="1"
            min-height="170"
          >
            <v-icon color="blue" size="30">fa-solid fa-folder-plus</v-icon>
            <div class="text-subtitle-1 text-medium-emphasis">
              Total Proyectos Ingresados
            </div>
            <div class="text-h4 text-primary mt-2">
              {{
                admittedApprovedStore.totalEnteredProjects.toLocaleString(
                  "es-CL"
                )
              }}
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="4" sm="6">
          <v-card
            class="d-flex pa-4 text-center flex-column justify-center align-center"
            elevation="1"
            min-height="170"
          >
            <v-icon color="green" size="30">fa-solid fa-circle-check</v-icon>
            <div class="text-subtitle-1 text-medium-emphasis">
              Total Proyectos Aprobados
            </div>
            <div class="text-h4 text-primary mt-2">
              {{
                admittedApprovedStore.totalApprovedProjects.toLocaleString(
                  "es-CL"
                )
              }}
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="4" sm="12">
          <v-card
            class="d-flex pa-4 text-center flex-column justify-center align-center"
            elevation="1"
            min-height="170"
          >
            <v-icon color="purple" size="30">fa-solid fa-chart-line</v-icon>
            <div class="text-subtitle-1 text-medium-emphasis">
              Tasa de Aprobación Global
            </div>
            <div class="text-h4 text-primary mt-2">
              {{ admittedApprovedStore.approvalRate }}%
            </div>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mb-6">
        <v-col cols="12">
          <v-card class="pa-4" elevation="1">
            <v-card-title class="text-h5 text-center text-md-start">
              Proyectos Ingresados y Aprobados por Año
            </v-card-title>
            <v-card-text>
              <v-chart autoresize class="chart" :option="chartOptions" />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-card class="pa-4" elevation="1">
            <v-card-title class="text-h5 text-center text-md-start">
              Detalle de Proyectos por Año
            </v-card-title>
            <v-card-text>
              <v-data-table
                class="elevation-0"
                :headers="tableHeaders"
                hide-default-footer
                item-value="year"
                :items="admittedApprovedStore.projectsTableData"
              >
                <template #item.entered="{ item }">
                  {{ item.entered.toLocaleString("es-CL") }}
                </template>
                <template #item.approved="{ item }">
                  {{ item.approved.toLocaleString("es-CL") }}
                </template>
                <template #item.approvalRate="{ item }">
                  {{ item.approvalRate.toFixed(2) }}%
                </template>
                <template #no-data>
                  No hay datos para mostrar en la tabla con los filtros
                  actuales.
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup lang="ts">
  import { computed, onMounted } from 'vue'
  import { useMainStore } from '@/stores/main'
  import { useAdmittedApprovedStore } from '@/stores/pages/admittedApproved'

  const mainStore = useMainStore()
  const admittedApprovedStore = useAdmittedApprovedStore()

  onMounted(() => {
    mainStore.fetchAllProjects()
  })

  const chartOptions = computed(() => {
    const chartData = admittedApprovedStore.chartData
    // Retorna objeto vacío si no hay datos
    if (chartData.years.length === 0) {
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
        data: chartData.years,
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
          data: chartData.entered,
          emphasis: { focus: 'series' },
          itemStyle: { color: '#2196F3' },
        },
        {
          name: 'Proyectos Aprobados',
          type: 'bar',
          data: chartData.approved,
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

  const tableHeaders = [
    { title: 'Año', key: 'year', align: 'start' as const },
    { title: 'Proyectos Ingresados', key: 'entered', align: 'end' as const },
    { title: 'Proyectos Aprobados', key: 'approved', align: 'end' as const },
    { title: 'Tasa de Aprobación', key: 'approvalRate', align: 'end' as const },
  ]
</script>

<style scoped></style>
