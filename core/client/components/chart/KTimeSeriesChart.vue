<template>
  <div class="fit">
    <canvas :ref="onCanvasRef" />
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

let canvas = null
let chart = null
const unit2axis = new Map()

const emit = defineEmits(['zoom-start', 'zoom-end', 'legend-click'])
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

defineExpose({
  update,
  exportSeries
})

// data
const startTime = ref(props.startTime ? moment.utc(props.startTime) : null)
const endTime = ref(props.endTime ? moment.utc(props.endTime) : null)

// watch
watch(() => props.timeSeries, update)
watch(() => props.xAxisKey, update)
watch(() => props.yAxisKey, update)
watch(() => props.startTime, update)
watch(() => props.endTime, update)
watch(() => props.zoomable, update)
watch(() => props.logarithmic, update)
watch(() => props.currentTime, update)
watch(() => props.options, update)

// function
async function onCanvasRef (ref) {
  if (ref) {
    if (!chart) {
      const config = await makeChartConfig()
      chart = new Chart(ref.getContext('2d'), config)
    }
  } else {
    if (chart) {
      chart.destroy()
      chart = null
    }
  }
  canvas = ref
}

function getUnits (timeSerie) {
  // Falback to base unit
  const baseUnit = _.get(timeSerie, 'variable.units[0]')
  // Get default unit for this quantity instead if available
  const defaultUnit = Units.getDefaultUnit(baseUnit)
  const unit = (timeSerie.variable.units.includes(defaultUnit) ? defaultUnit : baseUnit)
  return { unit, baseUnit }
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

async function makeChartConfig () {
  // Order matters as we compute internals like data time range
  const datasets = await makeDatasets()
  const scales = makeScales()
  const annotation = makeAnnotation()
  return {
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
              const { baseUnit, unit, label } = context.dataset
              const y = _.get(context, 'parsed.y')
              return label + ': ' + Units.format(y, baseUnit, unit)
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
                onZoomStart: onZoomStart,
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
}

function makeScales () {
  const scales = {
    x: {
      type: 'time',
      time: { unit: 'hour' },
      min: startTime.value.valueOf(),
      max: endTime.value.valueOf(),
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
  }

  // Build a scale per unit
  unit2axis.clear()
  let axisId = 0
  for (const timeSerie of props.timeSeries) {
    const { unit, baseUnit } = getUnits(timeSerie)
    if (!unit2axis.has(unit)) {
      const axis = `y${axisId}`
      unit2axis.set(unit, axis)
      scales[axis] = _.merge({
        baseUnit,
        unit,
        type: props.logarithmic ? 'logarithmic' : 'linear',
        position: (axisId + 1) % 2 ? 'left' : 'right',
        title: {
          display: true,
          text: unit
        },
        ticks: {
          callback: function (value, index, values) {
            if (values[index] !== undefined) {
              return Units.format(values[index].value, baseUnit, unit, { symbol: false })
            }
          }
        }
      }, _.get(timeSerie.variable.chartjs, 'yAxis', {}))
      ++axisId
    }
  }
  return scales
}

async function makeDatasets () {
  const datasets = []
  for (const timeSerie of props.timeSeries) {
    const label = _.get(timeSerie, 'variable.label')
    const { unit, baseUnit } = getUnits(timeSerie)
    const data = await timeSerie.data
    // Update time range
    data.forEach(item => {
      const time = moment.utc(_.get(item, props.xAxisKey))
      if (!props.startTime) {
        if (!startTime.value || time.isBefore(startTime.value)) startTime.value = time
      }
      if (!props.endTime) {
        if (!endTime.value || time.isAfter(endTime.value)) endTime.value = time
      }
    })
    const dataset = Object.assign({
      label,
      data,
      baseUnit,
      unit,
      yAxisID: unit2axis.get(unit)
    }, _.omit(_.get(timeSerie, 'variable.chartjs', {}), 'yAxis'))
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
    for (let j = 0; j < timeSerie.series.length; j++) {
      const serie = timeSerie.series[j]
      const data = await serie.data
      times = times.concat(_.map(data, props.xAxisKey))
    }
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
      for (let j = 0; j < timeSerie.series.length; j++) {
        const visible = _.get(chart, `data.datasets[${j}]`)
        // Skip invisible variables in export
        if (options.visibleOnly && !visible) return
        const serie = timeSerie.series[j]
        const data = await serie.data
        const value = _.find(data, item => moment.utc(_.get(item, props.xAxisKey)).valueOf() === time.valueOf())
        const name = _.get(serie, 'variable.name')
        const label = _.get(serie, 'variable.label')
        row[options.labelAsHeader ? `${label}` : `${name}`] = value ? _.get(value, props.yAxisKey) : null
      }
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
  // Reset time range
  startTime.value = (props.startTime ? moment.utc(props.startTime) : null)
  endTime.value = (props.endTime ? moment.utc(props.endTime) : null)

  const config = await makeChartConfig()
  if (!chart) {
    chart = new Chart(canvas.getContext('2d'), config)
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
</script>
