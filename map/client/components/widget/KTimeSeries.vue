<template>
  <div id="time-series" class="column" :style="widgetStyle">
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
import { baseWidget } from '../../../../core/client/mixins'
import { KChart } from '../../../../core/client/components'
import 'chartjs-adapter-moment'
import { getCssVar } from 'quasar'

export default {
  name: 'k-time-series',
  inject: ['kActivity'],
  components: {
    KChart
  },
  mixins: [
    baseWidget
  ],
  props: {
    selection: {
      type: Object,
      default: () => {}
    },
    variables: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    title () {
      // Compute the layer name if any
      const layerName = this.selection.layer ? this.$t(this.selection.layer.name) : undefined
      // Compute the probe location name
      let probeName
      if (this.probedLocation) {
        // Check if we have a property as tooltip or popup and use it
        if (this.selection.layer) {
          const probeNameProperty = _.get(this.selection.layer, `${this.kActivity.engine}.tooltip.property`,
            _.get(this.selection.layer, `${this.kActivity.engine}.popup.pick[0]`))
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
      return this.selection.location
    },
    feature () {
      return this.selection.feature
    },
    layer () {
      return this.selection.layer
    },
    probedVariables () {
      // If the feature is linked to a layer with variables use it
      // Otherwise use all available variables to search for those applicable to it
      return (this.layer && this.layer.variables ? this.layer.variables : this.variables)
    }
  },
  watch: {
    variables: function () {
      this.refresh()
    },
    location: function () {
      this.refresh()
    }
  },
  data () {
    return {
      probedLocation: null,
      zoomHistory: []
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
        const baseUnit = variable.units[0]
        // Get default unit for this quantity instead if available
        const defaultUnit = Units.getDefaultUnit(baseUnit)
        const unit = (variable.units.includes(defaultUnit) ? defaultUnit : baseUnit)
        const label = this.$t(variable.label) || variable.label
        // Aggregated variable available for feature ?
        if (this.hasVariable(name, properties, variable.baseQuery)) {
          // Build data structure as expected by visualisation
          let values = properties[name].map((value, index) => ({ x: time[name][index], y: Units.convert(value, baseUnit, unit) }))
          // Keep only selected value if multiple are provided for the same time (eg different forecasts)
          if (variable.runTimes && !_.isEmpty(_.get(runTime, name)) && this.getSelectedRunTime()) {
            values = values.filter((value, index) => (runTime[name][index] === this.getSelectedRunTime().toISOString()))
          } else values = _.uniqBy(values, 'x')
          // Then transform to date object as expected by visualisation
          // To enable decimation the x, e.g. time, values should be defined in millisecond (parsing is disable)
          values = values.map((value) => Object.assign(value, { x: new Date(value.x).getTime() }))
          this.datasets.push(_.merge({
            label: `${label} (${Units.getUnitSymbol(unit)})`,
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
        const baseUnit = variable.units[0]
        // Get default unit for this quantity instead if available
        const defaultUnit = Units.getDefaultUnit(baseUnit)
        const unit = (variable.units.includes(defaultUnit) ? defaultUnit : baseUnit)
        // Variable available for feature ?
        if (this.hasVariable(name, properties, variable.baseQuery)) {
          this.yAxes[`y${axisId}`] = _.merge({
            unit: unit,
            display: 'auto',
            position: (axisId + 1) % 2 ? 'left' : 'right',
            ticks: {
              color: this.datasets[axisId].backgroundColor
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
        let annotation = {}
        if (currentTime.isBetween(timeRange.start, timeRange.end)) {
          annotation = {
            annotations: [{
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
            }]
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
            tooltips: {
              mode: 'x',
              callbacks: {
                label: (tooltipItem, data) => {
                  return data.datasets[tooltipItem.datasetIndex].label + ': ' + tooltipItem.yLabel.toFixed(2)
                }
              }
            },
            scales: {
              x: {
                type: 'time',
                time: {
                  unit: 'hour',
                  tooltipFormat: `${Time.getFormat().date.long} - ${Time.getFormat().time.long}`
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
              annotation,
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
      // Update tooltip action
      const action = _.find(this.$store.get('window.widgetActions'), { id: 'run-options' })
      action.tooltip = this.$t('KTimeSeries.RUN') + ' (' + Time.format(this.getSelectedRunTime(), 'date.short') +
        ' - ' + Time.format(this.getSelectedRunTime(), 'time.short') + ')'
      this.setupGraph()
    },
    updateProbedLocationHighlight () {
      if (!this.probedLocation) return
      const windDirection = (this.kActivity.forecastLevel ? `windDirection-${this.kActivity.forecastLevel}` : 'windDirection')
      const windSpeed = (this.kActivity.forecastLevel ? `windSpeed-${this.kActivity.forecastLevel}` : 'windSpeed')
      // Use wind barbs on weather probed features
      const isWeatherProbe = (_.has(this.probedLocation, `properties.${windDirection}`) &&
                              _.has(this.probedLocation, `properties.${windSpeed}`))
      const feature = (isWeatherProbe
        ? this.kActivity.getProbedLocationForecastAtCurrentTime(this.probedLocation)
        : this.kActivity.getProbedLocationMeasureAtCurrentTime(this.probedLocation))

      this.kActivity.updateSelectionHighlight('time-series', feature)
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
      const time = this.probedLocation.time || this.probedLocation.forecastTime
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
          const value = _.find(dataset.data, item => moment(item.x).toISOString() === time.toISOString())
          row[dataset.label] = value ? value.y : null
        })
        return row
      })
      // Convert to csv
      const csv = Papa.unparse(json)
      downloadAsBlob(csv, this.$t('KTimeSeries.SERIES_EXPORT_FILE'), 'text/csv;charset=utf-8;')
    },
    refreshActions () {
      let actions = [{
        id: 'absolute-time-range',
        component: 'time/KAbsoluteTimeRange'
      },
      {
        id: 'restore-time-range',
        icon: 'las la-undo',
        tooltip: 'KTimeSeries.RESTORE_TIME_RANGE',
        visible: !_.isEmpty(this.zoomHistory),
        handler: this.onZoomRestored
      },
      {
        id: 'relative-time-ranges',
        component: 'menu/KMenu',
        icon: 'las la-history',
        content: [{
          component: 'time/KRelativeTimeRanges',
          ranges: ['last-hour', 'last-2-hours', 'last-3-hours', 'last-6-hours',
            'last-12-hours', 'last-day', 'last-2-days', 'last-3-days', 'last-week',
            'next-12-hours', 'next-day', 'next-2-days', 'next-3-days']
        }]
      }]

      // When forecast data are available allow to select wich run to use
      if (this.runTimes && (this.runTimes.length > 1)) {
        // Select latest runTime as default option
        const runOptions = this.runTimes.map(runTime => ({
          label: Time.format(runTime, 'date.short') + ' - ' + Time.format(runTime, 'time.short'),
          value: runTime
        }))
        _.last(runOptions).default = true
        // Registers the action
        actions.push({
          id: 'run-options',
          component: 'input/KOptionsChooser',
          icon: 'las la-clock',
          tooltip: this.$t('KTimeSeries.RUN') + ' (' + Time.format(this.getSelectedRunTime(), 'date.short') +
            ' - ' + Time.format(this.getSelectedRunTime(), 'time.short') + ')',
          options: runOptions,
          on: { event: 'option-chosen', listener: this.onUpdateRun }
        })
      }
      actions = actions.concat([{
        id: 'center-view',
        icon: 'las la-eye',
        tooltip: 'KTimeSeries.CENTER_ON',
        visible: this.probedVariables,
        handler: this.onCenterOn
      },
      {
        id: 'export-feature',
        icon: 'las la-file-download',
        tooltip: 'KTimeSeries.EXPORT_SERIES',
        visible: this.probedVariables,
        handler: this.onExportSeries
      }])
      this.$store.patch('window', {
        widgetActions: actions
      })
    },
    async refresh () {
      // Clear previous run timle setup if any
      this.runTime = null
      this.probedLocation = null
      // Then manage selection
      this.kActivity.addSelectionHighlight('time-series')
      this.kActivity.centerOnSelection()
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
      this.refreshActions()
    }
  },
  mounted () {
    // Setup listeners
    this.$events.on('time-current-time-changed', this.refresh)
    this.$events.on('time-range-changed', this.refresh)
    this.$events.on('time-format-changed', this.refresh)
    this.$events.on('timeseries-span-changed', this.refresh)
    this.kActivity.$engineEvents.on('forecast-model-changed', this.refresh)
    this.kActivity.$engineEvents.on('selected-level-changed', this.refresh)
    // Initialize the time range
    const span = this.$store.get('timeseries.span')
    const start = moment(Time.getCurrentTime()).subtract(span, 'm')
    const end = moment(Time.getCurrentTime()).add(span, 'm')
    Time.patchRange({ start, end })
  },
  beforeUnmount () {
    // Release listeners
    this.$events.off('time-current-time-changed', this.refresh)
    this.$events.off('time-range-changed', this.refresh)
    this.$events.off('time-format-changed', this.refresh)
    this.$events.off('timeseries-span-changed', this.refresh)
    this.kActivity.$engineEvents.off('forecast-model-changed', this.refresh)
    this.kActivity.$engineEvents.off('selected-level-changed', this.refresh)
    this.kActivity.removeSelectionHighlight('time-series')
  }
}
</script>
