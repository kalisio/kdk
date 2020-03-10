<template>
  <k-modal ref="modal" :title="title" :toolbar="toolbar" :buttons="[]" >
    <div slot="modal-content">
      <div class="row justify-center text-center">
        <q-select class="col-1" v-model="property" :label="$t('KFeaturesChart.PROPERTY_LABEL')" stack-label
          :options="properties" @input="refreshChart"/>
        <q-select class="col-1" v-model="chartType" :label="$t('KFeaturesChart.CHART_LABEL')" stack-label
          :options="chartOptions" @input="refreshChart"/>
        <q-select class="col-1" v-model="nbValuesPerChart" :label="$t('KFeaturesChart.PAGINATION_LABEL')" stack-label
          :options="paginationOptions" @input="refreshChartAndPagination"/>
        <q-select class="col-1" v-model="render" :label="$t('KFeaturesChart.RENDER_LABEL')" stack-label
          :options="renderOptions" @input="refreshChart"/>
        <q-pagination v-if="nbCharts > 1" v-model="currentChart" :max="nbCharts" @input="refreshChart" :input="true"/>
      </div>
      <div class="row justify-center text-center">
        <div v-show="chartData.length === 0" class="q-ma-xl">
          <q-icon size="3rem" name="insert_chart_outlined" />
          <span class="text-h5">{{$t('KFeaturesChart.SELECT_PROPERTY_LABEL')}}</span>
        </div>
        <canvas v-show="chartData.length > 0" class="chart q-ma-lg" ref="chart"></canvas>
      </div>
    </div>
  </k-modal>
</template>

<script>
import _ from 'lodash'
import chroma from 'chroma-js'
import Chart from 'chart.js'
import 'chartjs-plugin-labels'
import { mixins as kCoreMixins } from '../../../core/client'

