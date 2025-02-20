<template>
  <div>
    <div id="style-manager-header" class="q-px-md q-mt-md" v-if="title || (toolbar && toolbar.length)">
      <div v-if="title" class="ellipsis text-h6">
        {{ $tie(title) }}
      </div>
      <KPanel
        id="style-manager-toolbar"
        :content="toolbar"
        v-bind:class="{ 'q-gutter-x-sm' : $q.screen.gt.xs, 'q-gutter-x-xs': $q.screen.lt.sm }"
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
                  id: 'apply-to-selection',
                  icon: 'las la-object-ungroup',
                  tooltip: 'KStyleManager.APPLY_TO_SELECTION',
                  scope: 'header',
                  handler: applyToSelection
                },
                {
                  id: 'edit-style',
                  icon: 'las la-edit',
                  tooltip: 'KStyleManager.EDIT',
                  scope: 'header',
                  handler: editStyle
                },
                {
                  id: 'delete-style',
                  icon: 'las la-trash',
                  tooltip: 'KStyleManager.DELETE',
                  scope: 'footer',
                  handler: { name: 'removeItem', params: ['confirm'] }
                },
              ],
              class: 'col-12'
            }"
          />
        </q-tab-panel>
        <q-tab-panel name="edit">
          <KStyleEditor ref="styleEditor" :style="style" @cancel="onCancel" @apply="onApply" />
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import _ from 'lodash'
import { KGrid } from '../../../../core/client/components'
import { Store, api } from '@kalisio/kdk/core.client'
import KStyleEditor from './KStyleEditor.vue'
import { useCurrentActivity } from '../../composables/activity.js'
import { isLayerStyleEditable } from '../../utils/utils.layers.js'
import { editFeaturesStyle } from '../../utils/utils.features.js'

// Props
defineProps({
  title: {
    type: String,
    default: ''
  }
})

// Data
const filter = Store.get('filter')
const styleEditor = ref(null)
const style = ref(null)
const viewMode = ref('list')
const { getSelectedFeaturesByLayer } = useCurrentActivity()

// Computed
const baseQuery = computed(() => {
  // Filter the objets of type of table
  const query = { }
  return query
})
const filterQuery = computed(() => {
  const query = _.clone(filter.query)
  // Filter the objects against the group
  return query
})
const toolbar = computed(() => {
  if (viewMode.value === 'edit') return []
  return [
    {
      component: 'collection/KSorter',
      id: 'style-manager-sorter-options',
      tooltip: 'KStyleManager.SORT',
      options: [
        { icon: 'las la-sort-alpha-down', value: { field: 'name', order: 1 }, default: true },
        { icon: 'las la-sort-alpha-up', value: { field: 'name', order: -1 } },
        { icon: 'kdk:clockwise.png', value: { field: 'updatedAt', order: 1 } },
        { icon: 'kdk:anticlockwise.png', value: { field: 'updatedAt', order: -1 } }
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

// Functions
function applyToSelection (styleToApply) {
  const type = { Point: 'point', LineString: 'line', Polygon: 'polygon' }
  _.forEach(getSelectedFeaturesByLayer(), layer => {
    if (isLayerStyleEditable(layer.layer)) {
      _.forEach(layer.features, f => { f.style = _.get(styleToApply, ['item', _.get(type, f.geometry.type, 'point')], null) })
      editFeaturesStyle({ type: 'FeatureCollection', features: layer.features }, layer.layer)
    }
  })
}
function editStyle (styleToEdit) {
  viewMode.value = 'edit'
  style.value = _.get(styleToEdit, 'item', null)
}
function onApply (style) {
  const service = api.getService('styles')
  if (style._id) {
    service.patch(style._id, style)
  } else {
    service.create(style)
  }
  viewMode.value = 'list'
}

function onCancel () {
  viewMode.value = 'list'
}

</script>
