<template>
  <div
    v-if="html"
    v-safe-html="html"
  />
</template>

<script setup>
import { ref, watch } from 'vue'

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
  if (response?.ok) html.value = await response.text()
  else html.value = null
}, { immediate: true })
</script>
