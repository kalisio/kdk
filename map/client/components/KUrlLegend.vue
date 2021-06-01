<template>
  <div v-if="legends.length > 0" class="k-url-legend">
    <div v-for="legend, index in legends" @click="onLegendClick(index)">
      <img v-if="legend.visible" :src="legend.src" class="shadow-2" ref="imgs"/>
      <div v-if="!legend.visible">&blacktriangleright;  {{legend.layer}}</div>
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
    async tryAddLegend (layer) {
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
        let visible = false
        try {
          const response = await fetch(legendUrl)
          visible = response.ok
          // additional check for funny servers answering with empty body ...
          if (visible) {
            const asBlob = await response.blob()
            visible = asBlob ? asBlob.size > 0 : false
          }
          if (visible) {
            // make sure layer is still visible since it may have been hidden in the meantime ...
            if (this.kActivity.isLayerVisible(layer.name)) {
              this.urlLegendLayers[layer._id] = legendUrl
              this.legends.push({
                src: legendUrl,
                layer: layer.name,
                visible: true
              })
            }
          }
        } catch (error) {
        }
      }
    },
    tryRemoveLegend (layer) {
      const legendUrl = this.urlLegendLayers[layer._id]
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
.k-url-legend
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-overflow: ellipsis;
  cursor: pointer;
</style>
