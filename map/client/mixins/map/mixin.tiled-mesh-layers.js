import _ from 'lodash'
import { Time } from '../../../../core/client/time'
import { makeGridSource, extractGridSourceConfig } from '../../../common/grid'
import { TiledMeshLayer } from '../../leaflet/TiledMeshLayer'

export default {
  methods: {
    createLeafletTiledMeshLayer (options) {
      const layerOptions = options.leaflet || options

      // Check for valid type
      if (layerOptions.type !== 'tiledMeshLayer') return

      // Copy options
      const colorMap = _.get(options, 'variables[0].chromajs', null)
      if (colorMap) Object.assign(layerOptions, { chromajs: colorMap })

      // Build grid source
      const [gridKey, gridConf] = extractGridSourceConfig(options)
      const gridSource = makeGridSource(gridKey, { weacastApi: this.weacastApi })
      gridSource.setup(gridConf)
      if (gridSource.updateCtx) {
        // define variables for source's dynamic properties
        const gatewayToken = this.$api.get('storage').getItem(this.$config('gatewayJwt'))
        if (gatewayToken) gridSource.updateCtx.jwtToken = gatewayToken
        gridSource.updateCtx.meteoElements = _.get(options, 'meteoElements')
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
      const levels = _.get(layer, 'levels')
      if ((typeof this.setSelectableLevels === 'function') && levels) {
        this.setSelectableLevels(layer, levels)
      }
      // setup layer
      engineLayer.setModel(this.forecastModel)
      engineLayer.setTime(Time.getCurrentTime())
    },

    onHideTiledMeshLayer (layer, engineLayer) {
      const isTiledMeshLayer = engineLayer instanceof TiledMeshLayer
      if (!isTiledMeshLayer) return

      this.tiledMeshLayers.delete(layer._id)
      // layer being hidden, hide slider if any was required
      if (typeof this.clearSelectableLevels === 'function') {
        this.clearSelectableLevels(layer)
      }
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

    this.$on('layer-added', this.onAddTiledMeshLayer)
    this.$on('layer-shown', this.onShowTiledMeshLayer)
    this.$on('layer-hidden', this.onHideTiledMeshLayer)
    this.$on('selected-level-changed', this.onSelectedLevelChangedTiledMeshLayer)
    this.$on('forecast-model-changed', this.onForecastModelChangedTiledMeshLayer)
    this.$events.on('time-current-time-changed', this.onCurrentTimeChangedTiledMeshLayer)
  },

  beforeDestroy () {
    this.$off('layer-added', this.onAddTiledMeshLayer)
    this.$off('layer-shown', this.onShowTiledMeshLayer)
    this.$off('layer-hidden', this.onHideTiledMeshLayer)
    this.$off('selected-level-changed', this.onSelectedLevelChangedTiledMeshLayer)
    this.$off('forecast-model-changed', this.onForecastModelChangedTiledMeshLayer)
    this.$events.off('time-current-time-changed', this.onCurrentTimeChangedTiledMeshLayer)
  }
}
