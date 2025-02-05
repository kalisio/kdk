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

<script>
import logger from 'loglevel'
import { Filter, Sorter, utils, i18n } from '../../../../core/client'
import { KGrid, KPanel, KAction } from '../../../../core/client/components'
import { uncacheView } from '../../utils'

export default {
  name: 'k-projects-panel',
  components: {
    KGrid,
    KPanel,
    KAction
  },
  inject: ['kActivity'],
  computed: {
    baseQuery () {
      return Object.assign({}, this.sorter.query)
    },
    toolbar () {
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
    }
  },
  data () {
    return {
      filter: Filter.get(),
      sorter: Sorter.get(),
      projectRenderer: {
        component: 'catalog/KProjectSelector',
        class: 'col-12',
        contextId: this.kActivity.contextId
      }
    }
  },
  methods: {
    async onProjectSelected (project, action) {
      switch (action) {
        case 'open-project': {
          this.$router.push({
            name: this.$route.name,
            query: Object.assign({ project: project._id }, this.$route.query),
            params: Object.assign({}, this.$route.params)
          })
          break
        }
        case 'edit-project': {
          this.editProject(project)
          break
        }
        case 'remove-project': {
          this.removeProject(project)
          break
        }
        default:
          logger.debug('invalid action ', action)
      }
    },
    editProject (project) {
      this.$router.push({
        name: 'edit-map-project',
        query: this.$route.query,
        params: Object.assign(this.$route.params, {
          objectId: project._id,
          contextId: this.contextId
        })
      })
    },
    async removeProject (project) {
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
      const catalogService = this.$api.getService('catalog')
      for (const viewId of project.views) {
        const view = await catalogService.get(viewId._id)
        uncacheView(view, project, this.kActivity)
      }
      await this.$api.getService('projects').remove(project._id)
    }
  }
}
</script>
