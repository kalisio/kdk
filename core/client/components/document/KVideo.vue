<template>
  <div v-if="url" class="fit">
    <video 
      :src="url" 
      :controls="controls"
      :autoplay="autoplay"
      class="fit" 
    />
  </div>
</template>

<script setup>
import _ from 'lodash'
import { computed } from 'vue'

// Props
const props = defineProps({
  url: {
    type: String,
    default: null
  },
  options: {
    type: Object,
    default: () => {
      return {
        controls: true,
        autoplay: true
      }
    }
  }
})

// Computed
const controls = computed(() => {
  return _.get(props.options, 'controls', true)
})
const autoplay = computed(() => {
  return _.get(props.options, 'autoplay', true)
})
</script>