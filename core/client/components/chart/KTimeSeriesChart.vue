<template>
  <div class="fit">
    <canvas :ref="onCanvasRef" />
    <KStamp v-if="!hasData" icon="las la-exclamation-circle" icon-size="3rem"
        :text="$t('KTimeSeriesChart.NO_DATA_AVAILABLE')" text-size="1rem"/>
  </div>
</template>

<script setup>
import _ from 'lodash'
import moment from 'moment'
import Papa from 'papaparse'
import { Chart } from 'chart.js'
import 'chartjs-adapter-moment'
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { getCssVar } from 'quasar'
import { Events } from '../../events'
import { downloadAsBlob } from '../../utils'
import { Units } from '../../units'
import { Time } from '../../time'
import { i18n } from '../../i18n'

// const timeserie = {
//   variable: { } variable definition
//   data:
//   label:
//   color:
//   unit:
// }

// Props
const props = defineProps({
  timeSeries: { type: Array, default: () => [] },
  xAxisKey: { type: String, default: 'x' },
  yAxisKey: { type: String, default: 'y' },
  startTime: { type: Object, default: () => null },
  endTime: { type: Object, default: () => null },
  logarithmic: { type: Boolean, default: false },
  zoomable: { type: Boolean, default: true },
  panable: { type: Boolean, default: false },
  currentTime: { type: Boolean, default: true },
  options: { type: Object, default: () => ({}) }
})

// Emits
const emit = defineEmits(['zoom-start', 'zoom-end', 'legend-click'])

// Data
let canvas = null
let chart = null
const unit2axis = new Map()
const hasData = ref(false)
// Min/Max time (ie for x axis)
const startTime = ref(props.startTime ? moment.utc(props.startTime) : null)
const endTime = ref(props.endTime ? moment.utc(props.endTime) : null)
// Min/max value by unit (ie for y axes)
let min = {}
let max = {}

// Watch
// We use debounce here to avoid pultiple refresh when initializing props
const requestUpdate = _.debounce(() => update(), 500)
watch(() => props.timeSeries, requestUpdate)
watch(() => props.xAxisKey, requestUpdate)
watch(() => props.yAxisKey, requestUpdate)
watch(() => props.startTime, requestUpdate)
watch(() => props.endTime, requestUpdate)
watch(() => props.zoomable, requestUpdate)
watch(() => props.logarithmic, requestUpdate)
watch(() => props.currentTime, requestUpdate)
watch(() => props.options, requestUpdate)

