<template>
  <div>
    <slot name="header" />
    <div v-if="layers.length > 0">
      <template v-for="layer in layers">
        <component :is="layerRenderer.component" v-bind="layerRenderer.options" :layer="layer"
          @toggled="onLayerToggled" @filter-toggled="onLayerFilterToggled"/>
      </template>
    </div>
    <div v-else-if="!options.hideIfEmpty" class="row justify-center q-pa-sm">
      <KStamp icon="las la-exclamation-circle" icon-size="sm" :text="$t('KLayersSelector.NO_LAYER_AVAILABLE')" direction="horizontal" />
    </div>
    <slot name="footer" />
  </div>
</template>

<script>
import _ from 'lodash'
import { utils } from '../../../../core/client'
import { KStamp } from '../../../../core/client/components'

export default {
  name: 'k-layers-selector',
  components: {
    KStamp
  },
  props: {
    layers: {
      type: Array,
      default: () => []
    },
    options: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    layerRenderer () {
      return {
        component: utils.loadComponent(_.get(this.options, 'renderer', 'catalog/KFilteredLayerItem')),
        options: _.get(this.options, 'renderer.options', {})
      }
    }
  },
  methods: {
    toggleLayer (layer) {
      const toggleAction = _.find(layer.actions, { id: 'toggle' })
      if (toggleAction) toggleAction.handler()
    },
    async onLayerToggled (layer) {
      if (layer.isDisabled) return
      if (this.options.exclusive) {
        // Due to v-model the visible flag has already been changed on the layer
        // Simply reset others layers before activating the new one to avoid any problem
        const visibleLayers = _.filter(this.layers, { isVisible: true })
        for (let i = 0; i < visibleLayers.length; i++) {
          const visibleLayer = visibleLayers[i]
          if (visibleLayer !== layer) await this.toggleLayer(visibleLayers[i])
        }
      }
      await this.toggleLayer(layer)
    },
    toggleLayerFilter (layer, filter) {
      const toggleFilterAction = _.find(layer.actions, { id: 'toggle-filter' })
      if (toggleFilterAction) toggleFilterAction.handler(filter)
    },
    onLayerFilterToggled (layer, filter) {
      if (layer.isDisabled) return
      this.toggleLayerFilter(layer)
    }
  }
}
</script>
