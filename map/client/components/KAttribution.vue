<template>
  <div class="q-pa-sm">
    <KShape
      class="text-weight-bold"
      :options="{
        shape: 'circle',
        color: 'white',
        stroke: {
          color: 'primary',
          width: '2'
        },
        text: {
          label: 'i',
          color: 'primary'
        }
      }"
    />
    <q-popup-proxy
      id="attributions-popup"
      transition-show="scale"
      transition-hide="scale"
      anchor="center left"
      self="bottom right"
    >
      <div
        id="attributions-banner" 
        class="bg-white text-primary text-center q-pa-xs"
      >
        <div 
          id="attributions-content"
          v-html="sanitizedAttributions" 
          class="text-caption"
        />
      </div>
    </q-popup-proxy>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { ref, computed, watch } from 'vue'
import { Document } from '../../../core/client/document.js'
import { KShape } from '../../../core/client/components/media'
import { useCurrentActivity } from '../composables'

// Data
const { CurrentActivity } = useCurrentActivity({ selection: false, probe: false })
const attributions = ref({})

// Computed
const sanitizedAttributions = computed(() => {
  let content = ''
  _.forEach(attributions.value, (attribution, layer) => {
    content += `${attribution}<br>`
  })
  return Document.sanitizeHtml(content)
})

// Watch
watch(CurrentActivity, (newActivity, oldActivity) => {
  if (oldActivity) {
    // remove listeners
    oldActivity.value.$engineEvents.off('layer-shown', onShowLayer)
    oldActivity.value.$engineEvents.off('layer-hidden', onHideLayer)
  }
  if (newActivity) {
    // setup attribution
    newActivity.getLayers().forEach((layer) => {
      if (newActivity.isLayerVisible(layer.name)) {
        onShowLayer(layer)
      }
    })
    // install listeners
    newActivity.$engineEvents.on('layer-shown', onShowLayer)
    newActivity.$engineEvents.on('layer-hidden', onHideLayer)
  }
}, { immediate: true })

// Functions
function onShowLayer (layer, engine) {
  if (layer.attribution) { 
    _.set(attributions.value, _.kebabCase(layer.name), layer.attribution)
  }
  console.log(attributions.value)
}
function onHideLayer (layer) {
  if (layer.attribution) {
    _.unset(attributions.value, _.kebabCase(layer.name))
  }
}
</script>
