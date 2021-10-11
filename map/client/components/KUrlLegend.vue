<template>
  <div v-if="legends.length > 0" class="k-url-legend-container">
    <div v-for="legend, index in legends" @click="onLegendClick(index)" class="k-url-legend-item text-primary text-caption q-pa-xs q-ma-xs shadow-2">
      <div v-if="legend.visible">&blacktriangledown;   {{legend.layer}}</div>
      <img v-if="legend.visible" :src="legend.src"/>
      <div v-if="!legend.visible">&blacktriangleright;   {{legend.layer}}</div>
    </div>
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
      legends: []
    }
  },
  methods: {
    onLegendClick (index) {
      this.legends[index].visible = !this.legends[index].visible
    },
    async getLegend (layer) {
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
          // additional check for funny servers answering with empty body ...
          if (response.ok) {
            const asBlob = await response.blob()
            if (asBlob.size === 0) legendUrl = null
          }
        } catch (error) {
          legendUrl = null
        }
      }

      return legendUrl
    },
    async tryAddLegend (layer) {
      const legendUrl = await this.getLegend(layer)
      if (legendUrl) {
        // make sure layer is still visible since it may have been hidden in the meantime ...
        if (this.kActivity.isLayerVisible(layer.name)) {
          this.legends.push({
            src: legendUrl,
            layer: layer.name,
            visible: true
          })
        }
      }
    },
    async tryRemoveLegend (layer) {
      const legendUrl = await this.getLegend(layer)
      if (legendUrl) {
        const index = this.legends.findIndex((legend) => legend.src === legendUrl)
        this.legends.splice(index, 1)
      }
    },
    onShowLayer (layer, engineLayer) {
      this.tryAddLegend(layer)
    },
    onHideLayer (layer) {
      this.tryRemoveLegend(layer)
    }
  },
  mounted () {
    this.urlLegendLayers = {}
    this.kActivity.$on('layer-shown', this.onShowLayer)
    this.kActivity.$on('layer-hidden', this.onHideLayer)

    // initial scan of already added layers
    this.kActivity.getLayers().forEach((layer) => {
      if (this.kActivity.isLayerVisible(layer.name)) {
        this.tryAddLegend(layer)
      }
    })
  },
  beforeDestroy () {
    this.kActivity.$off('layer-shown', this.onShowLayer)
    this.kActivity.$off('layer-hidden', this.onHideLayer)
  }
}
</script>

<style lang="stylus">
.k-url-legend-container
  display: flex;
  flex-direction: column;
  align-items: flex-start;

.k-url-legend-item
  text-overflow: ellipsis;
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.5);
</style>
