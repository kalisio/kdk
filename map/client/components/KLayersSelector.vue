<template>
  <q-list dense>
    <template v-for="layer in layers">
      <q-item
        :id="layer.name"
        :key="layer.name"
        :active="layer.isVisible"
        active-class="selected"
        class="cursor-pointer"
        dense>
        <q-item-section avatar @click="onLayerClicked(layer)">
          <q-icon v-if="!layer.iconUrl" :name="layerIcon(layer)" />
          <img v-else :src="layer.iconUrl" width="32" />
        </q-item-section>
        <q-item-section @click="onLayerClicked(layer)">
          <q-item-label lines="1">
            {{ layer.name }}
          </q-item-label>
          <q-item-label caption lines="2">
            {{ layer.description }}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <k-overflow-menu :actions="layerActions(layer)" :context="layer" :dense="$q.screen.lt.md" />
        </q-item-section>
        <q-tooltip v-if="layer.tooltip">
          {{ layer.tooltip }}
        </q-tooltip>
      </q-item>
    </template>
  </q-list>
</template>

<script>
import _ from 'lodash'
import { utils as kCoreUtils } from '../../../core/client'

export default {
  name: 'k-layers-selector',
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
  methods: {
    key (layer, action) {
      return layer.name + '-' + action
    },
    layerIcon (layer) {
      return kCoreUtils.getIconName(layer, 'icon')
    },
    layerActions (layer) {
      // Built-in toggle handler is used to select layer
      return _.filter(layer.actions, action => action.name !== 'toggle')
    },
    toggleLayer (layer) {
      const toggleAction = _.find(layer.actions, { name: 'toggle' })
      if (toggleAction) toggleAction.handler()
    },
    onLayerClicked (layer) {
      if (this.options.exclusive) {
        const selectedLayer = _.find(this.layers, { isVisible: true })
        if (selectedLayer) this.toggleLayer(selectedLayer)
        if (layer === selectedLayer) return
      }
      this.toggleLayer(layer)
    }
  },
  created () {
    // Loads the required components
    this.$options.components['k-overflow-menu'] = this.$load('layout/KOverflowMenu')
  }
}
</script>

<style>
.selected {
  font-weight: bold;
}
</style>
