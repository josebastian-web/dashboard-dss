import type { Project } from '@/types/project'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import rawProjectData from '@/data/project.json'

const initialProjects = rawProjectData as Project[]

export const useMainStore = defineStore('main', () => {
  const allProjects = ref<Project[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const availableRegions = computed(() => {
    const regions = new Set<string>()
    for (const project of allProjects.value) {
      if (project.region) {
        regions.add(project.region)
      }
    }
    return ['Todas', ...Array.from(regions).sort()]
  })

  async function fetchAllProjects () {
    if (isLoading.value || allProjects.value.length > 0) {
      return
    }
    isLoading.value = true
    error.value = null
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      allProjects.value = initialProjects
    } catch (error_: any) {
      error.value = `Error loading projects: ${error_.message || 'Unknown error'}`
      console.error('Error fetching projects in main store:', error_)
    } finally {
      isLoading.value = false
    }
  }

  return {
    allProjects,
    isLoading,
    error,
    availableRegions,
    fetchAllProjects,
  }
})
