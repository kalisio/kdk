<template>
  <template v-for="legend in legends" :key="legend.label">
    <div class="q-py-xs q-px-md">
      <component
        :is="legend.renderer"
        :label="legend.label"
        :content="legend.content"
      />
    </div>
  </template>
</template>

<script setup>
import _ from 'lodash'
import logger from 'loglevel'
import { computed } from 'vue'
import { utils as coreUtils } from '../../../../core/client'

// Props
const props = defineProps({
  layer: {
    type: Object,
    required: true
  },
  zoom: {
    type: Number,
    default: undefined
  },
  engine: {
    type: String,
    required: true
  },
  renderers: {
    type: Object,
    required: true
  }
})

// Computed
const legends = computed(() => {
  const result = []
  let layerLegends = props.layer.legend || []
  if (!Array.isArray(layerLegends)) layerLegends = [layerLegends]
  layerLegends.forEach(legend => {
    if (!legend.content) {
      logger.warn(`[KDK] Legend ${legend.label} for ${props.layer.name} has no content`)
      return
    }
    const minZoom = _.get(legend, 'minZoom', _.get(props.layer, `${props.engine}.minZoom`, 0))
    const maxZoom = _.get(legend, 'maxZoom', _.get(props.layer, `${props.engine}.maxZoom`, 99))
    if (props.zoom >= minZoom && props.zoom <= maxZoom) {
      logger.debug(`[KDK] Register '${props.layer.name}' legend ${legend.label}`)
      const renderer = props.renderers[legend.type]
      if (!renderer) {
        logger.warn(`[KDK] Cannot find any renderer for the layer's legend of type of ${legend.type}`)
        return
      }
      legend.renderer = coreUtils.loadComponent(renderer)
      result.push(legend)
    }
  })
  return result
})
</script>