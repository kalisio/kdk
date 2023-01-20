<template>
  <div id="time-series" class="column no-wrap" v-if="charts.length > 0">
    <!-- Pinned charts first -->
    <div v-for="(timeSerie, index) in timeSeries" class="col order-first column no-wrap">
      <div v-if="timeSerie.pinned" class="row bg-grey-3 col-auto">
        <KPanel :id="`${timeSerie.id}-header`" :content="charts[index].header" class="col justify-start"/>
        <KPanel :id="`${timeSerie.id}-actions`" :content="charts[index].actions" :context="timeSerie" class="col justify-end"/>
      </div>
      <k-time-series-chart v-if="timeSerie.pinned" :id="`${timeSerie.id}-timeseries-chart`"
        :ref="charts[index].onChartRef" :time-series="timeSerie.series" class="col q-pl-sm q-pr-sm" />
    </div>
    <!-- Then visible charts -->
    <div v-for="(timeSerie, index) in timeSeries" class="col order-first column no-wrap">
      <div v-if="timeSerie.visible && !timeSerie.pinned" class="row bg-grey-3 col-auto">
        <KPanel :id="`${timeSerie.id}-header`" :content="charts[index].header" class="col justify-start"/>
        <KPanel :id="`${timeSerie.id}-actions`" :content="charts[index].actions" :context="timeSerie" class="col justify-end"/>
      </div>
      <k-time-series-chart v-if="timeSerie.visible && !timeSerie.pinned" :id="`${timeSerie.id}-timeseries-chart`"
        :ref="charts[index].onChartRef" :time-series="timeSerie.series" class="col q-pl-sm q-pr-sm" />
    </div>
  </div>
</template>

<script setup>
import _ from 'lodash'
import moment from 'moment'
import Papa from 'papaparse'
import { ref, watch } from 'vue'
import { i18n } from '../../../../core/client/i18n.js'
import { Time } from '../../../../core/client/time.js'
import { Layout } from '../../../../core/client/layout.js'
import { downloadAsBlob } from '../../../../core/client/utils.js'
import KPanel from '../../../../core/client/components/KPanel.vue'
import KTimeSeriesChart from '../../../../core/client/components/chart/KTimeSeriesChart.vue'

// const timeseries = [
//   { label: 'group1', series: [] }
//   { label: 'group2', series: [] }
// ]
const props = defineProps({
  timeSeries: { type: Array, default: () => [] },
  actions: { type: Array, default: () => [] }
})

// expose
const exposed = {
  hasSeries,
  hasSingleSerie,
  isPinned,
  hasPinnedSerie,
  onPinSerie,
  onExportSeries
}

// data
const charts = ref([])

// watch
watch(() => props.timeSeries, refresh)

// functions
function refresh () {
  // Keep track of previosu charts
  const previousCharts = charts.value
  charts.value = []
  props.timeSeries.forEach((timeSerie, index) => {
    // Avoid building chart header/actions when the underlying time series has change, eg hidden/shown
    let chart = _.find(previousCharts, { timeSerie })
    if (chart) {
      if (chart.ref) ref.update()
    } else {
      // As context is different for each item we need to clone the global action configuration
      // otherwise context will always reference the last processed item
      const actions = Layout.bindContent(_.cloneDeep(props.actions), exposed)
      chart = {
        header: [{ component: 'KStamp', text: timeSerie.label, direction: 'horizontal' }],
        actions,
        onChartRef: (ref) => {
          if (ref && !chart.ref) {
            chart.ref = ref
          }
        },
        timeSerie
      }
    }
    charts.value.push(chart)
  })
}
function hasSeries () {
  return props.timeSeries.length > 0
}
function hasSingleSerie () {
  return props.timeSeries.length === 1
}
function isPinned (timeSerie) {
  return timeSerie.pinned
}
function hasPinnedSerie () {
  return _.find(props.timeSeries, timeSerie => timeSerie.pinned)
}
function onPinSerie (timeSerie) {
  timeSerie.pinned = !timeSerie.pinned
  // Call any attached handler
  if (timeSerie.onPinSerie) timeSerie.onPinSerie(timeSerie.pinned)
}
function onExportSeries (timeSerie) {
  // Call any attached handler
  if (timeSerie.onExportSeries) {
    timeSerie.onExportSeries()
    return
  }
  const timeSeries = timeSerie ? [timeSerie] : props.timeSeries
  let times = []
  timeSeries.forEach(timeSerie => {
    timeSerie.series.forEach(serie => {
      times = times.concat(_.map(serie.data, 'x'))
    })
  })
  // Make union of all available times for x-axis
  times = _.uniq(times).map(time => moment.utc(time)).sort((a, b) => a - b)
  // Convert to json
  const json = times.map(time => {
    const row = {
      [i18n.t('KTimeSeries.TIME_LABEL')]: time.toISOString()
    }
    timeSeries.forEach(timeSerie => {
      timeSerie.series.forEach(serie => {
        const value = _.find(serie.data, item => moment.utc(item.x).valueOf() === time.valueOf())
        const name = _.get(serie, 'variable.name')
        row[`${timeSerie.id}-${name}`] = value ? value.y : null
      })
    })
    return row
  })
  // Convert to csv
  const csv = Papa.unparse(json)
  downloadAsBlob(csv, timeSerie ? _.snakeCase(timeSerie.label) + '.csv' : i18n.t('KTimeSeries.SERIES_EXPORT_FILE'),
    'text/csv;charset=utf-8;')
}

// immediate
refresh()

// expose
defineExpose(exposed)
</script>
