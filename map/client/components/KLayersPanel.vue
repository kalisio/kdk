<template>
  <q-list dense bordered>
    <slot name="panel-header"/>
    <template v-for="category in categories">
      <q-expansion-item expand-separator
        v-if="layersByCategory[category.name].length > 0"
        :key="category.name"
        :icon="category.icon"
        :label="$t(category.label)">
        <k-layers-selector
          :layers="layersByCategory[category.name]"
          :options="category.options || {}" />
      </q-expansion-item>
    </template>
    <slot name="panel-footer"/>
  </q-list>
</template>

<script>
import sift from 'sift'
import _ from 'lodash'

export default {
  name: 'k-layers-panel',
  props: {
    layers: {
      type: Object,
      default: () => {}
    },
    categories: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    layersByCategory () {
      const layers = _.values(this.layers)
      const layersByCategory = {}
      this.categories.forEach(category => {
        layersByCategory[category.name] = layers.filter(sift(_.get(category, 'options.filter', {})))
      })
      return layersByCategory
    }
  },
  created () {
    this.$options.components['k-layers-selector'] = this.$load('KLayersSelector')
  }
}
</script>
