/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

import { BarChart, LineChart } from 'echarts/charts'
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import ECharts from 'vue-echarts'
import { registerPlugins } from '@/plugins'
import App from './App.vue'
// Styles
import 'unfonts.css'

const pinia = createPinia()
const app = createApp(App)

registerPlugins(app)

use([
  BarChart,
  CanvasRenderer,
  LineChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
])

app.component('v-chart', ECharts)
app.use(pinia)
app.mount('#app')
