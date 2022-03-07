<template>
  <div id="chart-container">
    <canvas class="q-pa-xs col-12" ref="chart"></canvas>
  </div>
</template>

<script>
import _ from 'lodash'
import chroma from 'chroma-js'
import { Chart, registerables } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import Annotation from 'chartjs-plugin-annotation'

Chart.register(...registerables, ChartDataLabels, Annotation)

export default {
  name: 'k-chart',
  data () {
    return {
      hasData: false
    }
  },
  methods: {
    update (config) {
      const type = _.get(this.chart, 'type')
      config.options.onResize = this.onResized
      // Is the chart type different
      if (config.type !== type) {
        // Create a new chart
        if (this.chart) this.chart.destroy()
        if (!_.isEmpty(config.data.datasets)) {
          this.colorize(config.data.datasets)
          this.chart = new Chart(this.$refs.chart.getContext('2d'), config)
          this.hasDatas = true
        } else {
          this.chart = null
          this.hasData = false
        }
      } else {
        // Update the existing chart
        this.chart.data.labels = config.labels
        this.chart.data.datasets = config.datasets
        this.chart.options = config.options
        this.colorize(this.chart.data.datasets)
        this.chart.update()
      }
      // Store whether the chart has a legend
      this.hasLegend = _.get(this.chart.options, 'plugins.legend.display')
      // Forece the chart to be reiszed
      if (this.chart) this.chart.resize()
    },
    colorize (datasets) {
      _.forEach(datasets, dataset => {
        if (dataset.colorScale) {
          if (this.type !== 'radar') dataset.backgroundColor = chroma.scale(dataset.colorScale).colors(dataset.data.length)
          else dataset.backgroundColor = chroma.scale(dataset.colorScale).colors(1)
        }
      })
    },
    onResized (size) {
      if (this.$q.screen.lt.sm) {
        // Hide the legend if exists
        if (this.hasLegend) this.chart.options.plugins.legend.display = false
      } else {
        // Restore the legend if exists
        if (this.hasLegend) this.chart.options.plugins.legend.display = true
      }
    }
  },
  beforeDestroy () {
    if (this.chart) this.chart.destroy()
  }
}
</script>
