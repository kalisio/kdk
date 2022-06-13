<template>
  <div class="fit">
    <canvas ref="chart"></canvas>
    <KStamp
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
import KStamp from '../frame/KStamp.vue'

/*
 legendMarginPlugin
 https://www.youtube.com/watch?v=87rnMzENg3U&ab_channel=ChartJS
 This plugin works only if the legend is diplayed on top or left
*/
const legendMarginPlugin = {
  id: 'legendMargin',
  beforeInit (chart, args, options) {
    const fitValue = chart.legend.fit
    chart.legend.fit = function fit() {
      fitValue.bind(chart.legend)()
      if (options.width) this.width += options.width
      if (options.height) this.height += options.height
    }
  }
}

Chart.register(...registerables, ChartDataLabelsPlugin, ChartAnnotationPlugin, ChartZoomPlugin, legendMarginPlugin)

const maxLabelLength = 20

export default {
  components: {
    KStamp
  },
  data () {
    return {
      hasData: false
    }
  },
  methods: {
    getAspectRatio () {
      const marginCoeff = 1.15
      return this.$q.screen.height === 0 ? 1 : this.$q.screen.width * marginCoeff / this.$q.screen.height
    },
    isLegendDisplayed () {
      return this.$q.screen.lt.sm ? false : true
    },
    update (config) {
      this.hasData = !_.isEmpty(_.get(config, 'data.datasets'))
      if (this.hasData) {
        // Store whether the chart has a legend
        this.hasLegend = _.get(config.options, 'plugins.legend.display')
        // Csutomize the chart
        this.customize(config)
        if (!this.chart) {
          this.chart = new Chart(this.$refs.chart.getContext('2d'), config)
        } else {
          if (this.chart.type !== config.type) {
            this.chart.destroy()
            this.chart = new Chart(this.$refs.chart.getContext('2d'), config)
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
              generateLabels (chart) {
                const data = chart.data;
                if (data.labels.length && data.datasets.length) {
                  const {labels: {pointStyle}} = chart.legend.options
                  return data.labels.map((label, i) => {
                    const meta = chart.getDatasetMeta(0);
                    const style = meta.controller.getStyle(i);
                    return {
                      text: _.truncate(label, { length: maxLabelLength }),
                      fillStyle: style.backgroundColor,
                      strokeStyle: style.borderColor,
                      lineWidth: style.borderWidth,
                      pointStyle: pointStyle,
                      hidden: !chart.getDataVisibility(i),
                      // Extra data used for toggling the correct item
                      index: i
                    };
                  });
                }
                return [];
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
                return _.truncate(this.getLabelForValue(value), { length: maxLabelLength })
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
