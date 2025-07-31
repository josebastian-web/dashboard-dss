/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

import { createVuetify } from 'vuetify'
import { aliases, fa } from 'vuetify/iconsets/fa'

// Styles
import '@mdi/font/css/materialdesignicons.css'
import '@fortawesome/fontawesome-free/css/all.css'
import 'vuetify/styles'

const lightDashboardTheme = {
  dark: false, // ¡Tema claro!
  colors: {
    // Colores base de fondo y superficie
    'background': '#F5F5F5',
    'surface': '#FFFFFF',

    // Colores de marca
    'primary': '#2196F3',
    'secondary': '#FF9800',
    'accent': '#9C27B0',

    // Colores de estado
    'success': '#4CAF50',
    'info': '#2196F3',
    'warning': '#FFC107',
    'error': '#F44336',

    'on-background': 'rgba(0, 0, 0, 0.87)',
    'on-surface': 'rgba(0, 0, 0, 0.87)',
    'on-primary': '#FFFFFF',
  },
}

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'lightDashboardTheme',
    themes: {
      lightDashboardTheme,
    },
  },
  icons: {
    defaultSet: 'fa',
    aliases,
    sets: {
      fa,
    },
  },
})
