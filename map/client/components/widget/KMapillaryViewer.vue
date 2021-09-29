<template>
  <div :style="widgetStyle()">
    <div class="fit row">
      <k-panel id="mapillary-actions" class="q-pa-sm" :content="actions" direction="vertical" />
      <div class="col" id="mapillary-container"></div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import L from 'leaflet'
import logger from 'loglevel'
import { Viewer } from 'mapillary-js'
import 'mapillary-js/dist/mapillary.css'
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
        imageId: this.imageId
      })
    },
    restoreStates () {
      const states = this.$store.get('selection.states.mapillary')
      this.location = states.location
      this.bearing = states.bearing
      this.imageId = states.imageId
    },
    getMarkerFeature () {
      const lat = this.location ? this.location.lat : 0
      const lon = this.location ? this.location.lng : 0
      const bearing = 225 + this.bearing || 0
      return {
        type: 'Feature',
        properties: {
          'icon-html': `<img style="${L.DomUtil.TRANSFORM}: translateX(-20px) translateY(-20px) rotateZ(${bearing}deg); width: 40p; height: 40px;" src="${this.$load('icons/mapillary-marker.png', 'asset')}">`
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
        if (this.imageId) await this.refreshView()
        else if (this.location) await this.moveCloseTo(this.location.lat, this.location.lng)
      } else {
        const location = this.selection.location
        if (location) await this.moveCloseTo(location.lat, location.lng)
      }
    },
    async moveCloseTo (lat, lon) {
      const distance = 0.0001
      const left = lon - distance
      const right = lon + distance
      const top = lat + distance
      const bottom = lat - distance
      const token = this.kActivity.mapillaryToken
      const query = `https://graph.mapillary.com/images?fields=id,computed_geometry&bbox=${left},${bottom},${right},${top}&access_token=${token}`
      const response = await fetch(query)
      if (response.status !== 200) {
        throw new Error(`Impossible to fetch ${query}: ` + response.status)
      }
      const data = await response.json()
      const imageCount = data.data.length
      if (imageCount > 0) {
        this.imageId = data.data[0].id
        this.refreshView()
      } else {
        this.$toast({ type: 'negative', message: this.$t('KMapillaryWidget.NO_IMAGE_FOUND_CLOSE_TO') })
      }
    },
    centerMap () {
      if (this.location) this.kActivity.center(this.location.lng, this.location.lat)
    },
    async refreshView () {
      this.kActivity.addSelectionHighlight('mapillary', this.getMarkerFeature())
      try {
        await this.mapillaryViewer.moveTo(this.imageId)
      } catch (error) {
        logger.error(error)
      }
    },
    onCurrentTimeChanged (time) {
      this.setupViewerFilters()
    },
    async onImageEvent (viewerImageEvent) {
      const image = viewerImageEvent.image;
      this.imageId = image.id
      this.location = image.lngLat
      this.bearing = await this.mapillaryViewer.getBearing()
      this.centerMap()
      this.kActivity.updateSelectionHighlight('mapillary', this.getMarkerFeature())
    }
  },
  beforeCreate () {
    // laod the required components
    this.$options.components['k-panel'] = this.$load('frame/KPanel')
  },
  created () {
    // Registers the actions
    this.actions = {
      default: [
        { id: 'center', icon: 'las la-eye', tooltip: this.$t('KMapillaryWidget.CENTER_ON'), handler: this.centerMap }
      ]
    }
  },
  mounted () {
    // Create the viewer
    this.mapillaryViewer = new Viewer({
      container: 'mapillary-container', 
      accessToken: this.kActivity.mapillaryToken
    })
    // Add event listeners
    this.mapillaryViewer.on('image', this.onImageEvent)
    // Configure the viewer
    this.location = undefined
    this.bearing = undefined
    this.key = undefined
    this.refresh()
  },
  async beforeDestroy () {
    // Remove event listeners
    this.mapillaryViewer.off('image', this.onNodeChanged)
    // Remove the marker
    this.kActivity.removeSelectionHighlight('mapillary')
    // Save the states
    this.saveStates()
  }
}
</script>
