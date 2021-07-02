<template>
  <div id="chart-container" class="row">
    <q-resize-observer @resize="onResized" />
    <canvas class="col-12" ref="chart"></canvas>
  </div>
</template>

<script>
import _ from 'lodash'
import chroma from 'chroma-js'
import { Chart } from 'chart.js'

export default {
  name: 'k-chart',
  props: {
    config: {
      type: Object,
      required: true,
      validator: (value) => {
        return _.has(value, 'type') && _.has(value, 'data') && _.has(value, 'options')
      }
    }
  },
  watch: {
    config: {
      async handler () {
        if (this.chart.config.type !== this.config.type) {
          // Create a new chart
          this.chart.destroy()
          const config = _.cloneDeep(this.config)
          this.colorize(config.data.datasets)
          this.chart = new Chart(this.$refs.chart.getContext('2d'), config)
        } else {
          // Update the existing chart
          this.chart.data.labels = _.cloneDeep(this.config.data.labels)
          this.chart.data.datasets = _.cloneDeep(this.config.data.datasets)
          this.colorize(this.chart.data.datasets)
          this.chart.options = _.cloneDeep(this.config.options)
          this.chart.update()
        }
      }
    }
  },
  methods: {
    colorize (datasets) {
      _.forEach(datasets, dataset => {
        if (!dataset.backgroundColor && dataset.colorScale) {
          dataset.backgroundColor = chroma.scale(dataset.colorScale).colors(dataset.data.length)
        }
      })
    },
    onResized (size) {
      if (!this.chart) this.chart = new Chart(this.$refs.chart.getContext('2d'), this.config)
    }
  },
  beforeDestroy () {
    if (this.chart) this.chart.destroy()
  }
}
</script>

