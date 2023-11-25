<template>
  <div>
    <div v-if="interactive === true" class="fit" >
      <pinch-zoom class="pinch-zoom-controller fit row justify-center items-center" @change="$emit('image-transformed')">
        <img :src="source" style="max-width:100%; max-height:100%" :onload="onLoaded" />
      </pinch-zoom>

    </div>
    <div v-else class="fit row justify-center items-center">
      <img :src="source" style="max-width:100%; max-height:100%" />
    </div>
    <q-spinner
      class="absolute-center"
      v-if="loading"
      color="white"
      size="3em"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import 'pinch-zoom-element/dist/pinch-zoom.js'

// Props
defineProps({
  source: {
    type: String,
    default: ''
  },
  interactive: {
    type: Boolean,
    default: true
  }
})

// Emit
defineEmits(['image-transformed'])

// Data
const loading = ref(true)

// Functions
function restore () {
  const controller = document.querySelector('.pinch-zoom-controller')
  if (controller) {
    controller.setTransform({
      scale: 1,
      x: 0,
      y: 0,
      allowChangeEvent: true
    })
  }
}
function onLoaded () {
  loading.value = false
}

// Hooks
onMounted(() => {
  restore()
})

// Expose
defineExpose({
  restore
})
</script>
