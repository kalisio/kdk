<template>
  <div :style='widgetStyle()'>
    <div v-if='hasGraph' class='fit row'>
      <q-resize-observer @resize='onResized' />
      <!-- Actions -->
      <k-tool-bar class='q-pa-sm' :actions='actions' direction='vertical' dense>
        <div slot='after'>
          <q-btn icon='las la-history' color='grey-9' size='md' flat round>
            <q-badge floating>
              <small>{{settings.span / 60}}H</small>
            </q-badge>
            <q-tooltip>{{$t('KTimeSeries.SPAN')}}</q-tooltip>
            <q-menu auto-close>
              <q-list>
                <q-item v-for="option in spanOptions" :key="option.value" clickable @click="onUpdateSpan(option.value)">
                  <q-item-section>{{ option.label }}</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </k-tool-bar>
      <div class='col full-width row'>
        <!-- Title -->
        <span class='col-12 q-pl-sm'>
          {{ probedLocationName }}
        </span>
        <!-- Graph -->
        <div id='chart-container' class='col-12'>
          <canvas ref='chart'></canvas>
        </div>
      </div>
    </div>
    <div v-else class='fit absolute-center'>
      <k-label :text="$t('KTimeSeries.NO_DATA_AVAILABLE')" icon-size='48px' />
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import Chart from 'chart.js'
import 'chartjs-plugin-annotation'
import { getTimeInterval } from '../../utils'
import { baseWidget } from '../../../../core/client/mixins'

