<template>
  <div class="q-pl-xs q-pb-sm q-pr-sm">
    <div v-if="layers.length > 0" class="full-width row">
      <template v-for="layer in layers">
        <div class="col-6 q-pa-xs" :key="layer.name">
          <q-card :id="layer.name">
            <q-radio class="text-caption" v-model="activeLayer" :val="layer.name" :label="$t(layer.name)" size="xs"/>
            <q-img :src="layer.iconUrl" :ratio="16/9">
              <q-tooltip v-if="(layer.tooltip || layer.description) && $q.platform.is.desktop" :delay="1000" anchor="center left" self="center right" :offset="[20, 0]">
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
  computed: {
    activeLayer: {
      get: function () {
        // active layer is the one visible
        const selectedLayer = _.find(this.layers, { isVisible: true })
        return selectedLayer ? selectedLayer.name : null
      },
      set: function (newValue) {
        // when defining activeLayer, just perform the action
        // get will pickup the visible layer
        const selectedLayer = _.find(this.layers, { isVisible: true })
        if (selectedLayer) this.toggleLayer(selectedLayer)
        const layerToSelect = _.find(this.layers, { name: newValue })
        if (layerToSelect) this.toggleLayer(layerToSelect)
      }
    }
  },
  methods: {
    toggleLayer (layer) {
      const toggleAction = _.find(layer.actions, { id: 'toggle' })
      if (toggleAction) toggleAction.handler()
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-stamp'] = this.$load('frame/KStamp')
  }
}
</script>
