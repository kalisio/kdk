<template>
  <q-img
    :src="image"
    :width="width"
    :height="height"
    fit="scale-down"
  />
</template>

<script setup>
// Props
defineProps({
  image: {
    type: String,
    default: 'kdk/north.svg'
  },
  width: {
    type: String,
    default: '36px'
  },
  height: {
    type: String,
    default: '36px'
  }
})
</script>
