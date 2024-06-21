<template>
  <q-list dense bordered>
    <div class="no-padding" :style="panelStyle">
      <q-resize-observer @resize="onResized" />
      <KPanel
        id="favorite-views-toolbar"
        :content="toolbar"
        class="no-wrap q-pl-sm q-pr-md"
      />
      <KColumn
        class="q-pl-sm"
        service="projects"
        :renderer="projectRenderer"
        :nbItemsPerPage="20"
        :append-items="true"
        :base-query="baseQuery"
        :filter-query="filter.query"
        :height="scrollAreaMaxHeight - 100"
        :width="scrollAreaMaxWidth - 50"
        :dense="true"
        @selection-changed="onProjectSelected"
      />
    </div>
  </q-list>
</template>

<script>
import logger from 'loglevel'
import { Filter, Sorter, utils, i18n } from '../../../../core/client'
import { KColumn, KPanel, KAction } from '../../../../core/client/components'
import { catalogPanel } from '../../mixins'
import { uncacheView } from '../../utils'

export default {
  name: 'k-projects-panel',
  components: {
    KColumn,
    KPanel,
    KAction
  },
  mixins: [catalogPanel],
  inject: ['kActivity'],
  computed: {
    baseQuery () {
      return Object.assign({}, this.sorter.query)
    },
    toolbar () {
      return [
        {
          id: 'projects-filter',
          component: 'collection/KFilter',
          class: 'full-width'
        },
        { component: 'QSpace' },
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
    const projectActions = []
    if (this.$can('update', 'projects', this.kActivity.contextId)) {
      const content = [{
        id: 'edit-project',
        icon: 'las la-file-alt',
        label: 'KProjectsPanel.EDIT_PROJECT',
        handler: (item) => this.editProject(item)
      }]
      if (this.$can('remove', 'projects', this.kActivity.contextId)) {
        content.push({
          id: 'remove-project',
          icon: 'las la-trash',
          label: 'KProjectsPanel.REMOVE_PROJECT',
          handler: (item) => this.removeProject(item)
        })
      }
      projectActions.push({
        id: 'project-overflowmenu',
        component: 'menu/KMenu',
        dropdownIcon: 'las la-ellipsis-v',
        actionRenderer: 'item',
        propagate: false,
        dense: true,
        content
      })
    }
    return {
      scrollAreaMaxWidth: 0,
      filter: Filter.get(),
      sorter: Sorter.get(),
      projectRenderer: {
        component: 'catalog/KProjectSelector',
        class: 'q-pt-xs q-pb-xs q-pr-xs',
        actions: projectActions
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
      for (let viewId of project.views) {
        console.log(viewId)
        let view = await catalogService.get(viewId._id)
        uncacheView(view, project, this.kActivity)
      }
      await this.$api.getService('projects').remove(project._id)
    },
    onResized (size) {
      this.scrollAreaMaxWidth = size.width
    }
  }
}
</script>
