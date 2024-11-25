<template>
  <div v-if="viewer">
    <component
      :is="viewer"
      v-bind="$props"
    />
  </div>
</template>

<script setup>
import _ from 'lodash'
import { computed } from 'vue'
import { Document } from '../../document.js'
import { loadComponent } from '../../utils'

// Props
const props = defineProps({
  url: {
    type: String,
    default: null
  },
  mimeType: {
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

// Computed
const viewer = computed(() => {
  const mimeType = props.mimeType || guessMimeType()
  if (!mimeType) return null
  const viewer = _.get(Document.options, `viewers.${mimeType}`)
  if (!viewer) return null
  return loadComponent(viewer)
})

// Function
function guessMimeType () {
  if (!props.url) return null
  const index = _.lastIndexOf(props.url, '.')
  if (!index) return null
  return props.url.substring(index + 1)
}
</script>
