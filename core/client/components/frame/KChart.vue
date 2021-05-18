<template>
  <div id="chart-container" class="row">
    <q-resize-observer @resize="onResized" />
    <canvas class="col-12" ref="chart"></canvas>
  </div>
</template>

<script>
import _ from 'lodash'
import Chart from 'chart.js'
import 'chartjs-plugin-annotation'

export default {
  name: 'k-chart',
  props: {
    type: {
      type: String,
      default: 'bar'
    },
    data: {
      type: Object,
      default: () => {}
    },
    options: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    refresh () {
      // Destroy previous chart
      if (this.chart) {
        this.chart.destroy()
        this.chart = null
      }
      // Create new chart
      if (!_.isEmpty(this.data)) {
        this.chart = new Chart(this.$refs.chart.getContext('2d'), {
          type: this.type,
          data: this.data,
          options: this.options          
        })
      }
    },
    onResized (size) {
      if (!this.chart) this.refresh()
    }
  }
}
</script>

