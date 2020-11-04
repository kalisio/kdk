import _ from 'lodash'

import { extractGridSourceConfig } from '../../../common/grid'
import { TiledWindLayer } from '../../leaflet/TiledWindLayer'

export default {
  methods: {
    createLeafletTiledWindLayer (options) {
      const leafletOptions = options.leaflet || options

      // Check for valid type
      if (leafletOptions.type !== 'tiledWindLayer') return

      // Copy options
      const colorMap = _.get(options, 'variables[0].chromajs', null)
      if (colorMap) Object.assign(leafletOptions, { chromajs: colorMap })
      const [gridKey, gridConf] = extractGridSourceConfig(options)
      leafletOptions[gridKey] = gridConf
      const uvComponents = _.get(options, 'uvComponents')
      if (uvComponents) Object.assign(leafletOptions, { uvComponents })

      leafletOptions.weacastApi = this.weacastApi
      const gatewayToken = this.$api.get('storage').getItem(this.$config('gatewayJwt'))
      if (gatewayToken) leafletOptions.jwtToken = gatewayToken

      return new TiledWindLayer(leafletOptions)
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
