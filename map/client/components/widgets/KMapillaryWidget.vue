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
    location: function () {
      this.moveCloseTo(this.location.lat, this.location.lng)
    }
  },
  methods: {
    moveCloseTo (lat, lon) {
      this.mapillaryViewer.moveCloseTo(lat, lon)
      .then(
        (node) => {
          this.onCenterOn()
        }, 
        (error) => {
          this.$toast({ type: 'negative', message: this.$t('KMapillaryWidget.NO_IMAGE_FOUND_CLOSE_TO') })
        } 
      )
    },
    onCenterOn () {
      this.mapillaryViewer.getPosition().then((position) => {
        this.kActivity.center(position.lon, position.lat)
      })
    },
    onMoveCloseToCurrentLocation () {
      const center = this.kActivity.map.getCenter()
      this.moveCloseTo(center.lat, center.lng)
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
      { name: 'moveCloseTo', icon: 'las la-street-view', label: this.$t('KMapillaryWidget.MOVE_CLOSE_TO'), handler: this.onMoveCloseToCurrentLocation }
    ]
  },
  mounted () {
    // Create the viewer
    this.mapillaryViewer = new Mapillary.Viewer('mapillary-container', this.kActivity.mapillaryClientID)
    // Add the marker to the map
    this.kActivity.addMapillaryMarker()
    // Subcribe to node changes
    this.mapillaryViewer.on(Mapillary.Viewer.nodechanged, (node) => {
      this.kActivity.updateMapillaryMarker(node.latLon.lat, node.latLon.lon)
    })
    // Configure the viewer
    if (this.location) {
      this.moveCloseTo(this.location.lat, this.location.lon)
    } else {
      this.onMoveCloseToCurrentLocation()
    }
  },
  beforeDestroy () {
    // Remove the marker
    this.mapillaryViewer.getPosition().then((position) => {
      this.kActivity.saveMapillaryLocation(position.lat, position.lon)
    })
    this.kActivity.removeMapillaryMarker()
  }
}
</script>
