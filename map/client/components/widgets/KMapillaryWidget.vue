<template>
  <div id="mapillary-container" :style="widgetStyle()">
    <q-resize-observer @resize="onResized" />
  </div>
</template>

<script>
import _ from 'lodash'
import * as Mapillary from 'mapillary-js'
import 'mapillary-js/dist/mapillary.min.css'
import { baseWidget } from '../../../../core/client/mixins'

export default {
  name: 'k-mapillary-widget',
  inject: ['kActivity'],
  mixins: [baseWidget],
  props: {
    location: {
      type: Object,
      default: () => { return null }
    }
  },
  watch: {
    location: function (location) {
      if (this.mapillaryViewer) this.mapillaryViewer.moveCloseTo(location.lat, location.lng)
    }
  },
  methods: {
    onResized () {
      if (this.mapillaryViewer) this.mapillaryViewer.resize()
    }
  },
  created () {
    // override the default widget height
    this.widgetHeight = '40vh'
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
