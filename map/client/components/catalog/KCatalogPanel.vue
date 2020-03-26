<template>
  <q-list dense bordered>
    <template v-for="category in layerCategories">
      <q-expansion-item expand-separator
        v-if="layersByCategory[category.name].length > 0"
        :key="category.name"
        :icon="category.icon"
        :label="$t(category.label)">
        <component 
          :is="category.componentKey" 
          :layers="layersByCategory[category.name]" 
          :forecastModels="forecastModels"
          :forecastModelHandlers="forecastModelHandlers"
          :forecastModel="forecastModel"
          :options="category.options"></component>
      </q-expansion-item>
    </template>
  </q-list>
</template>

<script>
import _ from 'lodash'
import path from 'path'

export default {
  name: 'k-catalog-panel',
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
  computed: {
    layersByCategory () {
      const layers = _.values(this.layers)
      const layersByCategory = {}
      this.layerCategories.forEach(category => {
        layersByCategory[category.name] = layers.filter(sift(_.get(category, 'options.filter', {})))
      })
      return layersByCategory
    }
  },
  created () {
    // Load the required components
    this.layerCategories.forEach(category => {
      const component = _.get(category, 'component', 'catalog/KLayersSelector')
      console.log(component)
      const componentKey = _.kebabCase(path.basename(component))
      console.log(componentKey)
      category['componentKey'] = componentKey
      if (!this.$options.components.componentKey) this.$options.components[componentKey] = this.$load(component)
    })
  }
}
</script>
