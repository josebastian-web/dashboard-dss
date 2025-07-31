<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app>
      <template #prepend>
        <v-list-item
          lines="two"
          prepend-avatar="https://randomuser.me/api/portraits/women/81.jpg"
          subtitle="Logged in"
          title="Jane Smith"
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
      <v-app-bar app dark scroll-behavior="elevate">
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

    <v-footer app class="text-center py-3" color="grey-lighten-3">
      <v-container>
        <span class="text-caption">
          &copy; {{ new Date().getFullYear() }} Mi Dashboard. Todos los derechos reservados.
        </span>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  /* import { useProductStore } from '@/stores/project'

  const authStore = useProductStore() */
  const routesProject = [
    {
      text: 'Inicio',
      icon: 'far fa-house',
      link: '/',
    },
    {
      text: 'Ingresados vs Aprobados',
      icon: 'far fa-paper-plane',
      link: '/admitted-approved',
    },
    {
      text: 'Inversion año/tipo',
      icon: 'far fa-chart-bar',
      link: '/investment',
    },
    {
      text: 'Diferencia Fecha/Fecha Resolución',
      icon: 'fa-regular fa-calendar',
      link: '/date-diff',
    },
  ]

  const drawer = ref(true)
</script>
