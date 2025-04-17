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
            <template v-for="(item, index) in filters" :key="index">
              <q-item v-if="item">
                <q-item-section>
                  <q-item-label>{{ item.label }}</q-item-label>
                  <q-item-label caption>{{ item.description }}</q-item-label>
                </q-item-section>
                <q-item-section class="col-auto">
                  <KPanel
                    id="filter-actions"
                    :content="[{
                      id: 'edit-filter',
                      tooltip: 'KFeaturesFilterManager.EDIT',
                      icon: 'las la-edit',
                      handler: () => editFilter(item, index)
                    }, {
                      id: 'remove-filter',
                      tooltip: 'KFeaturesFilterManager.REMOVE',
                      icon: 'las la-trash',
                      handler: () => removeFilter(index)
                    }]"
                  />
                </q-item-section>
              </q-item>
            </template>
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
              :filter="filter"
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
import { ref, computed } from 'vue'
import { api } from '../../../core/client'
import { useCurrentActivity } from '../composables'
import { getDefaultStyleFromTemplates, generateStyleTemplates, filterQueryToConditions, DefaultStyle } from '../utils'
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
const filter = ref(null)
const index = ref(null)
const viewMode = ref('list')
const layer = await getLayer()
const filters = ref(_.clone(_.get(layer, 'filters', [])))

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
function editFilter (filterToEdit, filterIndex) {
  filter.value = filterToEdit || null
  index.value = (!filterIndex && !_.isNumber(filterIndex)) ? null : filterIndex
  viewMode.value = 'editor'
}
function removeFilter (index) {
  filters.value[index] = null
}
function onApplied (filter) {
  if (index.value === null) {
    filters.value.push(filter)
  } else {
    filters.value[index.value] = filter
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
    const validFilters = _.compact(filters.value)
    for (const filter of validFilters) {
      if (!filter.style) return
      styles.push({
        conditions: filterQueryToConditions(filter.active),
        values: await styleService.get(filter.style)
      })
    }

    const engineStyle = _.pick(_.get(CurrentActivity.value, 'activityOptions.engine', {}), ['point', 'line', 'polygon'])
    const layerDefaultStyle = getDefaultStyleFromTemplates(_.get(layer, 'leaflet.style', {}))
    const templates = generateStyleTemplates(_.merge({}, DefaultStyle, engineStyle, layerDefaultStyle), styles)
    const result = Object.assign(
      {},
      { filters: validFilters },
      _.mapKeys(templates, (value, key) => `leaflet.${key}`),
      _.mapKeys(templates, (value, key) => `cesium.${key}`)
    )
    api.getService('catalog').patch(layer._id, result)
    return true
  }
}

defineExpose({
  apply
})

</script>
