<template>
  <q-list dense>
    <slot name="header" />
    <div v-if="layers.length > 0">
      <template v-for="layer in layers">
        <q-item
          :id="layer.name"
          :key="layer.name"
          :active="layer.isVisible"
          :disable="layer.isDisabled"
          :clickable="!layer.isDisabled"
          active-class="selected"
          class="cursor-pointer"
          dense>
          <q-item-section avatar @click="onLayerClicked(layer)">
            <q-icon v-if="!layer.iconUrl" :name="layerIcon(layer)"></q-icon>
            <img v-else :src="layer.iconUrl" width="32" />
            <!-- badge -->
            <q-badge v-if="layer.badge" v-bind="layer.badge">
              <q-icon v-if="layer.badge.icon" v-bind="layer.badge.icon" />
            </q-badge>
          </q-item-section>
          <!-- item label -->
          <q-item-section @click="onLayerClicked(layer)">
            <q-item-label lines="1">
              {{ layer.label || layer.name }}
            </q-item-label>
            <q-item-label v-if="options.description" caption lines="2">
              {{ layer.description }}
            </q-item-label>
          </q-item-section>
          <!-- actions -->
          <q-item-section side>
            <k-menu :id="`${layer.name}-actions`" :content="layerActions(layer)" :context="layer" action-renderer="item" />
          </q-item-section>
          <!-- tooltip -->
          <q-tooltip v-if="(layer.tooltip || layer.description) && $q.platform.is.desktop" :delay="1000"
            anchor="center left" self="center right" :offset="[20, 0]">
            {{ layer.tooltip || layer.description }}
          </q-tooltip>
        </q-item>
      </template>
    </div>
    <div v-else>
      <k-label :text="$t('KLayersSelector.NO_LAYER_AVAILABLE')" alignement="center-top" direction="horizontal" />
    </div>
    <slot name="footer" />
  </q-list>
</template>

<script>
import _ from 'lodash'
import { utils } from '../../../../core/client'

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
      return utils.getIconName(layer, 'icon')
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
      if (layer.isDisabled) return
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
    this.$options.components['k-menu'] = this.$load('frame/KMenu')
    this.$options.components['k-label'] = this.$load('frame/KLabel')
  }
}
</script>

<style>
.selected {
  font-weight: bold;
}
</style>
