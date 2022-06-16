<template>
  <KChart :ref="onChartCreated" />
</template>

<script>
import _ from 'lodash'
import KChart from './KChart.vue'

function labelValueFormatter (value, context) {
  return value
}

function labelPercentFormatter (value, context) {
  const sum = context.chart.getDatasetMeta(context.datasetIndex).total
  if (sum === 0) return 0
  return (value * 100 / sum).toFixed(2) + '%'
}

export default {
  components: {
    KChart
  },
  props: {
    format: {
      type: String,
      default: 'value'
    }
  },
  methods: {
    onChartCreated (ref) {
      if (ref) this.chart = ref
    },
    customizeDatasets (type, datasets) {
      _.forEach(datasets, dataset => {
        // Clear the colors
        dataset.backgroundColor = undefined
        dataset.borderColor = undefined
      })
    },
    customizeOptions (type, options) {
      const defaultOptions = {
        maintainAspectRatio: true,
        layout: {
          padding: {
            left: 32,
            right: 32,
            top: 32,
            bottom: 32
          }
        },
        plugins: {
          title: {
            display: !!this.title,
            text: this.title
          },
          legend: {
            display: !['radar', 'bar'].includes(type),
            position: 'top'
          },
          datalabels: {
            backgroundColor: function (context) {
              return context.dataset.backgroundColor
            },
            display: 'auto',
            borderColor: 'white',
            borderRadius: 3,
            borderWidth: 1,
            anchor: 'end',
            align: 'center',
            color: 'white',
            font: {
              weight: 'bold'
            },
            formatter: this.format === 'value' ? labelValueFormatter : labelPercentFormatter,
            padding: 6
          }
        }
      }
      _.defaultsDeep(options, defaultOptions)
    },
    update (config) {
      this.customizeDatasets(config.type, config.data.datasets)
      this.customizeOptions(config.type, config.options)
      // Update the chart
      if (this.chart) this.chart.update(config)
    }
  }
}
</script>
