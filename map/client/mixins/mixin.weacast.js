import _ from 'lodash'
import logger from 'loglevel'
import { getForecastForLocation, getForecastProbe, getForecastForFeature } from '../utils/utils.weacast.js'

export const weacast = {
  emits: [
    'forecast-model-changed',
    'forecast-level-changed'
  ],
  data () {
    return {
      forecastModel: null,
      forecastModels: []
    }
  },
  methods: {
    getWeacastApi () {
      // As we usually proxy weacast service we use our API unless another client has been specified by override
      return this.$api
    },
    async setupWeacast () {
      try {
        await this.setupForecastModels()
      } catch (error) {
        logger.error('Cannot retrieve available Weacast forecast models', error)
      }
    },
    async setupForecastModels () {
      if (!this.getWeacastApi()) return
      const response = await this.getWeacastApi().getService('forecasts').find()
      // Required to use splice when modifying objects inside an array to make it reactive
      this.forecastModels.splice(0, this.forecastModels.length, ...response.data)
      // store forecast models on the weacast api object too (useful in the weacast grid source)
      this.getWeacastApi().models = this.forecastModels
      // Add 'virtual' actions used to trigger the layer/filters
      this.forecastModels.forEach(forecastModel => {
        forecastModel.actions = [{ id: 'toggle', handler: () => this.setForecastModel(forecastModel) }]
      })
      // Select default if any or first one
      // FIXME: now done by selector when initializing using the toggle action
      // but the component might not be yet constructed at that point while the activity need it
      // so that we do it here by default as well
      let forecastModel = this.forecastModels.find(forecast => forecast.isDefault)
      if (!forecastModel) {
        forecastModel = (this.forecastModels.length > 0 ? this.forecastModels[0] : null)
      }
      this.setForecastModel(forecastModel)
    },
    setForecastModel (model) {
      if (this.forecastModel === model) return
      this.forecastModel = model
      this.onForecastModelChanged(model)
    },
    onForecastModelChanged (model) {
      this.$emit('forecast-model-changed', model)
      this.$engineEvents.emit('forecast-model-changed', model)
    },
    setForecastLevel (level) {
      if (this.forecastLevel === level) return
      this.forecastLevel = level
      this.onForecastLevelChanged(level)
    },
    onForecastLevelChanged (level) {
      this.$emit('forecast-level-changed', level)
      this.$engineEvents.emit('forecast-level-changed', level)
    },
    async getForecastForLocation (long, lat, startTime, endTime) {
      // Not yet ready
      if (!this.forecastModel) return
      this.setCursor('processing-cursor')
      const probedLocation = await getForecastForLocation({
        long, lat, startTime, endTime, forecastModel: this.forecastModel,
        forecastLevel: this.forecastLevel, weacastApi: this.getWeacastApi()
      })
      this.unsetCursor('processing-cursor')
      return probedLocation
    },
    async getForecastProbe (name) {
      // Not yet ready
      if (!this.forecastModel) return
      // Avoid reloading probe when not necessary
      if (this.probe && (this.probe.name === name) && (this.probe.forecast === this.forecastModel.name)) {
        return this.probe
      }
      this.probe = await getForecastProbe({ name, forecastModel: this.forecastModel, weacastApi: this.getWeacastApi() })
      return this.probe
    },
    async getForecastForFeature (featureId, startTime, endTime) {
      // Not yet ready
      if (!this.forecastModel) return
      // Check if probe is available
      if (!this.probe) return

      this.setCursor('processing-cursor')
      const probedLocation = await getForecastForFeature({ probe: this.probe, featureId, startTime, endTime, forecastModel: this.forecastModel, forecastLevel: this.forecastLevel, weacastApi: this.getWeacastApi() })
      this.unsetCursor('processing-cursor')
      return probedLocation
    },
    onCurrentForecastTimeChanged (time) {
      if (this.getWeacastApi()) this.getWeacastApi().setForecastTime(time)
    },
    onWeacastSelectedLevelChanged (level) {
      // Used when selectable levels are cleared
      if (_.isNil(level)) {
        this.setForecastLevel(null)
        return
      }
      // Retrieve the layer associated to current level selection
      const layer = this.selectableLevelsLayer
      if (layer) {
        // Check if of right type, ie weacast layer or tiled layer using a weacast source
        const type = _.get(layer, `${this.engine}.type`)
        const sources = _.get(layer, 'meteo_model.sources', [])
        const weacastSource = sources.find(source => _.has(source, 'weacast'))
        if (type.startsWith('weacast') || weacastSource) {
          this.setForecastLevel(level)
        }
      }
    }
  },
  created () {
    this.$events.on('time-current-time-changed', this.onCurrentForecastTimeChanged)
    this.$engineEvents.on('selected-level-changed', this.onWeacastSelectedLevelChanged)
  },
  beforeUnmount () {
    this.$events.off('time-current-time-changed', this.onCurrentForecastTimeChanged)
    this.$engineEvents.off('selected-level-changed', this.onWeacastSelectedLevelChanged)
  }
}
