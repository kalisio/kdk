<template>
  <q-scroll-area :style="`height: 75vh; min-width: ${width}px;`">
    <q-list dense bordered>
      <slot name="header" />
      <template v-for="category in kActivity.layerCategories">
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
            :forecastModels="kActivity.forecastModels"
            :forecastModelHandlers="kActivity.forecastModelHandlers"
            :forecastModel="kActivity.forecastModel"
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
  inject: ['kActivity'],
 /* props: {
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
  */
  computed: {
    width () {
      if (this.$q.screen.lt.md) return 300
      if (this.$q.screen.lt.lg) return 350
      return 400
    },
    layersByCategory () {
      const layers = _.values(this.kActivity.layers)
      const layersByCategory = {}
      this.kActivity.layerCategories.forEach(category => {
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
      this.kActivity.layerCategories.forEach(category => {
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
