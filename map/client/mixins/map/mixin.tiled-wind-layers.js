import _ from 'lodash'

import { makeGridSource, extractGridSourceConfig } from '../../../common/grid'
import { TiledWindLayer } from '../../leaflet/TiledWindLayer'

export default {
  methods: {
    createLeafletTiledWindLayer (options) {
      const layerOptions = options.leaflet || options

      // Check for valid type
      if (layerOptions.type !== 'tiledWindLayer') return

      // Copy options
      const colorMap = _.get(options, 'variables[0].chromajs', null)
      if (colorMap) Object.assign(layerOptions, { chromajs: colorMap })

      // Build u & v grid sources
      const [gridKey, gridConf] = extractGridSourceConfig(options)
      const uSource = makeGridSource(gridKey, { weacastApi: this.weacastApi })
      const vSource = makeGridSource(gridKey, { weacastApi: this.weacastApi })
      uSource.setup(gridConf)
      vSource.setup(gridConf)
      if (uSource.updateCtx) {
        // define variables for source's dynamic properties
        uSource.updateCtx.component = options.uvComponents.u
        vSource.updateCtx.component = options.uvComponents.v

        const gatewayToken = this.$api.get('storage').getItem(this.$config('gatewayJwt'))
        if (gatewayToken) {
          uSource.updateCtx.jwtToken = gatewayToken
          vSource.updateCtx.jwtToken = gatewayToken
        }
      }

      return new TiledWindLayer(layerOptions, uSource, vSource)
    },

    onShowTiledWindLayer (layer, engineLayer) {
      const isTiledWindLayer = engineLayer instanceof TiledWindLayer
      if (!isTiledWindLayer) return

      // store displayed layers
      this.tiledWindLayers.set(layer._id, engineLayer)

      // setup layer
      engineLayer.setModel(this.forecastModel)
      engineLayer.setTime(this.currentTime)
    },

    onHideTiledWindLayer (layer) {
      this.tiledWindLayers.delete(layer._id)
    },

    onForecastModelChangedTiledWindLayer (model) {
      // broadcast to visible layers
      this.tiledWindLayers.forEach(function (value, key, map) {
        value.setModel(model)
      })
    },

    onCurrentTimeChangedTiledWindLayer (time) {
      // broadcast to visible layers
      this.tiledWindLayers.forEach(function (value, key, map) {
        value.setTime(time)
      })
    }
  },

  created () {
    this.tiledWindLayers = new Map()
    this.registerLeafletConstructor(this.createLeafletTiledWindLayer)

    this.$on('layer-shown', this.onShowTiledWindLayer)
    this.$on('layer-hidden', this.onHideTiledWindLayer)
    this.$on('forecast-model-changed', this.onForecastModelChangedTiledWindLayer)
    this.$on('current-time-changed', this.onCurrentTimeChangedTiledWindLayer)
  },

  beforeDestroy () {
    this.$off('layer-shown', this.onShowTiledWindLayer)
    this.$off('layer-hidden', this.onHideTiledWindLayer)
    this.$off('forecast-model-changed', this.onForecastModelChangedTiledWindLayer)
    this.$off('current-time-changed', this.onCurrentTimeChangedTiledWindLayer)
  }
}
