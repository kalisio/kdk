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
        service="catalog"
        :renderer="viewRenderer"
        :nbItemsPerPage="20"
        :append-items="true"
        :base-query="baseQuery"
        :filter-query="filterQuery"
        @selection-changed="onViewSelected"
        :height="scrollAreaMaxHeight - 100"
        :width="scrollAreaMaxWidth"
        :dense="true"
      />
    </div>
  </q-list>
</template>

<script>
import _ from 'lodash'
import logger from 'loglevel'
import { Filter, Sorter, utils, i18n } from '../../../../core/client'
import { KColumn, KPanel, KAction } from '../../../../core/client/components'
import { catalogPanel } from '../../mixins'
import { useProject } from '../../composables'

export default {
  name: 'k-views-panel',
  components: {
    KColumn,
    KPanel,
    KAction
  },
  mixins: [catalogPanel],
  inject: ['kActivity'],
  data () {
    const viewActions = []
    if (this.$can('create', 'catalog', this.kActivity.contextId)) {
      viewActions.push({
        id: 'view-overflowmenu',
        component: 'menu/KMenu',
        dropdownIcon: 'las la-ellipsis-v',
        actionRenderer: 'item',
        propagate: false,
        dense: true,
        content: [{
          id: 'remove-view',
          icon: 'las la-trash',
          label: 'KViewsPanel.REMOVE_VIEW',
          handler: (item) => this.removeView(item)
        }]
      })
    }
    return {
      scrollAreaMaxWidth: 0,
      filter: Filter.get(),
      sorter: Sorter.get(),
      viewRenderer: {
        component: 'catalog/KViewSelector',
        class: 'q-pt-xs q-pb-xs q-pr-xs',
        actions: viewActions
      }
    }
  },
  computed: {
    baseQuery () {
      return Object.assign({ type: 'Context' }, this.sorter.query)
    },
    filterQuery () {
      const query = {}
      if (this.project) Object.assign(query, { _id: { $in: _.map(this.project.views, '_id') } })
      return Object.assign(query, this.filter.query)
    },
    toolbar () {
      return [
        {
          id: 'views-filter',
          component: 'collection/KFilter',
          class: 'full-width'
        },
        { component: 'QSpace' },
        {
          component: 'collection/KSorter',
          id: 'views-sorter',
          tooltip: 'KViewsPanel.SORT_VIEWS',
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
  methods: {
    async onViewSelected (view, action) {
      switch (action) {
        case 'apply-view': {
          this.kActivity.loadContext(view)
          break
        }
        case 'set-home-view': {
          if (!this.$can('update', 'catalog', this.kActivity.contextId)) return
          // Get current home view
          const response = await this.$api.getService('catalog').find({ query: { type: 'Context', isDefault: true } })
          const currentHomeView = (response.data.length > 0 ? response.data[0] : null)
          // Unset it
          if (currentHomeView) await this.$api.getService('catalog').patch(currentHomeView._id, { isDefault: false })
          // Then set new one if it's really a new one
          if (!currentHomeView || (view._id !== currentHomeView._id)) {
            await this.$api.getService('catalog').patch(view._id, { isDefault: true })
          }
          break
        }
        default:
          logger.debug('invalid action ', action)
      }
    },
    async removeView (view) {
      const result = await utils.dialog({
        title: i18n.t('KViewsPanel.REMOVE_DIALOG_TITLE', { view: view.name }),
        message: i18n.t('KViewsPanel.REMOVE_DIALOG_MESSAGE', { view: view.name }),
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
      await this.$api.getService('catalog').remove(view._id)
    },
    onResized (size) {
      this.scrollAreaMaxWidth = size.width
    }
  },
  // Should be used with <Suspense> to ensure the project is loaded upfront
  async setup () {
    const project = useProject()
    await project.loadProject()
    // Expose
    return {
      ...project
    }
  }
}
</script>
