import type { Project } from '@/types/project'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import projectData from '@/data/project.json'

// Le decimos a TypeScript que projectData es un Project[]
const typedProjectData = projectData as Project[]

export const useProjectStore = defineStore('projects', () => {
  const allProjects = ref<Project[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Cargamos la data
  async function fetchAllProjects () {
    if (isLoading.value) {
      return
    }

    isLoading.value = true
    error.value = null
    try {
      // Simula una llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000))
      allProjects.value = typedProjectData
    } catch (error_: any) {
      error.value = 'Error al cargar los proyectos: ' + error_.message
      console.error(error_)
    } finally {
      isLoading.value = false
    }
  }

  return { allProjects, isLoading, error, fetchAllProjects }
})
