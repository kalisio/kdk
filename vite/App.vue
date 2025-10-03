<template>
  <Suspense>
    <!-- App content (2D) -->
    <MapActivity style="width: 100%; height: 100%; position: fixed; left: 0;"/>
  </Suspense>
</template>

<script setup>
// For debug purpose with src hot reload
//import { kdkCore } from '../client.map.js'
// To test library build
import { kdkCore } from '../client/kdk.client.map.js'
import MapActivity from './MapActivity.vue'

let map, globe, updatingMap, updatingGlobe

kdkCore.composables.useSession()
</script>