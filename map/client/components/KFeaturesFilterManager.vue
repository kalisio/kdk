<template>
  <div class="column">
    <div id="filter-manager-header"
      class="row items-center full-row q-px-md q-mt-md q-gutter-sm"
    >
      <KAction
        v-if="viewMode === 'editor'"
        id="back"
        icon="las la-arrow-left"
        tooltip="KFeaturesFilterManager.BACK"
        class="col-auto"
        :handler="onCanceled"
      />
      <div class="ellipsis text-h6 col">
        {{ $tie('KFeaturesFilterManager.TITLE') + ' ' + layerName }}
      </div>
      <KPanel
        id="filter-manager-toolbar"
        :content="toolbar"
      />
    </div>
    <div id="filter-manager-content">
      <q-tab-panels v-model="viewMode" animated>
        <q-tab-panel name="list">
          <q-list separator v-if="filters.length">
            <q-item v-for="item in filters" :key="item.id">
              <q-item-section>
                <q-item-label>{{ item.label }}</q-item-label>
                <q-item-label caption>{{ item.description }}</q-item-label>
              </q-item-section>
              <q-item-section class="col-auto">
                <KPanel
                  id="filter-actions"
                  :content="getPanelContent(item)"
                />
              </q-item-section>
            </q-item>
          </q-list>
          <div v-else class="column items-center full-row">
            <KStamp
              icon="las la-exclamation-circle"
              icon-size="1.6rem"
              :text="$t('KFeaturesFilterManager.NO_FILTERS')"
              direction="horizontal"
              class="q-pa-md"
            />
          </div>
        </q-tab-panel>
        <q-tab-panel name="editor">
          <div class="full-width column">
            <KFeaturesFilterEditor
              ref="filterEditor"
              :filter="filterToEdit"
              :layerId="layerId"
              :layerName="layerName"
              :hideButtons="true"
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
import { uid } from 'quasar'
import { ref, computed, onMounted } from 'vue'
import { api } from '../../../core/client'
import { useCurrentActivity } from '../composables'
import { getDefaultStyleFromTemplates, generateStyleTemplates, filterQueryToConditions, DefaultStyle, getUpdatedLayerLegend } from '../utils'
import KFeaturesFilterEditor from './KFeaturesFilterEditor.vue'

// Props
const props = defineProps({
  layerId: {
    type: String,
    default: ''
  },
  layerName: {
    type: String,
    default: ''
  }
})

// Data
const { CurrentActivity } = useCurrentActivity()
const filterEditor = ref(null)
const filterToEdit = ref(null)
const viewMode = ref('list')
let layer = null
const filters = ref([])

// Computed
const toolbar = computed(() => {
  if (viewMode.value === 'editor') return []
  return [
    {
      id: 'add-filter',
      icon: 'las la-plus-circle',
      tooltip: 'KFeaturesFilterManager.CREATE',
      size: '1rem',
      handler: () => { editFilter() }
    }
  ]
})

// Functions
async function getLayer () {
  if (props.layerName) {
    return CurrentActivity.value.getLayerByName(props.layerName)
  } else {
    return await api.getService('catalog').get(props.layerId)
  }
}
function getFilters () {
  const filters = _.clone(_.get(layer, 'filters', []))
  _.forEach(filters, filter => { filter.id = uid() })
  return filters
}
function getPanelContent (item) {
  return [{
    id: 'edit-filter',
    tooltip: 'KFeaturesFilterManager.EDIT',
    icon: 'las la-edit',
    handler: () => editFilter(item)
  }, {
    id: 'remove-filter',
    tooltip: 'KFeaturesFilterManager.REMOVE',
    icon: 'las la-trash',
    handler: () => removeFilter(item.id)
  }]
}
function editFilter (filter) {
  filterToEdit.value = filter || null
  viewMode.value = 'editor'
}
function removeFilter (id) {
  filters.value = filters.value.filter(filter => filter.id !== id)
}
function onApplied (filter) {
  const targetIndex = _.get(filter, 'id') ? _.findIndex(filters.value, { id: filter.id }) : -1
  if (targetIndex > -1) {
    filters.value[targetIndex] = filter
  } else {
    Object.assign(filter, { id: uid() })
    filters.value.push(filter)
  }
  viewMode.value = 'list'
}
function onCanceled () {
  viewMode.value = 'list'
}
async function apply () {
  if (viewMode.value === 'editor') {
    filterEditor.value.apply()
  } else {
    // Apply styles
    const styles = []
    const styleService = api.getService('styles')
    const validFilters = _.map(filters.value, filter => _.omit(filter, 'id'))
    for (const filter of validFilters) {
      if (!filter.style) continue
      styles.push({
        conditions: filterQueryToConditions(filter.active),
        values: await styleService.get(filter.style)
      })
    }

    const engineStyle = _.pick(_.get(CurrentActivity.value, 'activityOptions.engine.style', {}), ['point', 'line', 'polygon'])
    const layerDefaultStyle = getDefaultStyleFromTemplates(_.get(layer, 'leaflet.style', {}))
    const templates = generateStyleTemplates(_.merge({}, DefaultStyle, engineStyle, layerDefaultStyle), styles)
    const result = Object.assign(
      {},
      (!_.isEmpty(validFilters) ? { filters: validFilters } : { $unset: { filters: true } }),
      _.mapKeys(templates, (value, key) => `leaflet.${key}`),
      _.mapKeys(templates, (value, key) => `cesium.${key}`)
    )
    const legendLayer = Object.assign({}, layer, result)
    if (_.isEmpty(validFilters)) delete legendLayer.filters
    const legend = await getUpdatedLayerLegend(legendLayer)
    api.getService('catalog').patch(layer._id, Object.assign(result, legend))
    return true
  }
}

onMounted(async () => {
  layer = await getLayer()
  filters.value = getFilters()
})

defineExpose({
  apply
})

</script>
