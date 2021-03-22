<template>

  <div class="k-wms-legend" v-if="visible">
    <img :src="legendUrl" class="shadow-2"/>
  </div>

</template>

<script>
import _ from 'lodash'
import { buildUrl } from '../../../core/common'

export default {
  name: 'k-wms-legend',
  inject: ['kActivity'],
  data () {
    return {
      visible: false,
      legendUrl: ''
    }
  },
  methods: {
    onWmsLegendShowLayer (layer, engineLayer) {
      if (_.get(layer, 'leaflet.type') === 'tileLayer.wms') {
        // lookup wms parameters on the leaflet layer parameters
        const leaflet = layer.leaflet
        const params = {
          SERVICE: 'WMS',
          REQUEST: 'GetLegendGraphic',
          VERSION: _.get(leaflet, 'version', '1.0.0'),
          FORMAT: 'image/png',
          LAYER: leaflet.layers
        }
        if (leaflet.styles) {
          params.STYLE = leaflet.styles
        }
        this.legendUrl = buildUrl(leaflet.source, params)
        this.visible = true
        this.wmsLegendLayer = layer
      } else {
        this.visible = false
      }
    },
    onWmsLegendHideLayer (layer) {
      if (this.wmsLegendLayer && ((this.wmsLegendLayer._id === layer._id) || (this.wmsLegendLayer.name === layer.name))) {
        this.visible = false
        this.wmsLegendLayer = null
      }
    }
  },
  mounted () {
    this.wmsLegendLayer = null
    this.kActivity.$on('layer-shown', this.onWmsLegendShowLayer)
    this.kActivity.$on('layer-hidden', this.onWmsLegendHideLayer)
  },
  beforeDestroy () {
    // Delete reference to the legend layer
    this.kActivity.$off('layer-shown', this.onWmsLegendShowLayer)
    this.kActivity.$off('layer-hidden', this.onWmsLegendHideLayer)
  }
}
</script>

<style lang="stylus">
.k-wms-legend
  position: relative;
  cursor: pointer;
  border: none;
  padding: 0;
  margin: 0;
</style>
