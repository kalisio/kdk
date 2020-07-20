import _ from 'lodash'

import { extractGridSourceConfig } from '../../../common/grid'
import { TiledMeshLayer } from '../../leaflet/TiledMeshLayer'
import { OsmBuildingLayer } from '../../leaflet/OsmBuildingLayer'

export default {
  methods: {
    createLeafletTiledMeshLayer (options) {
      const leafletOptions = options.leaflet || options

      if (leafletOptions.type === 'osmBuildingLayer') {
        return new OsmBuildingLayer(leafletOptions)
      }

      // Check for valid type
      if (leafletOptions.type !== 'tiledMeshLayer') return

      // Copy options
      const colorMap = _.get(options, 'variables[0].chromajs', null)
      if (colorMap) Object.assign(leafletOptions, { chromajs: colorMap })
      const [gridKey, gridConf] = extractGridSourceConfig(options)
      leafletOptions[gridKey] = gridConf

      leafletOptions.weacastApi = this.weacastApi

      return new TiledMeshLayer(leafletOptions)
    },

    onShowTiledMeshLayer (layer, engineLayer) {
      const isTiledMeshLayer = engineLayer instanceof TiledMeshLayer
      if (!isTiledMeshLayer) return

      // store displayed layers
      this.tiledMeshLayers.set(layer._id, engineLayer)
      const levels = _.get(layer, 'levels')
      if (levels) { this.setSelectableLevels(layer, levels) }

      // setup layer
      engineLayer.setModel(this.forecastModel)
      engineLayer.setTime(this.currentTime)
    },

    onHideTiledMeshLayer (layer) {
      this.tiledMeshLayers.delete(layer._id)
      // layer being hidden, hide slider if any was required
      this.clearSelectableLevels(layer)
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
