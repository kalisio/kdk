<template>
  <div id="panoramax-widget" class="column">
    <q-resize-observer @resize="onResized" />
    <div id="panoramax-container"
      class="col full-width full-height" style="position: relative;">
      <pnx-photo-viewer
        ref="pnxViewer"
        v-if="hasImage"
        id="pnx-viewer"
        class="full-width full-height"
        :endpoint="endpoint"
        :sequence="sequenceId"
        :picture="pictureId"
        @pnx-picture-change="onPictureEvent"
        @select="onPictureEvent"
      />
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
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
      this.hasImage = false
      if (_.has(this.selection, 'panoramax')) {
        this.restoreStates()
        if (this.pictureId) {
          this.hasImage = true
          this.refreshView()
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
      const buffer = 0.0002 // around 25m
      const left = lon - buffer
      const bottom = lat - buffer
      const right = lon + buffer
      const top = lat + buffer
      const query = `https://api.panoramax.xyz/api/search?bbox=${left},${bottom},${right},${top}&limit=50`

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
                this.pictureId = feature.id
                this.sequenceId = feature.collection
                this.position = { lat: coords[1], lng: coords[0] }
                this.bearing = picture['view:azimuth']
              }
            }
          })

          if (this.pictureId) {
            this.hasImage = true
            this.refreshView()
          } else {
            Notify.create({ type: 'negative', message: 'Aucune image trouvée à proximité' })
          }
        } else {
          Notify.create({ type: 'negative', message: 'Aucune image trouvée à proximité' })
        }
      } catch (error) {
        Notify.create({ type: 'negative', message: 'Erreur lors de la recherche d\'images' })
      }
    },

    async refreshView () {
      this.highlight(this.getMarkerFeature(), null, false)

      if (this.hasSelectedLocation()) {
        const location = this.getSelectedLocation()
        await this.moveCloseTo(location.lat, location.lng)
        return
      }

      if (_.has(this.selection, 'panoramax') && this.pictureId) {
        this.restoreStates()
        this.hasImage = true
        await this.refreshView()
      }
    },

    centerMap () {
      if (this.position) {
        this.kActivity.center(this.position.lng, this.position.lat)
      }
    },

    onCurrentTimeChanged (time) {
      this.setupViewerFilters()
    },

    async onPictureEvent (event) {
      const detail = event.detail
      if (detail) {
        this.pictureId = detail.picId
        this.sequenceId = detail.seqId
        this.hasImage = true
        await this.updatePictureData(detail.picId)
      }
    },

    async updatePictureData (picId) {
      try {
        const response = await fetch(`${this.endpoint}/pictures/${picId}`)
        const feature = await response.json()
        const coords = feature.geometry.coordinates
        if (coords) {
          this.position = { lat: coords[1], lng: coords[0] }
          this.bearing = feature.properties['view:azimuth']

          this.centerMap()
          this.highlight(this.getMarkerFeature(), null, false)
        }
      } catch (error) {
        Notify.create({ type: 'negative', message: 'Aucune image trouvée à proximité' })
      }
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

<style scoped>
#pnx-viewer {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
