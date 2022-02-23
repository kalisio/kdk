<template>
  <k-layers-panel
    :layers="filteredLayers"
    :layerCategories="filteredCategories" />
</template>

<script>
import _ from 'lodash'

export default {
  name: 'k-users-layers-panel',
  props: {
    layers: {
      type: Object,
      default: () => {}
    },
    layerCategories: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    filteredLayers () {
      return _.filter(this.layers, layer => {
        const scope = _.get(layer, 'scope', '')
        return scope === 'user' || scope === 'activity'
      })
    },
    filteredCategories () {
      return _.filter(this.layerCategories, category => {
        return _.has(category, '_id')
      })
    }
  },
  beforeCreate () {
    // Load the required components
    this.$options.components['k-layers-panel'] = this.$load('catalog/KLayersPanel')
  }
}
</script>
