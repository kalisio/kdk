<template>
  <div class="fit">
    <canvas :ref="onCanvasRef" />
  </div>
</template>

<script setup>
import _ from 'lodash'
import moment from 'moment'
import { Chart } from 'chart.js'
import 'chartjs-adapter-moment'
import { watch } from 'vue'
import { Units } from '../../../../core/client/units'
import { Time } from '../../../../core/client/time'

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

const emit = defineEmits(['legend-click'])
const props = defineProps({
  timeSeries: { type: Array, default: () => [] },
  currentTime: { type: Boolean, default: true }
})

defineExpose({ update })

// data
let startTime, endTime

// watch
watch(() => props.timeSeries, update)

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

async function makeChartConfig () {
  // Order matters as we compute internals like data time range
  const scales = makeScales()
  const datasets = await makeDatasets()
  const annotation = makeAnnotation()
  return {
    type: 'line',
    data: { datasets },
    plugins: [],
    options: {
      // responsive: true,
      animation: false,
      maintainAspectRatio: false,
      // resizeDelay: 100,
      parsing: false, // we'll provide data in native format
      scales,
      plugins: {
        // we disable all plugins that were registered by the KChart
        datalabels: { display: false },
        tooltip: {
          mode: 'x',
          callbacks: {
            title: (context) => {
              // As we are selecting tooltip items based on x coordinate all should have the same one, which is actually the time
              const x = _.get(context, '[0].parsed.x')
              return (x ? `${Time.format(x, 'date.short')} - ${Time.format(x, 'time.short')}` : '')
            },
            label: (context) => {
              const { baseUnit, unit, label } = context.dataset
              const y = _.get(context, 'parsed.y')
              return label + ': ' + Units.format(y, baseUnit, unit)
            }
          }
        },
        annotation,
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
    }
  }
}

function makeScales () {
  const scales = {
    x: {
      type: 'time',
      time: { unit: 'hour' },
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
        type: 'linear',
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
    const dataset = Object.assign({
      label,
      data,
      baseUnit,
      unit,
      yAxisID: unit2axis.get(unit),
      cubicInterpolationMode: 'monotone',
      tension: 0.4
    }, _.omit(_.get(timeSerie, 'variable.chartjs', {}), 'yAxis'))
    datasets.push(dataset)
    // Update time range
    data.forEach(item => {
      const time = moment.utc(item.x)
      if (!startTime || time.isBefore(startTime)) startTime = time
      if (!endTime || time.isAfter(endTime)) endTime = time
    })
  }

  return datasets
}

function makeAnnotation () {
  let annotation = {}
  // Is current time visible in chart ?
  if (props.currentTime) {
    const currentTime = Time.getCurrentTime()
    if (currentTime.isBetween(startTime, endTime)) {
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

async function update () {
  if (!canvas) return
  // Reset time range
  startTime = null
  endTime = null

  const config = await makeChartConfig()
  if (!chart) {
    chart = new Chart(canvas.getContext('2d'), config)
  } else {
    Object.assign(chart, config)
    chart.update()
  }
}
</script>
