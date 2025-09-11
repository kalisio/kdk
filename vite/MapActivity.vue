<template>
  <div id="map" :ref="configureMap">
    <q-resize-observer @resize="onMapResized" />
  </div>
</template>

<script>
// For debug purpose with src hot reload
//import { kdkCore, kdkMap } from '../client.map.js'
// To test library build
import { kdkCore, kdkMap } from '../client/kdk.client.map.js'

const name = 'mapActivity'
const baseActivityMixin = kdkCore.mixins.baseActivity(name)

export default {
  mixins: [
    kdkMap.mixins.map.baseMap,
    kdkMap.mixins.map.canvasLayers,
    kdkMap.mixins.map.geojsonLayers,
    kdkMap.mixins.map.heatmapLayers,
    kdkMap.mixins.map.fileLayers,
    kdkMap.mixins.map.editLayers,
    kdkMap.mixins.map.style,
    kdkMap.mixins.map.tooltip,
    kdkMap.mixins.map.popup,
    kdkMap.mixins.map.activity,
    kdkMap.mixins.map.tiledMeshLayers,
    kdkMap.mixins.map.tiledWindLayers,
    kdkMap.mixins.map.mapillaryLayers,
    kdkMap.mixins.map.gsmapLayers,
    kdkMap.mixins.map.pmtilesLayers,
    baseActivityMixin,
    kdkMap.mixins.activity,
    kdkMap.mixins.style,
    kdkMap.mixins.featureService,
    kdkMap.mixins.infobox,
    kdkMap.mixins.weacast,
    kdkMap.mixins.levels,
    kdkMap.mixins.context
  ],
  methods: {
    async configureMap (container) {
      // Avoid reentrance during awaited operations
      if (!container || this.mapContainer) return
      this.mapContainer = container
      // Wait until map is ready
      await this.initializeMap(container)
    }
  },
  created () {
    this.setCurrentActivity(this)
  },
  async setup () {
    const activity = kdkMap.composables.useActivity(name)
    const expose = {
      ...activity,
      ...activity.CurrentActivityContext
    }
    return expose
  }
}
</script>
