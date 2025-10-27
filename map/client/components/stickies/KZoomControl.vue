<template>
  <div :class="(props.vertical ? 'column reverse' : 'row') + (props.square ? ' k-zoom-control' : '')">
    <q-btn
      id="zoom-out"
      icon="remove"
      tooltip="mixins.activity.ZOOM_OUT"
      :handler="onZoomOut"
      color="white"
      text-color="grey-9"
      :flat="props.square"
      round
    />
    <q-separator v-if="props.square" :vertical="!props.vertical" />
    <div v-else style="height: 8px;" />
    <q-btn
      id="zoom-in"
      icon="add"
      tooltip="mixins.activity.ZOOM_IN"
      :handler="onZoomIn"
      color="white"
      text-color="grey-9"
      :flat="props.square"
      round
    />
  </div>
</template>

<script setup>
import { composables as kCoreComposables } from '@kalisio/kdk/core.client'

const { CurrentActivity } = kCoreComposables.useCurrentActivity()
const { onZoomOut, onZoomIn } = CurrentActivity.value

const props = defineProps({
  vertical: {
    default: true,
    type: Boolean
  },
  square: {
    default: false,
    type: Boolean
  }
})
</script>

<style>
.k-zoom-control {
  border: 1px solid lightgrey;
  background: white;
}
</style>
