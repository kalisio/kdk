<template>
  <div v-for="(legend, name) in legends" key="name">
    <q-expansion-item
      :label="$tie(name)"
      :header-class="legend.headerClass || defaults.headerClass"
      :default-opened="legend.opened || defaults.opened"
      dense
    >
      <div class="q-py-xs q-px-md">
        <component
          :is="legend.renderer"
          :content="legend.content"
        />
      </div>
    </q-expansion-item>
  </div>
</template>

<script setup>
import logger from 'loglevel'
import { inject, ref, onMounted, onBeforeUnmount } from 'vue'
import { loadComponent } from '../../../../core/client/utils.js'

// inject
const kActivity = inject('kActivity')

// props
const props = defineProps({
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
const legends = ref({})

// functions
function getLegend (layer) {
  const legend = layer.legend
  if (legend) {
    // make sure a renderer is assigned to the legend
    const renderer = props.renderers[legend.type]
    if (!renderer) {
      logger.warn(`Cannot find any renderer for the legend of type of ${legend.type}`)
      return
    }
    legend.renderer = loadComponent(renderer)
    // configure the legend with default values
    if (!legend.label) legend.label = layer.name
    if (!legend.headerClass) legend.headerClass = props.headerClass
    if (!legend.opened) legend.opened = props.opened
  }
  return legend
}
function addLegend (layer) {
  const legend = getLegend(layer)
  if (legend) {
    // make sure layer is still visible since it may have been hidden in the meantime ...
    if (kActivity.isLayerVisible(layer.name)) {
      legends.value[layer.name] = legend
    }
  }
}
function removeLegend (layer) {
  if (legends[layer.name]) delete legends[layer.name]
}
function onShowLayer (layer, engineLayer) {
  logger.debug(`show ${layer.name} legend`)
  addLegend(layer)
}
function onHideLayer (layer) {
  logger.debug(`hide ${layer.name} legend'`)
  removeLegend(layer)
}

// hooks
onMounted(() => {
  kActivity.$engineEvents.on('layer-shown', onShowLayer)
  kActivity.$engineEvents.on('layer-hidden', onHideLayer)
  // initial scan of already added layers
  kActivity.getLayers().forEach((layer) => {
    if (kActivity.isLayerVisible(layer.name)) {
      addLegend(layer)
    }
  })
})
onBeforeUnmount(() => {
  kActivity.$engineEvents.off('layer-shown', onShowLayer)
  kActivity.$engineEvents.off('layer-hidden', onHideLayer)
})
</script>
