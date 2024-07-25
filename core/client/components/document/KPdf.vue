<template>
  <div
    id="viewer"
    class="fit"
  />
</template>

<script setup>
import _ from 'lodash'
import { watch, onMounted } from 'vue'
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
  },
  options: {
    type: Object,
    default: () => {
      return {
        schemas: [],
        inputs: [{ fake: 'fake' }]
      }
    }
  }
})

// Data
const defaultSchemas = []
const defaultInputs = [{ fake: 'fake' }]
let domViewer
let viewer

// Watch
watch(() => props.url, async (value) => {
  if (viewer) {
    viewer.destroy()
    viewer = null
  }
  const response = await Document.fetchUrl(value, props.localize)
  if (response?.ok) {
    const blob = await response.blob()
    const reader = new FileReader()
    reader.onloadend = () => {
      viewer = new Viewer({ 
        domContainer: domViewer, 
        template: { 
          basePdf: reader.result, 
          schemas: _.get(props.options, 'schemas', defaultSchemas)
        },
        inputs: _.get(props.options, 'inputs', defaultInputs) 
      })
    }
    reader.readAsDataURL(blob)
  }
}, { immediate: true })

// Hook
onMounted(() => {
  domViewer = document.getElementById('viewer')
})
</script>
