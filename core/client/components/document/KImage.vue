<template>
  <div class="fit column">
    <div v-if="interactive === true" class="fit" >
      <pinch-zoom class="pinch-zoom-controller fit row justify-center items-center" @change="$emit('image-transformed')">
        <img :src="url"  :onload="onLoaded" />
      </pinch-zoom>

    </div>
    <div v-else class="fit row justify-center items-center">
      <img :src="url" :onload="onLoaded" />
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
import _ from 'lodash'
import { ref, computed, onMounted } from 'vue'
import 'pinch-zoom-element/dist/pinch-zoom.js'

// Props
const props = defineProps({
  url: {
    type: String,
    default: ''
  },
  options: {
    type: Object,
    default: () => {
      return {
        interactive: true
      }
    }
  }
})

// Emit
defineEmits(['image-transformed'])

// Data
const loading = ref(true)

// Computed
const interactive = computed(() => {
  return _.get(props.options, 'interactive', true)
})

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
