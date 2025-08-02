<template>
  <v-container class="pa-4" fluid>
    <h1 class="text-h4 mb-4 text-center text-md-start">
      Tiempo de Tramitación por Año y Tipo
    </h1>

    <v-card class="pa-4 mb-6" elevation="1">
      <v-card-title class="text-h6">
        Seleccionar Región
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-select
              v-model="dateDiffStore.selectedRegion"
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
      v-else-if="dateDiffStore.chartData.years.length === 0"
      class="text-center py-5"
    >
      <v-icon color="grey-lighten-1" size="48">fa-solid fa-chart-simple</v-icon>
      <p class="mt-2 text-medium-emphasis">
        No hay datos de tiempo de tramitación disponibles para la región
        seleccionada.
      </p>
    </div>
    <div v-else>
      <v-row class="mb-6">
        <v-col cols="12" md="4" sm="6">
          <v-card
            class="d-flex pa-4 text-center flex-column justify-center align-center"
            elevation="1"
            min-height="169"
          >
            <v-icon color="blue-grey" size="30">fa-solid fa-hourglass</v-icon>
            <div class="text-subtitle-1 text-medium-emphasis">
              Promedio General de Tramitación
            </div>
            <div class="text-h4 text-primary mt-2">
              {{ dateDiffStore.overallAverageProcessingTime }} días
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="4" sm="6">
          <v-card
            class="d-flex pa-4 text-center flex-column justify-center align-center"
            elevation="1"
            min-height="170"
          >
            <v-icon color="red" size="30">fa-solid fa-stopwatch</v-icon>
            <div class="text-subtitle-1 text-medium-emphasis">
              Tramitación Más Larga
            </div>
            <div
              v-if="dateDiffStore.projectWithLongestProcessingTime"
              class="text-h4 text-primary mt-2"
            >
              {{ dateDiffStore.projectWithLongestProcessingTime.days }}
              días
              <div class="text-subtitle-1 mt-1">
                ({{ dateDiffStore.projectWithLongestProcessingTime.project }})
              </div>
            </div>
            <div v-else class="text-h6 mt-2">N/A</div>
          </v-card>
        </v-col>
        <v-col cols="12" md="4" sm="12">
          <v-card
            class="d-flex pa-4 text-center flex-column justify-center align-center"
            elevation="1"
            min-height="170"
          >
            <v-icon color="green" size="30">fa-solid fa-bolt</v-icon>
            <div class="text-subtitle-1 text-medium-emphasis">
              Tramitación Más Corta
            </div>
            <div
              v-if="dateDiffStore.projectWithShortestProcessingTime"
              class="text-h4 text-primary mt-2"
            >
              {{ dateDiffStore.projectWithShortestProcessingTime.days }}
              días
              <div class="text-subtitle-1 mt-1">
                ({{ dateDiffStore.projectWithShortestProcessingTime.project }})
              </div>
            </div>
            <div v-else class="text-h6 mt-2">N/A</div>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mb-6">
        <v-col cols="12">
          <DateDiffChart :chart-data="dateDiffStore.chartData" />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-card class="pa-4" elevation="1">
            <v-card-title class="text-h5 text-center text-md-start">
              Detalles del Tiempo de Tramitación
            </v-card-title>
            <v-card-text>
              <v-data-table
                class="elevation-0"
                :headers="tableHeaders"
                hide-default-footer
                item-value="id"
                :items="dateDiffStore.processingTimeTableData"
              >
                <template #item.processing_days="{ item }">
                  {{ item.processing_days }} días
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
  import { useMainStore } from '@/stores/main'
  import { useDateDiffStore } from '@/stores/pages/dateDiff'

  const mainStore = useMainStore()
  const dateDiffStore = useDateDiffStore()

  onMounted(() => {
    mainStore.fetchAllProjects()
  })

  const tableHeaders = [
    { title: 'ID Proyecto', key: 'id', align: 'start' as const },
    { title: 'Nombre Proyecto', key: 'name', align: 'start' as const },
    { title: 'Año', key: 'year', align: 'start' as const },
    { title: 'Tipo', key: 'type', align: 'start' as const },
    { title: 'Fecha Ingreso', key: 'entry_date', align: 'start' as const },
    {
      title: 'Fecha Resolución',
      key: 'resolution_date',
      align: 'start' as const,
    },
    { title: 'Días Tramitación', key: 'processing_days', align: 'end' as const },
  ]
</script>

<style scoped></style>
