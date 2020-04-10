<template>
  <div id="mapillary-container" :style="widgetStyle">
    <q-resize-observer @resize="onResized" />
  </div>
</template>

<script>
import * as Mapillary from 'mapillary-js'
import 'mapillary-js/dist/mapillary.min.css'

export default {
  name: 'k-mapillary-viewer',
  inject: [
    'kActivity',
    'kWindow'
  ],
  props: {
    location: {
      type: Object,
      default: () => { return null }
    },
    mode: {
      type: String,
      default: 'minimized',
      validator: (value) => {
        return ['minimized', 'maximized'].includes(value)
      }
    }
  },
  watch: {
    location: function (location) {
      if (this.mapillaryViewer) this.mapillaryViewer.moveCloseTo(location.lat, location.lng)
    }
  },
  computed: {
    widgetStyle () {
      if (this.mode === 'minimized') return 'min-height: 35vh;'
      else return 'width: 100vw; height: 100vh'
    }
  },
  methods: {
    onResized () {
      if (this.mapillaryViewer) this.mapillaryViewer.resize()
    }
  },
  mounted () {
    // Create the viewer
    this.mapillaryViewer = new Mapillary.Viewer('mapillary-container', this.kActivity.mapillaryClientID)
    // Add the marker to the map
    this.kActivity.addMapillaryMarker()
    // Subcribe to node changes
    this.mapillaryViewer.on(Mapillary.Viewer.nodechanged, (node) => {
      this.kActivity.updateMapillaryMarker(node.latLon.lat, node.latLon.lon)
      this.kActivity.center(node.latLon.lon, node.latLon.lat)
    })
    // Configure the viewer
    if (this.location) this.mapillaryViewer.moveCloseTo(this.location.lat, this.location.lng)
  },
  beforeDestroy () {
    // Remove the marker
    this.kActivity.removeMapillaryMarker()
  }
}
</script>
