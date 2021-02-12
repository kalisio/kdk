<template>
  <q-scroll-area :style="computedStyle">
    <q-list dense bordered>
      <slot name="header" />
      <template v-for="category in layerCategories">
        <q-expansion-item
          v-if="layersByCategory[category.name].length > 0"
          :key="category.name"
          :id="category.name"
          header-class="text-primary"
          :icon="category.icon"
          :label="$t(category.label)"
          expand-separator>
          <component
            :is="category.componentKey"
            :layers="layersByCategory[category.name]"
            :forecastModels="forecastModels"
            :forecastModelHandlers="forecastModelHandlers"
            :forecastModel="forecastModel"
            :options="category.options"></component>
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
    computedStyle () {
      if (this.$q.screen.lt.md) return 'height: 65vh; min-width: 300px;'
      if (this.$q.screen.lt.lg) return 'height: 70vh; min-width: 350px;'
      return 'height: 75vh; min-width: 400px;'
    },
    layersByCategory () {
      const layers = _.values(this.layers)
      const layersByCategory = {}
      this.layerCategories.forEach(category => {
        layersByCategory[category.name] = layers.filter(sift(_.get(category, 'options.filter', {})))
      })
      return layersByCategory
    }
  },
  watch: {
    layerCategories: function () {
      this.refresh()
    }
  },
  methods: {
    refresh () {
      this.layerCategories.forEach(category => {
        const component = _.get(category, 'component', 'catalog/KLayersSelector')
        const componentKey = _.kebabCase(path.basename(component))
        category.componentKey = componentKey
        if (!this.$options.components[componentKey]) this.$options.components[componentKey] = this.$load(component)
      })
    }
  },
  created () {
    this.refresh()
  }
}
</script>