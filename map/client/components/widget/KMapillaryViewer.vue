<template>
  <div id="mapillary-widget" class="column">
    <q-resize-observer @resize="onResized" />
    <div
      class="col"
      id="mapillary-container"
    />
  </div>
</template>

<script>
import _ from 'lodash'
import logger from 'loglevel'
import { ref } from 'vue'
import { Viewer } from 'mapillary-js'
import 'mapillary-js/dist/mapillary.css'
import distance from '@turf/distance'
import { point } from '@turf/helpers'
import { KPanel } from '../../../../core/client/components'
import { useCurrentActivity, useHighlight } from '../../composables'

export default {
  components: {
    KPanel
  },
  computed: {
    location () {
      return this.hasSelectedLocation() && this.getSelectedLocation()
    }
  },
  watch: {
    location: {
      handler () {
        this.refresh()
      }
    }
  },
  methods: {
    saveStates () {
      this.selection.mapillary = {
        position: this.position,
        bearing: this.bearing,
        imageId: this.imageId
      }
    },
    restoreStates () {
      const states = this.selection.mapillary
      this.position = states.position
      this.bearing = states.bearing
      this.imageId = states.imageId
    },
    getMarkerFeature () {
      const lat = this.position ? this.position.lat : 0
      const lon = this.position ? this.position.lng : 0
      const bearing = 225 + this.bearing || 0
      return {
        type: 'Feature',
        style: {
          shape: 'none',
          icon: {
            url: '/kdk/mapillary-marker.png',
            size: 40,
            rotation: bearing
          }
        },
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: [lon, lat]
        }
      }
    },
    async refresh () {
      this.hasImage = false
      if (_.has(this.selection, 'mapillary')) {
        this.restoreStates()
        if (this.imageId) {
          this.hasImage = true
          await this.refreshView()
        } else if (this.position) await this.moveCloseTo(this.position.lat, this.position.lng)
      } else if (this.hasSelectedItem()) {
        const location = this.getSelectedLocation()
        if (location) await this.moveCloseTo(location.lat, location.lng)
      }
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
        this.hasImage = false
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
        this.hasImage = true
        this.refreshView()
      } else {
        this.$notify({ type: 'negative', message: this.$t('KMapillaryViewer.NO_IMAGE_FOUND_CLOSE_TO') })
      }
    },
    centerMap () {
      if (this.position) this.kActivity.center(this.position.lng, this.position.lat)
    },
    async refreshView () {
      this.highlight(this.getMarkerFeature(), null, false)
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
      this.hasImage = true
      this.position = image.lngLat
      this.bearing = await this.mapillaryViewer.getBearing()
      this.centerMap()
      this.highlight(this.getMarkerFeature(), null, false)
    },
    onResized (size) {
      if (this.mapillaryViewer) this.mapillaryViewer.resize()
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
    this.position = undefined
    this.bearing = undefined
    this.key = undefined
    this.refresh()
  },
  beforeUnmount () {
    // Remove event listeners
    this.mapillaryViewer.off('image', this.onImageEvent)
    // Save the states
    this.saveStates()
  },
  setup () {
    // Data
    const hasImage = ref(false)
    // Expose
    return {
      ...useCurrentActivity(),
      ...useHighlight('mapillary'),
      hasImage
    }
  }
}
</script>
