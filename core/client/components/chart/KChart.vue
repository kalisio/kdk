<template>
  <div class="fit">
    <canvas :ref="onChartRefCreated" />
    <div v-show="!hasData" class="absolute-center">
      <slot name="empty-chart">
        <KStamp
          v-show="!hasData"
          class="absolute-center"
          icon="las la-exclamation-circle"
          icon-size="3rem"
          :text="$t('KChart.NO_DATA_AVAILABLE')"
          text-size="1rem"
        />
      </slot>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import chroma from 'chroma-js'
import { Chart, registerables, Interaction, Tooltip } from 'chart.js'
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix'
import ChartDataLabelsPlugin from 'chartjs-plugin-datalabels'
import ChartAnnotationPlugin from 'chartjs-plugin-annotation'
import ChartZoomPlugin from 'chartjs-plugin-zoom'
import KStamp from '../frame/KStamp.vue'

/*
 legendMarginPlugin
 https://www.youtube.com/watch?v=87rnMzENg3U&ab_channel=ChartJS
 This plugin works only if the legend is diplayed on top or left
*/
const legendMarginPlugin = {
  id: 'legendMargin',
  beforeInit (chart, args, options) {
    if (chart.legend) {
      const fitValue = chart.legend.fit
      chart.legend.fit = function fit () {
        fitValue.bind(chart.legend)()
        if (options.width) this.width += options.width
        if (options.height) this.height += options.height
      }
    }
  }
}

Chart.register(...registerables, MatrixController, MatrixElement, ChartDataLabelsPlugin, ChartAnnotationPlugin, ChartZoomPlugin, legendMarginPlugin)

// Additional interaction mode: xSingle, same as x but only returns a single value
Interaction.modes.xSingle = (chart, e, options, useFinalPosition) => {
  const items = Interaction.modes.x(chart, e, options, useFinalPosition)
  // only keep one item per dataset
  const mapping = {}
  items.forEach((item) => { if (!mapping[item.datasetIndex]) mapping[item.datasetIndex] = item })
  return _.values(mapping)
}

// Additional tootltip positioner: at cursor position
Tooltip.positioners.cursorPosition = (elements, eventPosition) => {
  return eventPosition
}

export default {
  components: {
    KStamp
  },
  props: {
    maxLabelLength: {
      type: Number,
      default: 50
    }
  },
  data () {
    return {
      hasData: false
    }
  },
  methods: {
    onChartRefCreated (reference) {
      if (reference) {
        this.chartRef = reference
      }
    },
    getAspectRatio () {
      const marginCoeff = 1.15
      return this.$q.screen.height === 0 ? 1 : this.$q.screen.width * marginCoeff / this.$q.screen.height
    },
    isLegendDisplayed () {
      return !this.$q.screen.lt.sm
    },
    update (config) {
      if (!this.chartRef) throw new Error('Cannot update the chart while not created')
      this.hasData = !_.isEmpty(_.get(config, 'data.datasets'))
      if (this.hasData) {
        // Store whether the chart has a legend
        this.hasLegend = _.get(config.options, 'plugins.legend.display')
        // Csutomize the chart
        this.customize(config)
        if (!this.chart) {
          this.chart = new Chart(this.chartRef.getContext('2d'), config)
        } else {
          if (this.chart.type !== config.type) {
            this.chart.destroy()
            this.chart = new Chart(this.chartRef.getContext('2d'), config)
          } else {
            // Update the existing chart
            this.chart.data.labels = config.data.labels
            this.chart.data.datasets = config.data.datasets
            this.chart.options = config.options
            this.chart.update()
          }
        }
        // Force the chart to be reiszed
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
      const data = config.data
      if (data) {
        // Colorize datasets
        _.forEach(data.datasets, dataset => {
          if (!dataset.backgroundColor) {
            const colorScale = _.get(dataset, 'colorScale', 'Dark2')
            dataset.backgroundColor = chroma.scale(colorScale).colors(config.type !== 'radar' ? dataset.data.length : 1)
            if (!dataset.borderColor) dataset.borderColor = 'white'
          }
        })
      }
      const defaultOptions = {
        responsive: true,
        aspectRatio: this.getAspectRatio(),
        onResize: this.onResized,
        plugins: {
          legend: {
            labels: {
              display: this.isLegendDisplayed(),
              boxWidth: 15,
              maxLength: this.maxLabelLength,
              generateLabels (chart) {
                // generate original labels according the type of the chart
                const type = chart.config.type
                let defaultGenerator = Chart.defaults.plugins.legend.labels.generateLabels
                if (type === 'pie') defaultGenerator = Chart.overrides.pie.plugins.legend.labels.generateLabels
                else if (type === 'doughnut') defaultGenerator = Chart.overrides.doughnut.plugins.legend.labels.generateLabels
                else if (type === 'polarArea') defaultGenerator = Chart.overrides.polarArea.plugins.legend.labels.generateLabels
                const labels = defaultGenerator.call(this, chart)
                // iterate through the labels and truncate the text
                _.forEach(labels, label => {
                  label.text = _.truncate(label.text, { length: chart.config.options.plugins.legend.labels.maxLength })
                })
                return labels
              }
            }
          },
          legendMargin: {
            height: 12
          }
        }
      }
      if (config.type === 'bar' || config.type === 'line') {
        defaultOptions.scales = {
          x: {
            ticks: {
              maxRotation: 90,
              callback: function (value, index, ticks) {
                // https://www.chartjs.org/docs/latest/axes/labelling.html#creating-custom-tick-formats
                return _.truncate(this.getLabelForValue(value), { length: this.maxLabelLength })
              }
            }
          }
        }
      }
      _.defaultsDeep(config.options, defaultOptions)
    },
    onResized (chart) {
      if (!this.chart) return
      this.chart.options.aspectRatio = this.getAspectRatio()
      if (this.hasLegend) this.chart.options.plugins.legend.display = this.isLegendDisplayed()
    }
  },
  beforeUnmount () {
    // Clear the chart if any
    if (this.chart) this.chart.destroy()
  }
}
</script>
