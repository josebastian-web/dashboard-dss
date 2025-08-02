<template>
  <v-container class="pa-4" fluid>
    <h1 class="text-h4 mb-4 text-center text-md-start">
      Inversión por Año y Tipo de Proyecto
    </h1>

    <v-card class="pa-4 mb-6" elevation="1">
      <v-card-title class="text-h6">
        Seleccionar Región
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-select
              v-model="investmentStore.selectedRegion"
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
      v-else-if="investmentStore.chartData.years.length === 0"
      class="text-center py-5"
    >
      <v-icon color="grey-lighten-1" size="48">fa-solid fa-chart-simple</v-icon>
      <p class="mt-2 text-medium-emphasis">
        No hay datos de inversión disponibles para la región seleccionada.
      </p>
    </div>
    <div v-else>
      <v-row class="mb-6">
        <v-col cols="12" md="3" sm="6">
          <v-card
            class="d-flex pa-4 text-center flex-column justify-center align-center"
            elevation="1"
            min-height="170"
          >
            <v-icon color="indigo" size="30">fa-solid fa-sack-dollar</v-icon>
            <div class="text-subtitle-1 text-medium-emphasis">
              Inversión Histórica Total
            </div>
            <div class="text-h4 text-primary mt-2">
              {{ formatCurrency(investmentStore.totalHistoricalInvestment) }}
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-card
            class="d-flex pa-4 text-center flex-column justify-center align-center"
            elevation="1"
            min-height="170"
          >
            <v-icon color="teal" size="30">fa-solid fa-calculator</v-icon>
            <div class="text-subtitle-1 text-medium-emphasis">
              Inversión Promedio/Proyecto
            </div>
            <div class="text-h4 text-primary mt-2">
              {{ formatCurrency(investmentStore.averageInvestmentPerProject) }}
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-card
            class="d-flex pa-4 text-center flex-column justify-center align-center"
            elevation="1"
            min-height="170"
          >
            <v-icon color="orange" size="30">fa-solid fa-file-invoice-dollar</v-icon>
            <div class="text-subtitle-1 text-medium-emphasis">
              Inversión Total DIA
            </div>
            <div class="text-h4 text-primary mt-2">
              {{ formatCurrency(investmentStore.totalDiaInvestment) }}
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3" sm="6">
          <v-card
            class="d-flex pa-4 text-center flex-column justify-center align-center"
            elevation="1"
            min-height="170"
          >
            <v-icon color="cyan" size="30">fa-solid fa-file-invoice-dollar</v-icon>
            <div class="text-subtitle-1 text-medium-emphasis">
              Inversión Total EIA
            </div>
            <div class="text-h4 text-primary mt-2">
              {{ formatCurrency(investmentStore.totalEiaInvestment) }}
            </div>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mb-6">
        <v-col cols="12">
          <InvestmentBarChart :chart-data="investmentStore.chartData" />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-card class="pa-4" elevation="2">
            <v-card-title class="text-h5 text-center text-md-start">
              Detalle de Inversión por Año
            </v-card-title>
            <v-card-text>
              <v-data-table
                class="elevation-0"
                :headers="tableHeaders"
                hide-default-footer
                item-value="year"
                :items="investmentStore.investmentTableData"
              >
                <template #item.dia_investment="{ item }">
                  {{ formatCurrency(item.dia_investment) }}
                </template>
                <template #item.eia_investment="{ item }">
                  {{ formatCurrency(item.eia_investment) }}
                </template>
                <template #item.total_investment="{ item }">
                  {{ formatCurrency(item.total_investment) }}
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
  import { onMounted } from 'vue'
  import { formatCurrency } from '@/composables/useHelpers'
  import { useMainStore } from '@/stores/main'
  import { useInvestmentStore } from '@/stores/pages/investment'

  const mainStore = useMainStore()
  const investmentStore = useInvestmentStore()

  onMounted(() => {
    mainStore.fetchAllProjects()
  })

  const tableHeaders = [
    { title: 'Año', key: 'year', align: 'start' as const },
    { title: 'Inversión DIA', key: 'dia_investment', align: 'end' as const },
    { title: 'Inversión EIA', key: 'eia_investment', align: 'end' as const },
    { title: 'Inversión Total', key: 'total_investment', align: 'end' as const },
  ]
</script>

<style scoped></style>
