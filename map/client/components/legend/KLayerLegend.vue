<template>
  <template v-for="legend in legends" :key="legend.label">
    <div class="q-py-xs q-px-md">
      <component 
        :is="legend.renderer"
        :layer="layer"
        v-bind="legend.props"
      />
    </div>
  </template>
</template>

<script setup>
import _ from 'lodash'
import logger from 'loglevel'
import sift from 'sift'
import { ref, reactive, computed, watch } from 'vue'
import bboxPolygon from '@turf/bbox-polygon'
import intersects from '@turf/boolean-intersects'
import { featureEach } from '@turf/meta'
import { useCurrentActivity } from '../../composables'
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

// Data
const { CurrentActivity } = useCurrentActivity({ selection: false, probe: false })
const layerHasVisibleFeatures = ref(false)
const filterHasVisibleFeatures = reactive({})
const requestRefresh = _.debounce(refresh, 300)

// Computed
const legends = computed(() => {
  const result = []
  const hideWhenNoFeaturesVisible = _.get(props.layer, 'hideLegendWhenNoFeaturesVisible', true)
  if (hideWhenNoFeaturesVisible && !layerHasVisibleFeatures.value) return result
  let layerLegends = props.layer.legend || []
  if (!Array.isArray(layerLegends)) layerLegends = [layerLegends]
  // Check if layer has filters with own legend
  if (Array.isArray(props.layer.filters)) {
    props.layer.filters.forEach((filter) => {
      // Include when filter is active, has a legend and has feature
      if (!filter.isActive || !filter.legend || (hideWhenNoFeaturesVisible && !filterHasVisibleFeatures[filter.label])) return
      const filterLegends = Array.isArray(filter.legend) ? filter.legend : [filter.legend]
      layerLegends.push(...filterLegends)
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
    const inMaxZoomRange = (hasMaxZoom ? props.zoom < maxZoom : true)
    if (inMinZoomRange && inMaxZoomRange) {
      logger.debug(`[KDK] Rendering '${props.layer.name}' legend`)
      const renderer = props.renderers[legend.type]
      if (!renderer) {
        logger.warn(`[KDK] Cannot find any renderer for the layer's legend of type of ${legend.type}`)
        return
      }
      result.push({
        renderer: coreUtils.loadComponent(renderer),
        props: _.omit(legend, ['minZoom', 'maxZoom']) // Pass through additional legend props
      })
    }
  })
  return result
})

// Watch
watch(CurrentActivity, (newActivity, oldActivity) => {
  if (oldActivity) {
    oldActivity.value.$engineEvents.off('moveend', requestRefresh)
  }
  if (newActivity) {
    newActivity.$engineEvents.on('moveend', requestRefresh)
  }
}, { immediate: true })

// Function
function refresh() {
  if (!CurrentActivity.value) return
  // Check if any feature of the layer is visible in current map bounds
  const [[south, west], [north, east]] = CurrentActivity.value.getBounds()
  const bounds = bboxPolygon([west, south, east, north])
  const geoJson = CurrentActivity.value.toGeoJson(props.layer.name)
  layerHasVisibleFeatures.value = false
  // Check if layer has filters with own legend
  if (Array.isArray(props.layer.filters)) {
    props.layer.filters.forEach((filter) => {
      // Include when filter is active and has a legend
      if (!filter.isActive || !filter.legend) { return }
      filterHasVisibleFeatures[filter.label] = false
    })
  }
  featureEach(geoJson, (feature) => {
    const isFeatureInBounds = intersects(feature, bounds)
    // If at least one feature found for layer no need to test more
    if (!layerHasVisibleFeatures.value && isFeatureInBounds) {
      layerHasVisibleFeatures.value = true
    }
    // Check if feature match any filter as well
    if (Array.isArray(props.layer.filters)) {
      props.layer.filters.forEach((filter) => {
        // Include when filter is active and has a legend
        if (!filter.isActive || !filter.legend) return
        // If at least one feature found for filter no need to test more
        if (!filterHasVisibleFeatures[filter.label] && isFeatureInBounds) {
          const filteredFeatures = [feature].filter(sift(filter.active))
          if (!_.isEmpty(filteredFeatures)) {
            filterHasVisibleFeatures[filter.label] = true
          }
        }
      })
    }
  })
}

// Immediate
refresh()
</script>
