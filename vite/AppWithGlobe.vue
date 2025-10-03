<template>
  <div>
    <div v-show="false" id="globe-credit"/>
    <q-btn color="primary" class="fixed-top-left" style="z-index: 1" :label="synchronize ? 'UNSYNC VIEWS' : 'SYNC VIEWS'" @click="onSynchronize"/>
    <Suspense>
      <div>
        <!-- App content (2D) -->
        <MapActivity :ref="onMapCreated" @map-ready="onMapReady" style="width: 50%; height: 100%; position: fixed; left: 0;"/>
        <!-- App content (3D) -->
        <GlobeActivity :ref="onGlobeCreated" @globe-ready="onGlobeReady" style="width: 50%; height: 100%; position: fixed; right: 0;"/>
      </div>
    </Suspense>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// For debug purpose with src hot reload
//import { kdkCore } from '../client.js'
// To test library build
import { kdkCore } from '../client/kdk.client.js'
import MapActivity from './MapActivityWithGlobe.vue'
import GlobeActivity from './GlobeActivity.vue'

let map, globe, updatingMap, updatingGlobe
const synchronize = ref(false)

kdkCore.composables.useSession()

function onSynchronize () {
  synchronize.value = !synchronize.value
}
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
  if (!synchronize.value || updatingMap) return
  updatingMap = true
  const center = map.getCenter()
  globe.center(center.longitude, center.latitude, zoomLevelToAltitude(center.zoomLevel))
  updatingMap = false
}
function updateMap() {
  if (!synchronize.value || updatingGlobe) return
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