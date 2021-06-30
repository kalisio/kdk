<template>
  <div id="chart-container" class="row">
    <q-resize-observer @resize="onResized" />
    <canvas class="col-12" ref="chart"></canvas>
  </div>
</template>

<script>
import _ from 'lodash'
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
        this.chart.type = this.config.type
        this.chart.data.labels = this.config.data.labels
        this.chart.data.datasets = this.config.data.datasets
        this.chart.options = this.config.options
        this.chart.update()
      }
    }
  },
  methods: {
    onResized (size) {
      if (!this.chart) this.chart = new Chart(this.$refs.chart.getContext('2d'), this.config)
    }
  },
  beforeDestroy () {
    if (this.chart) this.chart.destroy()
  }
}
</script>

