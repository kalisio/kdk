<template>
  <div :style="widgetStyle">
    <div class="fit row no-wrap">
      <!-- Actions -->
      <k-panel id="timeseries-actions" class="q-pa-sm" :content="actions" direction="vertical" />
      <!-- Content -->
      <div class="col column">
        <span class="full-width q-pa-sm">{{ title }}</span>
        <k-chart ref="chart" class="col full-width q-pa-sm" />
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import logger from 'loglevel'
import centroid from '@turf/centroid'
import Papa from 'papaparse'
import { getTimeInterval } from '../../utils'
import { downloadAsBlob } from '../../../../core/client/utils'
import { Units } from '../../../../core/client/units'
import { Time } from '../../../../core/client/time'
import { baseWidget, refsResolver } from '../../../../core/client/mixins'
import 'chartjs-adapter-moment'

export default {
  name: 'k-time-series',
  inject: ['kActivity'],
  mixins: [
    baseWidget,
    refsResolver(['chart'])
  ],
  props: {
    selection: {
      type: Object,
      default: () => {}
    },
    variables: {
      type: Array,
      default: () => []
    },
    decimationFactor: {
      type: Number,
      default: 1
    }
  },
  computed: {
    title () {
      // Compute the layer name if any
      const layerName = this.selection.layer ? this.$t(this.selection.layer.name) : undefined
      // Compute the probe location name
      const probeName = this.probedLocation ? _.get(this.probedLocation, 'properties.name', _.get(this.probedLocation, 'properties.NAME')) : undefined
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
    decimationFactor: function () {
      this.refresh()
    },
    location: function () {
      this.refresh()
    }
  },
  data () {
    return {
      hasChart: null,
      probedLocation: null,
      actions: [],
      settings: this.$store.get('timeseries')
    }
  },
  methods: {
    filter (value, index) {
      // We filter one value out of N according to decimation factor
      return (index % this.decimationFactor) === 0
    },
    hasVariable (name, properties) {
      return (properties[name] && Array.isArray(properties[name]))
    },
    getSelectedRunTime () {
      // Set default run as latest
      return this.runTime || _.last(this.runTimes)
    },
    setupAvailableTimes () {
      this.times = []
      const time = this.probedLocation.time || this.probedLocation.forecastTime

      this.probedVariables.forEach(variable => {
        // Check if we are targetting a specific level
        const name = (this.kActivity.selectedLevel ? `${variable.name}-${this.kActivity.selectedLevel}` : variable.name)

        if (time && time[name]) this.times.push(time[name])
      })
      // Make union of all available times for x-axis
      this.times = _.union(...this.times).map(time => moment.utc(time)).sort((a, b) => a - b).filter(this.filter)
      // Compute min time interval
      if (this.times.length > 1) {
        // Convert to hours
        this.timeInterval = getTimeInterval(this.times) / (3600 * 1000)
      } else {
        this.timeInterval = 1 // 1h by default
      }
      // Then range
      if (this.times.length > 1) {
        this.timeRange = [this.times[0], this.times[this.times.length - 1]]
      } else {
        this.timeRange = null
      }
    },
    setupAvailableRunTimes () {
      this.runTimes = []
      const runTime = this.probedLocation.runTime
      this.probedVariables.forEach(variable => {
        if (!variable.runTimes) return
        // Check if we are targetting a specific level
        const name = (this.kActivity.selectedLevel ? `${variable.name}-${this.kActivity.selectedLevel}` : variable.name)

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
      this.probedVariables.forEach((variable, index) => {
        // Check if we are targetting a specific level
        const name = (this.kActivity.selectedLevel ? `${variable.name}-${this.kActivity.selectedLevel}` : variable.name)
        // Falback to base unit
        const baseUnit = variable.units[0]
        // Get default unit for this quantity instead if available
        const defaultUnit = Units.getDefaultUnit(baseUnit)
        const unit = (variable.units.includes(defaultUnit) ? defaultUnit : baseUnit)
        const label = this.$t(variable.label) || variable.label
        // Aggregated variable available for feature ?
        if (this.hasVariable(name, properties)) {
          // Build data structure as expected by visualisation
          let values = properties[name].map((value, index) => ({ x: time[name][index], y: Units.convert(value, baseUnit, unit) }))
          // Keep only selected value if multiple are provided for the same time (eg different forecasts)
          if (variable.runTimes && !_.isEmpty(_.get(runTime, name)) && this.getSelectedRunTime()) {
            values = values.filter((value, index) => (runTime[name][index] === this.getSelectedRunTime().toISOString()))
          } else values = _.uniqBy(values, 'x')
          // Then transform to date object as expected by visualisation
          values = values.map((value) => Object.assign(value, { x: new Date(value.x) })).filter(this.filter)
          this.datasets.push(_.merge({
            label: `${label} (${Units.getUnitSymbol(unit)})`,
            data: values,
            cubicInterpolationMode: 'monotone',
            tension: 0.4,
            yAxisID: `y${index}`
          }, _.omit(variable.chartjs, 'yAxis')))
        }
      })
    },
    setupAvailableYAxes () {
      this.yAxes = {}
      const properties = this.probedLocation.properties
      let isLeft = true
      const counter = 0
      this.probedVariables.forEach(variable => {
        // Check if we are targetting a specific level
        const name = (this.kActivity.selectedLevel ? `${variable.name}-${this.kActivity.selectedLevel}` : variable.name)
        // Falback to base unit
        const baseUnit = variable.units[0]
        // Get default unit for this quantity instead if available
        const defaultUnit = Units.getDefaultUnit(baseUnit)
        const unit = (variable.units.includes(defaultUnit) ? defaultUnit : baseUnit)
        // Variable available for feature ?
        // Check also if axis already created
        if (this.hasVariable(name, properties) && !_.find(this.yAxes, axis => axis.id === unit)) {
          this.yAxes[`y${counter}`] = _.merge({
            display: 'auto',
            position: isLeft ? 'left' : 'right',
            title: {
              display: true,
              text: Units.getUnitSymbol(unit)
            }
          }, _.get(variable.chartjs, 'yAxis', {}))
          // Alternate axes by default
          isLeft = !isLeft
        }
      })
    },
    hasAvailableDatasets () {
      const keys = Object.keys(this.probedLocation.properties)
      for (let i = 0; i < this.probedVariables.length; i++) {
        let name = this.probedVariables[i].name
        // Check if we are targetting a specific level
        if (this.kActivity.selectedLevel) name = `${name}-${this.kActivity.selectedLevel}`
        if (_.indexOf(keys, name) !== -1) {
          const values = this.probedLocation.properties[name]
          if (values && Array.isArray(values)) return true
        }
      }
      return false
    },
    async setupGraph () {
      if (!this.probedLocation) return
      // As we have async operations during the whole chart creation process avoid reentrance
      // otherwise we might have interleaved calls leading to multiple charts being created
      if (this.buildingChart) return
      // Try/Catch required to ensure we reset the build flag
      try {
        this.buildingChart = true
        // Check whether weed need a graph
        //if (this.hasAvailableDatasets()) {
          // Compute chart data
          this.setupAvailableTimes()
          // Compute appropriate time span gaps
          const scrapTimeSpan = _.get(this.layer, 'queryFrom')
          const timeSpanGaps = scrapTimeSpan ? Math.abs(moment.duration(scrapTimeSpan)) : undefined
          this.setupAvailableRunTimes()
          this.setupAvailableDatasets()
          this.setupAvailableYAxes()
          //const date = _.get(Time.getCurrentFormattedTime(), 'date.short')
          const time = _.get(Time.getCurrentFormattedTime(), 'time.long')
          const dateFormat = _.get(Time.getFormat(), 'date.short')
          const timeFormat = _.get(Time.getFormat(), 'time.long')
          // Is current time visible in data time range ?
          const currentTime = Time.getCurrentTime()
          let annotation = {}
          if (this.timeRange && currentTime.isBetween(...this.timeRange)) {
            annotation = {
              annotations: [{
                type: 'line',
                mode: 'vertical',
                scaleID: 'x',
                value: currentTime.toDate(),
                borderColor: 'grey',
                borderWidth: 1,
                label: {
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  content: `${time}`,
                  position: 'start',
                  enabled: true
                }
              }]
            }
          }
          await this.loadRefs()
          this.$refs.chart.update({
            type: 'line',
            data: {
              labels: this.times,
              datasets: this.datasets
            },
            options: _.merge({
              maintainAspectRatio: false,
              spanGaps:  timeSpanGaps,
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
                  id: 'time',
                  type: 'time',
                  time: {
                    unit: 'hour',
                    stepSize: this.timeStepSize,
                    displayFormats: {
                      hour: `${dateFormat} - ${timeFormat}`
                    },
                    tooltipFormat: `${dateFormat} - ${timeFormat}`,
                    parser: (date) => {
                      if (moment.isMoment(date)) return date
                      else return moment(typeof date === 'number' ? date : date.toISOString())
                    }
                  },
                  ticks: {
                    autoskip: true,
                    maxRotation: 20,
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
                datalabels: {
                  display: false
                },
                annotation,
                decimation: {
                  enabled: true,
                  algorithm: 'lttb',
                  samples: 20
                }
              }
            }, { scales: this.yAxes })
          })
        //}
      } catch (error) {
        logger.error(error)
      }
      this.buildingChart = false
    },
    onUpdateSpan (span) {
      this.$store.set('timeseries.span', span)
    },
    onUpdateRun (runTime) {
      this.runTime = runTime
      // Update tooltip action
      const action = _.find(this.actions, { id: 'run-options' })
      action.tooltip = this.$t('KTimeSeries.RUN') + ' (' + Time.format(this.getSelectedRunTime(), 'date.short') +
        ' - ' + Time.format(this.getSelectedRunTime(), 'time.short') + ')'
      this.setupGraph()
    },
    updateProbedLocationHighlight () {
      if (!this.probedLocation) return
      const windDirection = (this.kActivity.selectedLevel ? `windDirection-${this.kActivity.selectedLevel}` : 'windDirection')
      const windSpeed = (this.kActivity.selectedLevel ? `windSpeed-${this.kActivity.selectedLevel}` : 'windSpeed')
      // Use wind barbs on weather probed features
      const isWeatherProbe = (_.has(this.probedLocation, `properties.${windDirection}`) &&
                              _.has(this.probedLocation, `properties.${windSpeed}`))
      const feature = (isWeatherProbe
        ? this.kActivity.getProbedLocationForecastAtCurrentTime(this.probedLocation)
        : this.kActivity.getProbedLocationMeasureAtCurrentTime(this.probedLocation))

      this.kActivity.updateSelectionHighlight('time-series', feature)
    },
    onCenterOn () {
      this.kActivity.centerOnSelection()
    },
    onExportSeries () {
      const json = this.times.map(time => {
        const row = {
          [this.$t('KTimeSeries.TIME_LABEL')]: time.toISOString()
        }
        this.datasets.forEach(dataset => {
          const value = _.find(dataset.data, item => item.x.toISOString() === time.toISOString())
          row[dataset.label] = value ? value.y : null
        })
        return row
      })
      const csv = Papa.unparse(json)
      downloadAsBlob(csv, this.$t('KTimeSeries.SERIES_EXPORT_FILE'), 'text/csv;charset=utf-8;')
    },
    async refresh () {
      // Select the current span as default option in UX
      const span = this.$store.get('timeseries.span')
      const spanOptions = [
        { badge: '3h', value: 180 },
        { badge: '6h', value: 360 },
        { badge: '12h', value: 720 },
        { badge: '24h', value: 1440 },
        { badge: '48h', value: 2880 },
        { badge: '72h', value: 4320 },
        { badge: '96h', value: 5760 }
      ]
      spanOptions.forEach(option => {
        if (option.value === span) {
          option.default = true
        }
      })
      // Registers the base actions
      this.actions = [
        { id: 'center-view', icon: 'las la-eye', tooltip: 'KTimeSeries.CENTER_ON', handler: this.onCenterOn },
        {
          component: 'input/KOptionsChooser',
          id: 'timespan-options',
          icon: 'las la-history',
          tooltip: 'KTimeSeries.SPAN',
          options: spanOptions,
          on: { event: 'option-chosen', listener: this.onUpdateSpan }
        },
        { id: 'export-feature', icon: 'las la-file-download', tooltip: this.$t('KTimeSeries.EXPORT_SERIES'), handler: this.onExportSeries }
      ]
      // Clear previous run timle setup if any
      this.runTime = null
      // Then manage selection
      this.kActivity.addSelectionHighlight('time-series')
      this.kActivity.centerOnSelection()
      // Update timeseries data if required
      const { start, end } = this.kActivity.getProbeTimeRange()
      // No feature clicked => dynamic weacast probe at position
      if (!this.feature) {
        this.probedLocation = await this.kActivity.getForecastForLocation(this.location.lng, this.location.lat, start, end)
        _.set(this.probedLocation, 'properties.name', this.$t('mixins.timeseries.FORECAST_PROBE') +
          ` (${this.location.lng.toFixed(2)}°, ${this.location.lat.toFixed(2)}°)`)
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

      // When forecast data are available allow to select wich run to use
      if (this.runTimes && (this.runTimes.length > 1)) {
        // Select latest runTime as default option
        const runOptions = this.runTimes.map(runTime => ({
          label: Time.format(runTime, 'date.short') + ' - ' + Time.format(runTime, 'time.short'),
          value: runTime
        }))
        _.last(runOptions).default = true
        // Registers the action
        this.actions.push({
          component: 'input/KOptionsChooser',
          id: 'run-options',
          icon: 'las la-clock',
          tooltip: this.$t('KTimeSeries.RUN') + ' (' + Time.format(this.getSelectedRunTime(), 'date.short') +
            ' - ' + Time.format(this.getSelectedRunTime(), 'time.short') + ')',
          options: runOptions,
          on: { event: 'option-chosen', listener: this.onUpdateRun }
        })
      }
    }
  },
  beforeCreate () {
    // Load the required components
    this.$options.components['k-chart'] = this.$load('chart/KChart')
    this.$options.components['k-panel'] = this.$load('frame/KPanel')
    this.$options.components['k-stamp'] = this.$load('frame/KStamp')
  },
  created () {
    // Refresh the component
    this.refresh()
  },
  mounted () {
    this.$on('time-current-time-changed', this.refresh)
    this.$events.$on('time-format-changed', this.refresh)
    this.$events.$on('timeseries-span-changed', this.refresh)
    this.kActivity.$on('forecast-model-changed', this.refresh)
    this.kActivity.$on('forecast-level-changed', this.refresh)
  },
  beforeDestroy () {
    this.$off('time-current-time-changed', this.refresh)
    this.$events.$off('time-format-changed', this.refresh)
    this.$events.$off('timeseries-span-changed', this.refresh)
    this.kActivity.$off('forecast-model-changed', this.refresh)
    this.kActivity.$off('forecast-level-changed', this.refresh)
    this.kActivity.removeSelectionHighlight('time-series')
  }
}
</script>

