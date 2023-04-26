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
                :content="layer.legend.content"
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
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
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
  if (legend) {
    if (!_.find(layers.value, { name: layer.name })) {
      logger.debug(`[KDK] Register ${layer.name} legend`)
      const renderer = props.renderers[legend.type]
      if (!renderer) {
        logger.warn(`[KDK] Cannot find any renderer for the layer's legend of type of ${legend.type}`)
        return
      }
      legend.renderer = coreUtils.loadComponent(renderer)
      layers.value.push(layer)
    } else {
      logger.warn(`[KDK] Legend for ${layer.name} already resgistered`)
    }
  }
}
function onHideLayer (layer) {
  if (layer.legend) {
    logger.debug(`[KDK] Unregister ${layer.name} legend'`)
    _.remove(layers.value, { name: layer.name })
  }
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

// Hooks
onMounted(async () => {
  // initial scan of already added layers
  CurrentActivity.value.getLayers().forEach((layer) => {
    if (CurrentActivity.value.isLayerVisible(layer.name)) {
      onShowLayer(layer)
    }
  })
  // listen to the layer shown/hiddend signals
  CurrentActivity.value.$engineEvents.on('layer-shown', onShowLayer)
  CurrentActivity.value.$engineEvents.on('layer-hidden', onHideLayer)
})
onBeforeUnmount(() => {
  CurrentActivity.value.$engineEvents.off('layer-shown', onShowLayer)
  CurrentActivity.value.$engineEvents.off('layer-hidden', onHideLayer)
})
</script>
