<template>
  <div class="q-pa-md">
    <q-icon
      name="img:icons/kdk/attribution.png"
      size="24px"
    >
      <q-popup-proxy
        id="attributionsPopup"
        transition-show="scale"
        transition-hide="scale"
        anchor="bottom left"
        self="bottom right"
      >
        <div
          id="attributionsBanner" class="bg-white text-primary text-center q-pa-xs"
        >
          <div id="attributionsContent" v-html="sanitizedAttributionsContent" />
        </div>
      </q-popup-proxy>
    </q-icon>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Document } from '../../../core/client/document.js'
// Data
const attributionsHtmlContent = `
  <div>
    <a href="https://leafletjs.com" target="_blank">Leaflet</a> 
    | OpenMapTiles © <a href="https://openmaptiles.com" target="_blank">OpenMapTiles</a> 
    & OpenStreetMap © <a href="https://www.openstreetmap.org" target="_blank">OpenStreetMap</a> contributors
  </div>
`
// Computed
const sanitizedAttributionsContent = computed(() => {
  return Document.sanitizeHtml(attributionsHtmlContent)
})
</script>
<!--<script setup>
import { ref, computed, watch } from 'vue'
import { Document } from '../../../core/client/document.js'

// Props
const props = defineProps({
  url: {
    type: String,
    default: null
  }
})

// Data
const staticAttributionsHtmlContent = `
  <div>
    <a href="https://leafletjs.com" target="_blank">Leaflet</a> 
    | OpenMapTiles © <a href="https://openmaptiles.com" target="_blank">OpenMapTiles</a> 
    & OpenStreetMap © <a href="https://www.openstreetmap.org" target="_blank">OpenStreetMap</a> contributors
  </div>
`
const attributionsHtmlContent = ref(staticAttributionsHtmlContent)

// Watch
watch(() => props.url, async (newUrl) => {
  if (newUrl) {
    const response = await Document.fetchUrl(newUrl)
    if (response?.ok) {
      attributionsHtmlContent.value = await response.text()
    }
  } else {
    attributionsHtmlContent.value = staticAttributionsHtmlContent
  }
}, { immediate: true })

// Computed
const sanitizedAttributionsContent = computed(() => {
  return Document.sanitizeHtml(attributionsHtmlContent.value)
})
</script>-->

<style>
#attributionsPopup {
  min-width: fit-content;
}
#attributionsBanner {
  min-height: fit-content;
  font-size: 11px;
}
</style>