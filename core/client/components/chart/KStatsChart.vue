<template>
  <k-chart ref="chart" />
</template>

<script>
import _ from 'lodash'
import KChart from './KChart.vue'

export default {
  name: 'k-stats-chart',
  components: {
    KChart
  },
  methods: {
    customizeDatasets (type, datasets) {
      _.forEach(datasets, dataset => {
        if (!dataset.min) dataset.min = _.min(dataset.data)
        if (!dataset.max) dataset.max = _.max(dataset.data)
        if (!dataset.sum) dataset.sum = _.sum(dataset.data)
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
            /*formatter: function (value, context) {
              return value + '/' + Math.round(100 * value / context.dataset.sum) + '%'
            },*/
            padding: 6
          }
        }
      }
      _.merge(options, defaultOptions)
    },
    async update (config) {
      this.customizeDatasets(config.type, config.data.datasets)
      this.customizeOptions(config.type, config.options)
      // Update the chart
      if (this.$refs.chart) this.$refs.chart.update(config)
    }
  }
}
</script>
