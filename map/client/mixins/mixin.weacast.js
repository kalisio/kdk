import _ from 'lodash'
import logger from 'loglevel'

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
      if (!this.getWeacastApi() || this.getWeacastApi().isDisconnected) return
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
      this.forecastModel = model
      this.onForecastModelChanged(model)
    },
    onForecastModelChanged (model) {
      this.$emit('forecast-model-changed', model)
      this.$engineEvents.emit('forecast-model-changed', model)
    },
    setForecastLevel (level) {
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
      // From now to last available time
      const geometry = {
        type: 'Point',
        coordinates: [long, lat]
      }
      const query = {
        forecastTime: {
          $gte: startTime.format(),
          $lte: endTime.format()
        },
        geometry: {
          $geoIntersects: {
            $geometry: geometry
          }
        }
      }
      let probedLocation
      this.setCursor('processing-cursor')
      try {
        let elements = this.forecastModel.elements.map(element => element.name)
        // Filter available elements according to current level if any
        if (this.forecastLevel) elements = elements.filter(element => element.endsWith(this.forecastLevel.toString()))
        else {
          elements = elements.filter(element => {
            const tokens = element.split('-')
            return (tokens.length === 0) || !_.isFinite(_.toNumber(tokens[tokens.length - 1]))
          })
        }
        const response = await this.getWeacastApi().getService('probes')
          .create({
            forecast: this.forecastModel.name,
            elements
          }, { query })
        if (response.features.length > 0) {
          probedLocation = response.features[0]
        } else throw new Error('Cannot find valid forecast at location')
      } catch (error) {
        logger.error(error)
      }
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
      const results = await this.getWeacastApi().getService('probes').find({
        query: {
          name,
          forecast: this.forecastModel.name,
          $paginate: false,
          $select: ['elements', 'forecast', 'featureId']
        }
      })
      if (results.length > 0) {
        this.probe = results[0]
        return this.probe
      } else {
        return null
      }
    },
    async getForecastForFeature (featureId, startTime, endTime) {
      // Not yet ready
      if (!this.forecastModel) return
      // Check if probe is available
      if (!this.probe) return

      let probedLocation
      this.setCursor('processing-cursor')
      try {
        let elements = this.forecastModel.elements.map(element => element.name)
        // Filter available elements according to current level if any
        if (this.forecastLevel) {
          elements = elements.filter(element => element.endsWith(this.forecastLevel.toString()))
        } else {
          elements = elements.filter(element => {
            const tokens = element.split('-')
            return (tokens.length === 0) || !_.isFinite(_.toNumber(tokens[tokens.length - 1]))
          })
        }
        // Need to add derived values for static probes as they are not computed on the fly
        const windDirection = (this.forecastLevel ? `windDirection-${this.forecastLevel}` : 'windDirection')
        const windSpeed = (this.forecastLevel ? `windSpeed-${this.forecastLevel}` : 'windSpeed')
        elements = elements.concat([windDirection, windSpeed])

        const results = await this.getWeacastApi().getService('probe-results').find({
          query: {
            probeId: this.probe._id,
            forecastTime: {
              $gte: startTime.format(),
              $lte: endTime.format()
            },
            [this.probe.featureId]: featureId,
            $groupBy: this.probe.featureId,
            $aggregate: elements
          }
        })
        if (results.length > 0) {
          probedLocation = results[0]
        } else throw new Error('Cannot find valid forecast for feature')
      } catch (error) {
        logger.error(error)
      }
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
