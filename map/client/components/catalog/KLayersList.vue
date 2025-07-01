<template>
  <div>
    <slot name="header" />

    <div v-if="internalLayers.length > 0" :key="layersKey">
      <div
        v-for="(layer, index) in internalLayers"
        :key="layer._id"
        class="draggable-layer"
        :draggable="isDraggable(layer?.scope)"
        @dragstart="onDragStart($event, index, layer)"
        @drop="onDrop($event, index)"
        @dragover.prevent
        @dragenter.prevent
      >
        <div v-if="isDraggable(layer?.scope)" class="drag-handle">☰</div>
        <component
          :is="layerRenderer.component"
          v-bind="layerRenderer.options"
          :layer="layer"
          @toggled="onLayerToggled"
          @filter-toggled="onLayerFilterToggled"
          style="flex-grow: 1;"
        />
      </div>
    </div>

    <div v-else-if="!options.hideIfEmpty" class="row justify-center q-pa-sm">
      <KStamp
        icon="las la-exclamation-circle"
        icon-size="sm"
        :text="$t('KLayersList.NO_LAYER_AVAILABLE')"
        direction="horizontal"
      />
    </div>

    <slot name="footer" />
  </div>
</template>

<script setup>
import _ from 'lodash'
import { computed, ref } from 'vue'
import { api, utils } from '../../../../core/client'
import KStamp from '../../../../core/client/components/KStamp.vue'
import { getCategories } from '../../utils.map'

// Props
const props = defineProps({
  category: {
    type: Object,
    default: () => {}
  },
  layers: {
    type: Array,
    default: () => []
  },
  options: {
    type: Object,
    default: () => {}
  }
})

// Local state for layers to allow reordering
const internalLayers = ref(props.layers.map((layer, i) => ({ ...layer, order: i })))
const draggedIndex = ref(null)

// Computed
const layerRenderer = computed(() => ({
  component: utils.loadComponent(_.get(props.options, 'renderer', 'catalog/KFilteredLayerItem')),
  options: _.get(props.options, 'renderer.options', {})
}))
const layersKey = computed(() => props.layers.map(l => l._id).join('-'))

// watch(() => props.layers, (newLayers) => { internalLayers.value = [...newLayers] }, { deep: true })

// Drag & Drop handlers
function onDragStart (event, index, layer) {
  draggedIndex.value = index
  event.dataTransfer.dropEffect = 'move'
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('layerName', layer.name)
}

async function onDrop (event, targetIndex) {
  const layerName = event.dataTransfer.getData('layerName')
  const categories = await getCategories()
  // TODO if layerId is unavailable because of user scope object lacking the property, use something else in the dataTransfer
  if (layerName) { // target is layer
    const layer = internalLayers.value.find((l) => l?.name === layerName)
    const isLayerFromCurrentCategory = props.category?.layers?.includes(layerName)
    if (isLayerFromCurrentCategory) {
      // TODO: instead of doing all that, send event upwards to splice category
      layer.order = targetIndex
      const otherLayers = internalLayers.value.filter((l) => l.name !== layerName)
      for (const otherLayer of otherLayers) {
        if (targetIndex > draggedIndex.value) {
          if (otherLayer.order <= targetIndex && otherLayer.order > draggedIndex.value) otherLayer.order--
        }
        if (targetIndex < draggedIndex.value) {
          if (otherLayer.order >= targetIndex && otherLayer.order < draggedIndex.value) otherLayer.order++
        }
      }
      internalLayers.value.sort((a, b) => a.order - b.order)
    } else { // layer isn't from current category

    }
  } else {
    const categoryID = null
    if (categoryID) { // target is category

    }
  }
}

// Layer toggle handling
function toggleLayer (layer) {
  const toggleAction = _.find(layer.actions, { id: 'toggle' })
  if (toggleAction) toggleAction.handler()
}

async function onLayerToggled (layer) {
  if (layer.isDisabled) return
  if (props.options.exclusive) {
    // Due to v-model the visible flag has already been changed on the layer
    // Simply reset others layers before activating the new one to avoid any problem
    const visibleLayers = _.filter(props.layers, { isVisible: true })
    for (const visibleLayer of visibleLayers) {
      if (visibleLayer !== layer) await toggleLayer(visibleLayer)
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

// Misc functions
function isDraggable (scope) {
  return scope && scope === 'user' && api.can('update', 'catalog')
}
</script>

<style scoped>
.draggable-layer {
  display: flex;
  align-items: center;
}
.drag-handle {
  visibility: hidden;
  opacity: 0;
  width: 0;
  cursor: move;
  transform: scaleX(0.001);
  margin-left: 0px;
  margin-right: 0px;
  font-size: 18px;
  user-select: none;
  transition: visibility 0s, opacity 0.2s, margin-right 0.2s, margin-left 0.2s, transform 0.2s linear;
}
.draggable-layer:hover .drag-handle {
  margin-right: 16px;
  margin-left: 8px;
  transform: scaleX(1);
  visibility: visible;
  opacity: 1;
  transition-duration: 0.2s;
}
</style>
