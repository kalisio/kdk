<template>
  <div class="fit">
    <canvas :ref="onCanvasRef" />
  </div>
</template>

<script setup>
// import moment from 'moment'
// import chroma from 'chroma-js'
import { Chart /*, registerables, Interaction, Tooltip */ } from 'chart.js'
import 'chartjs-adapter-moment'
// import { MatrixController, MatrixElement } from 'chartjs-chart-matrix'
// import ChartDataLabelsPlugin from 'chartjs-plugin-datalabels'
// import ChartAnnotationPlugin from 'chartjs-plugin-annotation'
// import ChartZoomPlugin from 'chartjs-plugin-zoom'
// import KStamp from '../frame/KStamp.vue'

// const timeserie = {
//   variable: { } variable definition
//   fetch: fn to fetch data
//   label:
//   color:
//   unit:
// }

let canvas = null
let chart = null
const unit2axis = new Map()

const emit = defineEmits(['legend-click'])
const props = defineProps({
  timeSeries: { type: Array, default: (raw) => { return [] } },
  groupAxisByUnit: { type: Boolean, default: true },
  emitLegendClick: { type: Boolean, default: false }
})

defineExpose({ update })

// data

// function
async function onCanvasRef (ref) {
  if (ref) {
    if (!chart) { chart = await buildChart(ref.getContext('2d')) }
  } else {
    if (chart) {
      chart.destroy()
      chart = null
    }
  }
  canvas = ref
}

function makeChartConfig () {
  const chartConfig = {
    type: 'line',
    data: { datasets: [] },
    plugins: [],
    options: {
      responsive: true,
      maintainAspectRatio: false,
      // resizeDelay: 100,
      parsing: false, // we'll provide data in native format
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'hour'
          }
        }
      },
      plugins: {
        // we disable all plugins that were registered by the KChart
        datalabels: { display: false },
        annotation: {
          annotations: {},
          clip: false
        }
      }
    }
  }
  if (props.emitLegendClick) {
    chartConfig.options.plugins.legend = {
      onClick: (event, legendItem, legend) => {
        // const dataset = legendItem.datasetIndex
        // const config = legend.chart.config
        // const timeSerieIndex = config.data.datasets[dataset]._index
        // emit('legend-click', { event, legendItem, legend, timeSerieIndex })
        const timeSerieIndex = legendItem.datasetIndex
        emit('legend-click', timeSerieIndex)
      }
    }
  }

  return chartConfig
}

function makeScales () {
  const scales = {
    x: {
      type: 'time',
      time: { unit: 'hour' }
    }
  }

  // Build a scale per unit
  unit2axis.clear()
  let axisId = 0
  for (const timeSerie of props.timeSeries) {
    const unit = timeSerie.variable.units[0]
    if (!unit2axis.has(unit)) {
      const axis = `y${axisId}`
      unit2axis.set(unit, axis)
      scales[axis] = {
        type: 'linear',
        position: (axisId + 1) % 2 ? 'left' : 'right',
        title: {
          display: true,
          text: unit
        }
      }
      ++axisId
    }
  }
  return scales
}

async function makeDatasets () {
  const datasets = []
  for (const timeSerie of props.timeSeries) {
    const unit = timeSerie.variable.units[0]
    // const label = $t(timeSerie.variable.label) + `(${unit})`
    const label = timeSerie.variable.label + ` (${unit})`
    const dataset = Object.assign({
      label,
      data: await timeSerie.fetch(),
      yAxisID: unit2axis.get(unit),
      cubicInterpolationMode: 'monotone',
      tension: 0.4
    }, timeSerie.variable.chartjs)
    datasets.push(dataset)
  }

  return datasets
}

async function buildChart (context) {
  const chartConfig = makeChartConfig()
  chartConfig.options.scales = makeScales()
  chartConfig.data.datasets = await makeDatasets()
  return new Chart(context, chartConfig)
}

async function update () {
  if (!canvas) return

  if (!chart) {
    chart = await buildChart(canvas.getContext('2d'))
  } else {
    chart.options.scales = makeScales()
    chart.data.datasets = await makeDatasets()
    chart.update()
  }
}
</script>
