<template>
  <div class="q-pl-xs q-pb-sm q-pr-sm">
    <div v-if="layers.length > 0" class="full-width row">
      <template v-for="layer in layers">
        <div class="col-6 q-pa-xs" :key="layer.name">
          <q-card :id="layer.name">
            <q-radio class="text-caption" v-model="activeLayer" :val="layer.name" :label="$t(layer.name)" size="xs" />
            <q-img :src="layer.iconUrl" :ratio="16/9">
              <q-tooltip v-if="(layer.tooltip || layer.description) && $q.platform.is.desktop" :delay="1000" anchor="center left" self="center right" :offset="[20, 0]">
                {{ layer.tooltip || layer.description }}
              </q-tooltip>
            </q-img>
          </q-card>
        </div>
      </template>
    </div>
    <div v-else-if="!options.hideIfEmpty">
      <k-label class="q-pb-md" :text="$t('KLayersSelector.NO_LAYER_AVAILABLE')" alignement="center-top" direction="horizontal" />
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { QRadio } from 'quasar'

export default {
  name: 'k-base-laeyrs-selector',
  components: {
    QRadio,
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
      activeLayer: undefined
    }
  }, 
  watch: {
    activeLayer: {
      immediate: true,
      handler () {
        const selectedLayer = _.find(this.layers, { isVisible: true })
        if (selectedLayer) this.toggleLayer(selectedLayer)
        const layerToSelect = _.find(this.layers, { name: this.activeLayer})
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
    this.activeLayer = _.get(_.find(this.layers, { default: true }), 'name')
    if (!this.activeLayer) this.activeLayer = _.get(_.head(this.layers), 'name')
  }
}
</script>
