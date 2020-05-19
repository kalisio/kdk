import _ from 'lodash'
import L from 'leaflet'
import logger from 'loglevel'
import moment from 'moment'
import { getNearestTime } from '../utils'

/**/
import { getNearestRunTime, getNearestForecastTime } from 'weacast-core/common'
// import OpenDapGridSource from '../../common/opendap-grid-source'
import { makeGridSource, extractGridSourceConfig } from '../../common/grid'
import { MeteoModelGridSource } from '../../common/meteo-model-grid-source'
import * as dap from '../../common/opendap-utils.js'
/**/

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

    /**/
    async getOpenDapForLocation (long, lat, startTime, endTime) {
      this.setCursor('processing-cursor')

      const result = {
        geometry: {
          type: 'Point',
          coordinates: [long, lat]
        },
        forecastTime: {},
        runTime: {},
        properties: {}
      }

      const runTime = getNearestRunTime(startTime, this.forecastModel.runInterval)
      const startForecastTime = getNearestForecastTime(startTime, this.forecastModel.interval)
      const endForecastTime = getNearestForecastTime(endTime, this.forecastModel.interval)

      const properties = []
      const sources = []
      // foreach archive layer with a meteo_model, build corresponding grid source
      for (const name of _.keys(this.layers)) {
        const layer = this.layers[name]
        if (!layer.tags.includes('archive')) continue
        const meteoModel = layer[MeteoModelGridSource.getKey()]
        if (!meteoModel) continue
        const impl = MeteoModelGridSource.selectImpl(meteoModel, startForecastTime, this.forecastModel)

        const prop = layer.variables[0].name
        result.forecastTime[prop] = []
        result.runTime[prop] = []
        result.properties[prop] = []
        properties.push(prop)
        sources.push(impl)
      }

      const startOffset = moment.duration(startForecastTime.diff(runTime)).asHours()
      const endOffset = moment.duration(endForecastTime.diff(runTime)).asHours()

      // foreach property, fetch data
      const allp = []
      for (let i = 0; i < properties.length; ++i) {
        const url = _.template(sources[i].dynprops.url.strTemplate)({ runTime })
        const p = dap.initContext(url).then(async (ctx) => {
          const values = {
            time: [startOffset, endOffset]
          }
          Object.assign(values, sources[i].opendap.dimensionsAsValues)

          const indexes = await dap.lookupIndexForValues(ctx, values)
          const dimensions = _.mapValues(indexes, (v) => {
            if (v.length === 1) return `${v[0]}`
            return `${v[0]}:1:${v[1]}`
          })

          const data = await dap.query(ctx, sources[i].opendap.variable, dimensions)
          console.log(data)
        })
        allp.push(p)
        /*
        const q = dap.makeQuery(url, query)
        console.log(q)
        */
      }

      await Promise.all(allp)
      
      this.unsetCursor('processing-cursor')

      return result
    },
    /**/

    /**/
    async getArchiveForLocation (long, lat, startTime, endTime) {
      this.setCursor('processing-cursor')

      const result = {
        geometry: {
          type: 'Point',
          coordinates: [long, lat]
        },
        forecastTime: {},
        runTime: {},
        properties: {}
      }

      // get url template
      // get static values
      // assume dynamic value = time ?
      // fetch dataset descriptor
      // build query with time range + lat/lon index ?
      // parse output

      const properties = []
      const sources = []
      // foreach archive layer with a meteo_model, build corresponding grid source
      for (const name of _.keys(this.layers)) {
        const layer = this.layers[name]
        if (!layer.tags.includes('archive')) continue
        if (!layer[MeteoModelGridSource.getKey()]) continue

        const [gridKey, gridConf] = extractGridSourceConfig(layer)
        const source = makeGridSource(gridKey, { })
        await source.setup(gridConf)

        const prop = layer.variables[0].name
        result.forecastTime[prop] = []
        result.runTime[prop] = []
        result.properties[prop] = []
        properties.push(prop)
        sources.push(source)
      }

      const resolution = [this.forecastModel.resolution[1], this.forecastModel.resolution[0]]
      const offset = [resolution[0] / 2, resolution[1] / 2]
      const reqBbox = [lat - offset[0], long - offset[1], lat + offset[0], long + offset[0]]

      const toWait = []
      const current = startTime.clone()
      // iterate over time range
      while (current.isSameOrBefore(endTime)) {
        const runTime = getNearestRunTime(current, this.forecastModel.runInterval)
        const forecastTime = getNearestForecastTime(current, this.forecastModel.interval)

        // foreach property, fetch data
        for (let i = 0; i < properties.length; ++i) {
          sources[i].setModel(this.forecastModel)
          sources[i].setTime(current)
          const p = sources[i].update().then(async () => {
            const grid = await sources[i].fetch(null, reqBbox, resolution)
            if (grid) {
              const prop = properties[i]
              result.forecastTime[prop].push(forecastTime)
              result.runTime[prop].push(runTime)
              // result.properties[prop].push(grid.getValue(0,0))
              result.properties[prop].push(grid.interpolate(lat, long))
            }
          })
          toWait.push(p)
        }

        await Promise.allSettled(toWait)
        toWait.splice(0)

        current.add(this.forecastModel.interval, 's')
      }

      this.unsetCursor('processing-cursor')

      return result
    },
    /**/

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
        const nearestTime = getNearestTime(this.currentTime, times.map(time => moment.utc(time)))
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
            feature.properties[key] = this.getForecastValueAtCurrentTime(times, value)
          }
        }
      })
      return feature
    },
    getProbedLocationForecastTooltip (feature, layer) {
      // Only wind/temperature can be available at different levels now
      const windDirection = (this.forecastLevel ? `windDirection-${this.forecastLevel}` : 'windDirection')
      const windSpeed = (this.forecastLevel ? `windSpeed-${this.forecastLevel}` : 'windSpeed')
      const temperature = (this.forecastLevel ? `temperature-${this.forecastLevel}` : 'temperature')
      const direction = _.get(feature, `properties.${windDirection}`)
      const speed = _.get(feature, `properties.${windSpeed}`)
      const gust = _.get(feature, 'properties.gust')
      const t = _.get(feature, `properties.${temperature}`)
      const precipitations = _.get(feature, 'properties.precipitations')
      const humidity = _.get(feature, 'properties.humidity')
      let time = _.get(feature, 'time', _.get(feature, 'forecastTime'))
      const name = _.get(feature, 'properties.name', _.get(feature, 'properties.NAME'))
      let html = ''
      if (!_.isNil(speed) && _.isNumber(speed)) {
        html += `${speed.toFixed(1)} m/s</br>`
      }
      if (!_.isNil(gust) && _.isNumber(gust)) {
        html += `max ${gust.toFixed(1)} m/s</br>`
      }
      if (!_.isNil(direction) && _.isNumber(direction)) {
        html += `${direction.toFixed(1)} °</br>`
      }
      if (!_.isNil(precipitations) && _.isNumber(precipitations)) {
        html += `${precipitations.toFixed(1)} mm/h</br>`
      }
      if (!_.isNil(humidity) && _.isNumber(humidity)) {
        html += `${humidity.toFixed(0)} %</br>`
      }
      if (!_.isNil(t) && _.isNumber(t)) {
        html += `${t.toFixed(1)} °C</br>`
      }
      // If we have any value add name/time information
      if (html && !_.isNil(time)) {
        if (!_.isNil(name)) html = `<b><u>${name}</u></b></br>` + html
        time = moment.utc(time)
        if (time.isValid()) html += `${this.formatTime('date.short', time)} - ${this.formatTime('time.long', time)}`
      }
      return (html ? L.tooltip({ permanent: false }, layer).setContent(`<b>${html}</b>`) : null)
    },
    getProbedLocationForecastMarker (feature, latlng) {
      const properties = feature.properties
      if (!properties) return null
      const windDirection = (this.forecastLevel ? `windDirection-${this.forecastLevel}` : 'windDirection')
      const windSpeed = (this.forecastLevel ? `windSpeed-${this.forecastLevel}` : 'windSpeed')
      // const temperature = (this.forecastLevel ? `temperature-${this.forecastLevel}` : 'temperature')
      if (!_.has(properties, windDirection) || !_.has(properties, windSpeed)) return null
      // Use wind barbs on probed features
      const icon = new L.WindBarb.Icon({
        deg: _.get(properties, windDirection),
        speed: _.get(properties, windSpeed), // Expressed as m/s
        pointRadius: 10,
        pointColor: '#2196f3', // TODO: colorize according to temperature scale if
        pointStroke: '#888888',
        strokeWidth: 2,
        strokeColor: '#888888',
        strokeLength: 12,
        fillColor: '#2196f3',
        barbSpaceing: 4,
        barbHeight: 10,
        forceDir: true
      })
      return L.marker(latlng, { icon })
    },
    onCurrentForecastTimeChanged (time) {
      if (this.weacastApi) this.weacastApi.setForecastTime(time)
    },
    onWeacastShowLayer (layer, engineLayer) {
      // Check for valid types
      if (engineLayer instanceof L.weacast.ForecastLayer) {
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
    onWeacastHideLayer (layer) {
      if (typeof this.clearSelectableLevels === 'function') {
        this.clearSelectableLevels(layer)
        this.$off('selected-level-changed', this.setForecastLevel)
      }
    }
  },
  created () {
    this.$on('current-time-changed', this.onCurrentForecastTimeChanged)
    this.$on('layer-shown', this.onWeacastShowLayer)
    this.$on('layer-hidden', this.onWeacastHideLayer)
  },
  mounted () {
  },
  beforeDestroy () {
    this.$off('current-time-changed', this.onCurrentForecastTimeChanged)
    this.$off('layer-shown', this.onWeacastShowLayer)
    this.$off('layer-hidden', this.onWeacastHideLayer)
  }
}
