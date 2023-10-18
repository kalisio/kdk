<template>
  <q-list dense bordered>
    <div class="no-padding" :style="panelStyle">
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
        :filter-query="filter.query"
        @selection-changed="onViewSelected"
        :height="scrollAreaMaxHeight - 100"
        :width="scrollAreaMaxWidth"
        :dense="true"
      />
    </div>
  </q-list>
</template>

<script>
import logger from 'loglevel'
import { Filter, Sorter } from '../../../../core/client'
import { KColumn, KPanel, KAction } from '../../../../core/client/components'
import { catalogPanel } from '../../mixins'

export default {
  name: 'k-views-panel',
  components: {
    KColumn,
    KPanel,
    KAction
  },
  mixins: [catalogPanel],
  inject: ['kActivity'],
  computed: {
    baseQuery () {
      return Object.assign({ type: 'Context' }, this.sorter.query)
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
  data () {
    const viewActions = []
    if (this.$can('create', 'catalog', this.kActivity.contextId)) {
      viewActions.push({
        id: 'view-overflowmenu',
        component: 'menu/KMenu',
        dropdownIcon: 'las la-ellipsis-v',
        actionRenderer: 'item',
        propagate: false,
        content: [{
          id: 'remove-view',
          icon: 'las la-trash',
          label: 'KViewsPanel.REMOVE_VIEW',
          handler: (item) => this.removeView(item)
        }]
      })
    }
    return {
      filter: Filter.get(),
      sorter: Sorter.get(),
      viewRenderer: {
        component: 'catalog/KViewSelector',
        class: 'q-pt-xs q-pb-xs q-pr-xs',
        actions: viewActions
      }
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
    removeView (view) {
      this.$api.getService('catalog').remove(view._id)
    }
  }
}
</script>
