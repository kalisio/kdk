<template>
  <div class="fit">
    <KGrid
      service="projects"
      :renderer="projectRenderer"
      :nb-items-per-page="20"
      :append-items="true"
      :base-query="baseQuery"
      :filter-query="filter.query"
      :dense="true"
      :scrollToTop="false"
      :header="toolbar"
      header-class="full-width no-wrap"
      @selection-changed="onProjectSelected"
    />
  </div>
</template>

<script setup>
import logger from 'loglevel'
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCurrentActivity } from '../../composables'
import { Filter, Sorter, utils, i18n, api } from '../../../../core/client'
import { KGrid } from '../../../../core/client/components'
import { uncacheView } from '../../utils'

// Data
const router = useRouter()
const route = useRoute()
const { CurrentActivity } = useCurrentActivity()
const filter = ref(Filter.get())
const sorter = Sorter.get()
const projectRenderer = ref({
  component: 'catalog/KProjectSelector',
  class: 'col-12'
})

// Computed
const baseQuery = computed(() => Object.assign({}, sorter.query))
const toolbar = computed(() => {
  return [
    {
      id: 'projects-filter',
      component: 'collection/KFilter'
    },
    {
      component: 'collection/KSorter',
      id: 'projects-sorter',
      tooltip: 'KProjectsPanel.SORT_PROJECTS',
      options: [
        { icon: 'las la-sort-alpha-down', value: { field: 'name', order: 1 }, default: true },
        { icon: 'las la-sort-alpha-up', value: { field: 'name', order: -1 } },
        { icon: 'kdk:clockwise.png', value: { field: 'updatedAt', order: 1 } },
        { icon: 'kdk:anticlockwise.png', value: { field: 'updatedAt', order: -1 } }
      ]
    }
  ]
})

// Functions
async function onProjectSelected (project, action) {
  switch (action) {
    case 'open-project': {
      router.push({
        name: route.name,
        query: Object.assign({ project: project._id }, route.query),
        params: Object.assign({}, route.params)
      })
      break
    }
    case 'edit-project': {
      editProject(project)
      break
    }
    case 'remove-project': {
      removeProject(project)
      break
    }
    default:
      logger.debug('invalid action ', action)
  }
}
function editProject (project) {
  router.push({
    name: 'edit-map-project',
    query: route.query,
    params: Object.assign(route.params, {
      objectId: project._id
    })
  })
}
async function removeProject (project) {
  const result = await utils.dialog({
    title: i18n.t('KProjectsPanel.REMOVE_DIALOG_TITLE', { project: project.name }),
    message: i18n.t('KProjectsPanel.REMOVE_DIALOG_MESSAGE', { project: project.name }),
    html: true,
    ok: {
      label: i18n.t('OK'),
      flat: true
    },
    cancel: {
      label: i18n.t('CANCEL'),
      flat: true
    }
  })
  if (!result.ok) return false
  const catalogService = api.getService('catalog')
  for (const viewId of project.views) {
    const view = await catalogService.get(viewId._id)
    uncacheView(view, project, CurrentActivity)
  }
  await api.getService('projects').remove(project._id)
}
</script>
