<template>
  <KChart ref="onChartCreated" />
</template>

<script>
import _ from 'lodash'
import KChart from './KChart.vue'

export default {
  components: {
    KChart
  },
  methods: {
    onChartCreated (ref) {
      if (ref) this.chart = ref
    },
    customizeDatasets (type, datasets) {
      _.forEach(datasets, dataset => {
        // Compute the stats
        if (!dataset.min) dataset.min = _.min(dataset.data)
        if (!dataset.max) dataset.max = _.max(dataset.data)
        if (!dataset.sum) dataset.sum = _.sum(dataset.data)
        // Clear the colors
        dataset.backgroundColor = undefined
        dataset.borderColor = undefined
      })
      // return this.datasets
    },
    customizeOptions (type, options) {
      const defaultOptions = {
        maintainAspectRatio: true,
        layout: {
          padding: {
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
            position: this.$q.screen.lt.sm ? 'bottom' : 'left'
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
            align: 'end',
            color: 'white',
            font: {
              weight: 'bold'
            },
            /* formatter: function (value, context) {
              return value + '/' + Math.round(100 * value / context.dataset.sum) + '%'
            }, */
            padding: 6
          }
        }
      }
      _.merge(options, defaultOptions)
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
