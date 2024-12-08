<template>
  <q-scroll-area class="fit">
    <div
      v-if="html"
      v-html="html"
    />
  </q-scroll-area>  
</template>

<script setup>
import { ref, watch } from 'vue'
import { Document } from '../../document.js'

// Props
const props = defineProps({
  url: {
    type: String,
    default: null
  },
  localize: {
    type: Boolean,
    default: true
  }
})

// Data
const html = ref(null)

// Watch
watch(() => props.url, async (value) => {
  const response = await Document.fetchUrl(value, props.localize)
  if (response?.ok) html.value = Document.sanitizeHtml(await response.text())
  else html.value = null
}, { immediate: true })
</script>
