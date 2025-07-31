<template>
  <v-container class="fill-height" fluid>
    <h1 class="text-h4 mb-4">Resumen de Proyectos</h1>

    <v-row>
      <v-col cols="12" md="3" sm="6">
        <v-card class="pa-4 text-center" elevation="2">
          <v-icon color="primary" size="64">fa-solid fa-file-lines</v-icon>
          <div class="text-h5 mt-2">Proyectos Ingresados</div>
          <div class="text-h4 font-weight-bold">1.250</div>
        </v-card>
      </v-col>

      <v-col cols="12" md="3" sm="6">
        <v-card class="pa-4 text-center" elevation="2">
          <v-icon color="success" size="64">fa-solid fa-circle-check</v-icon>
          <div class="text-h5 mt-2">Proyectos Aprobados</div>
          <div class="text-h4 font-weight-bold">980</div>
        </v-card>
      </v-col>

      <v-col cols="12" md="3" sm="6">
        <v-card class="pa-4 text-center" elevation="2">
          <v-icon color="info" size="64">fa-solid fa-percent</v-icon>
          <div class="text-h5 mt-2">Tasa de Aprobación</div>
          <div class="text-h4 font-weight-bold">78.4%</div>
        </v-card>
      </v-col>

      <v-col cols="12" md="3" sm="6">
        <v-card class="pa-4 text-center" elevation="2">
          <v-icon color="secondary" size="64">fa-solid fa-dollar-sign</v-icon>
          <div class="text-h5 mt-2">Inversión Total</div>
          <div class="text-h4 font-weight-bold">$125M</div>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-6">
      <v-col cols="12" md="8">
        <v-card class="pa-4" elevation="2">
          <v-card-title class="text-h5">Gráfico de Proyectos por Año</v-card-title>
          <v-card-text>
            <v-skeleton-loader type="image" />
            <p class="mt-4 text-center text-medium-emphasis">
              (Espacio para el gráfico de "Proyectos Ingresados vs Aprobados por
              Año")
            </p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="pa-4" elevation="2">
          <v-card-title class="text-h5">Proyectos Recientes</v-card-title>
          <v-card-text>
            <v-list dense>
              <v-list-item>
                <v-list-item-icon><v-icon>mdi-calendar-check</v-icon></v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Proyecto Urbano (Aprobado)</v-list-item-title>
                  <v-list-item-subtitle>Fecha: 2025-07-28</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon><v-icon>mdi-alert-circle</v-icon></v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Proyecto Energético (Pendiente)</v-list-item-title>
                  <v-list-item-subtitle>Fecha: 2025-07-25</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
//
</script>
