<template>
  <q-img
    :src="image"
    :width="width"
    :height="height"
    class="k-target"
  />
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  image: {
    type: String,
    default: 'kdk/target.svg'
  },
  width: {
    type: String,
    default: '40px'
  },
  height: {
    type: String,
    default: '40px'
  }
})

// Computed
const width = computed(() => {
  return `${props.size}px`
})
const height = computed(() => {
  return `${props.size}px`
})
</script>

<style lang="scss" scoped>
.k-target {
  pointer-events: none;
  background-color: #00000020; 
  border-radius: 50%;
}
</style>