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
import L from 'leaflet'
import moment from 'moment'
import logger from 'loglevel'
import * as Mapillary from 'mapillary-js'
import 'mapillary-js/dist/mapillary.min.css'
import { baseWidget } from '../../../../core/client/mixins'

export default {
  name: 'k-mapillary-viewer',
  inject: ['kActivity'],
  mixins: [baseWidget],
  data () {
    return {
      selection: this.$store.get('selection'),
      actions: []
    }
  },
  watch: {
    'selection.location': function () {
      this.refresh()
    }
  },
  methods: {
    saveStates () {
      this.$store.set('selection.states.mapillary', {
        location: this.location,
        bearing: this.bearing,
        key: this.key
      })
    },
    restoreStates () {
      const states = this.$store.get('selection.states.mapillary')
      this.location = states.location
      this.bearing = states.bearing
      this.key = states.key
    },
    getMarkerFeature () {
      const lat = this.location ? this.location.lat : 0
      const lon = this.location ? this.location.lng : 0
      const bearing = 225 + this.bearing || 0
      return {
        type: 'Feature',
        properties: {
          'icon-html': `<img style="${L.DomUtil.TRANSFORM}: translateX(-20px) translateY(-20px) rotateZ(${bearing}deg); width: 40p; height: 40px;" src="./statics/mapillary-marker.png">`
        },
        geometry: {
          type: 'Point',
          coordinates: [lon, lat]
        }
      }
    },
    async refresh () {
      if (_.has(this.selection, 'states.mapillary')) {
        this.restoreStates()
        if (this.key) await this.moveToKey(this.key)
        else if (this.location) await this.moveCloseTo(this.location.lat, this.location.lng)
      } else {
        const location = this.selection.location
        if (location) await this.moveCloseTo(location.lat, location.lng)
      }
      /* if (this.key) await this.moveToKey(this.key)
      else if (this.location) await this.moveCloseTo(this.location.lat, this.location.lng)
      this.onCenterOn()
      this.kActivity.addSelectionHighlight('mapillary', this.getMarkerFeature()) */
    },
    async moveToKey (key) {
      try {
        await this.mapillaryViewer.moveToKey(key)
        this.onCenterOn()
        this.kActivity.addSelectionHighlight('mapillary', this.getMarkerFeature())
      } catch (error) {
        logger.error(error)
        this.$toast({ type: 'negative', message: this.$t('KMapillaryWidget.NO_IMAGE_FOUND') })
      }
    },
    async moveCloseTo (lat, lon) {
      try {
        await this.mapillaryViewer.moveCloseTo(lat, lon)
        this.onCenterOn()
        this.kActivity.addSelectionHighlight('mapillary', this.getMarkerFeature())
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
        ['<=', 'capturedAt', endTime.valueOf()]
      ])
    },
    onCenterOn () {
      if (this.location) this.kActivity.center(this.location.lng, this.location.lat)
    },
    onResized (size) {
      if (this.mapillaryViewer) this.mapillaryViewer.resize()
    },
    async onNodeChanged (node) {
      this.location = L.latLng(node.latLon.lat, node.latLon.lon)
      this.bearing = await this.mapillaryViewer.getBearing()
      this.kActivity.updateSelectionHighlight('mapillary', this.getMarkerFeature())
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
      { name: 'centerOn', icon: 'las la-eye', label: this.$t('KMapillaryWidget.CENTER_ON'), handler: this.onCenterOn }
    ]
  },
  mounted () {
    // Create the viewer
    this.mapillaryViewer = new Mapillary.Viewer('mapillary-container', this.kActivity.mapillaryClientID)
    this.setupViewerFilters()
    // Add event listeners
    this.mapillaryViewer.on(Mapillary.Viewer.nodechanged, this.onNodeChanged)
    this.kActivity.$on('current-time-changed', this.onCurrentTimeChanged)
    // Configure the viewer
    this.location = undefined
    this.bearing = undefined
    this.key = undefined
    this.refresh()
  },
  async beforeDestroy () {
    // Remove event listeners
    this.mapillaryViewer.off(Mapillary.Viewer.nodechanged, this.onNodeChanged)
    this.kActivity.$off('current-time-changed', this.onCurrentTimeChanged)
    // Remove the marker
    this.kActivity.removeSelectionHighlight('mapillary')
    // Save the states
    this.saveStates()
  }
}
</script>
