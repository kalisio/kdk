import _ from 'lodash'
import L from 'leaflet'
import 'weacast-leaflet'

export default {
  methods: {
    getVisualForecastModel (layerConfig) {
      // For visualization we might decimate the data resolution for performance reasons
      const decimationFactor = layerConfig.decimationFactor || 2
      // Copy forecast model
      const visualModel = Object.assign({}, this.forecastModel)
      // Then assign visual configuration
      Object.assign(visualModel, {
        name: this.forecastModel.name,
        origin: this.forecastModel.origin,
        bounds: this.forecastModel.bounds,
        size: [Math.floor(this.forecastModel.size[0] / decimationFactor), Math.floor(this.forecastModel.size[1] / decimationFactor)],
        resolution: [decimationFactor * this.forecastModel.resolution[0], decimationFactor * this.forecastModel.resolution[1]]
      })
      return visualModel
    },
    updateVisualForecastModel () {
      // Update layers
      _.forOwn(this.leafletLayers, layer => {
        if (layer instanceof L.weacast.ForecastLayer) {
          layer.setForecastModel(this.getVisualForecastModel(layer.options))
        }
      })
    },
    updateForecastElements () {
      // Update layers
      _.forOwn(this.leafletLayers, layer => {
        if (layer instanceof L.weacast.ForecastLayer) {
          const leafletOptions = layer.options
          if (leafletOptions.baseElements && this.forecastLevel) { // Check if the layer supports different levels
            const elements = leafletOptions.baseElements.map(element => `${element}-${this.forecastLevel}`)
            if (!_.isEqual(layer.forecastElements, elements)) {
              layer.setForecastElements(elements)
            }
          }
        }
      })
    },
    createLeafletForecastLayer (options) {
      const leafletOptions = options.leaflet || options
      // Check for valid types
      if (!leafletOptions.type.startsWith('weacast')) return
      // We need to add Weacast API object as argument before creating the layer
      leafletOptions.source = this.weacastApi
      // Copy as well color map options
      const colorMap = _.get(options, 'variables[0].chromajs')
      if (colorMap) Object.assign(leafletOptions, colorMap)
      // Check for multiple levels if any
      const levels = _.get(options, 'levels.values')
      if (levels && levels.length > 0) {
        // Keep track of available elements
        leafletOptions.baseElements = leafletOptions.elements
        // Select first available level by default
        const level = levels[0]
        leafletOptions.elements = leafletOptions.baseElements.map(element => `${element}-${level}`)
      }
      const layer = this.createLeafletLayer(options)
      // For visualization we might decimate the data resolution for performance reasons
      layer.setForecastModel(this.getVisualForecastModel(leafletOptions))
      return layer
    }
  },
  created () {
    this.registerLeafletConstructor(this.createLeafletForecastLayer)
  },
  mounted () {
    this.$on('forecast-model-changed', this.updateVisualForecastModel)
    this.$on('forecast-level-changed', this.updateForecastElements)
  },
  beforeDestroy () {
    this.$off('forecast-model-changed', this.updateVisualForecastModel)
    this.$off('forecast-level-changed', this.updateForecastElements)
  }
}
