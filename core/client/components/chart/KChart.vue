<template>
  <div class="fit">
    <canvas ref="chart"></canvas>
    <k-stamp
      v-show="!hasData" class="absolute-center"
      icon="las la-exclamation-circle"
      icon-size="3rem"
      :text="$t('KChart.NO_DATA_AVAILABLE')"
      text-size="1rem" />
  </div>
</template>

<script>
import _ from 'lodash'
import chroma from 'chroma-js'
import { Chart, registerables } from 'chart.js'
import ChartDataLabelsPlugin from 'chartjs-plugin-datalabels'
import ChartAnnotationPlugin from 'chartjs-plugin-annotation'
import ChartZoomPlugin from 'chartjs-plugin-zoom'

Chart.register(...registerables, ChartDataLabelsPlugin, ChartAnnotationPlugin, ChartZoomPlugin)

export default {
  name: 'k-chart',
  data () {
    return {
      hasData: false
    }
  },
  methods: {
    update (config) {
      this.hasData = !_.isEmpty(_.get(config, 'data.datasets'))
      if (this.hasData) {
        this.customize(config)
        if (!this.chart) {
          this.chart = new Chart(this.$refs.chart.getContext('2d'), config)
        } else {
          if (this.chart.type !== config.type) {
            this.chart.destroy()
            this.chart = new Chart(this.$refs.chart.getContext('2d'), config)
          } else {
            // Update the existing chart
            this.chart.data.labels = config.labels
            this.chart.data.datasets = config.datasets
            this.chart.options = config.options
            this.chart.update()
          }
        }
        // Store whether the chart has a legend
        this.hasLegend = _.get(this.chart.options, 'plugins.legend.display')
        // Forece the chart to be reiszed
        this.chart.resize()
      } else {
        // clear the chart if needed
        if (this.chart) {
          this.chart.destroy()
          this.chart = null
        }
      }
    },
    customize (config) {
      const datasets = _.get(config, 'data.datasets')
      _.forEach(datasets, dataset => {
        if (!dataset.backgroundColor) {
          const colorScale = _.get(dataset, 'colorScale', 'Dark2')
          dataset.backgroundColor = chroma.scale(colorScale).colors(config.type !== 'radar' ? dataset.data.length : 1)
          if (!dataset.borderColor) dataset.borderColor = dataset.backgroundColor
        }
      })
      _.merge(config.options, {
        responsive: true,
        onResize: this.onResized,
        plugins: {
          legend: {
            labels: {
              boxWidth: 20
            }
          }
        }
      })
    },
    onResized (chart) {
      if (this.$q.screen.lt.sm) {
        // Hide the legend if exists
        if (this.hasLegend && this.chart) this.chart.options.plugins.legend.display = false
      } else {
        // Restore the legend if exists
        if (this.hasLegend && this.chart) this.chart.options.plugins.legend.display = true
      }
    }
  },
  beforeCreate () {
    // Load the required components
    this.$options.components['k-stamp'] = this.$load('frame/KStamp')
  },
  beforeDestroy () {
    // Clear the chart if any
    if (this.chart) this.chart.destroy()
  }
}
</script>
