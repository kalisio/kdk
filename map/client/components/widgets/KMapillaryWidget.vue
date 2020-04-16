<template>
  <div :style="widgetStyle()">
    <q-resize-observer @resize="onResized" />
    <div class="fit row">
      <k-tool-bar class="q-pa-sm" :actions="actions" direction="vertical" dense />
      <div class="col" id="mapillary-container"></div>
    </div>
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
  data () {
    return {
      actions: []
    }
  },
  watch: {
    location: function (location) {
      if (this.mapillaryViewer) this.mapillaryViewer.moveCloseTo(location.lat, location.lng)
    }
  },
  methods: {
    onCenterOn () {
      this.kActivity.centerOnMapillaryLocation()
    },
    onMoveCloseTo () {
      this.kActivity.moveCloseToCurrentLocation()
    },
    onResized (size) {
      if (this.mapillaryViewer) this.mapillaryViewer.resize()
    }
  },
  created () {
    // laod the required components
    this.$options.components['k-tool-bar'] = this.$load('layout/KToolBar')
    // Registers the actions
    this.actions = [
      { name: 'centerOn', icon: 'las la-eye', label: this.$t('KMapillaryWidget.CENTER_ON'), handler: this.onCenterOn },
      { name: 'moveCloseTo', icon: 'las la-street-view', label: this.$t('KMapillaryWidget.MOVE_CLOSE_TO'), handler: this.onMoveCloseTo }
    ]
  },
  mounted () {
    // Create the viewer
    this.mapillaryViewer = new Mapillary.Viewer('mapillary-container', this.kActivity.mapillaryClientID)
    // Add the marker to the map
    this.kActivity.addMapillaryMarker()
    // Subcribe to node changes
    this.mapillaryViewer.on(Mapillary.Viewer.nodechanged, (node) => {
      this.kActivity.updateMapillaryLocation(node.latLon.lat, node.latLon.lon)
    })
    // Configure the viewer
    if (this.location) {
      this.mapillaryViewer.moveCloseTo(this.location.lat, this.location.lng)
      .then(() => this.kActivity.centerOnMapillaryLocation())
      .catch(() => this.$toast({ type: 'negative', message: this.$t('KMapillaryidget.NO_IMAGE_FOUND_CLOSE_TO') }))
    } else {
      this.kActivity.moveCloseToCurrentLocation()
    }
  },
  beforeDestroy () {
    // Remove the marker
    this.kActivity.removeMapillaryMarker()
  }
}
</script>
