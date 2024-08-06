<template>
  <div class="fit column">
    <!-- 
      Header
    -->
    <div class="q-pr-xs q-pb-xs">
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
    <q-scroll-area class="fit" @scroll="onScrolled">
      <!--q-list dense-->
        <!-- Orphan layers -->
        <KLayersSelector
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
      <!--/q-list-->
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
import sift from 'sift'
import _ from 'lodash'
import { utils as coreUtils } from '../../../../core/client'
import { getLayersByCategory, getOrphanLayers } from '../../utils'
import { useProject } from '../../composables'
import KLayersSelector from './KLayersSelector.vue'
import KCategoryItem from './KCategoryItem.vue'

export default {
name: 'k-layers-panel',
components: {
  KCategoryItem,
  KLayersSelector
},
props: {
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
  footer: {
    type: [Array, Object],
    default: () => null
  },
  footerClass: {
    type: String,
    default: undefined
}
},
inheritAttrs: false,
data () {
  return {
    orphanLayersOptions: { hideIfEmpty: true }
  }
},
computed: {
  filteredLayers () {
    const filter = (typeof this.layersFilter === 'object' ? sift(this.layersFilter) : this.layersFilter)
    return _.filter(this.layers, filter)
  },
  filteredCategories () {
    const filter = (typeof this.layerCategoriesFilter === 'object' ? sift(this.layerCategoriesFilter) : this.layerCategoriesFilter)
    const filteredCategories = _.filter(this.layerCategories, filter)
    _.forEach(filteredCategories, category => {
      const component = _.get(category, 'component', 'catalog/KLayersSelector')
      if (!category.componentInstance) category.componentInstance = coreUtils.loadComponent(component)
    })
    return filteredCategories
  },
  layersByCategory () {
    return getLayersByCategory(this.filteredLayers, this.filteredCategories)
  },
  orphanLayers () {
    return getOrphanLayers(this.filteredLayers, this.layersByCategory)
  }
},
methods: {
  getCategoryId (category) {
    return _.kebabCase(category.name)
  },
  isCategoryVisible (category) {
    // Show a built-in category only if it has some layers.
    // Indeed, depending on the app configuration, none might be available for this category.
    // User-defined categories are visible by default, even if empty,
    // except if used inside a project as in this case having no layers means we don't want to use this category
    const isEmpty = (this.layersByCategory[category.name].length === 0)
    if (isEmpty) {
      if (this.hasProject()) return false
      else return !_.get(category, 'hideIfEmpty', !category._id)
    }
    return true
  }
},
setup () {
  // Expose
  return {
    ...useProject()
  }
}
}
</script>
