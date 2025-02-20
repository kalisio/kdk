<template>
  <q-img
    :src="image"
    :width="width"
    :height="height"
    class="k-target"
  />
</template>

<script setup>
// Props
defineProps({
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
</script>

<style lang="scss" scoped>
.k-target {
  pointer-events: none;
  background-color: #00000020;
  border-radius: 50%;
}
</style>
