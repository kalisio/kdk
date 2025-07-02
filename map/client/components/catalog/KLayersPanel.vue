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
        :layers="orphanLayers"
        :options="orphanLayersOptions"
      />
      <!-- Categorized layers -->
      <template v-for="(category, index) in filteredCategories">
        <KCategoryItem
          v-if="isCategoryVisible(category)"
          :key="getCategoryId(category)"
          :id="getCategoryId(category)"
          :category="category"
          :layers="layersByCategory[category.name]"
          :forecastModels="forecastModels"
          @layerMoved="handleLayerMove"
        >
          <template v-slot:header>
            <div
              :key="index"
              class="draggable-category"
              :draggable="isDraggable(category?._id)"
              @dragstart="onDragStart($event, index, category)"
              @drop="onDrop($event, index)"
              @dragover.prevent
              @dragenter.prevent
            >
              <q-item-section v-if="isDraggable(category?._id)" avatar class="drag-handle">
                <q-icon name="las la-braille" color="primary" text-color="black" />
              </q-item-section>

              <q-item-section>
                {{ category?._id ? category.name : i18n.t(category.name) }}
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
import { onMounted, ref, watchEffect } from 'vue'
import { api, utils as coreUtils, i18n } from '../../../../core/client'
import { useProject } from '../../composables'
import { getLayersByCategory, getOrphanLayers } from '../../utils'
import KCategoryItem from './KCategoryItem.vue'
import KLayersList from './KLayersList.vue'

// Props
const props = defineProps({
  layers: {
    type: [Object, Array],
    default: () => []
  },
  layersFilter: {
    type: [Object, Function],
    default: () => {}
  },
  layerCategories: {
    type: Array,
    default: () => []
  },
  layerCategoriesFilter: {
    type: [Object, Function],
    default: () => {}
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
const orphanLayersOptions = { hideIfEmpty: true }
const filteredCategories = ref([])
const layersByCategory = ref({})
const orphanLayers = ref([])
const draggedIndex = ref(null)

// Watch
watchEffect(() => { refresh() })

// Functions
function getCategoryId (category) {
  return _.kebabCase(category.name)
}
function isCategoryVisible (category) {
// Show a built-in category only if it has some layers.
// Indeed, depending on the app configuration, none might be available for this category.
// User-defined categories are visible by default, even if empty,
// except if used inside a project as in this case having no layers means we don't want to use this category
  const isEmpty = (layersByCategory.value[category.name].length === 0)
  if (isEmpty) {
    if (hasProject()) return false
    else return !_.get(category, 'hideIfEmpty', !category._id)
  }
  return true
}
function refresh () {
  // filter layers
  const layersFilter = (typeof props.layersFilter === 'object' ? sift(props.layersFilter) : props.layersFilter)
  const filteredLayers = _.filter(props.layers, layersFilter)
  // filter categories
  const categoriesFilter = (typeof props.layerCategoriesFilter === 'object' ? sift(props.layerCategoriesFilter) : props.layerCategoriesFilter)
  filteredCategories.value = _.filter(props.layerCategories, categoriesFilter)
  _.forEach(filteredCategories.value, category => {
    const component = _.get(category, 'component', 'catalog/KLayersList')
    if (!category.componentInstance) category.componentInstance = coreUtils.loadComponent(component)
  })
  // compute layers by categories and orphans layers
  layersByCategory.value = getLayersByCategory(filteredLayers, filteredCategories.value)
  orphanLayers.value = getOrphanLayers(filteredLayers, layersByCategory.value)
}//, 100)

function onDragStart (event, index, category) {
  draggedIndex.value = index
  event.dataTransfer.dropEffect = 'move'
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('categoryID', category._id)
}

function onDrop (event, targetIndex) {
  const categoryID = event.dataTransfer.getData('categoryID')
}

function isDraggable (categoryId) {
  return !!categoryId && api.can('update', 'catalog')
}

function handleLayerMove(draggedIndex, targetIndex) {
  console.log("layer moved")
}

// Hooks
onMounted(() => {
  refresh()
})
</script>

<style scoped>
.draggable-category {
  display: flex;
  align-items: center;
  flex-grow: 1;
}
.drag-handle {
  visibility: hidden;
  opacity: 0;
  min-width: 0;
  width: 1px;
  cursor: move;
  transform: scaleX(0.001);
  margin-left: 0px;
  margin-right: 0px;
  padding: 0px;
  user-select: none;
  transition: visibility 0s, opacity 0.2s, margin-right 0.2s, margin-left 0.2s, transform 0.2s linear;
}
.draggable-category:hover .drag-handle {
  margin-right: 32px;
  transform: scaleX(1);
  visibility: visible;
  opacity: 1;
  transition-duration: 0.2s;
}
</style>