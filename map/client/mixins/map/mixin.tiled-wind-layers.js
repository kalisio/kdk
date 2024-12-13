import _ from 'lodash'
import 'leaflet-velocity'
import { Time } from '../../../../core/client/time.js'
import { makeGridSource, extractGridSourceConfig } from '../../../common/grid.js'
import { TiledWindLayer } from '../../leaflet/TiledWindLayer.js'

export const tiledWindLayers = {
  methods: {
    async createLeafletTiledWindLayer (options) {
      const layerOptions = options.leaflet || options

      // Check for valid type
      if (layerOptions.type !== 'tiledWindLayer') return

      // Copy options
      const colorMap = _.get(options, 'variables[0].chromajs', null)
      if (colorMap) Object.assign(layerOptions, { chromajs: colorMap })

      // Build u & v grid sources
      const [gridKey, gridConf] = extractGridSourceConfig(options)
      // Check API to be used in case the layer is coming from a remote "planet"
      const weacastApi = (typeof options.getPlanetApi === 'function' ? options.getPlanetApi() : this.getWeacastApi())
      const uSource = makeGridSource(gridKey, { weacastApi })
      const vSource = makeGridSource(gridKey, { weacastApi })
      uSource.setup(gridConf)
      vSource.setup(gridConf)
      if (uSource.updateCtx) {
        // define variables for source's dynamic properties
        const gatewayToken = (weacastApi.hasConfig('gatewayJwt') ? await weacastApi.get('storage').getItem(weacastApi.getConfig('gatewayJwt')) : null)
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
      engineLayer.setTime(Time.getCurrentTime())
    },

    onHideTiledWindLayer (layer, engineLayer) {
      const isTiledWindLayer = engineLayer instanceof TiledWindLayer
      if (!isTiledWindLayer) return

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
    },

    onSelectedLevelChangedTiledWindLayer (value) {
      if (!this.selectableLevelsLayer) return

      // send selected value only to associated layer
      const layer = this.tiledWindLayers.get(this.selectableLevelsLayer._id)
      if (!layer) return

      layer.setLevel(value)
    }
  },

  created () {
    this.tiledWindLayers = new Map()
    this.registerLeafletConstructor(this.createLeafletTiledWindLayer)

    this.$engineEvents.on('layer-added', this.onAddTiledWindLayer)
    this.$engineEvents.on('layer-shown', this.onShowTiledWindLayer)
    this.$engineEvents.on('layer-hidden', this.onHideTiledWindLayer)
    this.$engineEvents.on('selected-level-changed', this.onSelectedLevelChangedTiledWindLayer)
    this.$engineEvents.on('forecast-model-changed', this.onForecastModelChangedTiledWindLayer)
    this.$events.on('time-current-time-changed', this.onCurrentTimeChangedTiledWindLayer)
  },

  beforeUnmount () {
    this.$engineEvents.off('layer-added', this.onAddTiledWindLayer)
    this.$engineEvents.off('layer-shown', this.onShowTiledWindLayer)
    this.$engineEvents.off('layer-hidden', this.onHideTiledWindLayer)
    this.$engineEvents.off('selected-level-changed', this.onSelectedLevelChangedTiledWindLayer)
    this.$engineEvents.off('forecast-model-changed', this.onForecastModelChangedTiledWindLayer)
    this.$events.off('time-current-time-changed', this.onCurrentTimeChangedTiledWindLayer)
  }
}
