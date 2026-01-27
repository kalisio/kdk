<template>
  <div id="panoramax-widget" class="column">
    <q-resize-observer />
    <div id="panoramax-container"
      class="col" style="position: relative;">
      <pnx-photo-viewer
        v-show="hasImage"
        id="pnx-viewer"
        widgets="false"
        class="fit"
        style="position: absolute;"
        :endpoint="endpoint"
        :sequence="sequenceId"
        :picture="pictureId"
        @select="onPictureEvent"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import _ from 'lodash'
import distance from '@turf/distance'
import { point } from '@turf/helpers'
import { Notify } from 'quasar'
import { useCurrentActivity, useHighlight } from '../../composables'
import '@panoramax/web-viewer/build/photoviewer.css'
import '@panoramax/web-viewer/build/photoviewer'
import { i18n } from '../../../../core/client/i18n.js'

// Composables externes
const { kActivity, selection, hasSelectedItem, hasSelectedLocation, getSelectedLocation } = useCurrentActivity()
const { highlight } = useHighlight('panoramax')

// Data
const hasImage = ref(false)
const pictureId = ref(null)
const sequenceId = ref(null)
const position = ref(null)
const bearing = ref(null)
const endpoint = 'https://api.panoramax.xyz/api'

// computed
const location = computed(() =>
  hasSelectedLocation() && getSelectedLocation()
)

// Fonctions
const getMarkerFeature = () => {
  const lat = position.value ? position.value.lat : 0
  const lon = position.value ? position.value.lng : 0
  const rot = 225 + (bearing.value || 0)
  return {
    type: 'Feature',
    style: {
      shape: 'none',
      icon: {
        url: '/kdk/panoramax-marker.png',
        size: 80,
        rotation: rot
      }
    },
    properties: {},
    geometry: {
      type: 'Point',
      coordinates: [lon, lat]
    }
  }
}

const saveStates = () => {
  selection.panoramax = {
    pictureId: pictureId.value,
    sequenceId: sequenceId.value,
    position: position.value,
    bearing: bearing.value
  }
}

const restoreStates = () => {
  const states = selection.panoramax
  if (states) {
    position.value = states.position
    bearing.value = states.bearing
    pictureId.value = states.pictureId
    sequenceId.value = states.sequenceId
  }
}

const moveCloseTo = async (lat, lon) => {
  const buffer = 0.0002
  const left = lon - buffer
  const bottom = lat - buffer
  const right = lon + buffer
  const top = lat + buffer
  const query = `https://api.panoramax.xyz/api/search?bbox=${left},${bottom},${right},${top}&limit=50`

  try {
    const response = await fetch(query)
    if (response.status !== 200) throw new Error(`Impossible to fetch ${query}: ` + response.status)

    const data = await response.json()
    const pictures = data.features || []

    if (pictures.length > 0) {
      const clickedPosition = point([lon, lat])
      let minDist = Infinity

      pictures.forEach(feature => {
        const picture = feature.properties
        const coords = feature.geometry.coordinates
        if (coords?.[0] && coords?.[1]) {
          const dist = distance(clickedPosition, point(coords))
          if (dist < minDist) {
            minDist = dist
            pictureId.value = feature.id
            hasImage.value = true
            sequenceId.value = feature.collection
            position.value = { lat: coords[1], lng: coords[0] }
            bearing.value = picture['view:azimuth']
          }
        }
      })
    } else { throw new Error('No image found') }
  } catch (error) {
    Notify.create({ type: 'negative', message: i18n.t('KPanoramaxViewer.NO_IMAGE_FOUND_CLOSE_TO') })
  }
}

function centerMap () {
  if (position.value) kActivity.value.center(position.value.lng, position.value.lat)
}

const onPictureEvent = async (event) => {
  const detail = event.detail
  if (!detail) return

  try {
    pictureId.value = detail.picId
    sequenceId.value = detail.seqId
    hasImage.value = true

    const query = `${endpoint}/pictures/${detail.picId}`
    const response = await fetch(query)
    if (!response.ok) {
      throw new Error(`Impossible to fetch ${query}: ` + response.status)
    }

    const feature = await response.json()
    const coords = feature.geometry?.coordinates
    if (coords) {
      position.value = { lat: coords[1], lng: coords[0] }
      bearing.value = feature.properties?.['view:azimuth']
      window.history.replaceState({}, '', window.location.pathname)
      centerMap()
      highlight(getMarkerFeature(), null, false)
    } else {
      throw new Error('No coords found')
    }
  } catch (err) {
    Notify.create({ type: 'negative', message: i18n.t('KPanoramaxViewer.NO_IMAGE_FOUND_CLOSE_TO') })
  }
}

const refresh = async () => {
  // clear the url query parameter
  window.history.replaceState({}, '', window.location.pathname)

  restoreStates()

  if (position.value) {
    highlight(getMarkerFeature(), null, false)
  }

  if (hasSelectedItem()) {
    const loc = getSelectedLocation()
    await moveCloseTo(loc.lat, loc.lng)
    return
  }

  if (_.has(selection, 'panoramax')) {
    restoreStates()
    if (pictureId.value) hasImage.value = true
  }
}

// Vue
watch(location, refresh)

onMounted(() => {
  refresh()
})

onBeforeUnmount(() => {
  saveStates()
  window.history.replaceState({}, '', window.location.pathname)
})
</script>
