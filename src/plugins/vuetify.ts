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

// Tema claro
const lightDashboardTheme = {
  dark: false,
  colors: {
    'primary': '#2196F3',
    'secondary': '#00ACC1',
    'accent': '#FFC107',
    // Estado / Semánticos
    'error': '#F44336',
    'info': '#2196F3',
    'success': '#4CAF50',
    'warning': '#FF9800',
    // Neutros / Base de UI (para fondos, superficies, textos)
    'surface': '#FFFFFF',
    'background': '#F5F7FA',
    // Colores de texto (Vuetify los usa para 'on-primary', 'on-surface' etc.)
    'on-primary': '#FFFFFF',
    'on-secondary': '#FFFFFF',
    'on-accent': '#212121',
    'on-error': '#FFFFFF',
    'on-info': '#FFFFFF',
    'on-success': '#FFFFFF',
    'on-warning': '#212121',

    // Colores de texto específicos si necesitas control fino
    'text-high-emphasis': '#212121',
    'text-medium-emphasis': '#616161',
    'text-disabled': 'rgba(0, 0, 0, 0.38)',
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
