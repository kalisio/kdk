<template>
  <q-ajax-bar
    ref="progressBarRef"
    position="bottom"
    :size="size"
    color="primary"
    :delay="delay"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Events } from '../../events.js'

// Props
const props = defineProps({
  size: {
    type: String,
    default: '8px'
  },
  delay: {
    type: Number,
    default: 250
  }
})

// Data
const progressBarRef = ref(null)
let nbRequests = 0
let nbCompletedRequests = 0
let isProgressBarActive = false

// Functions
function addRequest (hook) {
  // Check if this request is a quiet one or not
  if (hook.params.ignore) return
  nbRequests++
  if (progressBarRef.value && !isProgressBarActive && (nbRequests > nbCompletedRequests)) {
    progressBarRef.value.start()
    isProgressBarActive = true
  }
}
function addCompletedRequest (hook) {
  // Check if this request is a quiet one or not
  if (hook.params.ignore) return
  nbCompletedRequests++
  if (progressBarRef.value && isProgressBarActive && (nbRequests <= nbCompletedRequests)) {
    isProgressBarActive = false
    progressBarRef.value.stop()
  }
}

// Hooks
onMounted(() => {
  Events.on('before-hook', hook => { addRequest(hook) })
  Events.on('after-hook', hook => { addCompletedRequest(hook) })
  Events.on('error-hook', hook => { addCompletedRequest(hook) })
})
</script>
