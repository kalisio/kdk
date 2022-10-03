<template>
  <div class="q-pa-xs">
    <div :style="`min-width: ${width}; height: ${height}; border-radius: ${borderRadius}; background-color: ${color};`" />
  </div>
</template>

<script setup>
import { getCssVar } from 'quasar'

// props
defineProps({
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
