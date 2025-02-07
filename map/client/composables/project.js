import _ from 'lodash'
import { ref, computed, watch, onBeforeMount, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '../../../core.client.js'
import { useCurrentActivity } from '../composables/activity.js'
import { getCatalogProjectQuery } from '../utils/utils.project.js'

export function useProject (options = {}) {
  const { setActivityProject } = useCurrentActivity({ selection: false, probe: false })

  _.defaults(options, {
    // Set if project should be extracted from route
    // otherwise it should be loaded manually
    route: true,
    // Default to contextual or global service depending on store
    context: '',
    // Default to target activity
    updateActivity: true,
    // Default to app API
    planetApi: api
  })

  // Data
  const route = useRoute()
  const router = useRouter()
  const projectId = ref(null)
  const project = ref(null)

  // Computed
  const projectQuery = computed(() => {
    return _.isEmpty(projectId.value) ? {} : { project: projectId.value }
  })
  const catalogProjectQuery = computed(() => {
    return _.isEmpty(project.value) ? {} : getCatalogProjectQuery(project.value)
  })

  // Functions
  function hasProject () {
    return projectId.value
  }
  function isProjectLoaded () {
    return project.value
  }
  async function loadProject (query) {
    // Ensure project ID is available first
    refreshProjectId()
    // Populate project (i.e. layers, views) by default
    const projectQuery = (query ? _.cloneDeep(query) : {})
    _.defaults(projectQuery, { populate: true })
    if (!projectId.value) {
      project.value = null
      if (query) {
        const response = await options.planetApi.getService('projects', options.context).find({ query: projectQuery })
        project.value = _.get(response, 'data[0]')
        // If we load project manually not by using route update ID as well
        if (project.value) projectId.value = project.value._id
      }
    } else {
      project.value = await options.planetApi.getService('projects', options.context).get(projectId.value, { query: projectQuery })
    }
    if (options.updateActivity) setActivityProject(project.value)
    // Keep track of source API
    if (project.value) {
      project.value.getPlanetApi = () => options.planetApi
    }
  }
  function onProjectUpdated (updatedProject) {
    if (project.value && (updatedProject._id === project.value._id)) {
      project.value = updatedProject
      if (options.updateActivity) setActivityProject(updatedProject)
    }
  }
  function onProjectRemoved (removedProject) {
    if (project.value && (removedProject._id === project.value._id)) {
      project.value = null
      projectId.value = null
      // Clear project from query as well
      if (options.route) {
        router.push({
          name: route.name,
          query: _.omit(route.query, ['project']),
          params: route.params
        })
      }
    }
  }
  function refreshProjectId () {
    if (!options.route) return
    const id = _.get(route, 'query.project', null)
    if (projectId.value !== id) projectId.value = id
  }

  // Lifecycle hooks
  if (options.route) watch(() => route.query.project, refreshProjectId)

  onBeforeMount(() => {
    refreshProjectId()
    const projectsService = options.planetApi.getService('projects', options.context)
    // Keep track of changes once project is loaded
    projectsService.on('patched', onProjectUpdated)
    projectsService.on('updated', onProjectUpdated)
    projectsService.on('removed', onProjectRemoved)
  })

  // Cleanup
  onBeforeUnmount(() => {
    const projectsService = options.planetApi.getService('projects', options.context)
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
    projectQuery,
    catalogProjectQuery
  }
}
