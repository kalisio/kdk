<template>
  <template v-for="legend in legends" :key="legend.label">
    <div class="q-py-xs q-px-md">
      <component
        :is="legend.renderer"
        :layer="layer"
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
  // Check if layer has filters with own legend
  if (Array.isArray(props.layer.filters)) {
    props.layer.filters.forEach((filter) => {
      // Include when filter is active and has a legend
      if (!filter.isActive || !filter.legend)
        return
      layerLegends.push(...filter.legend)
    })
  }
  layerLegends.forEach(legend => {
    const minZoom = _.get(legend, 'minZoom', _.get(props.layer, `${props.engine}.minZoom`, 0))
    const maxZoom = _.get(legend, 'maxZoom', _.get(props.layer, `${props.engine}.maxZoom`, 99))
    // Check for valid number on min/max zoom level as we might set it to false/null to indicate
    // there is none and we should use defaults
    const hasMinZoom = _.isNumber(minZoom)
    const hasMaxZoom = _.isNumber(maxZoom)
    const inMinZoomRange = (hasMinZoom ? props.zoom >= minZoom : true)
    const inMaxZoomRange = (hasMaxZoom ? props.zoom <= maxZoom : true)
    if (inMinZoomRange && inMaxZoomRange) {
      logger.debug(`[KDK] Register '${props.layer.name}'`)
      const renderer = props.renderers[legend.type]
      if (!renderer) {
        logger.warn(`[KDK] Cannot find any renderer for the layer's legend of type of ${legend.type}`)
        return
      }
      result.push({
        layer: props.layer,
        label: legend.label,
        content: legend.content,
        renderer: coreUtils.loadComponent(renderer)
      })
    }
  })
  return result
})
</script>
