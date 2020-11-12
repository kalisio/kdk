import _ from 'lodash'

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
      engineLayer.setTime(this.currentTime)
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

      layer.setCutValue(value)
    },

    onForecastModelChangedTiledMeshLayer (model) {
      // broadcast to visible layers
      this.tiledMeshLayers.forEach(function (value, key, map) {
        value.setModel(model)
      })
    },

    onCurrentTimeChangedTiledMeshLayer (time) {
      // broadcast to visible layers
      this.tiledMeshLayers.forEach(function (value, key, map) {
        value.setTime(time)
      })
    }
  },

  created () {
    this.tiledMeshLayers = new Map()
    this.registerLeafletConstructor(this.createLeafletTiledMeshLayer)

    this.$on('layer-shown', this.onShowTiledMeshLayer)
    this.$on('layer-hidden', this.onHideTiledMeshLayer)
    this.$on('selected-level-changed', this.onSelectedLevelChangedTiledMeshLayer)
    this.$on('forecast-model-changed', this.onForecastModelChangedTiledMeshLayer)
    this.$on('current-time-changed', this.onCurrentTimeChangedTiledMeshLayer)
  },

  beforeDestroy () {
    this.$off('layer-shown', this.onShowTiledMeshLayer)
    this.$off('layer-hidden', this.onHideTiledMeshLayer)
    this.$off('selected-level-changed', this.onSelectedLevelChangedTiledMeshLayer)
    this.$off('forecast-model-changed', this.onForecastModelChangedTiledMeshLayer)
    this.$off('current-time-changed', this.onCurrentTimeChangedTiledMeshLayer)
  }
}
