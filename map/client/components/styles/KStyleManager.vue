<template>
  <div class="column">
    <div id="style-manager-header"
      v-if="title || (toolbar && toolbar.length)"
      class="full-width"
    >
      <div v-if="title" class="ellipsis text-h6">
        {{ $tie(title) }}
      </div>
      <KPanel
        id="style-manager-toolbar"
        :content="toolbar"
        class="q-pr-sm no-wrap"
      />
      <QSeparator inset />
      <div class="row justify-center q-mt-xs">
        <KTagSelection :selection="tagsSelection" @selection-changed="onTagSelectionChanged" />
      </div>
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
            :renderer="renderer"
          />
          <KFollower
            :follower="{
              component: 'layout/KFab',
              direction: 'up',
              alignment: 'right',
              content: [{
                id: 'create-style',
                icon: 'las la-plus',
                tooltip: 'KStyleManager.CREATE_STYLE',
                handler: editStyle
              }]
            }"
            targetId="left-window-magnet"
            anchor="bottom-right"
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
import { computed, ref, onMounted } from 'vue'
import { useCurrentActivity } from '../../composables/activity.js'
import { isLayerStyleEditable, editLayerStyle, updateLayerWithFiltersStyle } from '../../utils/utils.layers.js'
import { editFeaturesStyle } from '../../utils/utils.features.js'
import { getTagsFilterOptions } from '../../../../core/client/utils/utils.tags.js'
import KGrid from '../../../../core/client/components/collection/KGrid.vue'
import KFollower from '../../../../core/client/components/KFollower.vue'
import KTagSelection from '../../../../core/client/components/tags/KTagSelection.vue'
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
const baseQuery = ref({})
const searchString = ref('')
const tagsOptions = ref([])
const tagsSelection = ref([])

// Computed
const filterQuery = computed(() => {
  const query = {}
  if (!_.isEmpty(searchString.value)) {
    query.name = { $regex: searchString.value }
  }
  if (!_.isEmpty(tagsSelection.value)) {
    query['tags.name'] = { $in: _.map(tagsSelection.value, el => el.name) }
  }
  return query
})
const toolbar = computed(() => {
  if (viewMode.value === 'editor') return []
  return [
    {
      component: 'collection/KItemsSorter',
      id: 'style-manager-sorter-options',
      tooltip: 'KStyleManager.SORT',
      options: [
        { icon: 'las la-sort-alpha-down', value: { field: 'name', order: 1 }, default: true },
        { icon: 'las la-sort-alpha-up', value: { field: 'name', order: -1 } }
      ],
      onOptionChanged: (option) => {
        baseQuery.value = { $sort: { [option.field]: option.order } }
      }
    },
    {
      component: 'tags/KTagFilter',
      id: 'style-manager-tags-filter',
      selection: tagsSelection.value,
      options: tagsOptions.value,
      onSelectionChanged: onTagSelectionChanged
    },
    {
      component: 'collection/KItemsFilter',
      class: 'col',
      value: searchString.value,
      onSearch: (value) => {
        searchString.value = value
      }
    }
  ]
})
const renderer = computed(() => {
  const visibleLayers = CurrentActivity.value.getLayers().filter(sift({ isVisible: true, scope: 'user' }))
  const layerMenuContent = _.map(visibleLayers, layer => {
    return {
      id: 'apply-style-to-layer',
      label: layer.name,
      handler: (styleToApply) => applyToLayer(layer, styleToApply.item)
    }
  })
  return {
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
      }
    ],
    dense: true,
    class: 'col-12'
  }
})

// Functions
function onTagSelectionChanged (selection) {
  tagsSelection.value = selection
}
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
      _.forEach(layer.features, f => {
        let geometryType = f.geometry.type
        if (_.has(f, 'properties.entityStyle')) {
          // Walls and corridors must be treated as polygons in style editor
          if (_.has(f, 'properties.entityStyle.wall')) geometryType = 'Polygon'
          else if (_.has(f, 'properties.entityStyle.corridor')) geometryType = 'Polygon'
        }
        _.set(f, 'style', _.get(styleToApply, ['item', _.get(type, geometryType, 'point')], null))
      })
      if (CurrentActivity.value.isInMemoryLayer(layer.layer)) {
        CurrentActivity.value.resetLayer(layer.layer)
      } else {
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
  // Update layers with filters that use this style
  const layers = _.filter(CurrentActivity.value?.getLayers ? CurrentActivity.value.getLayers() : [], layer =>
    _.get(layer, 'scope') === 'user' &&
    _.some(_.get(layer, 'filters', []), filter => _.get(filter, 'style') === style._id))
  _.forEach(layers, layer => { updateLayerWithFiltersStyle(layer) })
}
function onCanceled () {
  viewMode.value = 'list'
}

// Hooks
onMounted(async () => {
  tagsOptions.value = await getTagsFilterOptions('styles')
})
</script>
