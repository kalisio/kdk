<template>
  <div :class="'k-zoom-control ' + (props.vertical ? 'column reverse' : 'row')">
    <KAction
      id="zoom-out"
      icon="remove"
      tooltip="mixins.activity.ZOOM_OUT"
      renderer="button"
      :handler="onZoomOut"
    />
    <q-separator :vertical="!props.vertical" />
    <KAction
      id="zoom-in"
      icon="add"
      tooltip="mixins.activity.ZOOM_IN"
      renderer="button"
      :handler="onZoomIn"
    />
  </div>
</template>

<script setup>
import { composables as kCoreComposables } from '@kalisio/kdk/core.client'

const { CurrentActivity } = kCoreComposables.useCurrentActivity()
const { onZoomOut, onZoomIn } = CurrentActivity.value

const props = defineProps({
  vertical: {
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
