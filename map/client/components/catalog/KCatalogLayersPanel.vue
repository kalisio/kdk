<template>
  <k-layers-panel
    :layers="filteredLayers"
    :layerCategories="filteredCategories"
    :forecastModels="forecastModels"
    :forecastModelHandlers="forecastModelHandlers"
    :forecastModel="forecastModel" />
</template>

<script>
import _ from 'lodash'
import KLayersPanel from './KLayersPanel.vue'

export default {
  name: 'k-catalog-layers-panel',
  components: {
    KLayersPanel
  },
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
    filteredLayers () {
      return _.filter(this.layers, layer => {
        const scope = _.get(layer, 'scope', '')
        const filter = ['user', 'system', 'activity']
        return !filter.includes(scope)
      })
    },
    filteredCategories () {
      return _.filter(this.layerCategories, category => {
        return !_.has(category, '_id')
      })
    }
  }
}
</script>
