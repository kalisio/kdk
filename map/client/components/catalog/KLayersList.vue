<template>
  <div>
    <slot name="header" />

    <div v-if="layers && layers.length > 0">
      <div
        v-for="(layer, index) in layers"
        :key="index"
        class="draggable-layer"
        :draggable="isDraggable()"
        @dragstart="onDragStart($event, index, layer)"
        @drop="onDrop($event, index)"
        @dragover.prevent
        @dragenter.prevent
      >
        <q-icon v-if="isDraggable()" name="las la-grip-lines" color="primary" text-color="black" class="drag-handle" />
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
import { utils } from '../../../../core/client'
import KStamp from '../../../../core/client/components/KStamp.vue'
import { useCurrentActivity } from '../../composables'
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
  layersDraggable: {
    type: [Boolean, Function],
    default: () => false
  },
  options: {
    type: Object,
    default: () => {}
  }
})

// Emits
const emit = defineEmits(['orphan-layer-updated'])

// Data
const draggedIndex = ref(null)
const { CurrentActivity } = useCurrentActivity()
const { updateCategoriesOrder, updateLayersOrder } = CurrentActivity.value

// Computed
const layerRenderer = computed(() => ({
  component: utils.loadComponent(_.get(props.options, 'renderer', 'catalog/KFilteredLayerItem')),
  options: _.get(props.options, 'renderer.options', {})
}))

// Drag & Drop handlers
function onDragStart (event, index, layer) {
  draggedIndex.value = index
  event.dataTransfer.dropEffect = 'move'
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('draggedIndex', draggedIndex.value)
  event.dataTransfer.setData('layerName', layer?.name)
  event.dataTransfer.setData('categoryID', props.category?._id)
}

async function onDrop (event, targetIndex) {
  const layerName = event.dataTransfer.getData('layerName')
  const sourceCategoryId = event.dataTransfer.getData('categoryID')
  if (!props.category?._id) { // source and target are orphan layers
    if (sourceCategoryId !== 'undefined') return
    emit('orphan-layer-updated', targetIndex, draggedIndex.value)
    return
  }
  if (layerName && layerName.length > 0) { // source is layer
    const isLayerFromCurrentCategory = props.category._id === sourceCategoryId
    if (isLayerFromCurrentCategory) { // reorder layers in category
      const categoryLayers = props.category.layers
      categoryLayers.splice(targetIndex, 0, categoryLayers.splice(draggedIndex.value, 1)[0])
      await updateLayersOrder(props.category._id, { layers: categoryLayers })
    } else { // layer isn't from current category: move layer to current category
      // we are cloning currentCategoryLayers to avoid triggering unneeded reactivity
      // (reactivity isn't needed here because updateLayersOrder will trigger a refresh anyway)
      const currentCategoryLayers = _.clone(props.category.layers)
      if (sourceCategoryId === "undefined") { // source is orphan layer
        currentCategoryLayers.splice(targetIndex, 0, layerName)
        await updateLayersOrder(props.category._id, { layers: currentCategoryLayers })
      } else { // source isn't orphan layer
        const sourceCategory = await getCategories({ query: { _id: sourceCategoryId } })
        const sourceCategoryLayers = sourceCategory[0].layers
        currentCategoryLayers.splice(targetIndex, 0, sourceCategoryLayers.splice(draggedIndex.value, 1)[0])
        await updateLayersOrder(props.category._id, { layers: currentCategoryLayers })
        await updateLayersOrder(sourceCategoryId, { layers: sourceCategoryLayers })
      }
    }
  } else { // drag source is category: reorder categories with target layer's category
    const sourceCategoryId = event.dataTransfer.getData('categoryID')
    const targetCategoryId = props.category._id
    await updateCategoriesOrder(sourceCategoryId, targetCategoryId)
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

function isDraggable () {
  return (typeof props.layersDraggable === 'function' ? props.layersDraggable(props.category) : props.layersDraggable)
}
</script>

<style scoped>
.draggable-layer {
  display: flex;
  align-items: center;
}
.drag-handle {
  cursor: move;
  margin-left: 16px;
  font-size: 18px;
  user-select: none;
}
</style>
