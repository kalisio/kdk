<template>
  <div :class="(vertical ? 'column reverse' : 'row') + (square ? ' k-zoom-control' : '')">
    <q-btn
      id="zoom-out"
      icon="remove"
      tooltip="mixins.activity.ZOOM_OUT"
      color="white"
      text-color="grey-9"
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
      color="white"
      text-color="grey-9"
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
    default: true,
    type: Boolean
  },
  square: {
    default: false,
    type: Boolean
  },
  size: {
    default: '11px',
    type: String
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
