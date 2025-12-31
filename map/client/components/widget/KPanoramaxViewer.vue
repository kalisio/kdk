<template>
  <div id="panoramax-widget" class="column">
    <q-resize-observer @resize="onResized" />
    <div
      class="col"
      id="panoramax-container"
    />
  </div>
</template>

<script>
import _ from 'lodash'
import { ref } from 'vue'
import { Notify } from 'quasar'
import distance from '@turf/distance'
import { point } from '@turf/helpers'
import { KPanel } from '../../../../core/client/components'
import { useCurrentActivity, useHighlight } from '../../composables'
import { PhotoViewer } from '@panoramax/web-viewer'
import '@panoramax/web-viewer/build/index.css'

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
      this.selection.panoramax = {
        position: this.position,
        bearing: this.bearing,
        pictureId: this.pictureId
      }
    },
    restoreStates () {
      const states = this.selection.panoramax
      this.position = states.position
      this.bearing = states.bearing
      this.pictureId = states.pictureId
    },
    getMarkerFeature () {
      const lat = this.position ? this.position.lat : 0
      const lon = this.position ? this.position.lng : 0
      const bearing = 225 + (this.bearing || 0)
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
      console.log('REFRESH - location:', this.location)
      this.hasImage = false
      if (_.has(this.selection, 'panoramax')) {
        this.restoreStates()
        if (this.pictureId) {
          this.hasImage = true
          await this.refreshView()
        } else if (this.position) {
          await this.moveCloseTo(this.position.lat, this.position.lng)
        }
      } else if (this.hasSelectedItem()) {
        const location = this.getSelectedLocation()
        if (location) await this.moveCloseTo(location.lat, location.lng)
      }
    },
    async moveCloseTo (lat, lon) {
      console.log('CLIC CARTE - lat:', lat, 'lon:', lon)
      const buffer = 0.0002 // around 25m
      const left = lon - buffer
      const bottom = lat - buffer
      const right = lon + buffer
      const top = lat + buffer
      const query = `https://api.panoramax.xyz/api/search?bbox=${left},${bottom},${right},${top}&limit=50`
      console.log('URL API appelée:', query)
      const response = await fetch(query)
      if (response.status !== 200) {
        this.hasImage = false
        throw new Error(`Impossible to fetch ${query}: ` + response.status)
      }
      const data = await response.json()
      const pictures = data.features || []

      if (pictures.length > 0) {
        console.log('Photos trouvées:', pictures.length)
        const clickedPosition = point([lon, lat])
        let minDist = Infinity
        pictures.forEach((feature, i) => {
          const picture = feature.properties
          const coords = feature.geometry.coordinates
          console.log("feat;", feature)
          if (coords && coords[0] && coords[1]) {
            const dist = distance(clickedPosition, point([coords[0], coords[1]]))
            if (dist < minDist) {
              minDist = dist
              this.pictureId = feature.id
              this.sequenceId = feature.collection
              this.position = { lat: coords[1], lng: coords[0] }
              this.bearing = picture['view:azimuth']
            }
          }
        })

        if (this.pictureId) {
          console.log('PictureId sélectionné:', this.pictureId, 'sequence', this.sequenceId, 'position:', this.position)
          this.hasImage = true
          await this.refreshView()
        } else {
          Notify.create({ type: 'negative', message: this.$t('KPanoramaxViewer.NO_IMAGE_FOUND_CLOSE_TO') })
        }
      } else {
        Notify.create({ type: 'negative', message: this.$t('KPanoramaxViewer.NO_IMAGE_FOUND_CLOSE_TO') })
      }
    },
    centerMap () {
      if (this.position) this.kActivity.center(this.position.lng, this.position.lat)
    },
    async refreshView () {
      this.highlight(this.getMarkerFeature(), null, false)
      console.log('refreshView - pictureId:', this.pictureId, 'sequenceId:', this.sequenceId)

      if (this.panoramaxViewer && this.pictureId) {
        this.panoramaxViewer.select(this.sequenceId, this.pictureId)
      } else {
        console.log('Viewer ou pictureId manquant', this.panoramaxViewer, this.pictureId)
      }
    },
    async onPictureEvent (viewerPictureEvent) {
      const picture = viewerPictureEvent.picture || viewerPictureEvent.image
      this.pictureId = picture.id
      this.hasImage = true
      this.position = { lat: picture.lat, lng: picture.lon }
      this.bearing = picture.bearing || 0
      this.centerMap()
      this.highlight(this.getMarkerFeature(), null, false)
    },
    onResized (size) {
      // There is no PhotoViewer.resize() in Panoramax API
    }
  },
  mounted () {
    // Create the viewer
    this.panoramaxViewer = new PhotoViewer({
      container: 'panoramax-container',
      endpoint: 'https://api.panoramax.xyz/api',
    })

    console.log('PhotoViewer créé:', this.panoramaxViewer)

    // Add event listeners
    this.panoramaxViewer.addEventListener('image', this.onPictureEvent)
    // Configure the viewer
    this.position = undefined
    this.bearing = undefined
    this.key = undefined
    this.refresh()
  },
  beforeUnmount () {
    this.panoramaxViewer.removeEventListener('image', this.onPictureEvent)
    this.saveStates()
  },
  setup () {
    const hasImage = ref(false)
    return {
      ...useCurrentActivity(),
      ...useHighlight('panoramax'),
      hasImage
    }
  }
}
</script>
