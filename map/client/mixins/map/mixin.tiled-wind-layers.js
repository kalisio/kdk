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
        const gatewayToken = this.$api.get('storage').getItem(this.$config('gatewayJwt'))
        if (gatewayToken) {
          uSource.updateCtx.jwtToken = gatewayToken
          vSource.updateCtx.jwtToken = gatewayToken
        }
        uSource.updateCtx.windComponent = _.get(options, 'meteoElements[0]')
        vSource.updateCtx.windComponent = _.get(options, 'meteoElements[1]')
      }

      return new TiledWindLayer(layerOptions, uSource, vSource)
    },

    updateTiledWindLayerZoomBounds (layer, model) {
      const minZoom = _.get(layer, `leaflet.meteoModelMinZoom[${model.name}]`)
      const maxZoom = _.get(layer, `leaflet.meteoModelMaxZoom[${model.name}]`)

      if (minZoom) layer.leaflet.minZoom = minZoom
      else delete layer.leaflet.minZoom
      if (maxZoom) layer.leaflet.maxZoom = maxZoom
      else delete layer.leaflet.maxZoom
      this.updateLayerDisabled(layer)

      // reflect on engine layers
      const engineLayer = this.getLeafletLayerByName(layer.name)
      if (engineLayer) {
        if (minZoom) engineLayer.options.minZoom = minZoom
        else delete engineLayer.options.minZoom
        if (maxZoom) engineLayer.options.maxZoom = maxZoom
        else delete engineLayer.options.maxZoom
      }
    },

    onAddTiledWindLayer (layer) {
      if (!this.forecastModel || _.get(layer, 'leaflet.type') !== 'tiledWindLayer') return
      this.updateTiledWindLayerZoomBounds(layer, this.forecastModel)
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
      // update layer & engine layer {min,max}Zoom if required
      const tiledWindLayers = _.filter(this.layers, (layer) => _.get(layer, 'leaflet.type') === 'tiledWindLayer')
      for (const layer of tiledWindLayers) this.updateTiledWindLayerZoomBounds(layer, model)
      // broadcast model to visible layers
      this.tiledWindLayers.forEach((engineLayer) => { engineLayer.setModel(model) })
    },

    onCurrentTimeChangedTiledWindLayer (time) {
      // broadcast time to visible layers
      this.tiledWindLayers.forEach((engineLayer) => { engineLayer.setTime(time) })
    }
  },

  created () {
    this.tiledWindLayers = new Map()
    this.registerLeafletConstructor(this.createLeafletTiledWindLayer)

    this.$on('layer-added', this.onAddTiledWindLayer)
    this.$on('layer-shown', this.onShowTiledWindLayer)
    this.$on('layer-hidden', this.onHideTiledWindLayer)
    this.$on('forecast-model-changed', this.onForecastModelChangedTiledWindLayer)
    this.$on('current-time-changed', this.onCurrentTimeChangedTiledWindLayer)
  },

  beforeDestroy () {
    this.$off('layer-added', this.onAddTiledWindLayer)
    this.$off('layer-shown', this.onShowTiledWindLayer)
    this.$off('layer-hidden', this.onHideTiledWindLayer)
    this.$off('forecast-model-changed', this.onForecastModelChangedTiledWindLayer)
    this.$off('current-time-changed', this.onCurrentTimeChangedTiledWindLayer)
  }
}
