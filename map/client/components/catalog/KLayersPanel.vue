<template>
  <KScrollArea :maxHeight="scrollAreaMaxHeight" :style="panelStyle">
    <q-list dense bordered>
      <slot name="header" />
      <k-layers-selector
        :layers="orphanLayers"
        :options="{ hideIfEmpty: true }" />
      <template v-for="category in layerCategories">
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
            :forecastModelHandlers="forecastModelHandlers"
            :forecastModel="forecastModel"
            :options="category.options || category">
          </component>
        </q-expansion-item>
      </template>
      <slot name="footer" />
    </q-list>
  </KScrollArea>
</template>

<script>
import sift from 'sift'
import _ from 'lodash'
import { loadComponent } from '../../../../core/client/utils'
import { KScrollArea } from '../../../../core/client/components'
import { catalogPanel } from '../../mixins'
import KLayersSelector from './KLayersSelector.vue'

export default {
  name: 'k-layers-panel',
  components: {
    KScrollArea,
    KLayersSelector
  },
  mixins: [catalogPanel],
  props: {
    layers: {
      type: Array,
      default: () => {}
    },
    layerCategories: {
      type: Array,
      default: () => []
    },
    forecastModels: {
      type: Array,
      default: () => []
    },
    forecastModelHandlers: {
      type: Object,
      default: () => {}
    },
    forecastModel: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    layers: {
      handler () {
        this.categorize()
      }
    },
    layerCategories: {
      handler () {
        this.categorize()
      }
    }
  },
  computed: {
    layersByCategory () {
      const layersByCategory = {}
      _.forEach(this.layerCategories, category => {
        // Built-in categories use filtering while user-defined ones use layers list
        let filter = null
        if (_.has(category, 'options.filter')) {
          filter = _.get(category, 'options.filter')
        } else if (_.has(category, 'layers')) {
          filter = { name: { $in: _.get(category, 'layers') } }
        }
        // If the list of layers in category is empty we can have a null filter
        layersByCategory[category.name] = filter ? _.remove(this.layers, sift(filter)) : []
      })
      return layersByCategory
    },
    orphanLayers () {
      // Filters system layers
      const categories = _.flatten(_.values(this.layersByCategory))
      return _.difference(this.layers, categories)
    }
  },
  methods: {
    getId (category) {
      return _.kebabCase(category.name)
    },
    isVisible (category) {
      // User-defined categories are always visible, even if empty
      if (category._id) return true
      // Built-in categories only if not empty as depending on the configuration
      // built-in layers might be unavailable
      const isEmpty = (this.layersByCategory[category.name].length > 0)
      return (isEmpty ? _.get(category, 'hideIfEmpty', true) : true)
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
      // return this.layerCategories.length === 1
      // robin: to not break existing apps, just return false when options.open is not defined
      return false
    },
    categorize () {
      _.forEach(this.layerCategories, category => {
        const component = _.get(category, 'component', 'catalog/KLayersSelector')
        if (!category.componentInstance) category.componentInstance = loadComponent(component)
      })
    }
  },
  created () {
    // Categorize layers
    this.categorize()
  }
}
</script>
