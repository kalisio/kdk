<template>
  <div>
    <slot name="header" />
    <div v-if="layers.length > 0">
      <template v-for="layer in layers">
        <component
          :is="layerRenderer.component"
          v-bind="layerRenderer.options"
          :layer="layer"
          @toggled="onLayerToggled"
          @filter-toggled="onLayerFilterToggled"
        />
      </template>
    </div>
    <div v-else-if="!options.hideIfEmpty" class="row justify-center q-pa-sm">
      <KStamp 
        icon="las la-exclamation-circle" 
        icon-size="sm" 
        :text="$t('KLayersSelector.NO_LAYER_AVAILABLE')" 
        direction="horizontal" 
      />
    </div>
    <slot name="footer" />
  </div>
</template>

<script setup>
import _ from 'lodash'
import { computed } from 'vue'
import { utils } from '../../../../core/client'
import { KStamp } from '../../../../core/client/components/KStamp.vue'

// Props
const props = defineProps({
  layers: {
    type: Array,
    default: () => []
  },
  options: {
    type: Object,
    default: () => {}
  }
})

// Computed
const layerRenderer = computed(() => {
  return {
    component: utils.loadComponent(_.get(props.options, 'renderer', 'catalog/KFilteredLayerItem')),
    options: _.get(props.options, 'renderer.options', {})
  }
})

// Functions
function  toggleLayer (layer) {
  const toggleAction = _.find(layer.actions, { id: 'toggle' })
  if (toggleAction) toggleAction.handler()
}
async function onLayerToggled (layer) {
  if (layer.isDisabled) return
  if (props.options.exclusive) {
    // Due to v-model the visible flag has already been changed on the layer
    // Simply reset others layers before activating the new one to avoid any problem
    const visibleLayers = _.filter(props.layers, { isVisible: true })
    for (let i = 0; i < visibleLayers.length; i++) {
      const visibleLayer = visibleLayers[i]
      if (visibleLayer !== layer) await toggleLayer(visibleLayers[i])
    }
  }
  await toggleLayer(layer)
}
function toggleLayerFilter (layer, filter) {
  const toggleFilterAction = _.find(layer.actions, { id: 'toggle-filter' })
  if (toggleFilterAction) toggleFilterAction.handler(filter)
}
function onLayerFilterToggled (layer, filter) {
  if (layer.isDisabled) return
  toggleLayerFilter(layer, filter)
}
</script>
