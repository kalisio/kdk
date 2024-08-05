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
    <q-scroll-area class="col">
      <q-list dense>
        <!-- Orphan layers -->
        <KLayersSelector
          :layers="orphanLayers"
          :options="{ hideIfEmpty: true }"
        />
        <!-- Categorized layers -->
        <template v-for="category in filteredCategories">
          <q-expansion-item
            v-if="isVisible(category)"
            :key="getId(category)"
            :id="getId(category)"
            :header-class="getHeaderClass(category)"
            :icon="getIcon(category)"
            :label="$t(category.name)"
            :default-opened="getDefaultOpened(category)"
            expand-separator>
            <component
              :is="category.componentInstance"
              :layers="layersByCategory[category.name]"
              :forecastModels="forecastModels"
              :options="category.options || category">
            </component>
          </q-expansion-item>
        </template>
      </q-list>
    </q-scroll-area>
    <!-- 
      Footer
    -->    
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
import { loadComponent } from '../../../../core/client/utils'
import { getLayersByCategory, getOrphanLayers } from '../../utils'
import { useProject } from '../../composables'
import KLayersSelector from './KLayersSelector.vue'

export default {
  name: 'k-layers-panel',
  components: {
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
        if (!category.componentInstance) category.componentInstance = loadComponent(component)
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
    getId (category) {
      return _.kebabCase(category.name)
    },
    isVisible (category) {
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
    },
    getHeaderClass (category) {
      if (category.headerClass) return category.headerClass
      return 'text-' + _.get(category, 'icon.color', 'primary')
    },
    getIcon (category) {
      return _.get(category, 'icon.name', _.get(category, 'icon'))
    },
    getDefaultOpened (category) {
      // if category explicitely specify default opened state, use that
      if (_.has(category, 'options.open')) return category.options.open
      // otherwise, defaut open when there's only one category
      // return this.filteredCategories.length === 1
      // robin: to not break existing apps, just return false when options.open is not defined
      return false
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
