<template>
  <div>
    <!-- Invisible link used to download data -->
    <a ref="downloadLink" v-show="false" :href="currentDownloadLink" :download="currentDownloadName"></a>
    <k-modal ref="modal"
      id="feature-chart-modal"
      :title="title"
      :buttons="buttons"
      :toolbar="toolbar"
      :maximized="isModalMaximized"
      v-model="isModalOpened"
      @opened="$emit('opened')"
      @closed="$emit('closed')">
      <div slot="modal-content">
        <div class="row justify-center text-center q-ma-none q-pa-none">
          <div style="width: 90vw">
            <canvas v-show="chartData.length > 0" class="chart" ref="chart"></canvas>
          </div>
          <q-btn v-show="currentChart > 1" size="1rem" flat round color="primary"
            icon="las la-chevron-left" class="absolute-left" @click="onPreviousChart"/>
          <q-btn v-show="currentChart < nbCharts" size="1rem" flat round color="primary"
            icon="las la-chevron-right" class="absolute-right" @click="onNextChart" />
        </div>
      </div>
    </k-modal>
    <k-modal 
      id="chart-settings-modal" 
      ref="chartSettings" 
      :title="$t('KFeaturesChart.CHART_SETTINGS_LABEL')"
      :buttons="[{ id: 'close-action', label: 'CLOSE', renderer: 'form-button', handler: () => this.$refs.chartSettings.close() }]">
      <div slot="modal-content">
        <q-select v-model="property" :label="$t('KFeaturesChart.PROPERTY_LABEL')"
          :options="properties" @input="refreshChart"/>
        <q-select v-model="chartType" :label="$t('KFeaturesChart.CHART_LABEL')"
          :options="chartOptions" @input="refreshChart"/>
        <q-select v-model="nbValuesPerChart" :label="$t('KFeaturesChart.PAGINATION_LABEL')"
          :options="paginationOptions" @input="refreshChartAndPagination"/>
        <q-select v-model="render" :label="$t('KFeaturesChart.RENDER_LABEL')"
          :options="renderOptions" @input="refreshChart"/>
      </div>
    </k-modal>
  </div>
</template>

<script>
import _ from 'lodash'
import logger from 'loglevel'
import Papa from 'papaparse'
import { Loading } from 'quasar'
import chroma from 'chroma-js'
import Chart from 'chart.js'
import 'chartjs-plugin-labels'
import { mixins as kCoreMixins, utils as kCoreUtils } from '../../../core/client'

export default {
  name: 'k-features-chart',
  mixins: [
    kCoreMixins.refsResolver(['chartSettings']),
    kCoreMixins.baseModal
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
      const properties = []
      _.forOwn(_.get(this.layer, 'schema.content.properties'), (value, key) => {
        const label = _.get(value, 'field.label', _.get(value, 'field.helper', key))
        // Check if we have a translation key or directly the label content
        properties.push({ value: key, label: (this.$i18n.i18next.exists(label) ? this.$t(label) : label) })
      })
      // if (properties.length) this.property = properties[0]
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
      toolbar: [
        { id: 'settings', icon: 'las la-cog', tooltip: 'KFeaturesChart.CHART_SETTINGS_LABEL', handler: () => this.$refs.chartSettings.open() },
        { id: 'download', icon: 'las la-file-download', tooltip: 'KFeaturesChart.CHART_EXPORT_LABEL', handler: () => this.downloadChartData() },
      ],
      buttons: [
        { id: 'close-acation', label: 'CLOSE', renderer: 'form-button', handler: () => this.closeModal() }
      ],
      property: null,
      chartType: _.find(chartOptions, { value: 'pie' }),
      chartOptions,
      currentChart: 1,
      nbValuesPerChart: _.find(paginationOptions, { value: 10 }),
      paginationOptions,
      renderOptions,
      render: _.find(renderOptions, { value: 'value' }),
      chartData: [],
      currentDownloadLink: null,
      currentDownloadName: null
    }
  },
  methods: {
    open () {
      this.openModal(true)
    },
    async getPropertyValues () {
      // For enumeration we directly get the values
      let values = _.get(this.layer, `schema.content.properties.${this.property.value}.field.options`)
      if (!values) {
        // Otherwise we need to make a DB query
        values = await this.$api.getService(this.layer.service, this.contextId)
          .find({ query: Object.assign({ $distinct: `properties.${this.property.value}` }, this.layer.baseQuery) })
        // We don't have label in that case
        values = values.map(value => ({ value, label: (value || this.$t('KFeaturesChart.NULL_VALUE_LABEL')) }))
      }
      return values
    },
    async getChartData () {
      // Get possible values
      this.values = await this.getPropertyValues()
      // Then count features for each value
      let data = await Promise.all(this.values.map(async value => {
        const response = await this.$api.getService(this.layer.service, this.contextId)
          .find({ query: Object.assign({ $limit: 0, [`properties.${this.property.value}`]: value.value }, this.layer.baseQuery) })
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
      // const title = this.property.label + ' - ' + this.$t(`KFeaturesChart.CHART_LABEL_${type.toUpperCase()}`)
      let title = this.property.label
      if (this.nbCharts > 1) title += ` (${this.currentChart}/${this.nbCharts})`
      const config = {
        type,
        data: {
          labels: this.values.map(value => value.label).slice(start, end),
          datasets: [{
            data: this.chartData.slice(start, end)
          }]
        },
        options: {
          responsive: true,
          title: {
            display: true,
            text: title
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
        // _.set(config, 'options.plugins.labels.fontSize', 0)
      } else if (type === 'polarArea') {
        // FIXME: does not work in this case
        // _.set(config, 'options.scale.display', false)
      }

      return config
    },
    async refreshChart () {
      // As we have async operations during the whole chart creation process avoid reentrance
      // otherwise we might have interleaved calls leading to multiple charts being created
      if (this.buildingChart) return
      Loading.show({ message: this.$t('KFeaturesChart.CHARTING_LABEL') })
      // Try/Catch required to ensure we reset the build flag
      try {
        this.buildingChart = true
        // Destroy previous graph if any
        if (this.chart) this.chart.destroy()
        // Retrieve data
        await this.getChartData()
        // We need to force a refresh so that the computed props are correctly updated by Vuejs
        await this.$nextTick()
        this.chart = new Chart(this.$refs.chart.getContext('2d'),
          this.getChartOptions(this.chartType.value))
      } catch (error) {
        // User error message on operation should be raised by error hook, otherwise this is more a coding error
        logger.error(error)
      }
      this.buildingChart = false
      Loading.hide()
    },
    async refreshChartAndPagination () {
      this.currentChart = 1
      await this.refreshChart()
    },
    onNextChart () {
      this.currentChart++
      this.refreshChart()
    },
    onPreviousChart () {
      this.currentChart--
      this.refreshChart()
    },
    downloadChartData () {
      const json = this.values.map((value, index) => ({
        [this.property.label]: value.label,
        [this.$t('KFeaturesChart.CHART_COUNT_LABEL')]: this.chartData[index]
      }))
      const csv = Papa.unparse(json)
      kCoreUtils.downloadAsBlob(csv, this.$t('KFeaturesChart.CHART_EXPORT_FILE', { layer: this.layer.name }), 'text/csv;charset=utf-8;')
    }
  },
  created () {
    // laod the required components
    this.$options.components['k-modal'] = this.$load('frame/KModal')
  },
  async mounted () {
    await this.loadRefs()
    this.$refs.chartSettings.open()
  },
  beforeDestroy () {
    if (this.chart) this.chart.destroy()
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
