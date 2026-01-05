<template>
  <div id="panoramax-widget" class="column">
    <q-resize-observer @resize="onResized" />
    <div class="col" id="panoramax-container">
      <pnx-photo-viewer
        v-if="hasImage"
        id="pnx-viewer"
        :endpoint="endpoint"
        :sequence="sequenceId"
        :picture="pictureId"
        @pnx-picture-change="onPictureEvent"
        widgets="false"
      />
      <div v-else class="flex flex-center text-grey">
        NOT FOUND
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import logger from 'loglevel'
import { Notify } from 'quasar'
import { ref } from 'vue'
import distance from '@turf/distance'
import { point } from '@turf/helpers'
import { useCurrentActivity, useHighlight } from '../../composables'
import { KPanel } from '../../../../core/client/components'
import '@panoramax/web-viewer/build/photoviewer.css'
import '@panoramax/web-viewer/build/photoviewer'

export default {
  components: { KPanel },

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
        pictureId: this.pictureId,
        sequenceId: this.sequenceId,
        position: this.position
      }
    },
    restoreStates () {
      const states = this.selection.panoramax
      if (states) {
        this.position = states.position
        this.bearing = states.bearing
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
        if (this.pictureId) {
          this.hasImage = true
          await this.refreshView()
        } else if (this.position) {
          await this.moveCloseTo(this.position.lat, this.position.lng)
        }
      } else if (this.hasSelectedItem()) {
        const location = this.getSelectedLocation()
        if (location) {
          await this.moveCloseTo(location.lat, location.lng)
        }
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

      try {
        const response = await fetch(query)
        if (response.status !== 200) {
          this.hasImage = false
          throw new Error(`Impossible to fetch ${query}: ${response.status}`)
        }

        const data = await response.json()
        const pictures = data.features || []

        if (pictures.length > 0) {
          const clickedPosition = point([lon, lat])
          let minDist = Infinity

          pictures.forEach(feature => {
            const picture = feature.properties
            const coords = feature.geometry.coordinates
            if (coords?.[0] && coords?.[1]) {
              const dist = distance(clickedPosition, point([coords[0], coords[1]]))
              if (dist < minDist) {
                minDist = dist
                console.log("feat;",feature)
                this.pictureId = feature.id
                this.sequenceId = feature.collection
                this.position = { lat: coords[1], lng: coords[0] }
                this.bearing = picture['view:azimuth']
              }
            }
          })

          if (this.pictureId) {
            console.log('PictureId sélectionné:', this.pictureId, 'sequence', this.sequenceId)
            this.hasImage = true
          } else {
            Notify.create({ type: 'negative', message: 'Aucune image trouvée à proximité' })
          }
        } else {
          Notify.create({ type: 'negative', message: 'Aucune image trouvée à proximité' })
        }
      } catch (error) {
        console.error('Erreur moveCloseTo:', error)
        Notify.create({ type: 'negative', message: 'Erreur lors de la recherche d\'images' })
      }
    },

    async refreshView () {
      if (this.position) {
        this.highlight(this.getMarkerFeature(), null, false)
        logger.info('refreshView - pictureId:', this.pictureId, 'sequenceId:', this.sequenceId)
      }
    },

    centerMap () {
      if (this.position) {
        this.kActivity.center(this.position.lng, this.position.lat)
      }
    },

    onPictureEvent (event) {
      const picture = event.detail?.picture || event.detail?.image || event
      if (picture) {
        this.pictureId = picture.id
        this.hasImage = true
        this.position = { lat: picture.lat, lng: picture.lon }
        this.bearing = picture.bearing || picture['view:azimuth'] || 0
        this.centerMap()
        this.highlight(this.getMarkerFeature(), null, false)
      }
    },

    onResized (size) {
      logger.debug('Widget resized:', size)
    }
  },

  mounted () {
    this.position = undefined
    this.bearing = undefined
    this.key = undefined
    this.refresh()
  },
  beforeUnmount () {
    this.saveStates()
  },

  setup () {
    const hasImage = ref(false)
    const pictureId = ref(null)
    const sequenceId = ref(null)
    const position = ref(null)
    const endpoint = 'https://api.panoramax.xyz/api'

    return {
      ...useCurrentActivity(),
      ...useHighlight('panoramax'),
      hasImage,
      pictureId,
      sequenceId,
      position,
      endpoint
    }
  }
}
</script>
