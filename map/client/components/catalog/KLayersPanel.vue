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
      <template v-for="category in filteredCategories">
        <KCategoryItem
          v-if="isCategoryVisible(category)"
          :key="getCategoryId(category)"
          :id="getCategoryId(category)"
          :category="category"
          :layers="layersByCategory[category.name]"
          :forecastModels="forecastModels"
        />
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
import { ref, watchEffect, onMounted } from 'vue'
import { utils as coreUtils } from '../../../../core/client'
import { getLayersByCategory, getOrphanLayers } from '../../utils'
import { useProject } from '../../composables'
import KLayersList from './KLayersList.vue'
import KCategoryItem from './KCategoryItem.vue'

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

// Hooks
onMounted(() => {
  refresh()
})
</script>
