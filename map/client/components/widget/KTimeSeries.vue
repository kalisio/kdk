<template>
  <div id="time-series" class="column">
    <k-chart id="timeseries-chart" :ref="onChartCreated" class="col q-pl-sm q-pr-sm" />
  </div>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import logger from 'loglevel'
import centroid from '@turf/centroid'
import Papa from 'papaparse'
import { downloadAsBlob } from '../../../../core/client/utils'
import { Units } from '../../../../core/client/units'
import { Time } from '../../../../core/client/time'
import { KChart } from '../../../../core/client/components'
import { useCurrentActivity, useWeather, useMeasure, useHighlight } from '../../composables'
import 'chartjs-adapter-moment'
import { getCssVar } from 'quasar'

export default {
  name: 'k-time-series',
  components: {
    KChart
  },
  props: {
    highlight: {
      type: Object,
      default: () => ({ 'stroke-color': 'primary', 'fill-opacity': 0, zOrder: 1 })
    }
  },
  computed: {
    title () {
      // Compute the layer name if any
      const layerName = this.hasSelectedFeature() && this.getSelectedLayer() ? this.$t(this.getSelectedLayer().name) : undefined
      // Compute the probe location name
      let probeName
      if (this.probedLocation) {
        // Check if we have a property as tooltip or popup and use it
        if (this.hasSelectedLayer()) {
          const probeNameProperty = _.get(this.getSelectedLayer(), `${this.kActivity.engine}.tooltip.property`,
            _.get(this.getSelectedLayer(), `${this.kActivity.engine}.popup.pick[0]`))
          if (probeNameProperty) probeName = _.get(this.probedLocation, `properties.${probeNameProperty}`)
        }
        // Otherwise test for conventional names otherwise
        if (!probeName) probeName = _.get(this.probedLocation, 'properties.name', _.get(this.probedLocation, 'properties.NAME'))
      }
      if (layerName && probeName) return `${layerName} - ${probeName}`
      if (probeName) return probeName
      return ''
    },
    location () {
      if (this.hasSelectedLocation()) return this.getSelectedLocation()
      else if (this.hasProbedLocation()) return this.getProbedLocation()
    },
    feature () {
      return this.hasSelectedFeature() && this.getSelectedFeature()
    },
    layer () {
      if (this.hasSelectedLayer()) return this.getSelectedLayer()
      else if (this.hasProbedLayer()) return this.getProbedLayer()
    },
    probedVariables () {
      // If the feature is linked to a layer with variables use it
      // Otherwise use all available variables to search for those applicable to it
      return (this.layer && this.layer.variables ? this.layer.variables : this.kActivity.variables)
    },
    runOptions () {
      // Build options from runtimes for UI
      let runOptions = []
      if (this.hasRunTimes()) {
        runOptions = this.runTimes.map(runTime => ({
          label: Time.format(runTime, 'date.short') + ' - ' + Time.format(runTime, 'time.short'),
          value: runTime
        }))
        // Select latest runTime as default option
        _.last(runOptions).default = true
      }
      return runOptions
    }
  },
  watch: {
    variables: function () {
      this.refresh()
    },
    // This also cover the case where the feature changes
    location: function () {
      this.refresh()
    }
  },
  data () {
    return {
      probedLocation: null,
      zoomHistory: [],
      runTime: null,
      runTimes: []
    }
  },
  methods: {
    hasVariable (name, properties, match) {
      // The feature target the variable if it has at least the target variable value name
      let hasVariable = (properties[name] && Array.isArray(properties[name]))
      // Test if the variable needs to match additional properties
      // in case multiple variables target the same property value name
      if (match) {
        _.forOwn(match, (value, key) => { hasVariable = hasVariable && (properties[key] === value) })
      }
      return hasVariable
    },
    hasZoomHistory () {
      return this.zoomHistory.length > 0
    },
    getBaseUnit (variable, properties) {
      const unit = variable.unit
      // Could be either directly the unit or the property of the measure storing the unit
      return _.get(properties, unit, unit)
    },
    hasRunTimes () {
      return this.runTimes && (this.runTimes.length > 1)
    },
    getSelectedRunTime () {
      // Set default run as latest
      return this.runTime || _.last(this.runTimes)
    },
    setupAvailableRunTimes () {
      this.runTimes = []
      const runTime = this.probedLocation.runTime
      this.probedVariables.forEach(variable => {
        if (!variable.runTimes) return
        // Check if we are targetting a specific level
        const name = (this.kActivity.forecastLevel ? `${variable.name}-${this.kActivity.forecastLevel}` : variable.name)

        if (runTime && runTime[name]) this.runTimes.push(runTime[name])
      })
      // Make union of all available run times
      this.runTimes = _.union(...this.runTimes).map(time => moment.utc(time)).sort((a, b) => a - b)
    },
    setupAvailableDatasets () {
      this.datasets = []
      const time = this.probedLocation.time || this.probedLocation.forecastTime
      const runTime = this.probedLocation.runTime
      const properties = this.probedLocation.properties
      let axisId = 0
      this.probedVariables.forEach((variable, index) => {
        // Check if we are targetting a specific level
        const name = (this.kActivity.forecastLevel ? `${variable.name}-${this.kActivity.forecastLevel}` : variable.name)
        // Falback to base unit
        const unit = this.getBaseUnit(variable, properties)
        const label = this.$t(variable.label) || variable.label
        // Aggregated variable available for feature ?
        if (this.hasVariable(name, properties, variable.baseQuery)) {
          // Build data structure as expected by visualisation
          let values = properties[name].map((value, index) => ({ x: time[name][index], y: value }))
          // Keep only selected value if multiple are provided for the same time (eg different forecasts)
          if (variable.runTimes && !_.isEmpty(_.get(runTime, name)) && this.getSelectedRunTime()) {
            values = values.filter((value, index) => (runTime[name][index] === this.getSelectedRunTime().toISOString()))
          } else values = _.uniqBy(values, 'x')
          // Then transform to date object as expected by visualisation
          // To enable decimation the x, e.g. time, values should be defined in millisecond (parsing is disable)
          values = values.map((value) => Object.assign(value, { x: new Date(value.x).getTime() }))
          this.datasets.push(_.merge({
            label: `${label} (${Units.getTargetUnitSymbol(unit)})`,
            unit,
            data: values,
            cubicInterpolationMode: 'monotone',
            tension: 0.4,
            yAxisID: `y${axisId++}`
          }, _.omit(variable.chartjs, 'yAxis')))
        }
      })
    },
    setupAvailableYAxes () {
      this.yAxes = {}
      const properties = this.probedLocation.properties
      let axisId = 0
      this.probedVariables.forEach(variable => {
        // Check if we are targetting a specific level
        const name = (this.kActivity.forecastLevel ? `${variable.name}-${this.kActivity.forecastLevel}` : variable.name)
        // Falback to base unit
        const unit = this.getBaseUnit(variable, properties)
        // Variable available for feature ?
        if (this.hasVariable(name, properties, variable.baseQuery)) {
          this.yAxes[`y${axisId}`] = _.merge({
            unit,
            display: 'auto',
            position: (axisId + 1) % 2 ? 'left' : 'right',
            ticks: {
              color: this.datasets[axisId].backgroundColor,
              callback: function (value, index, values) {
                if (values[index] !== undefined) {
                  return Units.format(values[index].value, unit, null, { symbol: false })
                }
              }
            }
          }, _.get(variable.chartjs, 'yAxis', {}))
          axisId++
        }
      })
    },
    hasAvailableDatasets () {
      const keys = Object.keys(this.probedLocation.properties)
      for (let i = 0; i < this.probedVariables.length; i++) {
        let name = this.probedVariables[i].name
        // Check if we are targetting a specific level
        if (this.kActivity.forecastLevel) name = `${name}-${this.kActivity.forecastLevel}`
        if (_.indexOf(keys, name) !== -1) {
          const values = this.probedLocation.properties[name]
          if (values && Array.isArray(values)) return true
        }
      }
      return false
    },
    onChartCreated (ref) {
      if (ref && !this.chart) {
        this.chart = ref
      }
    },
    async setupGraph () {
      if (!this.probedLocation) return
      // As we have async operations during the whole chart creation process avoid reentrance
      // otherwise we might have interleaved calls leading to multiple charts being created
      if (this.buildingChart) return
      // Try/Catch required to ensure we reset the build flag
      try {
        this.buildingChart = true
        // TODO this.setupAvailableTimes()
        // Compute appropriate time span gaps
        const scrapTimeSpan = _.get(this.layer, 'queryFrom')
        const timeSpanGaps = scrapTimeSpan ? Math.abs(moment.duration(scrapTimeSpan)) : undefined
        this.setupAvailableRunTimes()
        this.setupAvailableDatasets()
        this.setupAvailableYAxes()
        // Is current time visible in data time range ?
        const currentTime = Time.getCurrentTime()
        const timeRange = Time.getRange()
        const annotations = []
        if (currentTime.isBetween(timeRange.start, timeRange.end)) {
          annotations.push({
            type: 'line',
            mode: 'vertical',
            scaleID: 'x',
            value: currentTime.toDate(),
            borderColor: 'grey',
            borderWidth: 1,
            label: {
              backgroundColor: 'rgba(0,0,0,0.65)',
              content: _.get(Time.getCurrentFormattedTime(), 'time.long'),
              position: 'start',
              enabled: true
            }
          })
        }
        // Display also time of probed feature, only if single variable
        if ((this.probedVariables.length === 1) && this.feature && this.feature.time) {
          const time = moment.utc(this.feature.time[this.probedVariables[0].name])
          if (time.isBetween(timeRange.start, timeRange.end)) {
            annotations.push({
              type: 'line',
              mode: 'vertical',
              scaleID: 'x',
              value: time.toDate(),
              borderColor: 'green',
              borderWidth: 1,
              label: {
                backgroundColor: 'rgba(0,0,0,0.65)',
                content: Time.format(time, 'time.long'),
                position: 'start',
                enabled: true
              }
            })
          }
        }
        this.chart.update({
          type: 'line',
          data: {
            labels: this.times,
            datasets: this.datasets
          },
          options: _.merge({
            maintainAspectRatio: false,
            animation: false,
            parsing: false,
            spanGaps: timeSpanGaps,
            scales: {
              x: {
                type: 'time',
                time: {
                  unit: 'hour'
                },
                ticks: {
                  autoskip: true,
                  maxRotation: 20,
                  major: {
                    enabled: true
                  },
                  callback: function (value, index, values) {
                    if (values[index] !== undefined) {
                      if (values[index].major === true) {
                        return Time.format(moment(values[index].value), 'date.short')
                      } else {
                        return Time.format(moment(values[index].value), 'time.short')
                      }
                    }
                  },
                  font: function (context) {
                    if (context.tick && context.tick.major) {
                      return {
                        weight: 'bold'
                      }
                    }
                  }
                }
              }
            },
            plugins: {
              title: {
                display: true,
                text: this.title,
                align: 'start'
              },
              datalabels: {
                display: false
              },
              tooltip: {
                mode: 'x',
                callbacks: {
                  title: (context) => {
                    // As we are selecting tooltip items based on x coordinate all should have the same one, which is actually the time
                    const x = _.get(context, '[0].parsed.x')
                    return (x ? `${Time.format(x, 'date.short')} - ${Time.format(x, 'time.short')}` : '')
                  },
                  label: (context) => {
                    const { unit, label } = context.dataset
                    const y = _.get(context, 'parsed.y')
                    // We have unit in label name for legend but we want it after the value for tooltip
                    return label.replace(`(${Units.getTargetUnitSymbol(unit)})`, '') + ': ' + Units.format(y, unit)
                  }
                }
              },
              annotation: {
                annotations
              },
              zoom: {
                zoom: {
                  drag: {
                    enabled: true,
                    backgroundColor: getCssVar('secondary')
                  },
                  mode: 'x',
                  onZoomStart: this.onZoomStarted,
                  onZoom: this.onZoomed
                }
              },
              decimation: {
                enabled: true,
                algorithm: 'lttb'
              }
            }
          }, { scales: this.yAxes })
        })
      } catch (error) {
        logger.error(error)
      }
      this.buildingChart = false
    },
    onUpdateRun (runTime) {
      this.runTime = runTime
      this.setupGraph()
    },
    updateProbedLocationHighlight () {
      this.clearHighlights()
      if (!this.probedLocation) return
      const isWeatherProbe = this.isWeatherProbe(this.probedLocation)
      const feature = (isWeatherProbe
        ? this.getProbedLocationForecastAtCurrentTime(this.probedLocation)
        : this.getProbedLocationMeasureAtCurrentTime(this.probedLocation))
      this.highlight(feature, this.layer)
    },
    onZoomRestored () {
      if (!_.isEmpty(this.zoomHistory)) {
        Time.patchRange(_.last(this.zoomHistory))
        this.zoomHistory = _.slice(this.zoomHistory, 0, this.zoomHistory.length - 1)
      }
    },
    onZoomStarted ({ chart }) {
      this.zoomHistory.push({
        start: moment(Time.getRange().start),
        end: moment(Time.getRange().end)
      })
    },
    onZoomed ({ chart }) {
      const start = moment(_.get(chart, 'scales.x.min'))
      const end = moment(_.get(chart, 'scales.x.max'))
      Time.patchRange({ start, end })
    },
    onCenterOn () {
      this.kActivity.centerOnSelection()
    },
    onExportSeries () {
      let times = []
      const time = _.get(this.probedLocation, 'time', _.get(this.probedLocation, 'forecastTime'))
      this.probedVariables.forEach(variable => {
        // Check if we are targetting a specific level
        const name = (this.kActivity.forecastLevel ? `${variable.name}-${this.kActivity.forecastLevel}` : variable.name)
        if (time && time[name]) times.push(time[name])
      })
      // Make union of all available times for x-axis
      times = _.union(...times).map(time => moment.utc(time)).sort((a, b) => a - b)
      // Convert to json
      const json = times.map(time => {
        const row = {
          [this.$t('KTimeSeries.TIME_LABEL')]: time.toISOString()
        }
        this.datasets.forEach(dataset => {
          const value = _.find(dataset.data, item => moment.utc(item.x).toISOString() === time.toISOString())
          row[dataset.label] = value ? value.y : null
        })
        return row
      })
      // Convert to csv
      const csv = Papa.unparse(json)
      let filename = (this.title ? this.title.replace(/\s/g, '') : this.$t('KTimeSeries.SERIES_EXPORT_FILE'))
      filename += '_' + new Date().toLocaleString()
      downloadAsBlob(csv, _.snakeCase(filename) + '.csv', 'text/csv;charset=utf-8;')
    },
    async refresh () {
      // Clear previous run time setup if any
      this.runTime = null
      this.probedLocation = null
      this.clearHighlights()
      if (!this.location) {
        // Clear current graph if any
        this.chart.clear()
        return
      }
      // Then manage selection
      this.highlight(this.location, this.layer)
      if (this.hasProbedLocation()) this.centerOnProbe()
      else this.centerOnSelection()
      // Update timeseries data if required
      const { start, end } = Time.getRange()
      // No feature clicked => dynamic weacast probe at position
      if (!this.feature) {
        if (this.kActivity.probeLocation) { // Maybe there's a specific probeLocation function
          this.probedLocation = await this.kActivity.probeLocation(this.location.lng, this.location.lat, start, end)
        }
        if (!this.probedLocation) {
          this.probedLocation = await this.kActivity.getForecastForLocation(this.location.lng, this.location.lat, start, end)
          _.set(this.probedLocation, 'properties.name', this.$t('mixins.timeseries.FORECAST_PROBE') +
                ` (${this.location.lng.toFixed(2)}°, ${this.location.lat.toFixed(2)}°)`)
        }
      } else if (this.layer.probe) { // Static weacast probe
        const probe = await this.kActivity.getForecastProbe(this.layer.probe)
        if (probe) {
          this.probedLocation = await this.kActivity.getForecastForFeature(_.get(this.feature, probe.featureId), start, end)
        }
      } else if (this.layer.variables && this.layer.service) { // Static measure probe
        this.probedLocation = await this.kActivity.getMeasureForFeature(this.layer, this.feature, start, end)
      } else { // dynamic weacast probe at feature position
        const name = _.get(this.feature, 'properties.name', _.get(this.feature, 'properties.NAME'))
        const location = centroid(this.feature)
        const longitude = _.get(location, 'geometry.coordinates[0]')
        const latitude = _.get(location, 'geometry.coordinates[1]')
        this.probedLocation = await this.kActivity.getForecastForLocation(longitude, latitude, start, end)
        _.set(this.probedLocation, 'properties.name', this.$t('mixins.timeseries.FORECAST_PROBE') +
          (name ? ` (${name})` : ` (${longitude.toFixed(2)}°, ${latitude.toFixed(2)}°)`))
      }
      await this.setupGraph()
      this.updateProbedLocationHighlight()
    }
  },
  async mounted () {
    // Initialize the time range
    const span = this.$store.get('timeseries.span')
    const start = moment(Time.getCurrentTime()).subtract(span, 'm')
    const end = moment(Time.getCurrentTime()).add(span, 'm')
    Time.patchRange({ start, end })
    // Force a first refresh
    await this.refresh()
    // Then setup listeners
    this.$events.on('time-current-time-changed', this.refresh)
    this.$events.on('time-range-changed', this.refresh)
    this.$events.on('time-format-changed', this.refresh)
    this.$events.on('timeseries-span-changed', this.refresh)
    this.kActivity.$engineEvents.on('forecast-model-changed', this.refresh)
    this.kActivity.$engineEvents.on('selected-level-changed', this.refresh)
  },
  beforeUnmount () {
    // Release listeners
    this.$events.off('time-current-time-changed', this.refresh)
    this.$events.off('time-range-changed', this.refresh)
    this.$events.off('time-format-changed', this.refresh)
    this.$events.off('timeseries-span-changed', this.refresh)
    this.kActivity.$engineEvents.off('forecast-model-changed', this.refresh)
    this.kActivity.$engineEvents.off('selected-level-changed', this.refresh)
  },
  setup (props) {
    return {
      ...useCurrentActivity(),
      ...useWeather(),
      ...useMeasure(),
      ...useHighlight('time-series', props.highlight)
    }
  }
}
</script>
