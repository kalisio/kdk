<template>
  <div :class="(vertical ? 'column reverse' : 'row') + (square ? ' k-zoom-control' : '')">
    <q-btn
      id="zoom-out"
      icon="remove"
      tooltip="mixins.activity.ZOOM_OUT"
      :color="color"
      :text-color="textColor"
      :flat="square"
      round
      @click="onZoomOutFn"
      :size="size"
    />
    <q-separator v-if="square" :vertical="!vertical" />
    <div v-else style="height: 8px;" />
    <q-btn
      id="zoom-in"
      icon="add"
      tooltip="mixins.activity.ZOOM_IN"
      :color="color"
      :text-color="textColor"
      :flat="square"
      round
      @click="onZoomInFn"
      :size="size"
    />
  </div>
</template>

<script setup>
import { composables as kCoreComposables } from '@kalisio/kdk/core.client'

// Props
defineProps({
  vertical: {
    type: Boolean,
    default: true
  },
  square: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: '10px',
  },
  color: {
    type: String,
    default: 'white'
  },
  textColor: {
    type: String,
    default: 'grey-9'
  }
})

// Data
const { CurrentActivity } = kCoreComposables.useCurrentActivity()

// Functions
function onZoomOutFn () {
  if (CurrentActivity.value && typeof CurrentActivity.value?.onZoomOut === 'function') {
    CurrentActivity.value.onZoomOut()
  }
}
function onZoomInFn () {
  if (CurrentActivity.value && typeof CurrentActivity.value?.onZoomIn === 'function') {
    CurrentActivity.value.onZoomIn()
  }
}
</script>

<style>
.k-zoom-control {
  border: 1px solid lightgrey;
  background: white;
}
</style>