// Functions
async function onCanvasRef (ref) {
  canvas = ref
  update()
}
function getUnit (timeSerie) {
  return _.get(timeSerie, 'variable.unit')
}
function getTargetUnit (timeSerie) {
  return _.get(timeSerie, 'variable.targetUnit')
}
function setUnit (timeserie, targetUnit) {
  _.set(timeserie, 'variable.unit', targetUnit)
}
function getZoom () {
  const start = moment.utc(_.get(chart, 'scales.x.min'))
  const end = moment.utc(_.get(chart, 'scales.x.max'))
  return { start, end }
}
function onZoomStart () {
  const start = moment.utc(_.get(chart, 'scales.x.min'))
  const end = moment.utc(_.get(chart, 'scales.x.max'))
  emit('zoom-start', { chart, start, end })
}
function onZoomEnd () {
  const start = moment.utc(_.get(chart, 'scales.x.min'))
  const end = moment.utc(_.get(chart, 'scales.x.max'))
  emit('zoom-end', { chart, start, end })
}
// We allow min/max options to be computed from data min/max using a function
function computeScaleBound (scale, property, min, max) {
  const scaleBound = _.get(scale, property)
  if (typeof scaleBound === 'function') {
    _.set(scale, property, scaleBound(min, max))
  }
}
async function makeChartConfig () {
  // Order matters as we compute internals like data time range
  const datasets = await makeDatasets()
  // No data ?
  if (_.isEmpty(datasets)) return null
  const scales = makeScales(datasets)
  const annotation = makeAnnotation()
  const config = {
    type: 'line',
    data: { datasets },
    plugins: [],
    options: _.merge({
      // responsive: true,
      animation: false,
      maintainAspectRatio: false,
      // resizeDelay: 100,
      parsing: {
        xAxisKey: props.xAxisKey,
        yAxisKey: props.yAxisKey
      },
      scales,
      plugins: {
        datalabels: { display: false },
        tooltip: {
          mode: 'x',
          callbacks: {
            title: (context) => {
              // As we are selecting tooltip items based on x coordinate all should have the same one, which is actually the time
              const x = _.get(context, '[0].parsed.x')
              return (x ? `${Time.format(x, 'date.short')} - ${Time.format(x, 'time.long')}` : '')
            },
            label: (context) => {
              const { unit, targetUnit, label } = context.dataset
              const y = _.get(context, 'parsed.y')
              return label + ': ' + Units.format(y, targetUnit?.name || unit.name, targetUnit?.name || unit.name)
            }
          }
        },
        annotation,
        zoom: (props.zoomable || props.panable
          ? {
              pan: {
                enabled: props.panable,
                mode: 'x',
                scaleMode: 'x',
                modifierKey: 'ctrl',
                onPanStart: onZoomStart,
                onPanComplete: onZoomEnd
              },
              zoom: {
                drag: {
                  enabled: props.zoomable,
                  backgroundColor: getCssVar('secondary') + '88'
                },
                mode: 'x',
                onZoomStart,
                onZoom: onZoomEnd
              }
            }
          : undefined),
        decimation: {
          enabled: true,
          algorithm: 'lttb'
        },
        legend: {
          onClick: (event, legendItem, legend) => {
            const index = legendItem.datasetIndex
            const chart = legend.chart
            if (chart.isDatasetVisible(index)) {
              chart.hide(index)
              legendItem.hidden = true
            } else {
              chart.show(index)
              legendItem.hidden = false
            }
            emit('legend-click', { legendItem, legend })
          }
        }
      }
    }, props.options)
  }
  computeScaleBound(scales.x, 'min', startTime.value, endTime.value)
  computeScaleBound(scales.x, 'max', startTime.value, endTime.value)
  computeScaleBound(scales.x, 'suggestedMin', startTime.value, endTime.value)
  computeScaleBound(scales.x, 'suggestedMax', startTime.value, endTime.value)
  return config
}
function makeScales (datasets) {
  // Setup time ticks unit
  const hours = endTime.value.diff(startTime.value, 'hours')
  const days = endTime.value.diff(startTime.value, 'days')
  const months = endTime.value.diff(startTime.value, 'months')
  const timeUnit = (months > 12 ? 'month' : (days > 7 ? 'day' : (hours > 2 ? 'hour' : 'minute')))
  const x = {
    type: 'time',
    time: { unit: timeUnit },
    min: startTime.value.valueOf(),
    max: endTime.value.valueOf(),
    ticks: {
      autoskip: true,
      minRotation: 10,
      maxRotation: 45,
      major: {
        enabled: true
      },
      callback: function (value, index, values) {
        const time = moment(values[index].value)
        if (!_.isNil(values[index])) {
          const isMajor = values[index].major
          const year = Time.format(time, 'year.short')
          const date = Time.format(time, 'date.short')
          const shortTime = Time.format(time, 'time.short')
          const longTime = Time.format(time, 'time.long')
          // Check for tick granularity
          if (timeUnit === 'minute') {
            return (isMajor ? `${date} ${shortTime}` : `${date} ${longTime}`)
          } else if (timeUnit === 'hour') {
            return (isMajor ? `${date} ${shortTime}` : `${date} ${shortTime}`)
          } else if (timeUnit === 'day') {
            return (isMajor ? `${date} ${year}` : `${date}`)
          } else { // month
            return (isMajor ? `${year}` : `${date}`)
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
  const scales = { x }
  // Build a scale per unit
  unit2axis.clear()
  let axisId = 0
  for (const timeSerie of props.timeSeries) {
    const unit = getUnit(timeSerie)
    const targetUnit = getTargetUnit(timeSerie) || unit
    const unitName = targetUnit.name
    if (!unit2axis.has(unitName)) {
      // Ensure a related dataset does exist
      const axisDatasets = _.filter(datasets, dataset => (_.get(dataset, 'targetUnit.name', _.get(dataset, 'unit.name')) === unitName))
      if (axisDatasets.length === 0) continue
      const axis = `y${axisId}`
      // Set axis to related datasets
      axisDatasets.forEach(dataset => Object.assign(dataset, { yAxisID: axis }))
      unit2axis.set(unitName, axis)
      scales[axis] = _.merge({
        targetUnit: unitName,
        type: props.logarithmic ? 'logarithmic' : 'linear',
        position: (axisId + 1) % 2 ? 'left' : 'right',
        title: {
          display: true,
          text: i18n.tie(targetUnit.symbol)
        },
        ticks: {
          callback: function (value, index, values) {
            if (values[index] !== undefined) {
              // We do not convert using units here as data should have already be converted
              return Units.format(values[index].value, null, null, { symbol: false })
            }
          }
        }
      }, _.get(timeSerie.variable.chartjs, 'yAxis', {}))
      computeScaleBound(scales[axis], 'min', min[unitName], max[unitName])
      computeScaleBound(scales[axis], 'max', min[unitName], max[unitName])
      computeScaleBound(scales[axis], 'suggestedMin', min[unitName], max[unitName])
      computeScaleBound(scales[axis], 'suggestedMax', min[unitName], max[unitName])
      ++axisId
    }
  }
  return scales
}
async function makeDatasets () {
  const datasets = []
  for (const timeSerie of props.timeSeries) {
    const label = _.get(timeSerie, 'variable.label')
    const unit = getUnit(timeSerie)
    const targetUnit = getTargetUnit(timeSerie)
    if (targetUnit) setUnit(timeSerie, targetUnit)
    const data = await timeSerie.data
    // No data ?
    if (_.isEmpty(data)) continue
    const unitName = (targetUnit ? targetUnit.name : unit.name)
    const dataset = Object.assign({
      label,
      data,
      unit,
      targetUnit
    }, _.omit(_.get(timeSerie, 'variable.chartjs', {}), 'yAxis'))
    const xAxisKey = _.get(dataset, 'parsing.xAxisKey', props.xAxisKey)
    const yAxisKey = _.get(dataset, 'parsing.yAxisKey', props.yAxisKey)
    // Update time/value range
    data.forEach(item => {
      const time = moment.utc(_.get(item, xAxisKey))
      // Take zero into account
      if (_.has(item, yAxisKey)) {
        let value = _.get(item, yAxisKey)
        if (_.isFinite(value)) {
          if (targetUnit) {
            value = Units.convert(value, unit.name, targetUnit.name)
            _.set(item, yAxisKey, value)
          }
          if (_.isNil(min[unitName]) || (value < min[unitName])) min[unitName] = value
          if (_.isNil(max[unitName]) || (value > max[unitName])) max[unitName] = value
        }
        if (!props.startTime) {
          if (!startTime.value || time.isBefore(startTime.value)) startTime.value = time
        }
        if (!props.endTime) {
          if (!endTime.value || time.isAfter(endTime.value)) endTime.value = time
        }
      }
    })
    // Check for individual chartjs properties if any
    if (!_.isEmpty(dataset.perItemProperties)) {
      // In that case dataset requires an array of values, one for each data point
      dataset.perItemProperties.forEach(property => {
        const values = []
        data.forEach(item => {
          // Get property value for item and fallback to default value in dataset
          values.push(_.get(item, property, _.get(dataset, property)))
        })
        Object.assign(dataset, { [property]: values })
      })
    }
    datasets.push(dataset)
  }

  return datasets
}
function makeAnnotation () {
  let annotation = {}
  // Is current time visible in chart ?
  if (props.currentTime) {
    const currentTime = Time.getCurrentTime()
    if (currentTime.isBetween(startTime.value, endTime.value)) {
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
        }],
        clip: false
      }
    }
  }
  return annotation
}
async function exportSeries (options = {}) {
  let times = []
  for (let i = 0; i < props.timeSeries.length; i++) {
    const timeSerie = props.timeSeries[i]
    const xAxisKey = _.get(timeSerie, 'variable.chartjs.parsing.xAxisKey', props.xAxisKey)
    const data = await timeSerie.data
    times = times.concat(_.map(data, xAxisKey))
  }
  // Make union of all available times for x-axis
  times = _.uniq(times).map(time => moment.utc(time)).sort((a, b) => a - b)
  // Convert to json
  const json = []
  for (let t = 0; t < times.length; t++) {
    const time = times[t]
    const row = {
      [i18n.t('KTimeSeriesChart.TIME_LABEL')]: time.toISOString()
    }
    for (let i = 0; i < props.timeSeries.length; i++) {
      const timeSerie = props.timeSeries[i]
      const visible = chart.isDatasetVisible(i)
      // Skip invisible variables in export
      if (options.visibleOnly && !visible) return
      const xAxisKey = _.get(timeSerie, 'variable.chartjs.parsing.xAxisKey', props.xAxisKey)
      const yAxisKey = _.get(timeSerie, 'variable.chartjs.parsing.yAxisKey', props.yAxisKey)
      const data = await timeSerie.data
      const value = _.find(data, item => moment.utc(_.get(item, xAxisKey)).valueOf() === time.valueOf())
      const name = _.get(timeSerie, 'variable.name')
      const label = _.get(timeSerie, 'variable.label')
      row[options.labelAsHeader ? `${label}` : `${name}`] = value ? _.get(value, yAxisKey) : null
    }
    json.push(row)
  }
  // Convert to csv
  const csv = Papa.unparse(json)
  downloadAsBlob(csv, _.template(options.filename || i18n.t('KTimeSeriesChart.SERIES_EXPORT_FILE'))(),
    'text/csv;charset=utf-8;')
}
async function update () {
  if (!canvas) return
  // Reset time/value range
  startTime.value = (props.startTime ? moment.utc(props.startTime) : null)
  endTime.value = (props.endTime ? moment.utc(props.endTime) : null)
  min = {}
  max = {}

  const config = await makeChartConfig()
  if (!config) {
    if (chart) {
      chart.clear()
      chart.destroy()
    }
    chart = null
    hasData.value = false
    return
  }
  if (!chart) {
    chart = new Chart(canvas.getContext('2d'), config)
    hasData.value = true
  } else {
    Object.assign(chart, config)
    chart.update()
  }
}
async function updateCurrentTime () {
  if (!props.currentTime) return
  update()
}

// Hooks
onMounted(() => {
  Events.on('time-current-time-changed', updateCurrentTime)
})
onBeforeUnmount(() => {
  Events.off('time-current-time-changed', updateCurrentTime)
})

// Expose
defineExpose({
  update,
  getZoom,
  exportSeries
})
</script>
