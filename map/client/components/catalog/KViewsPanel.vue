<template>
  <div class="fit">
    <KGrid
      service="catalog"
      :renderer="viewRenderer"
      :nb-items-per-page="20"
      :append-items="true"
      :base-query="baseQuery"
      :filter-query="filterQuery"
      :dense="true"
      :scrollToTop="false"
      :header="toolbar"
      header-class="full-width no-wrap"
      @collection-refreshed="onCollectionRefreshed"
      @selection-changed="onViewSelected"
    />
  </div>
</template>

<script>
import _ from 'lodash'
import logger from 'loglevel'
import { LocalForage } from '@kalisio/feathers-localforage'
import { Filter, Sorter, utils, i18n, api } from '../../../../core/client'
import { KGrid, KPanel, KAction } from '../../../../core/client/components'
import { useProject } from '../../composables'
import { cacheView, uncacheView } from '../../utils/utils.offline.js'
import { Dialog, Notify } from 'quasar'

export default {
  name: 'k-views-panel',
  components: {
    KGrid,
    KPanel,
    KAction
  },
  inject: ['kActivity'],
  data () {
    const viewActions = []
    viewActions.push({
      id: 'view-overflowmenu',
      component: 'menu/KMenu',
      dropdownIcon: 'las la-ellipsis-v',
      actionRenderer: 'item',
      propagate: false,
      dense: true,
      content: []
    })
    if (this.$can('create', 'catalog', this.kActivity.contextId)) {
      viewActions[0].content.push({
        id: 'remove-view',
        icon: 'las la-trash',
        label: 'KViewsPanel.REMOVE_VIEW',
        handler: (item) => this.removeView(item)
      })
    }
    return {
      filter: Filter.get(),
      sorter: Sorter.get(),
      viewRenderer: {
        component: 'catalog/KViewSelector',
        class: 'col-12',
        actions: viewActions,
        cachable: !_.isNil(this.project)
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
          component: 'collection/KFilter'
        },
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
    async onCollectionRefreshed (items) {
      const cachedViews = await LocalForage.getItem('views')
      if (!cachedViews) return
      // Update
      _.forEach(items, (item) => {
        item.isCached = _.has(cachedViews, item._id)
      })
    },
    getProjectLayers () {
      return (this.project ? this.project.layers.map(layer => (layer._id ? this.kActivity.getLayerById(layer._id) : this.kActivity.getLayerByName(layer.name))) : [])
    },
    async onViewSelected (view, action) {
      switch (action) {
        case 'apply-view': {
          this.kActivity.loadContext(view)
          break
        }
        case 'set-home-view': {
          if (!this.$can('update', 'catalog', this.kActivity.contextId)) return
          // Get current home view
          const response = await api.getService('catalog').find({ query: { type: 'Context', isDefault: true } })
          const currentHomeView = (response.data.length > 0 ? response.data[0] : null)
          // Unset it
          if (currentHomeView) await api.getService('catalog').patch(currentHomeView._id, { isDefault: false })
          // Then set new one if it's really a new one
          if (!currentHomeView || (view._id !== currentHomeView._id)) {
            await api.getService('catalog').patch(view._id, { isDefault: true })
          }
          break
        }
        case 'cache-view': {
          // Select cache options
          const center = this.kActivity.getCenter()
          Dialog.create({
            title: i18n.t('KViewsPanel.CACHE_VIEW_DIALOG_TITLE'),
            message: i18n.t('KViewsPanel.CACHE_VIEW_DIALOG_MESSAGE'),
            html: true,
            component: 'KDialog',
            componentProps: {
              component: 'catalog/KCreateOfflineView',
              zoomLevel: center.zoomLevel,
              view,
              okAction: {
                id: 'ok-button',
                label: 'OK',
                handler: 'apply',
                flat: true
              },
              cancelAction: 'CANCEL'
            }
          }).onOk(async (values) => {
            const dismiss = Notify.create({
              group: 'views',
              icon: 'las la-hourglass-half',
              message: i18n.t('KViewsPanel.CACHING_VIEW'),
              color: 'primary',
              timeout: 0,
              spinner: true
            })
            await cacheView(view, this.getProjectLayers(), {
              contextId: this.kActivity.contextId,
              ...values
            })
            view.isCached = true
            dismiss()
          })
          break
        }
        case 'uncache-view': {
          const dismiss = Notify.create({
            group: 'views',
            icon: 'las la-trash-alt',
            message: i18n.t('KViewsPanel.UNCACHING_VIEW'),
            color: 'primary',
            timeout: 0,
            spinner: true
          })
          await uncacheView(view, this.getProjectLayers(), {
            contextId: this.kActivity.contextId
          })
          view.isCached = false
          dismiss()
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
      await uncacheView(view, this.getProjectLayers())
      await api.getService('catalog').remove(view._id)
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
