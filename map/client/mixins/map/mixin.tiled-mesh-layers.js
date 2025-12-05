import _ from 'lodash'
import { Time } from '../../../../core/client/time.js'
import { Events } from '../../../../core/client/events.js'
import { makeGridSource, extractGridSourceConfig } from '../../../common/grid.js'
import { TiledMeshLayer } from '../../leaflet/TiledMeshLayer.js'

export const tiledMeshLayers = {
  methods: {
    async createLeafletTiledMeshLayer (options) {
      const layerOptions = options.leaflet || options

      // Check for valid type
      if (layerOptions.type !== 'tiledMeshLayer') return

      // Copy options
      const colorMap = _.get(options, 'variables[0].chromajs', null)
      if (colorMap) Object.assign(layerOptions, { chromajs: colorMap })

      // Build grid source
      const [gridKey, gridConf] = extractGridSourceConfig(options)
      const planetApi = (typeof options.getPlanetApi === 'function' ? options.getPlanetApi() : this.getWeacastApi())
      const apiJwt = (planetApi.hasConfig('apiJwt') ? await planetApi.get('storage').getItem(planetApi.getConfig('apiJwt')) : null)
      const gatewayJwt = (planetApi.hasConfig('gatewayJwt') ? await planetApi.get('storage').getItem(planetApi.getConfig('gatewayJwt')) : null)
      const gridSource = makeGridSource(gridKey, { planetApi })
      gridSource.setup(gridConf)
      if (gridSource.updateCtx) {
        // define variables for source's dynamic properties
        Object.assign(gridSource.updateCtx, {
          apiJwt, gatewayJwt,
          // This one is for backward compatibility
          jwtToken: gatewayJwt,
          meteoElements: _.get(options, 'meteoElements')
        })
      }

      return new TiledMeshLayer(layerOptions, gridSource)
    },

    updateTiledMeshLayerZoomBounds (layer, model) {
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

    onAddTiledMeshLayer (layer) {
      if (!this.forecastModel || _.get(layer, 'leaflet.type') !== 'tiledMeshLayer') return
      this.updateTiledMeshLayerZoomBounds(layer, this.forecastModel)
    },

    onShowTiledMeshLayer (layer, engineLayer) {
      const isTiledMeshLayer = engineLayer instanceof TiledMeshLayer
      if (!isTiledMeshLayer) return

      // store displayed layers
      this.tiledMeshLayers.set(layer._id, engineLayer)
      // setup layer
      engineLayer.setModel(this.forecastModel)
      engineLayer.setTime(Time.getCurrentTime())
    },

    onHideTiledMeshLayer (layer, engineLayer) {
      const isTiledMeshLayer = engineLayer instanceof TiledMeshLayer
      if (!isTiledMeshLayer) return

      this.tiledMeshLayers.delete(layer._id)
    },

    onSelectedLevelChangedTiledMeshLayer (value) {
      if (!this.selectableLevelsLayer) return

      // send selected value only to associated layer
      const layer = this.tiledMeshLayers.get(this.selectableLevelsLayer._id)
      if (!layer) return

      layer.setLevel(value)
    },

    onForecastModelChangedTiledMeshLayer (model) {
      // update layer & engine layer {min,max}Zoom if required
      const tiledMeshLayers = _.filter(this.layers, (layer) => _.get(layer, 'leaflet.type') === 'tiledMeshLayer')
      for (const layer of tiledMeshLayers) this.updateTiledMeshLayerZoomBounds(layer, model)
      // broadcast model to visible layers
      this.tiledMeshLayers.forEach((engineLayer) => { engineLayer.setModel(model) })
    },

    onCurrentTimeChangedTiledMeshLayer (time) {
      // broadcast time to visible layers
      this.tiledMeshLayers.forEach((engineLayer) => { engineLayer.setTime(time) })
    }
  },

  created () {
    this.tiledMeshLayers = new Map()
    this.registerLeafletConstructor(this.createLeafletTiledMeshLayer)

    this.$engineEvents.on('layer-added', this.onAddTiledMeshLayer)
    this.$engineEvents.on('layer-shown', this.onShowTiledMeshLayer)
    this.$engineEvents.on('layer-hidden', this.onHideTiledMeshLayer)
    this.$engineEvents.on('selected-level-changed', this.onSelectedLevelChangedTiledMeshLayer)
    this.$engineEvents.on('forecast-model-changed', this.onForecastModelChangedTiledMeshLayer)
    Events.on('time-current-time-changed', this.onCurrentTimeChangedTiledMeshLayer)
  },

  beforeUnmount () {
    this.$engineEvents.off('layer-added', this.onAddTiledMeshLayer)
    this.$engineEvents.off('layer-shown', this.onShowTiledMeshLayer)
    this.$engineEvents.off('layer-hidden', this.onHideTiledMeshLayer)
    this.$engineEvents.off('selected-level-changed', this.onSelectedLevelChangedTiledMeshLayer)
    this.$engineEvents.off('forecast-model-changed', this.onForecastModelChangedTiledMeshLayer)
    Events.off('time-current-time-changed', this.onCurrentTimeChangedTiledMeshLayer)
  }
}
