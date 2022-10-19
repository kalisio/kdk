<template>
  <div class="column full-width">
    <KScrollArea :maxHeight="maxHeight">
      <template v-for="legend in legends" key="legend.name" class="column full-width">
        <q-expansion-item
          v-if="!_.isEmpty(layersByLegend[legend.name])"
          :label="$tie(legend.name)"
          :header-class="legend.headerClass || headerClass"
          :default-opened="legend.opened || opened"
          dense
        >
          <template v-for="layer in layersByLegend[legend.name]" key="layer.name" class="column full-width">
            <div class="q-py-xs q-px-md">
              <component
                :is="layer.legend.renderer"
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
import { inject, ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { KScrollArea } from '../../../../core/client/components'
import { i18n } from '../../../../core/client/index.js'
import { loadComponent } from '../../../../core/client/utils.js'
import { useCatalog } from '../../composables'

// inject
const kActivity = inject('kActivity')

// props
const props = defineProps({
  contextId: {
    type: String,
    default: undefined
  },
  maxHeight: {
    type: Number,
    default: 500
  },
  headerClass: {
    type: String,
    default: 'bg-grey-3 text-weight-regular'
  },
  opened: {
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

// data
const { listLegends } = useCatalog(props.contextId)
const legends = ref({})
const layers = ref([])

// cmoputed
const layersByLegend = computed(() => {
  const result = {}
  _.forEach(legends.value, legend => {
    // Built-in legends use filtering while
    let filter = null
    if (_.has(legend, 'options.filter')) {
      filter = _.get(legend, 'options.filter')
    }
    // If the list of layers in category is empty we can have a null filter
    result[legend.name] = filter ? _.filter(layers.value, sift(filter)) : []
  })
  return result
})

// functions
function onShowLayer (layer, engineLayer) {
  const legend = layer.legend
  if (legend) {
    logger.debug(`register ${layer.name} legend`)
    const renderer = props.renderers[legend.type]
    if (!renderer) {
      logger.warn(`Cannot find any renderer for the layer's legend of type of ${legend.type}`)
      return
    }
    legend.renderer = loadComponent(renderer)
    if (!legend.label) legend.label = layer.name
    layers.value.push(layer)
  }
}
function onHideLayer (layer) {
  if (layer.legend) {
    logger.debug(`unregister ${layer.name} legend'`)
    _.remove(layers.value, { name: layer.name })
  }
}

// hooks
onMounted(async () => {
  kActivity.$engineEvents.on('layer-shown', onShowLayer)
  kActivity.$engineEvents.on('layer-hidden', onHideLayer)
  // retrieve the legends
  legends.value = await listLegends()
  // register legend translations
  _.forEach(legends.value, legend => {
    if (legend.i18n) i18n.registerTranslation(legend.i18n)
  })
  // initial scan of already added layers
  kActivity.getLayers().forEach((layer) => {
    if (kActivity.isLayerVisible(layer.name)) {
      onShowLayer(layer)
    }
  })
})
onBeforeUnmount(() => {
  kActivity.$engineEvents.off('layer-shown', onShowLayer)
  kActivity.$engineEvents.off('layer-hidden', onHideLayer)
})
</script>
