<template>
  <k-layers-panel
    :layers="filteredLayers"
    :layerCategories="filteredCategories" />
</template>

<script>
import _ from 'lodash'
import KLayersPanel from './KLayersPanel.vue'

export default {
  name: 'k-users-layers-panel',
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
  }
}
</script>
