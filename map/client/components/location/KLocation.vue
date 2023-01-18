<template>
  <input />

</template>

<script setup>

// Props
defineProps({
  modelValue: {
    type: Object,
    default: () => null
  },
  icon: {
    type: String,
    default: null
  },
  dense: {
    type: Boolean,
    default: false
  }
})

</script>
