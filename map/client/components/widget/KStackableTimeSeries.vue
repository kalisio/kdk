<template>
  <div id="time-series" class="column no-wrap">
    <div v-show="numGroupedSeries > 0" class="col order-first column no-wrap">
      <div class="row bg-grey-3 col col-auto">
        <KPanel id="group-header" :content="groupHeader()" class="col justify-start"/>
        <KPanel id="group-actions" :content="groupActions()" class="col justify-end"/>
      </div>
      <k-time-series-chart
id="grouped-timeseries" :ref="onGroupChartRef" :timeSeries="group.series" emitLegendClick @legend-click="onGroupLegendClick" class="col q-pl-sm q-pr-sm" />
    </div>
  <div v-for="uiIndex in numSingleSeries" class="col col-auto">
  <div v-show="singleVisible[uiIndex-1]" class="column no-wrap">
        <div class="row bg-grey-3 col col-auto">
          <KPanel id="single-header" :content="singleHeaders[uiIndex-1]" class="col justify-start"/>
          <KPanel id="single-actions" :content="singleActions(uiIndex-1)" class="col justify-end"/>
        </div>
        <k-time-series-chart :ref="(ref) => { this.onSingleChartRef(uiIndex-1, ref) }" :timeSeries="singles[uiIndex-1].series" class="col q-pl-sm q-pr-sm"/>
  </div>
  </div>
  </div>

  <!--
  <q-splitter id="time-series" horizontal v-model="splitValue">

    <template #before>
      <div class="column no-wrap">
        <div class="row bg-grey-3 col col-auto">
          <KPanel id="group-header" :content="groupHeader()" class="col justify-start"/>
          <KPanel id="group-actions" :content="groupActions()" class="col justify-end"/>
        </div>
        <k-time-series-chart
id="grouped-timeseries" :ref="onGroupChartRef" :timeSeries="group.series" emitLegendClick @legend-click="onGroupLegendClick" class="col q-pl-sm q-pr-sm" />
      </div>
    </template>

    <template #after>
      <div v-for="uiIndex in numSingleSeries" class="column no-wrap">
        <div class="row bg-grey-3 col col-auto">
          <KPanel id="single-header" :content="singleHeaders[uiIndex-1]" class="col justify-start"/>
          <KPanel id="single-actions" :content="singleActions(uiIndex-1)" class="col justify-end"/>
        </div>
        <k-time-series-chart :ref="(ref) => { this.onSingleChartRef(uiIndex-1, ref) }" :timeSeries="singles[uiIndex-1].series" class="col q-pl-sm q-pr-sm"/>
      </div>
    </template>

  </q-splitter>
  -->
</template>

<!--
<script setup>
import { reactive } from 'vue'
import moment from 'moment'
import { KPanel, KTimeSeriesChart } from '../../../../core/client/components'

// data
const state = reactive(
  { singleHeaders: [] }
)

const numGroupedSeries = computed(() => { return state.groupedSeries.length })
const numSingleSeries = computed(() => { return state.singleHeaders.length })


// functions

</script>
-->

<script>
import moment from 'moment'
import { KPanel, KTimeSeriesChart } from '../../../../core/client/components'
import { useCurrentActivity, useSelection, useProbe } from '../../composables'
import { Time } from '../../../../core/client/time'

