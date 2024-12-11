<template>
  <KLocationSearch
    v-model="location"
    :geocoders="geocoders"
    :autofocus="autofocus"
    :style="computedStyle"
  />
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { uid, getCssVar, useQuasar } from 'quasar'
import bbox from '@turf/bbox'
import KLocationSearch from '../location/KLocationSearch.vue'
import { useCurrentActivity } from '../../composables'

// Data
const $q = useQuasar()
const { CurrentActivity } = useCurrentActivity()
const location = ref(null)
const LocationLayerName = uid()

// Props
defineProps({
  geocoders: {
    type: Array,
    default: () => []
  },
  autofocus: {
    type: Boolean,
    default: false
  }
})

// Computed
const computedStyle = computed(() => {
  if ($q.screen.lt.md) return 'width: 80vw'
  if ($q.screen.lt.lg) return 'width: 60vw'
  return 'width: 50vw'
})

// Functions
async function createLocationLayer () {
  // create the layer
  const style = CurrentActivity.value.activityOptions.engine.style.location
  await CurrentActivity.value.addLayer({
    name: LocationLayerName,
    type: 'OverlayLayer',
    scope: 'system',
    isSelectable: false,
    leaflet: {
      type: 'geoJson',
      isVisible: true,
      realtime: true,
      interactive: false,
      style,
      popup: { template: '<%= properties.name %>' }
    },
    cesium: {
      type: 'geoJson',
      isVisible: true,
      realtime: true,
      // FIXME: should use the style
      // style,
      'marker-symbol': 'marker',
      'marker-color': getCssVar('primary'),
      popup: { template: '<%= properties.name %>' }
    }
  })
  // updated the layer with the location
  CurrentActivity.value.updateLayer(LocationLayerName, {
    type: 'FeatureCollection',
    features: [Object.assign({ _id: LocationLayerName + '-marker' }, location.value)]
  })
  // show the layer
  if (!CurrentActivity.value.isLayerVisible(LocationLayerName)) await CurrentActivity.value.showLayer(LocationLayerName)
  // zoom to the location
  const geometry = location.value.geometry
  if (geometry.type === 'Point') {
    const zoomOrDist = CurrentActivity.value.is2D() ? 18 : 75
    const lng = location.value.geometry.coordinates[0]
    const lat = location.value.geometry.coordinates[1]
    CurrentActivity.value.center(lng, lat, zoomOrDist)
  } else {
    CurrentActivity.value.zoomToBBox(bbox(location.value))
  }
}

async function removeLocationLayer () {
  if (CurrentActivity.value) await CurrentActivity.value.removeLayer(LocationLayerName)
}

// Watchers
watch(location, async (newLocation, previousLocation) => {
  if (previousLocation) await removeLocationLayer()
  if (newLocation) await createLocationLayer()
})

// Hooks
onBeforeUnmount(async () => {
  if (location.value) await removeLocationLayer()
})
</script>
