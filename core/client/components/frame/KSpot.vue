<template>
  <div class="q-pa-xs">
    <div :style="`min-width: ${width}; height: ${height}; border-radius: ${borderRadius}; background-color: ${color};`" />
  </div>
</template>

<script>
import { colors } from 'quasar'

export default {
  name: 'k-spot',
  props: {
    color: {
      type: String,
      default: colors.getBrand('primary')
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
  }
}
</script>
