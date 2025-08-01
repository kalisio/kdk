<template>
  <div id="globe" :ref="configureGlobe">
    <q-resize-observer @resize="onGlobeResized" />
  </div>
</template>

<script>
import { kdkCore, kdkMap } from '../client.globe.js'

const name = 'globeActivity'
const baseActivityMixin = kdkCore.mixins.baseActivity(name)

export default {
  mixins: [
    kdkMap.mixins.globe.baseGlobe,
    kdkMap.mixins.globe.geojsonLayers,
    kdkMap.mixins.globe.fileLayers,
    kdkMap.mixins.globe.style,
    kdkMap.mixins.globe.tooltip,
    kdkMap.mixins.globe.popup,
    kdkMap.mixins.globe.activity,
    kdkMap.mixins.globe.opendapLayers,
    baseActivityMixin,
    kdkMap.mixins.activity,
    kdkMap.mixins.style,
    kdkMap.mixins.featureService,
    kdkMap.mixins.infobox,
    kdkMap.mixins.weacast,
    kdkMap.mixins.context
  ],
  methods: {
    async configureGlobe (container) {
      // Avoid reentrance during awaited operations
      if (!container || this.globeContainer) return
      this.globeContainer = container
      // Not yet ready wait for capabilities to be there
      if (!this.$store.get('capabilities.api')) return
      const token = this.$store.get('capabilities.api.cesium.token')
      // Wait until viewer is ready
      await this.initializeGlobe(container, token)
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
