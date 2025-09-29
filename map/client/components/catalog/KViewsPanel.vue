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

<script setup>
import _ from 'lodash'
import logger from 'loglevel'
import { ref, computed } from 'vue'
import { utils, i18n, api, LocalCache, Store } from '../../../../core/client'
import { KGrid } from '../../../../core/client/components'
import { useCurrentActivity, useProject } from '../../composables'
import { cacheView, uncacheView } from '../../utils/utils.offline.js'
import { Dialog, Notify } from 'quasar'

// Data
const { CurrentActivity } = useCurrentActivity()
const { project: loadedProject } = await getProject()
const project = ref(loadedProject)
const viewRenderer = ref(getViewRenderer())
const searchString = ref('')
const sortQuery = ref({ $sort: { name: 1 } })

// Computed
const baseQuery = computed(() => {
  return Object.assign({ type: 'Context' }, sortQuery.value)
})
const filterQuery = computed(() => {
  const query = {}
  if (project.value) Object.assign(query, { _id: { $in: _.map(project.value.views, '_id') } })
  if (!_.isEmpty(searchString.value)) {
    Object.assign(query, { name: { $regex: searchString.value } })
  }
  return query
})
const toolbar = computed(() => {
  return [
    {
      id: 'views-filter',
      component: 'collection/KItemsFilter',
      class: 'col',
      value: searchString.value,
      onSearch: (value) => {
        searchString.value = value
      }
    },
    {
      component: 'collection/KItemsSorter',
      id: 'views-sorter',
      tooltip: 'KViewsPanel.SORT_VIEWS',
      options: [
        { icon: 'las la-sort-alpha-down', value: { field: 'name', order: 1 }, default: true },
        { icon: 'las la-sort-alpha-up', value: { field: 'name', order: -1 } },
        { icon: 'kdk:clockwise.png', value: { field: 'updatedAt', order: 1 } },
        { icon: 'kdk:anticlockwise.png', value: { field: 'updatedAt', order: -1 } }
      ],
      onOptionChanged: (option) => {
        sortQuery.value = { $sort: { [option.field]: option.order } }
      }
    }
  ]
})

// Functions
async function getProject () {
  const project = useProject()
  await project.loadProject()
  return project
}
function getViewRenderer () {
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
  if (api.can('create', 'catalog')) {
    viewActions[0].content.push({
      id: 'remove-view',
      icon: 'las la-trash',
      label: 'KViewsPanel.REMOVE_VIEW',
      handler: (item) => removeView(item)
    })
  }
  return {
    component: 'catalog/KViewSelector',
    class: 'col-12',
    actions: viewActions,
    cachable: !_.isNil(project.value)
  }
}
async function onCollectionRefreshed (items) {
  const cachedViews = await LocalCache.getItem('views')
  if (!cachedViews) return
  // Update
  _.forEach(items, (item) => {
    item.isCached = _.has(cachedViews, item._id)
  })
}
function getProjectLayers () {
  const layers = (project.value
    ? project.value.layers.map(layer => (layer._id
      ? CurrentActivity.value.getLayerById(layer._id)
      : CurrentActivity.value.getLayerByName(layer.name)))
    : [])
  return layers.filter(layer => !_.isNil(layer))
}
async function onViewSelected (view, action) {
  switch (action) {
    case 'apply-view': {
      CurrentActivity.value.loadContext(view)
      break
    }
    case 'set-home-view': {
      if (!api.can('update', 'catalog')) return
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
      const center = CurrentActivity.value.getCenter()
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
        await cacheView(view, getProjectLayers(), {
          contextId: Store.get('context'),
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
      await uncacheView(view, getProjectLayers(), {
        contextId: Store.get('context')
      })
      view.isCached = false
      dismiss()
      break
    }
    default:
      logger.debug('invalid action ', action)
  }
}
async function removeView (view) {
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
  await uncacheView(view, getProjectLayers())
  await api.getService('catalog').remove(view._id)
}
</script>
