<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app>
      <template #prepend>
        <v-list-item
          lines="two"
          prepend-avatar="https://api.dicebear.com/9.x/icons/svg?seed=Mackenzie"
          subtitle="Conectado"
          title="José Lagos"
        />
      </template>
      <v-divider />
      <v-list dense nav>
        <v-list-item
          v-for="(item, i) in routesProject"
          :key="i"
          link
          :prepend-icon="item.icon"
          :title="item.text"
          :to="item.link"
        />
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-app-bar
        app
        class="app-bar-scroll-transition mt-4 px-4"
        color="background"
        elevation="0"
        rounded
        scroll-behavior="elevate"
        scroll-threshold="100"
      >
        <v-app-bar-nav-icon @click="drawer = !drawer" />
        <v-spacer />
        <v-btn icon>
          <v-icon icon="fa-regular fa-user" />
        </v-btn>
      </v-app-bar>
      <v-container class="pa-4" fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'

  const routesProject = [
    {
      text: 'Estado de Proyectos',
      icon: 'fa-regular fa-folder-open',
      link: '/admitted-approved',
    },
    {
      text: 'Inversión por Proyecto',
      icon: 'far fa-chart-bar',
      link: '/investment',
    },
    {
      text: 'Reporte de Tramitación',
      icon: 'fa-regular fa-file-lines',
      link: '/date-diff',
    },
  ]

  const drawer = ref(true)
</script>
