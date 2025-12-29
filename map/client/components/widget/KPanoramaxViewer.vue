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
import logger from 'loglevel'
import { ref } from 'vue'
import { Notify } from 'quasar'
import distance from '@turf/distance'
import { point } from '@turf/helpers'
import { KPanel } from '../../../../core/client/components'
import { useCurrentActivity, useHighlight } from '../../composables'
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
        sequenceId: this.sequenceId,
        pictureId: this.pictureId
      }
    },
    restoreStates () {
      const states = this.selection.panoramax
      if (states) {
        this.position = states.position
        this.bearing = states.bearing
        this.sequenceId = states.sequenceId
        this.pictureId = states.pictureId
      }
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
      this.hasImage = false
      if (_.has(this.selection, 'panoramax')) {
        this.restoreStates()
        if (this.pictureId && this.sequenceId) {
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
      const buffer = 0.0002
      const left = lon - buffer
      const bottom = lat - buffer
      const right = lon + buffer
      const top = lat + buffer
      const query = `https://api.panoramax.xyz/api/search?bbox=${left},${bottom},${right},${top}&limit=50`
      
      const response = await fetch(query)
      if (response.status !== 200) {
        this.hasImage = false
        throw new Error(`Impossible to fetch ${query}: ` + response.status)
      }
      const data = await response.json()
      const pictures = data.features || []
      
      if (pictures.length > 0) {
        const clickedPosition = point([lon, lat])
        let minDist
        pictures.forEach(feature => {
          const picture = feature.properties
          if (picture.lat && picture.lon) {
            const dist = distance(clickedPosition, point([picture.lon, picture.lat]))
            if (!minDist || dist < minDist) {
              minDist = dist
              this.sequenceId = picture.collection
              this.pictureId = feature.id
              this.position = { lat: picture.lat, lng: picture.lon }
              this.bearing = picture.bearing || picture.direction || 0
            }
          }
        })
        this.hasImage = true
        await this.refreshView()
      } else {
        Notify.create({ type: 'negative', message: this.$t('KPanoramaxViewer.NO_IMAGE_FOUND_CLOSE_TO') || 'Aucune image trouvée à proximité' })
      }
    },
    centerMap () {
      if (this.position) this.kActivity.center(this.position.lng, this.position.lat)
    },
    async refreshView () {
      this.highlight(this.getMarkerFeature(), null, false)
      this.centerMap()
      // Force viewer update via attributes
      if (this.panoramaxViewer) {
        this.panoramaxViewer.setAttribute('sequence', this.sequenceId || '')
        this.panoramaxViewer.setAttribute('picture', this.pictureId || '')
      }
    },
    onPictureEvent (event) {
      const picture = event.detail?.picture || event
      if (picture) {
        this.pictureId = picture.id
        this.sequenceId = picture.sequence_id || picture.collection
        this.hasImage = true
        this.position = { lat: picture.lat, lng: picture.lon }
        this.bearing = picture.bearing || 0
        this.centerMap()
        this.highlight(this.getMarkerFeature(), null, false)
      }
    },
    onResized (size) {
      // Web components gèrent le resize automatiquement
    }
  },
  mounted () {
    // Créer le web component Panoramax dans le container
    const container = document.getElementById('panoramax-container')
    container.style.height = '400px'
    container.style.position = 'relative'
    
    this.panoramaxViewer = document.createElement('pnx-photo-viewer')
    this.panoramaxViewer.setAttribute('endpoint', 'https://api.panoramax.xyz/api')
    this.panoramaxViewer.style.width = '100%'
    this.panoramaxViewer.style.height = '100%'
    
    // Écouter les événements
    this.panoramaxViewer.addEventListener('picturechange', this.onPictureEvent)
    this.panoramaxViewer.addEventListener('image-load', this.onPictureEvent)
    
    container.appendChild(this.panoramaxViewer)
    
    // Initialiser état
    this.position = undefined
    this.bearing = undefined
    this.sequenceId = undefined
    this.pictureId = undefined
    this.refresh()
  },
  beforeUnmount () {
    if (this.panoramaxViewer) {
      this.panoramaxViewer.removeEventListener('picturechange', this.onPictureEvent)
      this.panoramaxViewer.removeEventListener('image-load', this.onPictureEvent)
      this.panoramaxViewer.remove()
    }
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