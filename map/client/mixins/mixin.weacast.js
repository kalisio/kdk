import _ from 'lodash'
import L from 'leaflet'
import logger from 'loglevel'
import moment from 'moment'
import { Time } from '../../../core/client/time'
import { Units } from '../../../core/client/units'
import { getNearestTime, SelectionLayerName } from '../utils'

export default {
  data () {
    return {
      forecastModel: null,
      forecastModels: []
    }
  },
  methods: {
    async setupWeacast () {
      // As we proxy weacast service we use our API
      this.weacastApi = this.$api
      // We need to implement time management
      this.weacastApi.setForecastTime = (time) => {
        this.$api.forecastTime = time
        this.$api.emit('forecast-time-changed', time)
      }
      this.weacastApi.getForecastTime = () => {
        return this.$api.forecastTime
      }
      try {
        await this.setupForecastModels()
      } catch (error) {
        logger.error('Cannot retrieve available Weacast forecast models', error)
      }
    },
    async setupForecastModels () {
      if (!this.weacastApi) return
      const response = await this.weacastApi.getService('forecasts').find()
      this.forecastModels = response.data
      // store forecast models on the weacast api object too (useful in the weacast grid source)
      this.weacastApi.models = this.forecastModels
      // Select default if any or first one
      let forecastModel = this.forecastModels.find(forecast => forecast.isDefault)
      if (!forecastModel) {
        forecastModel = (this.forecastModels.length > 0 ? this.forecastModels[0] : null)
      }
      this.setForecastModel(forecastModel)
    },
    setForecastModel (model) {
      this.forecastModel = model
      this.$emit('forecast-model-changed', this.forecastModel)
    },
    setForecastLevel (level) {
      this.forecastLevel = level
      this.$emit('forecast-level-changed', this.forecastLevel)
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
        const response = await this.weacastApi.getService('probes')
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
      const results = await this.weacastApi.getService('probes').find({
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

        const results = await this.weacastApi.getService('probe-results').find({
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
    getForecastValueAtCurrentTime (times, values) {
      // Check for the right value at time
      if (Array.isArray(times) && Array.isArray(values)) {
        // Look for the nearest time
        const nearestTime = getNearestTime(Time.getCurrentTime(), times.map(time => moment.utc(time)))
        // Check if we found a valid time within interval, otherwise the time is missing
        if ((nearestTime.difference / 1000) > (0.5 * this.forecastModel.interval)) return null
        else return values[nearestTime.index]
      } else {
        // Constant value
        return values
      }
    },
    getProbedLocationForecastAtCurrentTime (probedLocation) {
      // Create new geojson from raw response containing all times
      const feature = _.cloneDeep(probedLocation)
      // Then check for the right value at time
      _.forOwn(feature.properties, (value, key) => {
        if (Array.isArray(value)) {
          const times = _.get(feature, 'forecastTime.' + key)
          if (times) {
            _.set(feature, 'properties.' + key, this.getForecastValueAtCurrentTime(times, value))
            _.set(feature, 'forecastTime.' + key, this.getForecastValueAtCurrentTime(times, times))
          }
        }
      })
      return feature
    },
    getForecastAsHtml (feature, fields = {}) {
      // Retrieve target fields on feature
      const windDirectionField = _.get(fields, 'windDirection', 'properties.windDirection')
      const windSpeedField = _.get(fields, 'windSpeed', 'properties.windSpeed')
      const gustField = _.get(fields, 'gust', 'properties.gust')
      const temperatureField = _.get(fields, 'temperature', 'properties.temperature')
      const precipitationsField = _.get(fields, 'precipitations', 'properties.precipitations')
      const humidityField = _.get(fields, 'humidity', 'properties.humidity')
      const timeField = _.get(fields, 'time', 'forecastTime')
      const nameField = _.get(fields, 'name', 'properties.name')
      // Then get values for fields
      const windDirection = _.get(feature, `${windDirectionField}`)
      const windSpeed = _.get(feature, `${windSpeedField}`)
      const gust = _.get(feature, `${gustField}`)
      const temperature = _.get(feature, `${temperatureField}`)
      const precipitations = _.get(feature, `${precipitationsField}`)
      const humidity = _.get(feature, `${humidityField}`)
      let time = _.get(feature, `${timeField}`)
      // We can have a single time or a map between fields and available times
      // If a single time is found we will display it once,
      // otherwise we will display a different time for each field
      let uniqTime = true
      if (typeof time === 'object') {
        const uniqTimes = _.uniq(_.values(time))
        if (uniqTimes.length > 1) {
          uniqTime = false
        } else {
          // Update time in place with actual value
          time = uniqTimes[0]
        }
      }
      const getTimeAsHtml = (time) => {
        if (!_.isNil(time)) {
          time = moment.utc(time)
          if (time.isValid()) return ` (${Time.format(time, 'date.short')} - ${Time.format(time, 'time.long')})`
        }
        return ''
      }
      let html = ''
      if (!_.isNil(windSpeed) && _.isFinite(windSpeed)) {
        html += Units.format(windSpeed, 'm/s')
        // Add related time if any
        if (!uniqTime) html += getTimeAsHtml(_.get(time, windSpeedField.replace('properties.', '')))
        html += '</br>'
      }
      if (!_.isNil(gust) && _.isFinite(gust)) {
        html += `max ${Units.format(gust, 'm/s')}`
        // Add related time if any
        if (!uniqTime) html += getTimeAsHtml(_.get(time, gustField.replace('properties.', '')))
        html += '</br>'
      }
      if (!_.isNil(windDirection) && _.isFinite(windDirection)) {
        html += Units.format(windDirection, 'deg')
        // Add related time if any
        if (!uniqTime) html += getTimeAsHtml(_.get(time, windDirectionField.replace('properties.', '')))
        html += '</br>'
      }
      if (!_.isNil(precipitations) && _.isFinite(precipitations)) {
        html += Units.format(precipitations, 'mm/h')
        // Add related time if any
        if (!uniqTime) html += getTimeAsHtml(_.get(time, precipitationsField.replace('properties.', '')))
        html += '</br>'
      }
      if (!_.isNil(humidity) && _.isFinite(humidity)) {
        html += `${humidity.toFixed(0)} %`
        // Add related time if any
        if (!uniqTime) html += getTimeAsHtml(_.get(time, humidityField.replace('properties.', '')))
        html += '</br>'
      }
      if (!_.isNil(temperature) && _.isFinite(temperature)) {
        html += Units.format(temperature, 'degC')
        // Add related time if any
        if (!uniqTime) html += getTimeAsHtml(_.get(time, temperatureField.replace('properties.', '')))
        html += '</br>'
      }
      // If we have any value add name/time information
      if (html) {
        const name = _.get(feature, `${nameField}`)
        if (!_.isNil(name)) html = `<b><u>${name}</u></b></br>` + html
        // If we get a signle time for all field add it at the end
        if (uniqTime) {
          html += getTimeAsHtml(time)
        }
      }
      return html
    },
    getProbedLocationForecastTooltip (feature, layer, options) {
      if (options.name !== SelectionLayerName) return

      // Only wind/temperature can be available at different levels now
      const html = this.getForecastAsHtml(feature, {
        windDirection: (this.forecastLevel ? `properties.windDirection-${this.forecastLevel}` : 'properties.windDirection'),
        windSpeed: (this.forecastLevel ? `properties.windSpeed-${this.forecastLevel}` : 'properties.windSpeed'),
        temperature: (this.forecastLevel ? `properties.temperature-${this.forecastLevel}` : 'properties.temperature')
      })
      return (html ? L.tooltip({ permanent: false }, layer).setContent(`<b>${html}</b>`) : null)
    },
    createWindBarbMarker (feature, fields = {}) {
      // Retrieve target fields on feature
      let windDirection = _.get(fields, 'windDirection', 'properties.windDirection')
      let windSpeed = _.get(fields, 'windSpeed', 'properties.windSpeed')
      // TODO: colorize according to temperature scale if ?
      // let temperature = _.get(fields, 'temperature', 'properties.temperature')
      // Then get values for fields
      windDirection = _.get(feature, `${windDirection}`)
      windSpeed = _.get(feature, `${windSpeed}`)
      if (_.isNil(windDirection) || !_.isFinite(windDirection) ||
          _.isNil(windSpeed) || !_.isFinite(windSpeed)) return null
      // Then get values for fields
      return new L.WindBarb.Icon({
        deg: windDirection,
        speed: windSpeed, // Expressed as m/s
        pointRadius: 10,
        pointColor: '#2196f3',
        pointStroke: '#888888',
        strokeWidth: 2,
        strokeColor: '#888888',
        strokeLength: 12,
        fillColor: '#2196f3',
        barbSpaceing: 4,
        barbHeight: 10,
        forceDir: true
      })
    },
    getProbedLocationForecastMarker (feature, latlng, options) {
      if (options.name !== SelectionLayerName) return
      // Use wind barbs on probed features
      const icon = this.createWindBarbMarker(feature, {
        windDirection: (this.forecastLevel ? `properties.windDirection-${this.forecastLevel}` : 'properties.windDirection'),
        windSpeed: (this.forecastLevel ? `properties.windSpeed-${this.forecastLevel}` : 'properties.windSpeed')
      })
      return (icon ? L.marker(latlng, { icon }) : null)
    },
    onCurrentForecastTimeChanged (time) {
      if (this.weacastApi) this.weacastApi.setForecastTime(time)
    },
    onWeacastShowLayer (layer, engineLayer) {
      // Check for valid types
      if (!(engineLayer instanceof L.weacast.ForecastLayer)) {
        const levels = _.get(layer, 'levels')
        if (!levels) {
          this.setForecastLevel(null)
          return
        }
        if (typeof this.setSelectableLevels === 'function') {
          this.$on('selected-level-changed', this.setForecastLevel)
          this.setSelectableLevels(layer, levels)
        }
      }
    },
    onWeacastHideLayer (layer, engineLayer) {
      // Check for valid types
      if (!(engineLayer instanceof L.weacast.ForecastLayer)) return
      if (typeof this.clearSelectableLevels === 'function') {
        this.clearSelectableLevels(layer)
        this.$off('selected-level-changed', this.setForecastLevel)
      }
    }
  },
  created () {
    this.$events.$on('time-current-time-changed', this.onCurrentForecastTimeChanged)
    this.$on('layer-shown', this.onWeacastShowLayer)
    this.$on('layer-hidden', this.onWeacastHideLayer)
  },
  mounted () {
  },
  beforeDestroy () {
    this.$events.$off('time-current-time-changed', this.onCurrentForecastTimeChanged)
    this.$off('layer-shown', this.onWeacastShowLayer)
    this.$off('layer-hidden', this.onWeacastHideLayer)
  }
}
