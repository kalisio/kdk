<template>
  <div class="column no-wrap" v-if="zoom">
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
        <template v-slot:header>
          <!-- Label -->
          <q-item-section>
            {{ $tie(sublegend.name) }}
          </q-item-section>
          <!-- Helper -->
          <q-item-section v-if="hasSublegendHelper(sublegend)" side >
            <q-btn 
              color="primary"
              flat
              round
              :icon="sublegend.helper.icon"
              @click.native.stop="onSublegendHelperClicked(sublegend)"
            />
          </q-item-section>
        </template>
        <!-- legend components by layers -->
        <template v-for="layer in layersBySublegend[sublegend.name]" :key="layer.name" class="column full-width">
          <KLayerLegend 
            :layer ="layer" 
            :zoom="zoom" 
            :engine="engine" 
            :renderers="renderers"
          /> 
        </template>
      </q-expansion-item>
    </template>
  </div>
</template>

<script setup>
import _ from 'lodash'
import logger from 'loglevel'
import sift from 'sift'
import { Dialog } from 'quasar'
import { ref, computed, watch } from 'vue'
import { i18n, api } from '../../../../core/client'
import { useCurrentActivity } from '../../composables'
import KLayerLegend from './KLayerLegend.vue'

// Props
const props = defineProps({
  contextOrId: {
    type: String,
    default: undefined
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
        symbols: 'legend/KSymbolsLegend',
        variable: 'legend/KVariableLegend'
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
  const layerLegend = layer.legend
  // Check whether the layer has a legend
  if (!layerLegend) return
  // Check wehther the legend is already registered for that layer
  if (_.find(layers.value, { name: layer.name })) {
    logger.warn(`[KDK] Legend for ${layer.name} already resgistered`)
    return
  }
  logger.debug(`[KDK] Register '${layer.name}' legend`)
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
function hasSublegendHelper (sublegend) {
  return !_.isEmpty(_.get(sublegend, 'helper', {}))
}
function onSublegendHelperClicked (sublegend) {
  if (_.has(sublegend.helper, 'url')) window.open(sublegend.helper.url, '_blank')
  if (_.has(sublegend.helper, 'dialog')) {
    Dialog.create({
      title: i18n.t(sublegend.helper.dialog.title),
      message: i18n.t(sublegend.helper.dialog.message),
      html: true,
      persistent: true
    })
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
