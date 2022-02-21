<template>
  <div class="q-pl-xs q-pb-sm q-pr-sm">
    <div v-if="layers.length > 0" class="full-width row">
      <template v-for="layer in layers">
        <div class="col-6 q-pa-xs" :key="layer.name">
          <q-card
            :id="getId(layer)"
            v-ripple
            class="k-layer-card"
            v-bind:class="{ 'k-layer-card-active': selectedLayer === layer.name }"
            @click="selectedLayer = layer"
          >
            <q-img :src="layer.iconUrl" :ratio="16/9">
              <div
                class="absolute all-pointer-events"
                style="width: 100%; background-color: #00000099; padding: 4px"
              >
                <k-stamp
                  :class="selectedLayer === layer.name ? 'text-secondary' : 'text-white'"
                  :text="layer.name"
                  :icon="selectedLayer === layer.name ? 'las la-check-circle': 'las la-circle'"
                  text-size="0.8rem"
                  icon-size="1.2rem"
                  direction="horizontal" />
              </div>
              <q-tooltip
                v-if="(layer.tooltip || layer.description) && $q.platform.is.desktop"
                :delay="1200"
                anchor="center left"
                self="center right"
                :offset="[20, 0]"
              >
                {{ layer.tooltip || layer.description }}
              </q-tooltip>
            </q-img>
          </q-card>
        </div>
      </template>
    </div>
    <div v-else-if="!options.hideIfEmpty" class="row justify-center q-pb-sm">
      <k-stamp icon="las la-exclamation-circle" icons-size="sm" :text="$t('KLayersSelector.NO_LAYER_AVAILABLE')" direction="horizontal" />
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'k-base-layers-selector',
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
    selectedLayer: {
      get: function () {
        // active layer is the one visible
        const visibleLayer = _.find(this.layers, { isVisible: true })
        return visibleLayer ? visibleLayer.name : null
      },
      set: function (layer) {
        // when defining the selected layer, just perform the action
        // get will pickup the visible layer
        const layerToUnselect = _.find(this.layers, { isVisible: true })
        if (layerToUnselect) this.toggleLayer(layerToUnselect)
        const unselectedLayerName = layerToUnselect ? layerToUnselect.name : undefined
        const layerNameToSelect = layer.name
        if (unselectedLayerName !== layerNameToSelect) {
          const layerToSelect = _.find(this.layers, { name: layerNameToSelect })
          if (layerToSelect) this.toggleLayer(layerToSelect)
        }
      }
    }
  },
  methods: {
    getId (layer) {
      return _.kebabCase(layer.name)
    },
    toggleLayer (layer) {
      const toggleAction = _.find(layer.actions, { id: 'toggle' })
      if (toggleAction) toggleAction.handler()
    }
  },
  beforeCreate () {
    // Load the required components
    this.$options.components['k-stamp'] = this.$load('frame/KStamp')
  }
}
</script>

<style lang="scss">
.k-layer-card:hover {
  cursor: pointer;
}
.k-layer-card-active {
  border: 1px solid var(--q-color-primary);
}
</style>
