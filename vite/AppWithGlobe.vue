<template>
  <!--KWelcome /-->
  <Suspense>
    <div>
      <!-- App content (2D) -->
      <MapActivity :ref="onMapCreated" @map-ready="onMapReady" style="width: 50%; height: 100%; position: fixed; left: 0;"/>
      <!-- App content (3D) -->
      <GlobeActivity :ref="onGlobeCreated" @globe-ready="onGlobeReady" style="width: 50%; height: 100%; position: fixed; right: 0;"/>
    </div>
  </Suspense>
</template>

<script setup>
import { ref } from 'vue'
import { kdkCore } from '../client.js'
import KWelcome from '../core/client/components/app/KWelcome.vue'
import MapActivity from './MapActivity.vue'
import GlobeActivity from './GlobeActivity.vue'

let map, globe, updatingMap, updatingGlobe

kdkCore.composables.useSession()

function onMapCreated (ref) {
  if (ref && !map) {
    map = ref
  }
}
function onGlobeCreated (ref) {
  if (ref && !globe) {
    globe = ref
  }
}
function onMapReady () {
  map.$engineEvents.on('map-ready', () => {
    map.map.on('moveend', updateGlobe)
  })
}
function onGlobeReady () {
  globe.$engineEvents.on('globe-ready', () => {
    globe.viewer.camera.moveEnd.addEventListener(updateMap)
  })
}
function updateGlobe() {
  if (updatingMap) return
  updatingMap = true
  const center = map.getCenter()
  globe.center(center.longitude, center.latitude, zoomLevelToAltitude(center.zoomLevel))
  updatingMap = false
}
function updateMap() {
  if (updatingGlobe) return
  updatingGlobe = true
  const center = globe.getCenter()
  map.center(center.longitude, center.latitude, altitudeToZoomLevel(center.altitude))
  updatingGlobe = false
}
// Empirical formula found on https://stackoverflow.com/questions/36544209/converting-altitude-to-z-level-and-vice-versa
function altitudeToZoomLevel(altitude) {
  var A = 40487.57
  var B = 0.00007096758
  var C = 91610.74
  var D = -40467.74

  return D+(A-D)/(1+Math.pow(altitude/C, B))
}
function zoomLevelToAltitude(zoomLevel) {
  var A = 40487.57
  var B = 0.00007096758
  var C = 91610.74
  var D = -40467.74

  return C * Math.pow((A-D)/(zoomLevel-D) -1, 1/B)
}
</script>