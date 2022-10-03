<template>
  <div class="q-pa-xs">
    <div :style="`min-width: ${width}; height: ${height}; border-radius: ${borderRadius}; background-color: ${color};`" />
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { getCssVar } from 'quasar'

// props
const props = defineProps({
  color: {
    type: String,
    default: getCssVar('primary')
  },
  width: {
    type: String,
    default: '15px'
  },
  height: {
    type: String,
    default: '15px'
  },
  borderRadius: {
    type: String,
    default: '10px'
  }
})
</script>