export default {
  name: 'k-stackable-time-series',
  components: {
    KTimeSeriesChart
  },
  props: {},
  data () {
    return {
      numGroupedSeries: 0,
      numSingleSeries: 0,
      singleHeaders: [],
      singleVisible: []
    }
  },
  methods: {
    groupHeader () {
      return [{ component: 'KStamp', text: 'group', direction: 'horizontal' }]
    },
    groupActions () {
      return [
        { id: 'export', icon: 'las la-file-export', tooltip: 'KStackableTimeSeries.EXPORT_ACTION_TOOLTIP', size: 'sm', visible: true, handler: this.onExport }
      ]
    },
    singleActions (uiIndex) {
      const actions = [
        { id: 'group', icon: 'las la-layer-group', tooltip: 'KStackableTimeSeries.GROUP_ACTION_TOOLTIP', size: 'sm', visible: true, handler: () => { this.onGroup(uiIndex) } }
      ]
      const numSingles = this.singles.length
      if (uiIndex > 0)
        actions.push({ id: 'move-up', icon: 'las la-sort-up', tooltip: 'KStackableTimeSeries.MOVE_UP_ACTION_TOOLTIP', size: 'sm', visible: true, handler: () => { this.onMoveUp(uiIndex) } })
      if (uiIndex < (numSingles - 1))
        actions.push({ id: 'move-down', icon: 'las la-sort-down', tooltip: 'KStackableTimeSeries.MOVE_DOWN_ACTION_TOOLTIP', size: 'sm', visible: true, handler: () => { this.onMoveDown(uiIndex) } })
      actions.push({ id: 'export', icon: 'las la-file-export', tooltip: 'KStackableTimeSeries.EXPORT_ACTION_TOOLTIP', size: 'sm', visible: true, handler: () => { this.onExport(uiIndex) } })
      return actions
    },
    genTimeSerie () {
      const numPoints = 10 + Math.floor(Math.random()*20)
      const data = []
      for (let i = 0; i < numPoints; ++i) {
        data.push({ x: moment().add(i, 'm').valueOf(), y: Math.random() })
      }
      return data
    },
    swapSingleCharts (uiIndex0, uiIndex1) {
      const serieIndex0 = this.singles[uiIndex0].index
      const serieIndex1 = this.singles[uiIndex1].index

      this.singles[uiIndex0].index = serieIndex1
      this.singles[uiIndex0].series[0] = this.timeSeries[serieIndex1]
      this.singles[uiIndex1].index = serieIndex0
      this.singles[uiIndex1].series[0] = this.timeSeries[serieIndex0]

      let tmp = this.singleHeaders[uiIndex0]
      this.singleHeaders[uiIndex0] = this.singleHeaders[uiIndex1]
      this.singleHeaders[uiIndex1] = tmp

      this.singles[uiIndex0].chart.update()
      this.singles[uiIndex1].chart.update()
    },
    removeSingleChart (uiIndex) {
      this.singles.splice(uiIndex, 1)
      this.singleHeaders.splice(uiIndex, 1)
      this.singleVisible.splice(uiIndex, 1)
      this.numSingleSeries = this.singles.length
    },
    addSingleChart (serieIndex) {
      const serie = this.timeSeries[serieIndex]
      const single = { index: serieIndex, series: [ serie ], chart: null }
      this.singles.push(single)
      this.singleHeaders.push([{ component: 'KStamp', text: serie.variable.label, direction: 'horizontal' }])
      this.singleVisible.push(true)
      this.numSingleSeries = this.singles.length
    },
    groupChart (uiIndex) {
      const serieIndex = this.singles[uiIndex].index
      const serie = this.timeSeries[serieIndex]

      this.group.index.push(serieIndex)
      this.group.series.push(serie)
      this.numGroupedSeries = this.group.index.length

      if (this.group.chart)
        this.group.chart.update()

      this.removeSingleChart(uiIndex)
    },
    ungroupChart (groupIndex) {
      const serieIndex = this.group.index[groupIndex]

      this.group.index.splice(groupIndex, 1)
      this.group.series.splice(groupIndex, 1)
      this.numGroupedSeries = this.group.index.length

      if (this.numGroupedSeries)
        this.group.chart.update()

      this.addSingleChart(serieIndex)
    },
    onGroupChartRef (ref) {
      this.group.chart = ref
      if (ref) ref.update()
    },
    onSingleChartRef(uiIndex, ref) {
      const numSingles = this.singles.length
      if (uiIndex >= numSingles) return

      this.singles[uiIndex].chart = ref
      if (ref) ref.update()
    },
    onExport (index) {
      if (index) {
        // export single
      } else {
        // export group
      }
    },
    onMoveUp (uiIndex) {
      this.swapSingleCharts(uiIndex, uiIndex-1)
    },
    onMoveDown (uiIndex) {
      this.swapSingleCharts(uiIndex, uiIndex+1)
    },
    onGroup (uiIndex) {
       this.groupChart(uiIndex)
    },
    onGroupLegendClick (index) {
      this.ungroupChart(index)
    },
    async chartSelection () {
      /*
      if (this.hasProbedLocation()) {
        const location = this.getProbedLocation()

      }
      */
      const lat = 43.395787
      const lng = -1.360876
      const { start, end } = Time.getRange()
      const probe = await this.kActivity.getForecastForLocation(lng, lat, start, end)
      const variables = new Map()
      for (const layer of this.kActivity.getLayers()) {
        const vars = _.get(layer, 'variables')
        if (!vars) continue
        for (const v of vars)
          variables.set(v.name, v)
      }
      for (const prop in probe.properties) {
        const variable = variables.get(prop)
        if (!variable) continue
        this.timeSeries.push({ variable, fetch: () => {
            const data = []
            for (let i = 0; i < probe.properties[prop].length; ++i) {
              const t = moment(probe.forecastTime[prop][i]).valueOf()
              const v = probe.properties[prop][i]
              data.push({ x: t, y: v })
            }
            return data
          }
        })
        this.addSingleChart(this.timeSeries.length - 1)
      }
      console.log(probe)
    }
  },
  beforeMount () {
    this.timeSeries = []

    this.singles = []
    this.singleHeaders = []
    this.numSingleCharts = this.singles.length
    this.group = { index: [], series: [], chart: null }
    this.numGroupedCharts = this.group.index.length

    /**/
    /*
    this.timeSeries.push({ label: 'var1', unit: '°C', color: '#0000ff', fetch: this.genTimeSerie })
    this.timeSeries.push({ label: 'var2', unit: '%', color: '#00ff00', fetch: this.genTimeSerie })
    this.timeSeries.push({ label: 'var3', unit: 'm', color: '#ff0000', fetch: this.genTimeSerie })
    this.timeSeries.push({ label: 'var4', unit: 'km', color: '#00ffff', fetch: this.genTimeSerie })

    this.addSingleChart(0)
    this.addSingleChart(1)
    this.addSingleChart(2)
    this.addSingleChart(3)
    */
    /**/
  },
  mounted () {
    this.chartSelection()
  },
  setup (props) {
    return {
       ...useCurrentActivity(),
       ...useSelection(),
       ...useProbe()
    }
  }
}
</script>
