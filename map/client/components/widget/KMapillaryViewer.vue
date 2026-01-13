<template>
  <div id="mapillary-widget" class="column">
    <q-resize-observer @resize="onResized" />
    <div
      class="col"
      id="mapillary-container"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import _ from 'lodash'
import logger from 'loglevel'
import { Notify } from 'quasar'
import { Viewer } from 'mapillary-js'
import 'mapillary-js/dist/mapillary.css'
import distance from '@turf/distance'
import { point } from '@turf/helpers'
import { useCurrentActivity, useHighlight } from '../../composables'

const { kActivity, selection, hasSelectedItem, getSelectedLocation, hasSelectedLocation } = useCurrentActivity()
const { highlight } = useHighlight('mapillary')

// Data
const hasImage = ref(false)
const position = ref()
const bearing = ref()
const imageId = ref()
let mapillaryViewer = null

// Computed
const location = computed(() => hasSelectedLocation() && getSelectedLocation())

// Methods
function saveStates () {
  selection.mapillary = {
    position: position.value,
    bearing: bearing.value,
    imageId: imageId.value
  }
}

function restoreStates () {
  const states = selection.mapillary
  position.value = states.position
  bearing.value = states.bearing
  imageId.value = states.imageId
}

function getMarkerFeature () {
  const lat = position.value ? position.value.lat : 0
  const lon = position.value ? position.value.lng : 0
  const rotation = 225 + (bearing.value || 0)
  return {
    type: 'Feature',
    style: {
      shape: 'none',
      icon: {
        url: '/kdk/mapillary-marker.png',
        size: 40,
        rotation
      }
    },
    properties: {},
    geometry: {
      type: 'Point',
      coordinates: [lon, lat]
    }
  }
}


async function moveCloseTo (lat, lon) {
  const buffer = 0.0002 // ~25m
  const left = lon - buffer
  const right = lon + buffer
  const top = lat + buffer
  const bottom = lat - buffer
  const token = kActivity.value.mapillaryToken
  
  const query = `https://graph.mapillary.com/images?fields=id,computed_geometry&bbox=${left},${bottom},${right},${top}&access_token=${token}&limit=50`
  const response = await fetch(query)
  if (response.status !== 200) {
    hasImage.value = false
    throw new Error(`Impossible to fetch ${query}: ` + response.status)
  }

  const data = await response.json()
  const images = data.data || []
  
  if (images.length > 0) {
    const clickedPosition = point([lon, lat])
    let minDist
    images.forEach(image => {
      const dist = distance(clickedPosition, image.computed_geometry)
      if (!minDist || dist < minDist) {
        minDist = dist
        imageId.value = image.id
      }
    })
    hasImage.value = true
    await refreshView()
  } else {
    Notify.create({ type: 'negative', message: this.$t('KMapillaryViewer.NO_IMAGE_FOUND_CLOSE_TO') })
  }
}

function centerMap () {
  if (position.value) kActivity.value.center(position.value.lng, position.value.lat)
}

async function onImageEvent (e) {
  const image = e.image
  imageId.value = image.id
  hasImage.value = true
  position.value = image.lngLat
  bearing.value = await mapillaryViewer.getBearing()
  centerMap()
  highlight(getMarkerFeature(), null, false)
}

async function refresh () {
  hasImage.value = false
  if (_.has(selection.value, 'mapillary')) {
    restoreStates()
    if (imageId.value) {
      hasImage.value = true
      await refreshView()
    } else if (position.value) {
      await moveCloseTo(position.value.lat, position.value.lng)
    }
  } else if (hasSelectedItem()) {
    const loc = getSelectedLocation()
    if (loc) await moveCloseTo(loc.lat, loc.lng)
  }
}

async function refreshView () {
  highlight(getMarkerFeature(), null, false)
  try {
    await mapillaryViewer.moveTo(imageId.value)
  } catch (error) {
    logger.error(error)
  }
}


function onResized () {
  if (mapillaryViewer) mapillaryViewer.resize()
}

// Watcher
watch(location, refresh)

// Vue
onMounted(() => {
  mapillaryViewer = new Viewer({
    container: 'mapillary-container',
    accessToken: kActivity.value.mapillaryToken
  })
  mapillaryViewer.on('image', onImageEvent)
  refresh()
})

onBeforeUnmount(() => {
  if (mapillaryViewer) {
    mapillaryViewer.off('image', onImageEvent)
  }
  saveStates()
})
</script>