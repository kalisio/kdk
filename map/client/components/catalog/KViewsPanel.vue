<template>
  <div class="no-padding" :style="panelStyle">
    <k-panel id="favorite-views-toolbar" :content="toolbar" class="no-wrap q-pl-sm q-pr-md" />
    <k-column
      service="catalog"
      :renderer="viewRenderer"
      :nbItemsPerPage="20"
      :append-items="true"
      :base-query="baseQuery"
      :filter-query="filter.query"
      @selection-changed="onViewSelected"
      :height="scrollAreaMaxHeight - 100"
      :dense="true" />
  </div>
</template>

<script>
import _ from 'lodash'
import logger from 'loglevel'
import { Filter, Sorter } from '../../../../core/client'
import { catalogPanel } from '../../mixins'

export default {
  name: 'k-views-panel',
  mixins: [catalogPanel],
  inject: ['kActivity'],
  computed: {
    baseQuery () {
      return Object.assign({ type: 'Context' }, this.sorter.query)
    },
    toolbar () {
      return [
        { component: 'collection/KFilter', class: 'full-width' },
        { component: 'QSpace' },
        {
          component: 'collection/KSorter',
          id: 'views-sorter-options',
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
    return {
      filter: Filter.get(),
      sorter: Sorter.get(),
      viewRenderer: {
        component: 'catalog/KViewSelector',
        class: 'q-pt-xs q-pb-xs q-pr-xs',
        actions: [{
          id: 'view-overflowmenu',
          component: 'frame/KPopupAction',
          actionRenderer: 'item',
          content: [{
            id: 'remove-view',
            icon: 'las la-trash',
            label: 'KViewsPanel.REMOVE_VIEW',
            handler: (item) => this.removeView(item)
          }]
        }]
      }
    }
  },
  methods: {
    async onViewSelected (view, action) {
      switch (action) {
        case 'apply-view':
          this.kActivity.loadContext(view)
          break
        case 'set-home-view':
          // Get current home view
          const response = await this.$api.getService('catalog').find({ query: { type: 'Context', isDefault: true } })
          const currentHomeView = (response.data.length > 0 ? response.data[0] : null)
          // Unset it
          if (currentHomeView) await this.$api.getService('catalog').patch(currentHomeView._id, { isDefault: false })
          // Then set new one
          await this.$api.getService('catalog').patch(view._id, { isDefault: true })
          break
        default: 
          logger.debug('invalud action ', action)
      }
    },
    removeView (view) {
      this.$api.getService('catalog').remove(view._id)
    }
  },
  beforeCreate () {
    // Load the required components
    this.$options.components['k-action'] = this.$load('frame/KAction')
    this.$options.components['k-panel'] = this.$load('frame/KPanel')
    this.$options.components['k-column'] = this.$load('collection/KColumn')
  }
}
</script>
