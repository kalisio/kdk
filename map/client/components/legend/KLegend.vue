<template>
  <div v-for="(legend, name) in legends" key="name">
    <q-expansion-item
      :label="$tie(name)"
      :header-class="legend.headerClass || defaults.headerClass"
      :default-opened="legend.opened || defaults.opened"
      dense
    >
      <div class="q-py-xs q-px-md row full-width">
        <component
          :is="legend.component"
          :content="legend.content"
        />
      </div>
    </q-expansion-item>
  </div>
</template>

<script setup>
import _ from 'lodash'
import logger from 'loglevel'
import { inject, ref, onMounted, onBeforeUnmount } from 'vue'
import { loadComponent } from '../../../../core/client/utils.js'
import { Legend } from '../../legend.js'

// inject
const kActivity = inject('kActivity')

// data
const legends = ref({})
const defaults = _.defaults(kActivity.activityOptions.legend, {
  opened: true,
  headerClass: 'bg-grey-3 text-weight-regular'
})

// functions
function getLegend (layer) {
  const legend = layer.legend
  if (legend) {
    // make sure a component is assigned to the legend
    const component = Legend.get(legend.type)
    if (!component) {
      logger.warn(`The legend of type of ${legend.type} is not registered`)
      return
    }
    legend.component = loadComponent(component)
    legend.name = layer.name
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
