<template>
  <div id="panoramax-widget" class="column">
    <q-resize-observer @resize="onResized" />
    <div class="col" id="panoramax-container">
      <pnx-viewer
        ref="panoramaxViewer"
        endpoint="https://api.panoramax.xyz/api"
        :sequence="sequenceId"
        :picture="pictureId"
        widgets
      />
    </div>
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
    saveStates() {
      this.selection.panoramax = {
        position: this.position,
        bearing: this.bearing,
        sequenceId: this.sequenceId,
        pictureId: this.pictureId
      }
    },
    restoreStates() {
      const states = this.selection.panoramax
      this.position = states.position
      this.bearing = states.bearing
      this.sequenceId = states.sequenceId
      this.pictureId = states.pictureId
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
      if (_.has(this.selection, 'panoramax')) {
        this.restoreStates()
        if (this.pictureId && this.sequenceId) {
          this.hasImage = true
          await this.refreshView()
        } else if (this.position) {  
          await this.moveCloseTo(this.position.lat, this.position.lng)
        }
      }
      else if (this.hasSelectedItem()) {
        const location = this.getSelectedLocation()
        if (location) await this.moveCloseTo(location.lat, location.lng)
      }
    },
    async moveCloseTo(lat, lon) {
      const buffer = 0.0002 // ~25m bbox
      const bbox = `${lon - buffer},${lat - buffer},${lon + buffer},${lat + buffer}`
      const query = `https://api.panoramax.xyz/api/0.2/search/pictures?bbox=${bbox}&limit=50`
      const response = await fetch(query)
      if (response.status !== 200) throw new Error(`Fetch failed: ${response.status}`)
      const data = await response.json()
      if (data.pictures?.length > 0) {
        const clickedPosition = point([lon, lat])
        let minDist
        data.pictures.forEach(pic => {
          const dist = distance(clickedPosition, point([pic.lon, pic.lat]))
          if (!minDist || dist < minDist) {
            minDist = dist
            this.sequenceId = pic.sequence_id
            this.pictureId = pic.id
          }
        })
        this.hasImage = true
        this.refreshView()
      } else {
        Notify.create({ type: 'negative', message: this.$t('KPanoramaxViewer.NO_IMAGE_FOUND_CLOSE_TO') })
      }
    },
    centerMap () {
      if (this.position) this.kActivity.center(this.position.lng, this.position.lat)
    },
    async refreshView () {
      this.highlight(this.getMarkerFeature(), null, false)
      if (this.$refs.panoramaxViewer) {
        // Panoramax handles moveTo internally via props
        await this.$nextTick()
      }
    },
    async onPictureEvent(picture) {
      this.pictureId = picture.id
      this.sequenceId = picture.sequence_id
      this.hasImage = true
      this.position = { lat: picture.lat, lng: picture.lon }
      // Fetch bearing if available via API or approximate
      this.bearing = picture.bearing || 0
      this.centerMap()
      this.highlight(this.getMarkerFeature(), null, false)
    },
    onResized (size) {
    }
  },
  mounted () {
    // No explicit viewer init; web component handles it
    this.position = undefined
    this.bearing = undefined
    this.sequenceId = undefined
    this.pictureId = undefined
    this.refresh()
    // Listen for picture changes (adapt to actual Panoramax event)
    this.$refs.panoramaxViewer?.addEventListener('picture-change', (e) => this.onPictureEvent(e.detail))
  },
  beforeUnmount () {
    // Remove event listeners
    this.panoramaxViewer.off('image', this.onImageEvent)
    // Save the states
    this.saveStates()
  },
  setup () {
    // Data
    const hasImage = ref(false)
    // Expose
    return {
      ...useCurrentActivity(),
      ...useHighlight('panoramax'),
      hasImage,
      sequenceId: ref(null),
      pictureId: ref(null)
    }
  }
}
</script>
