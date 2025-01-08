<template>
  <div v-if="viewer">
    <q-scroll-area v-if="scrollable" class="fit">
      <component
      :is="viewer"
      v-bind="$props"
    />
    </q-scroll-area>
    <component v-else
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
  type: {
    type: String,
    default: null
  },
  localize: {
    type: Boolean,
    default: true
  },
  scrollable: {
    type: Boolean,
    default: false
  },
  options: {
    type: Object,
    default: () => null
  }
})

// Computed
const viewer = computed(() => {
  const type = props.type || guessType()
  if (!type) return null
  const viewer = _.get(Document.options, `viewers.${type}`)
  if (!viewer) return null
  return loadComponent(viewer)
})

// Function
function guessType () {
  if (!props.url) return null
  const index = _.lastIndexOf(props.url, '.')
  if (!index) return null
  return props.url.substring(index + 1)
}
</script>
