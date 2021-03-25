<template>
  <q-scroll-area :style="computedStyle">
    <q-list dense bordered>
      <slot name="header" />
      <template v-for="category in layerCategories">
        <q-expansion-item
          :key="category.name"
          :id="category.name"
          :header-class="getColor(category)"
          :icon="getIcon(category)"
          :label="$t(category.name)"
          expand-separator>
          <component
            :is="category.componentKey"
            :layers="layersByCategory[category.name]"
            :forecastModels="forecastModels"
            :forecastModelHandlers="forecastModelHandlers"
            :forecastModel="forecastModel"
            :options="category.options || {}"></component>
        </q-expansion-item>
      </template>
      <slot name="footer" />
    </q-list>
  </q-scroll-area>
</template>

<script>
import sift from 'sift'
import _ from 'lodash'
import path from 'path'

export default {
  name: 'k-catalog',
  props: {
    layers: {
      type: Object,
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
    layerCategories: function () {
      // Make configured categories reactive as catalog categoriess are built from
      this.categorize()
    }
  },
  computed: {
    computedStyle () {
      if (this.$q.screen.lt.md) return 'height: 65vh; min-width: 300px;'
      if (this.$q.screen.lt.lg) return 'height: 70vh; min-width: 350px;'
      return 'height: 75vh; min-width: 400px;'
    },
    layersByCategory () {
      console.log(this.layerCategories)
      const layers = _.values(this.layers)
      const layersByCategory = {}
      this.layerCategories.forEach(category => {
        // Built-in categories use filtering while user-defined ones use layers list
        let filter = {}
        if (_.has(category, 'options.filter')) {
          filter = _.get(category, 'options.filter')
        } else if (_.has(category, 'layers')) {
          filter = { name: { $in: _.get(category, 'layers') } }
        }
        layersByCategory[category.name] = _.remove(layers, sift(filter))
      })
      return layersByCategory
    }
  },
  methods: {
    getColor (category) {
      return 'text-' + _.get(category, 'icon.color', 'primary')
    },
    getIcon (category) {
      return _.get(category, 'icon.name', _.get(category, 'icon', 'las la-layer-group'))
    },
    categorize () {
      this.layerCategories.forEach(category => {
        const component = _.get(category, 'component', 'catalog/KLayersSelector')
        const componentKey = _.kebabCase(path.basename(component))
        category.componentKey = componentKey
        if (!this.$options.components[componentKey]) this.$options.components[componentKey] = this.$load(component)
      })
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-panel'] = this.$load('frame/KPanel')
    // Categorize layers
    this.categorize()
  }
}
</script>