export default {
  name: 'k-time-series-widget',
  inject: ['kActivity'],
  mixins: [baseWidget],
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
    location () { 
      return this.selection.location 
    },
    feature () { 
      return this.selection.feature 
    },
    layer () { 
      return this.selection.layer 
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
      probedLocation: null,
      probedLocationName: '',
      hasGraph: false,
      actions: [],
      spanOptions: [
        { label: '3H', value: 180  },
        { label: '6H', value: 360  },
        { label: '12H', value: 720 },
        { label: '24H', value: 1440 },
        { label: '48H', value: 2880 },
        { label: '72H', value: 4320 },
        { label: '96H', value: 5760 }
      ],
      settings: this.$store.get('timeseries')
    }
  },
  methods: {
    filter (value, index) {
      // We filter one value out of N according to decimation factor
      return (index % this.decimationFactor) === 0
    },
    setupTimeTicks () {
      if (!this.times || !this.graphWidth) return
      // Choose the right step size to ensure we have almost 100px between hour ticks
      // If the time interval is less than hour act as if we have only 1 time per hour
      const pixelsPerTick = this.graphWidth / (this.times.length * Math.min(1, this.timeInterval))
      this.timeStepSize = Math.ceil(Math.max(1, Math.round(100 / pixelsPerTick)))
      // Round to nearest multiple of time interval in hours
      const interval = Math.max(1, Math.floor(this.timeInterval))
      this.timeStepSize = Math.ceil(this.timeStepSize / interval) * interval
      // We can update in place when possible
      if (this.chart) {
        const xAxis = _.find(this.config.options.scales.xAxes, axis => axis.type === 'time')
        if (xAxis && xAxis.time) {
          xAxis.time.stepSize = this.timeStepSize
          this.chart.update(this.config)
        }
      }
    },
    setupAvailableTimes () {
      this.times = []
      const time = this.probedLocation.time || this.probedLocation.forecastTime

      this.variables.forEach(variable => {
        if (time && time[variable.name]) this.times.push(time[variable.name])
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
    setupAvailableDatasets () {
      this.datasets = []
      const time = this.probedLocation.time || this.probedLocation.forecastTime
      const properties = this.probedLocation.properties

      this.variables.forEach(variable => {
        const unit = variable.units[0]
        const label = this.$t(variable.label) || variable.label
        // Variable available for feature ?
        if (properties[variable.name]) {
          this.datasets.push(Object.assign({
            label: `${label} (${unit})`,
            data: properties[variable.name].map((value, index) => ({ x: new Date(time[variable.name][index]), y: value })).filter(this.filter),
            yAxisID: unit
          }, variable.chartjs))
        }
      })
    },
    setupAvailableYAxes () {
      this.yAxes = []
      const properties = this.probedLocation.properties
      let isLeft = true

      this.variables.forEach(variable => {
        const unit = variable.units[0]
        // Variable available for feature ?
        // Check also if axis already created
        if (properties[variable.name] && !_.find(this.yAxes, axis => axis.id === unit)) {
          this.yAxes.push({
            id: unit,
            position: isLeft ? 'left' : 'right',
            scaleLabel: {
              display: true,
              labelString: unit
            }
          })
          // Alternate axes
          isLeft = !isLeft
        }
      })
    },
    toggleVariable (variableItem) {
      const dataset = this.datasets[variableItem.datasetIndex]
      const metadata = this.chart.getDatasetMeta(variableItem.datasetIndex)
      // Check if there is others variables using the same unit axis
      const datasetsWithYAxis = []
      this.datasets.forEach((otherDataset, index) => {
        if ((dataset.label !== otherDataset.label) &&
            (dataset.yAxisID === otherDataset.yAxisID)) {
          datasetsWithYAxis.push(index)
        }
      })

      if (_.isNil(metadata.hidden)) {
        metadata.hidden = !this.chart.data.datasets[variableItem.datasetIndex].hidden
      } else {
        metadata.hidden = null
      }

      // Check if there is another variable using the same unit axis
      const yAxis = _.find(this.config.options.scales.yAxes, axis => axis.id === dataset.yAxisID)
      if (metadata.hidden) {
        let hideYAxis = true
        datasetsWithYAxis.forEach(otherDataset => {
          const otherMetadata = this.chart.getDatasetMeta(otherDataset)
          if (!otherMetadata.hidden) hideYAxis = false
        })
        if (hideYAxis) yAxis.display = false
      } else {
        let showYAxis = true
        datasetsWithYAxis.forEach(otherDataset => {
          const otherMetadata = this.chart.getDatasetMeta(otherDataset)
          if (!otherMetadata.hidden) showYAxis = false
        })
        if (showYAxis) yAxis.display = true
      }

      this.chart.update(this.config)
    },
    hasAvailableDatasets () {
      const keys = Object.keys(this.probedLocation.properties)
      for (let i = 0; i < this.variables.length; i++) {
        const name = this.variables[i].name
        if (_.indexOf(keys, name) !== -1) return true
      }
      return false
    },
    async setupGraph () {
      if (!this.probedLocation) return

      // Destroy previous graph if any
      if (this.chart) {
        this.chart.destroy()
        this.chart = null
      }

      // Check whether weed need a graph
      this.hasGraph = this.hasAvailableDatasets()
      if (!this.hasGraph) return

      // We need to force a refresh so that the prop is correctly updated by Vuejs in components
      await this.$nextTick()

      // Setup the graph
      this.setupAvailableTimes()
      this.setupTimeTicks()
      this.setupAvailableDatasets()
      this.setupAvailableYAxes()

      const date = _.get(this.kActivity.currentFormattedTime, 'date.short')
      const time = _.get(this.kActivity.currentFormattedTime, 'time.long')
      const dateFormat = _.get(this.kActivity.currentTimeFormat, 'date.short')
      const timeFormat = _.get(this.kActivity.currentTimeFormat, 'time.long')

      this.config = {
        type: 'line',
        data: {
          labels: this.times,
          datasets: this.datasets
        },
        options: {
          tooltips: {
            mode: 'x',
            callbacks: {
              label: (tooltipItem, data) => {
                return data.datasets[tooltipItem.datasetIndex].label + ': ' + tooltipItem.yLabel.toFixed(2)
              }
            }
          },
          scales: {
            xAxes: [{
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
              scaleLabel: {
                display: false,
                labelString: 'Date'
              }
            }],
            yAxes: this.yAxes
          },
          legend: {
            onClick: (event, legendItem) => this.toggleVariable(legendItem)
          },
          responsive: false,
          maintainAspectRatio: false
        }
      }
      // Is current time visible in data time range ?
      const currentTime = moment.utc(this.kActivity.currentFormattedTime.iso)
      if (this.timeRange && currentTime.isBetween(...this.timeRange)) {
        this.config.options.annotation = {
          drawTime: 'afterDatasetsDraw',
          events: ['click'],
          annotations: [{
            id: 'current-time',
            type: 'line',
            mode: 'vertical',
            scaleID: 'time',
            value: currentTime.toDate(),
            borderColor: 'grey',
            borderWidth: 2,
            label: {
              backgroundColor: 'rgba(0,0,0,0.5)',
              content: `${date} - ${time}`,
              position: 'top',
              enabled: true
            },
            onClick: (event) => {
              // The annotation is bound to the `this` variable
              // console.log('Annotation', event.type, this)
            }
          }]
        }
      }

      this.chart = new Chart(this.$refs.chart.getContext('2d'), this.config)
      if (this.graphHeight && this.graphWidth) {
        this.chart.canvas.parentNode.style.width = `${this.graphWidth}px` 
        this.chart.canvas.parentNode.style.height = `${this.graphHeight}px` 
        this.chart.resize()
      }
    },
    async onResized (size) {
      this.graphWidth =  Math.floor(size.width - 50)
      this.graphHeight = Math.floor(size.height * 0.9)
      this.setupGraph()
    },
    onUpdateSpan (span) {
      this.$store.set('timeseries.span', span)
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
    updateProbedLocationName () {
      this.probedLocationName = ''
      if (!this.probedLocation) return
      let name = _.get(this.probedLocation, 'properties.name') || _.get(this.probedLocation, 'properties.NAME')
      if (!name && _.has(this.probedLocation, 'geometry.coordinates')) {
        const longitude = _.get(this.probedLocation, 'geometry.coordinates[0]')
        const latitude = _.get(this.probedLocation, 'geometry.coordinates[1]')
        name = this.$t('mixins.timeseries.PROBE') + ` (${longitude.toFixed(2)}°, ${latitude.toFixed(2)}°)`
      }
      
      if (name) this.probedLocationName = name
    },
    async refresh () {
      this.kActivity.addSelectionHighlight('time-series')
      this.kActivity.centerOnSelection()
      // Update timeseries data if required
      const { start, end } = this.kActivity.getProbeTimeRange()
      // No feature clicked => dynamic weacast probe at position
      if (!this.feature) {
        this.probedLocation = await this.kActivity.getForecastForLocation(this.location.lng, this.location.lat, start, end)
      } else if (this.layer.probe) { // Static weacast probe
        const probe = await this.kActivity.getForecastProbe(this.layer.probe)
        if (probe) {
          this.probedLocation = await this.kActivity.getForecastForFeature(_.get(this.feature, probe.featureId), start, end)
        }
      } else if (this.layer.variables && this.layer.service) { // Static measure probe
        this.probedLocation = await this.kActivity.getMeasureForFeature(this.layer, this.feature, start, end)
      } else { // dynamic weacast probe at feature position
        const position = this.feature.geometry.coordinates
        this.probedLocation = await this.kActivity.getForecastForLocation(position[0], position[1], start, end)
      }
      this.updateProbedLocationName()
      this.setupGraph()
      this.updateProbedLocationHighlight()
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-tool-bar'] = this.$load('layout/KToolBar')
    this.$options.components['k-label'] = this.$load('frame/KLabel')
    // Registers the actions
    this.actions = [
      { name: 'centerOn', icon: 'las la-eye', label: this.$t('KTimeSeries.CENTER_ON'), handler: this.onCenterOn }
    ]
    // Refresh the component
    this.refresh()
  },
  mounted () {
    this.kActivity.$on('current-time-changed', this.refresh)
    this.$events.$on('time-format-changed', this.refresh)
    this.$events.$on('timeseries-span-changed', this.refresh)
    this.kActivity.$on('forecast-model-changed', this.refresh)
    this.kActivity.$on('forecast-level-changed', this.refresh)
  },
  beforeDestroy () {
    this.kActivity.$off('current-time-changed', this.refresh)
    this.$events.$off('time-format-changed', this.refresh)
    this.$events.$off('timeseries-span-changed', this.refresh)
    this.kActivity.$off('forecast-model-changed', this.refresh)
    this.kActivity.$off('forecast-level-changed', this.refresh)
    this.kActivity.removeSelectionHighlight('time-series')
  }
}
</script>

<style>
.vertical-text {
    writing-mode: vertical-rl;
    transform: rotate(-120deg);
    transform-origin: 150% 110%;
}
</style>
