<template>
  <div
    v-if="html"
    v-html="html"
  />
</template>

<script setup>
import { ref, watch } from 'vue'
import showdown from 'showdown'
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
  },
  options: {
    type: Object,
    default: () => null
  }
})

// Data
const html = ref(null)

// Watch
watch(() => props.url, async (value) => {
  const response = await Document.fetchUrl(value, props.localize)
  if (response?.ok) {
    const markdown = await response.text()
    const converter = new showdown.Converter(props.options || Document.options.mdConverter)
    html.value = Document.sanitizeHtml(converter.makeHtml(markdown))
  } else html.value = null
}, { immediate: true })
</script>
