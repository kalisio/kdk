<template>
  <div id="mapillary-widget" class="column" :style="widgetStyle">
    <div class="col" id="mapillary-container" />
  </div>
</template>

<script>
import _ from 'lodash'
import L from 'leaflet'
import logger from 'loglevel'
import { Viewer } from 'mapillary-js'
import 'mapillary-js/dist/mapillary.css'
import distance from '@turf/distance'
import { point } from '@turf/helpers'
import { baseWidget } from '../../../../core/client/mixins'
import { KPanel } from '../../../../core/client/components'

export default {
  name: 'k-mapillary-viewer',
  inject: ['kActivity'],
  components: {
    KPanel
  },
  mixins: [baseWidget],
  data () {
    return {
      selection: this.$store.get('selection')
    }
  },
  watch: {
    'selection.location': function () {
      this.refresh()
    },
    widgetHeight: {
      handler () {
        if (this.mapillaryViewer) this.mapillaryViewer.resize()
      }
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
          'icon-html': `<img style="${L.DomUtil.TRANSFORM}: translateX(-20px) translateY(-20px) rotateZ(${bearing}deg); width: 40p; height: 40px;" src="/icons/kdk/mapillary-marker.png">`
        },
        geometry: {
          type: 'Point',
          coordinates: [lon, lat]
        }
      }
    },
    refreshActions () {
      this.$store.patch('window', {
        widgetActions: [
          {
            id: 'center',
            icon: 'las la-eye',
            tooltip: 'KMapillaryViewer.CENTER_ON',
            visible: !_.isNil(this.imageId),
            handler: this.centerMap
          }
        ]
      })
    },
    async refresh () {
      // Refresh the actions
      this.refreshActions()
      if (_.has(this.selection, 'states.mapillary')) {
        this.restoreStates()
        if (this.imageId) await this.refreshView()
        else if (this.location) await this.moveCloseTo(this.location.lat, this.location.lng)
      } else {
        const location = this.selection.location
        if (location) await this.moveCloseTo(location.lat, location.lng)
      }
      // Refresh the actions
      this.refreshActions()
    },
    async moveCloseTo (lat, lon) {
      // Query the images according a bbox that contains the given position
      const buffer = 0.0002 // around 25m
      const left = lon - buffer
      const right = lon + buffer
      const top = lat + buffer
      const bottom = lat - buffer
      const token = this.kActivity.mapillaryToken
      const query = `https://graph.mapillary.com/images?fields=id,computed_geometry&bbox=${left},${bottom},${right},${top}&access_token=${token}&limit=50`
      const response = await fetch(query)
      if (response.status !== 200) {
        throw new Error(`Impossible to fetch ${query}: ` + response.status)
      }
      const data = await response.json()
      const imageCount = data.data.length
      // If any results then search for the nearest image
      if (imageCount > 0) {
        const clickedPosition = point([lon, lat])
        let minDist
        _.forEach(data.data, image => {
          const dist = distance(clickedPosition, image.computed_geometry)
          if (!minDist || dist < minDist) {
            minDist = dist
            this.imageId = image.id
          }
        })
        this.refreshView()
      } else {
        this.$toast({ type: 'negative', message: this.$t('KMapillaryViewer.NO_IMAGE_FOUND_CLOSE_TO') })
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
      const image = viewerImageEvent.image
      this.imageId = image.id
      this.location = image.lngLat
      this.bearing = await this.mapillaryViewer.getBearing()
      this.centerMap()
      this.kActivity.updateSelectionHighlight('mapillary', this.getMarkerFeature())
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
  async beforeUnmount () {
    // Remove event listeners
    this.mapillaryViewer.off('image', this.onImageEvent)
    // Remove the marker
    this.kActivity.removeSelectionHighlight('mapillary')
    // Save the states
    this.saveStates()
  }
}
</script>
