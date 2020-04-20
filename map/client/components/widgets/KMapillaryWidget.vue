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
import moment from 'moment'
import logger from 'loglevel'
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
    async moveCloseTo (lat, lon) {
      try {
        const node = await this.mapillaryViewer.moveCloseTo(lat, lon)
        await this.onCenterOn()
      } catch (error) {
        logger.error(error)
        this.$toast({ type: 'negative', message: this.$t('KMapillaryWidget.NO_IMAGE_FOUND_CLOSE_TO') })
      }
    },
    setupViewerFilters () {
      // Not yet initialized ?
      if (!this.mapillaryViewer || !this.kActivity.mapillaryLayer) return
      // Update viewer filters
      const endTime = this.kActivity.currentTime || moment.utc()
      const startTime = endTime.clone().add(moment.duration(_.get(this.kActivity.mapillaryLayer, 'queryFrom', 'P-1Y'))) // 1 year back by default
      this.mapillaryViewer.setFilter(['all',
        ['>=', 'capturedAt', startTime.valueOf()],
        ['<=', 'capturedAt', endTime.valueOf()],
      ])
    },
    async onCenterOn () {
      const position = await this.mapillaryViewer.getPosition()
      this.kActivity.center(position.lon, position.lat)
    },
    onMoveCloseToCurrentLocation () {
      const center = this.kActivity.map.getCenter()
      this.moveCloseTo(center.lat, center.lng)
    },
    onResized (size) {
      if (this.mapillaryViewer) this.mapillaryViewer.resize()
    },
    onNodeChanged (node) {
      this.kActivity.updateMapillaryMarker(node.latLon.lat, node.latLon.lon)
    },
    onCurrentTimeChanged (time) {
      this.setupViewerFilters()
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
    this.setupViewerFilters()
    // Add the marker to the map
    this.kActivity.addMapillaryMarker()
    // Subcribe to changes
    this.mapillaryViewer.on(Mapillary.Viewer.nodechanged, this.onNodeChanged)
    this.kActivity.$on('current-time-changed', this.onCurrentTimeChanged)
    // Configure the viewer
    if (this.location) {
      this.moveCloseTo(this.location.lat, this.location.lon)
    } else {
      this.onMoveCloseToCurrentLocation()
    }
  },
  async beforeDestroy () {
    this.mapillaryViewer.off(Mapillary.Viewer.nodechanged, this.onNodeChanged)
    this.kActivity.$off('current-time-changed', this.onCurrentTimeChanged)
    // Remove the marker
    this.kActivity.removeMapillaryMarker()
    // And save position
    const position = await this.mapillaryViewer.getPosition()
    this.kActivity.saveMapillaryLocation(position.lat, position.lon)
  }
}
</script>
