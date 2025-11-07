<template>
  <div class="fit column">
    <!--
      Header
    -->
    <div>
      <slot name="header">
        <KPanel
          :content="header"
          :class="headerClass"
        />
        <q-separator inset v-if="header"/>
      </slot>
    </div>
    <!--
      Content
    -->
    <q-scroll-area class="col">
      <!-- Custom content -->
      <slot name="before-content">
        <KPanel
          :content="beforeContent"
          :class="beforeContentClass"
        />
      </slot>
      <!-- Orphan layers -->
      <KLayersList
        :layers="filteredOrphanLayers"
        :layersDraggable="layersDraggable"
        :options="orphanLayersOptions"
        @orphanLayerUpdated="onOrphanLayerUpdated"
      />
      <!-- Categorized layers -->
      <template v-for="(category, index) in filteredCategories">
        <KCategoryItem
          v-if="isCategoryVisible(category)"
          :key="getCategoryId(category)"
          :id="getCategoryId(category)"
          :category="category"
          :layers="layersByCategory[category.name]"
          :layersDraggable="layersDraggable"
          :forecastModels="forecastModels"
        >
          <template v-slot:header>
            <div
              :key="index"
              class="draggable-category"
              :draggable="isDraggable(category)"
              @dragstart="onDragStart($event, index, category)"
              @drop="onDrop($event, index)"
              @dragover.prevent
              @dragenter.prevent
            >
              <q-item-section v-if="isDraggable(category)" avatar class="drag-handle">
                <q-icon name="las la-bars" color="primary" text-color="black" size="20px" />
              </q-item-section>

              <q-icon v-else :name="getCategoryIcon(category)" color="primary" text-color="black" size="20px" style="margin-right: 16px;" />

              <q-item-section>
                {{ i18n.tie(category.name) }}
              </q-item-section>
            </div> 
          </template>       
        </KCategoryItem>
      </template>
      <!-- Custom content -->
      <slot name="after-content">
        <KPanel
          :content="afterContent"
          :class="afterContentClass"
        />
      </slot>
    </q-scroll-area>
    <!--
      Footer
    -->
    <div>
      <slot name="footer">
        <q-separator inset v-if="footer"/>
        <KPanel
          :content="footer"
          :class="footerClass"
        />
      </slot>
    </div>
  </div>
</template>

<script>
// WARNING for now we must declare the inheritAttrs this way. Lint will try to move it. Don't do it.
// TODO: need to updated when switch to vue > 3.3 to be able to declare options
export default {
  inheritAttrs: false
}
</script>

<script setup>
import _ from 'lodash'
import sift from 'sift'
import { ref, watchEffect } from 'vue'
import { utils as coreUtils, i18n } from '../../../../core/client'
import { useCurrentActivity, useProject } from '../../composables'
import { getLayersByCategory } from '../../utils'
import KCategoryItem from './KCategoryItem.vue'
import KLayersList from './KLayersList.vue'

// Props
const props = defineProps({
  layersFilter: {
    type: [Object, Function],
    default: () => {}
  },
  orphanLayersFilter: {
    type: [Object, Function],
    // By default orphan layers are user/activity layers
    default: () => ({ scope: { $in: ['user', 'activity'] } })
  },
  layerCategoriesFilter: {
    type: [Object, Function],
    default: () => {}
  },
  layersDraggable: {
    type: [Boolean, Function],
    default: false
  },
  categoriesDraggable: {
    type: [Boolean, Function],
    default: () => false
  },
  forecastModels: {
    type: Array,
    default: () => []
  },
  header: {
    type: [Array, Object],
    default: () => null
  },
  headerClass: {
    type: String,
    default: undefined
  },
  beforeContent: {
    type: [Array, Object],
    default: () => null
  },
  beforeContentClass: {
    type: String,
    default: undefined
  },
  afterContent: {
    type: [Array, Object],
    default: () => null
  },
  afterContentClass: {
    type: String,
    default: undefined
  },
  footer: {
    type: [Array, Object],
    default: () => null
  },
  footerClass: {
    type: String,
    default: undefined
  }
})

// Data
const { hasProject } = useProject()
const { CurrentActivity } = useCurrentActivity()
const { forecastModels, updateCategoriesOrder, updateLayersOrder, updateOrphanLayersOrder } = CurrentActivity.value
const orphanLayersOptions = { hideIfEmpty: true }
const filteredCategories = ref([])
const layersByCategory = ref({})
const filteredOrphanLayers = ref([])
const draggedIndex = ref(null)

// Watch
watchEffect(() => { refresh() })