export default {
  name: 'k-features-chart',
  components: {
  },
  mixins: [
    kCoreMixins.refsResolver(['modal'])
  ],
  props: {
    layer: {
      type: Object,
      required: true
    },
    contextId: {
      type: String,
      default: ''
    }
  },
  computed: {
    title () {
      return this.$t('KFeaturesChart.TITLE', { layer: this.layer.name })
    },
    properties () {
      let properties = []
      _.forOwn(_.get(this.layer, 'schema.content.properties'), (value, key) => {
        const label = _.get(value, 'field.label', _.get(value, 'field.helper', key))
        // Check if we have a translation key or directly the label content
        properties.push({ value: key, label: (this.$i18n.i18next.exists(label) ? this.$t(label) : label) })
      })
      //if (properties.length) this.property = properties[0]
      return properties
    },
    nbCharts () {
      if (!this.chartData.length || (this.nbValuesPerChart.value === 0)) return 1
      else return Math.ceil(this.chartData.length / this.nbValuesPerChart.value)
    }
  },
  data () {
    const chartTypes = ['pie', 'polarArea', 'radar', 'bar']
    const chartOptions = chartTypes.map(
        type => ({ value: type, label: this.$i18n.t(`KFeaturesChart.CHART_LABEL_${type.toUpperCase()}`) }))
    const paginationOptions = [{
      value: 0, label: this.$i18n.t('KFeaturesChart.ALL_VALUES')
    }, {
      value: 5, label: '5'
    }, {
      value: 10, label: '10'
    }, {
      value: 20, label: '20'
    }]
    const renderOptions = [{
      value: 'value', label: this.$i18n.t('KFeaturesChart.VALUE_LABEL')
    }, {
      value: 'percentage', label: this.$i18n.t('KFeaturesChart.PERCENTAGE_LABEL')
    }]

    return {
      toolbar: [{ name: 'close', icon: 'close', handler: () => this.close() }],
      property: {},
      chartType: _.find(chartOptions, { value: 'pie' }),
      chartOptions,
      currentChart: 1,
      nbValuesPerChart: _.find(paginationOptions, { value: 10 }),
      paginationOptions,
      renderOptions,
      render: _.find(renderOptions, { value: 'value' }),
      chartData: []
    }
  },
  methods: {
    async open () {
      await this.loadRefs()
      this.$refs.modal.openMaximized()
    },
    close () {
      this.$refs.modal.close()
      this.$emit('closed')
    },
    async getPropertyValues () {
      // For enumeration we directly get the values
      let values = _.get(this.layer, `schema.content.properties.${this.property.value}.field.options`)
      if (!values) {
        // Otherwise we need to make a DB query
        values = await this.$api.getService('features', this.contextId)
          .find({ query: { $distinct: `properties.${this.property.value}` } })
        // We don't have label in that case
        values = values.map(value => ({ value, label: (value ? value : this.$t('KFeaturesChart.NULL_VALUE_LABEL')) }))
      }
      return values
    },
    async getChartData () {
      // Get possible values
      this.values = await this.getPropertyValues()
      // Then count features for each value
      let data = await Promise.all(this.values.map(async value => {
        const response = await this.$api.getService('features', this.contextId)
          .find({ query: { $limit: 0, layer: this.layer._id, [`properties.${this.property.value}`]: value.value } })
        return { value, count: response.total }
      }))
      // Sort data so that we don't have charts mixin large and small numbers when paginating, go large first
      data = _.sortBy(data, item => -item.count)
      this.values = data.map(item => item.value)
      this.chartData = data.map(item => item.count)
    },
    getChartOptions (type) {
      const start = (this.currentChart - 1) * this.nbValuesPerChart.value
      const end = (this.nbValuesPerChart.value > 0 ? start + this.nbValuesPerChart.value : this.chartData.length)
      const colors = _.shuffle(chroma.scale('Spectral').colors(end - start))
      let config = {
        type,
        data: {
          labels: this.values.map(value => value.label).slice(start, end),
          datasets: [{
            data: this.chartData.slice(start, end)
          }]
        },
        options: {
          responsive: true,
          title:{
            display: true,
            text: this.property.label + ' - ' +
                  this.$t(`KFeaturesChart.CHART_LABEL_${type.toUpperCase()}`)
          }
        }
      }
      // ticks.precision = 0 means round displayed values to integers
      if (type === 'radar') {
        _.set(config, 'options.legend.display', false)
        _.set(config, 'data.datasets[0].fill', true)
        _.set(config, 'data.datasets[0].borderColor', colors[0])
        _.set(config, 'data.datasets[0].backgroundColor', chroma(colors[0]).alpha(0.5).hex())
        _.set(config, 'data.datasets[0].pointBorderColor', '#fff')
        _.set(config, 'data.datasets[0].pointBackgroundColor', colors[0])
        _.set(config, 'options.scale.ticks.beginAtZero', true)
        _.set(config, 'options.scale.ticks.precision', 0)
      } else {
        _.set(config, 'data.datasets[0].backgroundColor', colors)
        _.set(config, 'options.plugins.labels.render', this.render.value)
        _.set(config, 'options.plugins.labels.position', 'border')
        _.set(config, 'options.plugins.labels.overlap', false)
        _.set(config, 'options.plugins.labels.showActualPercentages', true)
        _.set(config, 'options.plugins.labels.precision', 0)
        _.set(config, 'options.plugins.labels.textShadow', true)
        _.set(config, 'options.plugins.labels.fontSize', 24)
        _.set(config, 'options.plugins.labels.fontColor', (type === 'bar' ? '#000' : '#fff'))
      }
      if (type === 'bar') {
        _.set(config, 'options.legend.display', false)
        _.set(config, 'options.scales.xAxes[0].ticks.maxRotation', 90)
        _.set(config, 'options.scales.xAxes[0].ticks.minRotation', 70)
        _.set(config, 'options.scales.yAxes[0].ticks.beginAtZero', true)
        _.set(config, 'options.scales.yAxes[0].ticks.precision', 0)
        //_.set(config, 'options.plugins.labels.fontSize', 0)
      } else if (type === 'polarArea') {
        // FIXME: does not work in this case
        //_.set(config, 'options.scale.display', false)
      }

      return config
    },
    async refreshChart () {
      // Destroy previous graph if any
      if (this.chart) {
        this.chart.destroy()
      }
      // Retrieve data
      await this.getChartData()
      // We need to force a refresh so that the computed props are correctly updated by Vuejs
      await this.$nextTick()
      this.chart = new Chart(this.$refs.chart.getContext('2d'),
        this.getChartOptions(this.chartType.value))
    },
    async refreshChartAndPagination () {
      this.currentChart = 1
      await this.refreshChart()
    }
  },
  created () {
    // laod the required components
    this.$options.components['k-modal'] = this.$load('frame/KModal')
  },
  beforeDestroy () {
    
  }
}
</script>

<style lang="stylus">
.chart {
  border: solid 1px lightgrey;
  border-radius: 8px;
  background: #ffffff
}
</style>
