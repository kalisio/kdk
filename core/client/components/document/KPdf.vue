<template>
  <div 
    id="viewer" 
    class="fit"
  />
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { Viewer } from '@pdfme/ui'
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
let domViewer
const pdf = ref(null)

// Watch
watch(() => props.url, async (value) => {
  const response = await Document.fetchUrl(value, props.localize)
  if (response?.ok) {
    const blob  = await response.blob()
    const reader = new FileReader()
      reader.onloadend = () => {
        new Viewer({ domContainer: domViewer, template: { basePdf: reader.result, schemas: [] }, inputs: [{ fake: 'fake' }] })
      }
    reader.readAsDataURL(blob);
  } else pdf.value = null
}, { immediate: true })

// Hook
onMounted(() => {
  domViewer = document.getElementById('viewer')
})
</script>