// Functions
function getCategoryId (category) {
  return _.kebabCase(category.name)
}
function getCategoryIcon (category) {
  return _.get(category, 'icon.name', _.get(category, 'icon'), 'las la-bars')
}
function isCategoryVisible (category) {
  const options = category.options || category
  // Show a built-in category only if it has some layers.
  // Indeed, depending on the app configuration, none might be available for this category.
  // User-defined categories are visible by default, even if empty,
  // except if used inside a project as in this case having no layers means we don't want to use this category.
  // App might also force to hide it anyway with the hideIfEmpty option.
  const isEmpty = (layersByCategory.value[category.name].length === 0)
  return (isEmpty ? !_.get(options, 'hideIfEmpty', !category._id || hasProject()) : true)
}
function refresh () {
  const { layers, layerCategories, orphanLayers } = CurrentActivity.value
  // filter layers
  const layersFilter = (typeof props.layersFilter === 'object' ? sift(props.layersFilter) : props.layersFilter)
  const filteredLayers = _.filter(layers, layersFilter)
  // filter categories
  const categoriesFilter = (typeof props.layerCategoriesFilter === 'object' ? sift(props.layerCategoriesFilter) : props.layerCategoriesFilter)
  filteredCategories.value = _.filter(layerCategories, categoriesFilter)
  _.forEach(filteredCategories.value, category => {
    const component = _.get(category, 'component', 'catalog/KLayersList')
    if (!category.componentInstance) category.componentInstance = coreUtils.loadComponent(component)
  })
  // compute layers by categories
  layersByCategory.value = getLayersByCategory(filteredLayers, filteredCategories.value)
  // filter orphan layers
  const orphanLayersFilter = (typeof props.orphanLayersFilter === 'object' ? sift(props.orphanLayersFilter) : props.orphanLayersFilter)
  filteredOrphanLayers.value = _.filter(_.filter(orphanLayers, layersFilter), orphanLayersFilter)
}

async function onOrphanLayerUpdated (targetIndex, draggedIndex) {
  const { orphanLayers } = CurrentActivity.value
  const layer = filteredOrphanLayers.value[draggedIndex]
  const targetLayer = (targetIndex >= 0 ? filteredOrphanLayers.value[targetIndex] : null)
  const removedLayers = filteredOrphanLayers.value.splice(draggedIndex, 1)
  // As orphan layers are filtered we might have a mismatch between activity list index and panel index
  // so that we find the layer by name in the activity list to perform the same reordering
  let orphanLayer
  draggedIndex = _.findIndex(orphanLayers, orphanLayer => orphanLayer.name === layer.name)
  if (draggedIndex >= 0) {
    orphanLayer = orphanLayers[draggedIndex]
    orphanLayers.splice(draggedIndex, 1)
  }
  // If not -1 it means the orphan layer has been moved within the orphan layers list.
  // Otherwise it has been moved to another category so that we only need to remove it from the list
  if ((removedLayers.length > 0) && targetLayer) {
    filteredOrphanLayers.value.splice(targetIndex, 0, removedLayers[0])
    // As orphan layers are filtered we might have a mismatch between activity list index and panel index
    // so that we find the layer by name in the activity list to perform the same reordering
    targetIndex = _.findIndex(orphanLayers, orphanLayer => orphanLayer.name === targetLayer.name)
    if (orphanLayer && (targetIndex >= 0)) orphanLayers.splice(targetIndex, 0, orphanLayer)
  }
  await updateOrphanLayersOrder(filteredOrphanLayers.value.map(layer => layer?._id || layer?.name), layer)
}

function onDragStart (event, index, category) {
  draggedIndex.value = index
  event.dataTransfer.dropEffect = 'move'
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('categoryID', category._id)
}

async function onDrop (event, targetIndex) {
  const sourceCategoryId = event.dataTransfer.getData('categoryID')
  const layerName = event.dataTransfer.getData('layerName')
  const layers = _.flatten(_.values(layersByCategory.value)).concat(filteredOrphanLayers.value)
  const layer = layers.find(layer => layer?.name === layerName)
  const draggedLayerIndex = event.dataTransfer.getData('draggedIndex')
  if (layerName && layerName.length > 0) { // drag source is layer: change layer category
    const currentCategoryLayers = filteredCategories.value[targetIndex]?.layers
    // WARNING: Need to use a string here as dataTransfer serialize to strings
    if (sourceCategoryId === 'undefined') { // source is orphan layer
      onOrphanLayerUpdated(-1, draggedLayerIndex)
      currentCategoryLayers.unshift(layerName)
      await updateLayersOrder(filteredCategories.value[targetIndex]._id, { layers: currentCategoryLayers }, layer)
    } else {
      const sourceCategoryLayers = filteredCategories.value.find(category => category?._id === sourceCategoryId)?.layers
      const removedLayers = sourceCategoryLayers.splice(draggedLayerIndex, 1)
      if (removedLayers.length > 0) currentCategoryLayers.unshift(removedLayers[0])
      await updateLayersOrder(filteredCategories.value[targetIndex]._id, { layers: currentCategoryLayers }, layer)
      await updateLayersOrder(sourceCategoryId, { layers: sourceCategoryLayers }, layer)
    }
  } else { // drag source is category: reorder category
    await updateCategoriesOrder(sourceCategoryId, filteredCategories.value[targetIndex]._id)
  }
}

function isDraggable (category) {
  return !!category._id && (typeof props.categoriesDraggable === 'function' ? props.categoriesDraggable(category) : props.categoriesDraggable)
}
</script>

<style scoped>
.draggable-category {
  display: flex;
  align-items: center;
  flex-grow: 1;
}
.drag-handle {
  min-width: 0;
  width: 1px;
  cursor: move;
  margin-left: 0px;
  margin-right: 32px;
  padding: 0px;
  user-select: none;
}
</style>