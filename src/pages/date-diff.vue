<template>
  <v-container class="fill-height" fluid>
    <v-row>
      <v-col cols="12" md="12">
        <h1 class="text-h4 mb-4">Diferencia de tiempo entre fecha y fecha resolucion por año y tipo</h1>
      </v-col>
      <v-col cols="12" md="6" sm="6">
        <v-card class="pa-4 text-center" elevation="2">
          <v-icon color="primary" size="64">fa-solid fa-file-lines</v-icon>
          <div class="text-h5 mt-2">Días Promedio de Tramitación (General)</div>
          <div class="text-h4 font-weight-bold">$12,450</div>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" sm="6">
        <v-card class="pa-4 text-center" elevation="2">
          <v-icon color="success" size="64">fa-solid fa-circle-check</v-icon>
          <div class="text-h5 mt-2">Proyecto con Tramitación Más Larga / Corta</div>
          <div class="text-h4 font-weight-bold">150</div>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12" md="12">
        <AverageProcessTimeChart :is-loading="isLoading" :raw-data="allProjects" />
      </v-col>
      <v-col cols="12">
        <v-card class="pa-4" elevation="2">
          <v-card-title class="text-h5">Últimos Pedidos</v-card-title>
          <v-card-text>
            <v-table>
              <thead>
                <tr>
                  <th>ID Proyecto</th>
                  <th>Año</th>
                  <th>Tipo</th>
                  <th>Fecha Ingreso</th>
                  <th>Fecha Resolución</th>
                  <th>Días de Tramitación</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>#P001</td>
                  <td>#P001</td>
                  <td>#P001</td>
                  <td>#P001</td>
                  <td>#P001</td>
                  <td>#P001</td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia'
  import { onMounted } from 'vue'
  import AverageProcessTimeChart from '@/components/AverageProcessTimeChart.vue'
  import { useProjectStore } from '@/stores/project'

  const projectStore = useProjectStore()
  const { allProjects, isLoading } = storeToRefs(projectStore)
  const { fetchAllProjects } = projectStore

  onMounted(() => {
    fetchAllProjects()
  })
</script>
