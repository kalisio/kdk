import _ from 'lodash'
import { ref, computed, watch, onBeforeMount, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '../../../core.client.js'

export function useProject (options = {}) {
  // Data
  const route = useRoute()
  const projectId = ref(null)
  const project = ref(null)

  // Computed
  const projectQuery = computed(() => {
    return _.isEmpty(projectId.value) ? {} : { project: projectId.value }
  })

  // Functions
  function hasProject () {
    return projectId.value
  }
  function isProjectLoaded () {
    return project.value
  }
  async function loadProject (query = {}) {
    // Ensure project ID is available first
    refreshProjectId()
    if (!projectId.value) {
      project.value = null
    } else {
      project.value = await api.getService('projects', options.contextId).get(projectId.value, { query })
    }
  }
  function onProjectUpdated (updatedProject) {
    if (project.value && (updatedProject._id === project.value._id)) {
      project.value = updatedProject
    }
  }
  function onProjectRemoved (removedProject) {
    if (project.value && (removedProject._id === project.value._id)) {
      project.value = null
      projectId.value = null
    }
  }
  function refreshProjectId () {
    const id = _.get(route, 'query.project', null)
    if (projectId.value !== id) projectId.value = id
  }

  // Lifecycle hooks
  watch(() => route.query.project, refreshProjectId)

  onBeforeMount(() => {
    refreshProjectId()
    const projectsService = api.getService('projects', options.contextId)
    // Keep track of changes once project is loaded
    projectsService.on('patched', onProjectUpdated)
    projectsService.on('updated', onProjectUpdated)
    projectsService.on('removed', onProjectRemoved)
  })

  // Cleanup
  onBeforeUnmount(() => {
    const projectsService = api.getService('projects', options.contextId)
    projectsService.off('patched', onProjectUpdated)
    projectsService.off('updated', onProjectUpdated)
    projectsService.off('removed', onProjectRemoved)
  })

  return {
    project,
    projectId,
    hasProject,
    isProjectLoaded,
    loadProject,
    projectQuery
  }
}
