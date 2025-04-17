<template>
  <div class="column">
    <div id="style-manager-header"
      v-if="title || (toolbar && toolbar.length)"
      class="q-px-md q-mt-md"
    >
      <div v-if="title" class="ellipsis text-h6">
        {{ $tie(title) }}
      </div>
      <KPanel
        id="style-manager-toolbar"
        :content="toolbar"
      />
      <QSeparator inset />
    </div>
    <div id="style-manager-content">
      <q-tab-panels v-model="viewMode" animated>
        <q-tab-panel name="list">
          <KGrid
            service="styles"
            :append-items="true"
            :base-query="baseQuery"
            :filter-query="filterQuery"
            class="fit"
            :renderer="{
              component: 'styles/KStylePreviewItem',
              options: {
                avatar: false
              },
              actions: [
                {
                  id: 'apply-to-layer',
                  component: 'menu/KMenu',
                  icon: 'las la-layer-group',
                  tooltip: 'KStyleManager.APPLY_TO_LAYER',
                  actionRenderer: 'item',
                  content: layerMenuContent
                },
                {
                  id: 'apply-to-selection',
                  icon: 'las la-object-group',
                  tooltip: 'KStyleManager.APPLY_TO_SELECTION',
                  handler: applyToSelection
                },
                {
                  id: 'edit-style',
                  icon: 'las la-edit',
                  tooltip: 'KStyleManager.EDIT',
                  handler: editStyle
                },
                {
                  id: 'delete-style',
                  icon: 'las la-trash',
                  tooltip: 'KStyleManager.DELETE',
                  handler: { name: 'removeItem', params: ['confirm'] }
                },
              ],
              dense: true,
              class: 'col-12'
            }"
          />
        </q-tab-panel>
        <q-tab-panel name="editor">
          <div class="full-width column">
            <KStyleEditor
              ref="styleEditor"
              :style="style"
              @canceled="onCanceled"
              @applied="onApplied"
              class="col"
            />
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>

<script setup>
import _ from 'lodash'
import sift from 'sift'
import { computed, ref } from 'vue'
import { Filter, Sorter } from '@kalisio/kdk/core.client'
import { useCurrentActivity } from '../../composables/activity.js'
import { isLayerStyleEditable, editLayerStyle } from '../../utils/utils.layers.js'
import { editFeaturesStyle } from '../../utils/utils.features.js'
import KGrid from '../../../../core/client/components/collection/KGrid.vue'
import KStyleEditor from './KStyleEditor.vue'

// Props
defineProps({
  title: {
    type: String,
    default: null
  }
})

// Data
const { getSelectedFeaturesByLayer, CurrentActivity } = useCurrentActivity()
const styleEditor = ref(null)
const style = ref(null)
const viewMode = ref('list')

// Computed
const baseQuery = computed(() => {
  return Object.assign({}, Sorter.get().query)
})
const filterQuery = computed(() => {
  return Object.assign({}, Filter.get().query)
})
const toolbar = computed(() => {
  if (viewMode.value === 'editor') return []
  return [
    {
      component: 'collection/KSorter',
      id: 'style-manager-sorter-options',
      tooltip: 'KStyleManager.SORT',
      options: [
        { icon: 'las la-sort-alpha-down', value: { field: 'name', order: 1 }, default: true },
        { icon: 'las la-sort-alpha-up', value: { field: 'name', order: -1 } }
      ]
    },
    { component: 'collection/KFilter', style: 'max-width: 200px;' },
    { component: 'QSpace' },
    {
      id: 'add-layer-category',
      icon: 'las la-plus-circle',
      tooltip: 'KStyleManager.CREATE_STYLE',
      size: '1rem',
      handler: () => { editStyle() }
    }
  ]
})
const layerMenuContent = computed(() => {
  const visibleLayers = CurrentActivity.value.getLayers().filter(sift({ isVisible: true, scope: 'user' }))
  return _.map(visibleLayers, layer => {
    return {
      id: 'apply-style-to-layer',
      label: layer.name,
      handler: (styleToApply) => applyToLayer(layer, styleToApply.item)
    }
  })
})

// Functions
async function applyToLayer (layer, styleToApply) {
  await editLayerStyle(layer, styleToApply)
  if (CurrentActivity.value.isInMemoryLayer(layer)) {
    await CurrentActivity.value.resetLayer(layer)
  }
}
function applyToSelection (styleToApply) {
  const type = { Point: 'point', LineString: 'line', Polygon: 'polygon' }
  _.forEach(getSelectedFeaturesByLayer(), layer => {
    if (isLayerStyleEditable(layer.layer)) {
      // In case of in-memory layer, we need to get geoJson and update
      // each style of selected features
      // We can't use resetLayer function because it will retrieve features from
      // Cesium entities which will lose the style property
      if (CurrentActivity.value.isInMemoryLayer(layer.layer)) {
        const featuresToUpdate = _.map(layer.features, feature => feature._id)
        const geoJson = CurrentActivity.value.toGeoJson(layer.layer.name)
        if (geoJson) {
          // Update style of selected features
          _.forEach(geoJson.features, feature => {
            if (featuresToUpdate.includes(feature._id)) {
              _.set(feature, 'style', _.get(styleToApply, ['item', _.get(type, feature.geometry.type, 'point')], null))
            }
          })
        }
        CurrentActivity.value.updateLayer(layer.layer.name, geoJson)
      } else {
        _.forEach(layer.features, f => { 
          _.set(f, 'style', _.get(styleToApply, ['item', _.get(type, f.geometry.type, 'point')], null))
        })
        editFeaturesStyle({ type: 'FeatureCollection', features: layer.features }, layer.layer)
      }
    }
  })
}
function editStyle (styleToEdit) {
  viewMode.value = 'editor'
  style.value = _.get(styleToEdit, 'item', null)
}
function onApplied (style) {
  viewMode.value = 'list'
}
function onCanceled () {
  viewMode.value = 'list'
}
</script>
