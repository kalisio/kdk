<template>
  <div class="column full-width">
    <KScrollArea :maxHeight="maxHeight">
      <!-- Sublegends -->
      <template
        v-for="sublegend in sublegends"
        :key="sublegend.name"
        class="column full-width"
      >
        <!-- sublegend -->
        <q-expansion-item
          v-if="!_.isEmpty(layersBySublegend[sublegend.name])"
          :label="$tie(sublegend.name)"
          :header-class="sublegend.headerClass || headerClass"
          :default-opened="sublegend.opened || opened"
          dense
        >
          <!-- legend components by layers -->
          <template v-for="layer in layersBySublegend[sublegend.name]" :key="layer.name" class="column full-width">
            <div class="q-py-xs q-px-md">
              <component
                :is="layer.legend.renderer"
                :label="layer.legend.label"
                :content="filterContent(layer)"
              />
            </div>
          </template>
        </q-expansion-item>
      </template>
    </KScrollArea>
  </div>
</template>

<script setup>
import _ from 'lodash'
import logger from 'loglevel'
import sift from 'sift'
import { ref, computed, watch } from 'vue'
import { i18n, api, utils as coreUtils } from '../../../../core/client'
import { useCurrentActivity } from '../../composables'
import { KScrollArea } from '../../../../core/client/components'

// Props
const props = defineProps({
  contextId: {
    type: String,
    default: undefined
  },
  maxHeight: {
    type: Number,
    default: 800
  },
  headerClass: {
    type: String,
    default: 'bg-grey-3 text-weight-regular'
  },
  opened: {
    type: Boolean,
    default: true
  },
  sublegends: {
    type: Array,
    default: () => []
  },
  sublegendsFromCatalog: {
    type: Boolean,
    default: true
  },
  renderers: {
    type: Object,
    default: () => {
      return {
        image: 'legend/KImageLegend',
        'color-scale': 'legend/KColorScaleLegend',
        symbols: 'legend/KSymbolsLegend'
      }
    }
  }
})

// Data
const { CurrentActivity } = useCurrentActivity({ selection: false, probe: false })
const sublegends = ref([])
const layers = ref([])
const engine = ref()
const zoom = ref()

// Computed
const layersBySublegend = computed(() => {
  const result = {}
  _.forEach(sublegends.value, sublegend => {
    // Built-in legends use filtering while
    let filter = null
    if (_.has(sublegend, 'options.filter')) {
      filter = _.get(sublegend, 'options.filter')
    }
    // If the list of layers in category is empty we can have a null filter
    result[sublegend.name] = filter ? _.filter(layers.value, sift(filter)) : []
  })
  return result
})

// Functions
function onShowLayer (layer, engine) {
  const legend = layer.legend
  if (!legend) return
  if (!legend.content) {
    logger.warn(`[KDK] Legend for ${layer.name} has no content`)
    return
  }
  if (_.find(layers.value, { name: layer.name })) {
    logger.warn(`[KDK] Legend for ${layer.name} already resgistered`)
    return
  }
  logger.debug(`[KDK] Register '${layer.name}' legend`)
  const renderer = props.renderers[legend.type]
  if (!renderer) {
    logger.warn(`[KDK] Cannot find any renderer for the layer's legend of type of ${legend.type}`)
    return
  }
  legend.renderer = coreUtils.loadComponent(renderer)
  layers.value.push(layer)
}
function onHideLayer (layer) {
  if (!layer.legend) return
  logger.debug(`[KDK] Unregister '${layer.name}' legend`)
  _.remove(layers.value, { name: layer.name })
}
function onZoomChanged () {
  zoom.value = CurrentActivity.value.getCenter().zoomLevel
}
function filterContent (layer) {
  const content = layer.legend.content
  console.log(layer, CurrentActivity.value)
  if (!zoom.value) return content
  let result
  if (Array.isArray(content)) {
    _.forEach(content, item => {
      const minZoom = _.get(layer, `${engine.value}.minZoom`, _.get(item, 'minZoom', 0))
      const maxZoom = _.get(layer, `${engine.value}.maxZoom`, _.get(item, 'maxZoom', 99))
      if (zoom.value >= minZoom && zoom.value <= maxZoom) {
        result = item
        return false
      }
  })
  } else {
    const minZoom = _.get(layer, `${engine.value}.minZoom`, _.get(content, 'minZoom', 0))
    const maxZoom = _.get(layer, `${engine.value}.maxZoom`, _.get(content, 'maxZoom', 99))
    if (zoom.value >= minZoom && zoom.value <= maxZoom) {
      result = content
    }
  }
  return result
}

// Watch
watch([() => props.sublegends, () => props.sublegendsFromCatalog], async () => {
  // Retrieve the legends from catalog if required
  if (props.sublegendsFromCatalog) {
    const catalogService = api.getService('catalog', props.contextOrId)
    const response = await catalogService.find({ query: { type: 'Sublegend' } })
    sublegends.value = response.data
  } else {
    sublegends.value = []
  }
  sublegends.value = sublegends.value.concat(props.sublegends)
  // register legend translations
  _.forEach(sublegends.value, legend => {
    if (legend.i18n) i18n.registerTranslation(legend.i18n)
  })
}, { immediate: true })
watch(CurrentActivity, (newActivity, oldActivity) => {
  if (oldActivity) {
    // remove listeners
    oldActivity.value.$engineEvents.off('zoomend', onZoomChanged)
    oldActivity.value.$engineEvents.off('layer-shown', onShowLayer)
    oldActivity.value.$engineEvents.off('layer-hidden', onHideLayer)
    // clear legend
    sublegends.value = []
    layers.value = []
    engine.value = null
    zoom.value = null
  }
  if (newActivity) {
    // setup legend
    engine.value = newActivity.engine
    zoom.value = newActivity.getCenter().zoomLevel
    newActivity.getLayers().forEach((layer) => {
      if (newActivity.isLayerVisible(layer.name)) {
        onShowLayer(layer)
      }
    })
    // install listeners
    newActivity.$engineEvents.on('layer-shown', onShowLayer)
    newActivity.$engineEvents.on('layer-hidden', onHideLayer)
    newActivity.$engineEvents.on('zoomend', onZoomChanged)
  }
}, { immediate: true })
</script>
