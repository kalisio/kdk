<template>
  <div class="q-pl-xs q-pb-sm q-pr-sm">
    <div v-if="layers.length > 0" class="full-width row">
      <template v-for="layer in layers">
        <div class="col-6 q-pa-xs" :key="layer.name">
          <q-card 
            :id="layer.name" 
            v-ripple 
            class="k-layer-card" 
            v-bind:class="{ 'k-layer-card-active': selectedLayer === layer.name }"
            @click="onLayerClicked(layer)"
          >
            <q-img :src="layer.iconUrl" :ratio="16/9">
              <q-icon 
                v-if="selectedLayer === layer.name" 
                class="absolute all-pointer-events" 
                size="24px" 
                name="las la-check-circle" 
                color="primary" 
                style="top: 8px; left: 8px; background-color: #00000033; border-radius: 16px" />
              <q-tooltip 
                v-if="(layer.tooltip || layer.description) && $q.platform.is.desktop" 
                :delay="1000" 
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
import { QRadio } from 'quasar'

export default {
  name: 'k-base-layers-selector',
  components: {
    QRadio
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
  data () {
    return {
      selectedLayer: null
    }
  },
  methods: {
    onLayerClicked (layer) {
      const visibleLayer = _.find(this.layers, { isVisible: true })
      if (visibleLayer) this.toggleLayer(visibleLayer)
      if (this.selectedLayer !== layer.name) {
        // Select the new layer
        this.selectedLayer = layer.name
        const layerToSelect = _.find(this.layers, { name: layer.name })
        if (layerToSelect) this.toggleLayer(layerToSelect)
      } else {
        // Unselect the layer
        this.selectedLayer = null
      }
    },
    toggleLayer (layer) {
      const toggleAction = _.find(layer.actions, { id: 'toggle' })
      if (toggleAction) toggleAction.handler()
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-stamp'] = this.$load('frame/KStamp')
    // Look for the default active layer
    const defaultLayer = _.find(this.layers, { isVisible: true })
    if (defaultLayer) this.selectedLayer = defaultLayer.name
  }
}
</script>

<style lang="stylus">
.k-layer-card:hover {
  cursor: pointer;
}
.k-layer-card-active {
  border: 1px solid var(--q-color-primary);
}
</style>