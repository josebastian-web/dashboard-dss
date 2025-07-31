<template>
  <v-container class="fill-height" fluid>
    <v-row>
      <v-col cols="12" md="12">
        <h1 class="text-h4 mb-4">Proyectos admitidos vs aprobados</h1>
      </v-col>
      <v-col cols="12" md="4" sm="6">
        <v-card class="pa-4 text-center" elevation="2">
          <v-icon color="primary" size="64">fa-solid fa-file-lines</v-icon>
          <div class="text-h5 mt-2">Total Proyectos Ingresados(Histórico)</div>
          <div class="text-h4 font-weight-bold">$12,450</div>
        </v-card>
      </v-col>
      <v-col cols="12" md="4" sm="6">
        <v-card class="pa-4 text-center" elevation="2">
          <v-icon color="success" size="64">fa-solid fa-circle-check</v-icon>
          <div class="text-h5 mt-2">Total Proyectos Aprobados(Histórico)</div>
          <div class="text-h4 font-weight-bold">150</div>
        </v-card>
      </v-col>
      <v-col cols="12" md="4" sm="6">
        <v-card class="pa-4 text-center" elevation="2">
          <v-icon color="info" size="64">fa-solid fa-percent</v-icon>
          <div class="text-h5 mt-2">Tasa de Aprobación (Histórica)</div>
          <div class="text-h4 font-weight-bold">5</div>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12" md="12">
        <AdmitApprovBarChart :is-loading="isLoading" :raw-data="allProjects" />
      </v-col>
      <v-col cols="12">
        <v-card class="pa-4" elevation="2">
          <v-card-title class="text-h5">Últimos Pedidos</v-card-title>
          <v-card-text>
            <v-table>
              <thead>
                <tr>
                  <th>Año</th>
                  <th>Proyectos Ingresados</th>
                  <th>Proyectos Aprobados</th>
                  <th>Tasa de Aprobación (%)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>#P001</td>
                  <td>Alice Smith</td>
                  <td>$150.00</td>
                  <td><v-chip color="success" small>Completado</v-chip></td>
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
  import AdmitApprovBarChart from '@/components/AdmitApprovBarChart.vue'
  import { useProjectStore } from '@/stores/project'

  const projectStore = useProjectStore()
  const { allProjects, isLoading } = storeToRefs(projectStore)
  const { fetchAllProjects } = projectStore

  onMounted(() => {
    fetchAllProjects()
  })
</script>

<style lang="css" scoped>
.chart {
  height: 100vh;
}
</style>
