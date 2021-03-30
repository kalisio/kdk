<template>

  <div class="k-url-legend" v-if="visible">
    <img :src="legendUrl" class="shadow-2"/>
  </div>

</template>

<script>
import _ from 'lodash'
import fetch from 'node-fetch'
import * as wms from '../../common/wms-utils'

export default {
  name: 'k-url-legend',
  inject: ['kActivity'],
  data () {
    return {
      visible: false,
      legendUrl: ''
    }
  },
  methods: {
    async onUrlLegendShowLayer (layer, engineLayer) {
      let legendUrl = _.get(layer, 'legendUrl')
      if (!legendUrl) {
        // no legend on layer, try to fetch legend in case of WMS layer
        if (_.get(layer, 'leaflet.type') === 'tileLayer.wms') {
          // leaflet wms layer uses every other options as request extra parameters
          const leafletOptions = [
            'type', 'source', 'isVisible', // these are kdk specific
            'layers', 'styles', 'format', 'transparent', 'version', 'crs', 'uppercase' // these are leaflet specific
          ]
          const searchParams = _.omit(layer.leaflet, leafletOptions)
          // lookup wms parameters on the leaflet layer parameters
          legendUrl = wms.makeGetLegendGraphic(
            layer.leaflet.source,
            _.get(layer.leaflet, 'version', '1.0.0'),
            layer.leaflet.layers,
            _.get(layer.leaflet, 'styles'),
            searchParams)
        }
        // TODO: might try in case of WMTS layer too
      }

      // make sure server answers the request before using it
      if (legendUrl) {
        try {
          const response = await fetch(legendUrl)
          this.visible = response.ok
          if (this.visible) {
            this.legendUrl = legendUrl
            this.urlLegendLayer = layer
          }
        } catch (error) {
          this.visible = false
        }
      } else {
        this.visible = false
      }
    },
    onUrlLegendHideLayer (layer) {
      if (this.urlLegendLayer && ((this.urlLegendLayer._id === layer._id) || (this.urlLegendLayer.name === layer.name))) {
        this.visible = false
        this.urlLegendLayer = null
      }
    }
  },
  mounted () {
    this.urlLegendLayer = null
    this.kActivity.$on('layer-shown', this.onUrlLegendShowLayer)
    this.kActivity.$on('layer-hidden', this.onUrlLegendHideLayer)
  },
  beforeDestroy () {
    // Delete reference to the legend layer
    this.kActivity.$off('layer-shown', this.onUrlLegendShowLayer)
    this.kActivity.$off('layer-hidden', this.onUrlLegendHideLayer)
  }
}
</script>

<style lang="stylus">
.k-url-legend
  position: relative;
  cursor: pointer;
  border: none;
  padding: 0;
  margin: 0;
</style>
