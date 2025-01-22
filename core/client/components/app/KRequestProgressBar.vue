<template>
  <q-ajax-bar
    ref="progessBarRef" 
    position="bottom" 
    size="8px" 
    color="primary" 
    :delay="250">
  </q-ajax-bar>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { ref, onMounted } from 'vue'
import { Events } from '../../events.js'

// Data
const $q = useQuasar()
const progessBarRef = ref(null)
let nbRequests = 0
let nbCompletedRequests = 0
let isProgressBarActive = false

// Functions
function addRequest (hook) {
  // Check if this request is a quiet one or not
  if (hook.params.ignore) return
  nbRequests++
  if (progessBarRef.value && !isProgressBarActive && (nbRequests > nbCompletedRequests)) {
    progessBarRef.value.start()
    isProgressBarActive = true
  }
}
function addCompletedRequest (hook) {
  // Check if this request is a quiet one or not
  if (hook.params.ignore) return
  nbCompletedRequests++
  if (progessBarRef.value && isProgressBarActive && (nbRequests <= nbCompletedRequests)) {
    isProgressBarActive = false
    progessBarRef.value.stop()
  }
}

// Hooks
onMounted(() => {
  Events.on('before-hook', hook => { addRequest(hook) })
  Events.on('after-hook', hook => { addCompletedRequest(hook) })
  Events.on('error-hook', hook => { addCompletedRequest(hook) })
})

</script>
