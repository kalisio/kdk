<template>
  <div>
    <k-modal
      id="feature-chart-modal"
      :title="title"
      :buttons="buttons"
      :toolbar="toolbar"
      :maximized="isModalMaximized"
      v-model="isModalOpened"
    >
      <div class="fit row items-center q-gutter-x-lg">
        <!-- Previsious chart -->
        <q-btn
          v-if="currentChart > 1"
          size="1rem" flat round color="primary"
          icon="las la-chevron-left"
          @click="onPreviousChart"
        />
        <!-- Current chart -->
        <KStatisticsChart
          id="features-chart"
          class="col"
          :ref="onChartCreated"
          :format="render.value"
        />
        <!-- Next chart -->
        <q-btn
          v-if="currentChart < nbCharts"
          size="1rem" flat round color="primary"
          icon="las la-chevron-right"
          @click="onNextChart"
        />
      </div>
    </k-modal>
    <k-modal
      id="chart-settings-modal"
      :ref="onChartSettingsCreated"
      :title="$t('KFeaturesChart.CHART_SETTINGS_LABEL')"
      :buttons="[{ id: 'close-action', label: 'CLOSE', renderer: 'form-button', handler: () => this.closeSettings() }]">
      <div>
        <q-select
          v-model="selectedProperty"
          :label="$t('KFeaturesChart.PROPERTY_LABEL')"
          :options="properties"
          @update:modelValue="refreshChartAndPagination"
        />
        <q-select
          :disable="selectedProperty ? false : true"
          v-model="selectedChartType"
          :label="$t('KFeaturesChart.CHART_LABEL')"
          :options="availableChartTypes"
          @update:modelValue="refreshChart"
        />
        <q-select
          :disable="selectedProperty ? false : true"
          v-model="nbValuesPerChart"
          :label="$t('KFeaturesChart.PAGINATION_LABEL')"
          :options="paginationOptions"
          @update:modelValue="refreshChartAndPagination"
        />
        <q-select
          :disable="selectedProperty ? false: true"
          v-model="render"
          :label="$t('KFeaturesChart.RENDER_LABEL')"
          :options="renderOptions"
          @update:modelValue="refreshChart"
        />
      </div>
    </k-modal>
  </div>
</template>

<script>
import _ from 'lodash'
import logger from 'loglevel'
import Papa from 'papaparse'
import { Loading } from 'quasar'
import { mixins as kCoreMixins, utils as kCoreUtils, composables as kCoreComposables } from '../../../core/client'
import { KModal, KStatisticsChart } from '../../../core/client/components'

