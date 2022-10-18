<template>
  <div class="q-pa-xs">
    <div class="k-spot" />
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
  boderStyle: {
    type: String,
    default: 'solid'
  },
  borderColor: {
    type: String,
    default: getCssVar('primary')
  },
  borderWidth: {
    type: String,
    default: '2px'
  },
  borderRadius: {
    type: String,
    default: '10px'
  }
})
</script>

<style lang="scss" scoped>
  .k-spot {
    min-width: v-bind(width);
    height: v-bind(height);
    background-color: v-bind(color);
    border-radius: v-bind(borderRadius);
    border-color:  v-bind(borderColor);
    border-width: v-bind(borderWidth);
    border-style: v-bind(boderStyle);
  }
</style>
