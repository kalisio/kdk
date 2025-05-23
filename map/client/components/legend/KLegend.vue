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
          <q-item-section v-if="sublegend.helper" side >
            <KAction
              :id="sublegend.name + '-helper'"
              color="primary"
              :propagate="false"
              :icon="getHelperIcon(sublegend.helper)"
              :tooltip="getHelperTooltip(sublegend.helper)"
              :url="getHelperUrl(sublegend.helper)"
              :dialog="getHelperDialog(sublegend.helper)"
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
import { ref, computed, watch } from 'vue'
import { i18n } from '../../../../core/client'
import { getLayersBySublegend } from '../../utils'
import { useCurrentActivity } from '../../composables'
import KLayerLegend from './KLayerLegend.vue'

// Props
const props = defineProps({
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
        variables: 'legend/KVariablesLegend'
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
const layersBySublegend = computed(() => getLayersBySublegend(layers.value, sublegends.value))

// Watch
watch([() => props.sublegends, () => props.sublegendsFromCatalog], async () => {
  // Retrieve the legends from catalog if required
  if (props.sublegendsFromCatalog) {
    sublegends.value = await CurrentActivity.value.getCatalogSublegends()
  } else {
    sublegends.value = []
  }
  sublegends.value = _.uniqBy(_.concat(sublegends.value, props.sublegends), 'name')
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

// Functions
function onShowLayer (layer, engine) {
  const layerLegend = layer.legend
  // check whether the layer has a legend
  if (!layerLegend) return
  // check whether the legend is already registered for that layer
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
function getHelperIcon (helper) {
  return _.get(helper, 'icon', undefined)
}
function getHelperTooltip (helper) {
  return _.get(helper, 'tooltip', '')
}
function getHelperUrl (helper) {
  return _.get(helper, 'url', null)
}
function getHelperDialog (helper) {
  return _.get(helper, 'dialog', null)
}
</script>