export default {
  name: 'k-features-chart',
  components: {
    KModal,
    KStatisticsChart
  },
  mixins: [
    kCoreMixins.baseModal
  ],
  props: {
    layerId: {
      type: String,
      default: ''
    },
    layerName: {
      type: String,
      default: ''
    }
  },
  computed: {
    title () {
      return this.$t('KFeaturesChart.TITLE') + ` ${_.get(this.layer, 'name', '')}`
    },
    properties () {
      const properties = []
      _.forOwn(_.get(this.layer, 'schema.content.properties', {}), (value, key) => {
        const label = _.get(value, 'field.label', '')
        // Check if we have a translation key or directly the label content
        properties.push({ value: key, label: this.$tie(label) })
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
    const availableChartTypes = ['pie', 'polarArea', 'radar', 'bar'].map(
      type => ({ value: type, label: this.$t(`KFeaturesChart.CHART_LABEL_${type.toUpperCase()}`) }))
    const paginationOptions = [{
      value: 0, label: this.$t('KFeaturesChart.ALL_VALUES')
    }, {
      value: 5, label: '5'
    }, {
      value: 10, label: '10'
    }, {
      value: 20, label: '20'
    }]
    const renderOptions = [{
      value: 'value', label: this.$t('KFeaturesChart.VALUE_LABEL')
    }, {
      value: 'percentage', label: this.$t('KFeaturesChart.PERCENTAGE_LABEL')
    }]
    return {
      layer: {},
      toolbar: [
        { id: 'settings', icon: 'las la-cog', tooltip: 'KFeaturesChart.CHART_SETTINGS_LABEL', handler: () => this.openSettings() },
        { id: 'download', icon: 'las la-file-download', tooltip: 'KFeaturesChart.CHART_EXPORT_LABEL', handler: () => this.downloadChartData() }
      ],
      buttons: [
        { id: 'close-acation', label: 'CLOSE', renderer: 'form-button', handler: () => this.closeModal() }
      ],
      selectedProperty: null,
      availableChartTypes,
      selectedChartType: _.find(availableChartTypes, { value: 'pie' }),
      chartData: [],
      currentChart: 1,
      nbValuesPerChart: _.find(paginationOptions, { value: 10 }),
      paginationOptions,
      renderOptions,
      render: _.find(renderOptions, { value: 'value' })
    }
  },
  methods: {
    onChartCreated (ref) {
      if (ref && !this.chart) {
        this.chart = ref
        this.refreshChart()
      }
    },
    onChartSettingsCreated (ref) {
      if (ref && !this.chartSettings) {
        this.chartSettings = ref
        this.openSettings()
      }
    },
    async getPropertyValues () {
      // For enumeration we directly get the values
      let values = _.get(this.layer.schema, `content.properties.${this.selectedProperty.value}.field.options`)
      if (!values) {
        // Otherwise we need to make a DB query
        values = await this.$api.getService(this.layer.service)
          .find({ query: Object.assign({ $distinct: `properties.${this.selectedProperty.value}` }, this.layer.baseQuery) })
        // We don't have label in that case
        values = _.map(values, value => ({ value, label: (value || this.$t('KFeaturesChart.NULL_VALUE_LABEL')) }))
      }
      return values
    },
    async getChartData () {
      // Get possible values
      this.values = await this.getPropertyValues()
      // Then count features for each value
      let data = await Promise.all(_.map(this.values, async value => {
        const response = await this.$api.getService(this.layer.service)
          .find({ query: Object.assign({ $limit: 0, [`properties.${this.selectedProperty.value}`]: value.value }, this.layer.baseQuery) })
        return { value, count: response.total }
      }))
      // Sort data so that we don't have charts mixin large and small numbers when paginating, go large first
      data = _.sortBy(data, item => -item.count)
      this.values = data.map(item => item.value)
      this.chartData = data.map(item => item.count)
    },
    async refreshChart () {
      // As we have async operations during the whole chart creation process avoid reentrance
      // otherwise we might have interleaved calls leading to multiple charts being created
      if (!this.chart || !this.selectedProperty || this.buildingChart) return
      Loading.show({ message: this.$t('KFeaturesChart.CHARTING_LABEL'), html: true })
      // Try/Catch required to ensure we reset the build flag
      try {
        this.buildingChart = true
        // Retrieve chart data
        await this.getChartData()
        // Update chart options
        const start = (this.currentChart - 1) * this.nbValuesPerChart.value
        const end = (this.nbValuesPerChart.value > 0 ? start + this.nbValuesPerChart.value : this.chartData.length)
        let title = this.selectedProperty.label
        if (this.nbCharts > 1) title += ` (${this.currentChart}/${this.nbCharts})`
        // Update the chart
        this.chart.update({
          type: this.selectedChartType.value,
          data: {
            labels: _.map(this.values, value => value.label).slice(start, end),
            datasets: [{
              data: this.chartData.slice(start, end),
              colorScale: 'Dark2'
            }]
          },
          options: {
            plugins: {
              title: {
                display: true,
                text: title
              }
            }
          }
        })
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
        [this.selectedProperty.label]: value.label,
        [this.$t('KFeaturesChart.CHART_COUNT_LABEL')]: this.chartData[index]
      }))
      const csv = Papa.unparse(json)
      kCoreUtils.downloadAsBlob(csv, this.$t('KFeaturesChart.CHART_EXPORT_FILE', { layer: this.layer.name }), 'text/csv;charset=utf-8;')
    },
    openSettings () {
      // As we have tow modals it appears that opening them simultaneously on create does not work in quasar
      if (this.chartSettings) setTimeout(() => this.chartSettings.open(), 500)
    },
    closeSettings () {
      if (this.chartSettings) {
        this.chartSettings.close()
        // By default settings are open to at least select the target property
        if (!this.selectedProperty) this.closeModal()
      }
    },
    async openModal () {
      kCoreMixins.baseModal.methods.openModal.call(this, true)
      // If not injected load it
      if (this.layerName) this.layer = this.kActivity.getLayerByName(this.layerName)
      else this.layer = await this.$api.getService('catalog').get(this.layerId)
      this.openSettings()
    }
  },
  setup (props) {
    return {
      ...kCoreComposables.useCurrentActivity()
    }
  }
}
</script>
