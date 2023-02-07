<template>
  <div id="stacked-time-series" class="column justify-start no-wrap" v-if="components.length > 0">
    <!-- Pinned charts first -->
    <div v-for="(timeSerie, index) in timeSeries" class="col column justify-start no-wrap">
      <div v-if="timeSerie.pinned" class="row bg-grey-3 col col-auto">
        <KPanel :id="`${timeSerie.id}-header`" :content="components[index].header" class="col justify-start"/>
        <KPanel :id="`${timeSerie.id}-actions`" :content="components[index].actions" :context="timeSerie" class="col justify-end"/>
      </div>
      <k-time-series-chart v-if="timeSerie.pinned && !timeSerie.table" :id="`${timeSerie.id}-timeseries-chart`"
        class="col q-pl-sm q-pr-sm" :ref="components[index].onChartRef" :options="chartOptions" :time-series="timeSerie.series"
        :x-axis-key="xAxisKey" :y-axis-key="yAxisKey" :logarithmic="timeSerie.logarithmic"
        :start-time="startTime" :end-time="endTime" @zoom-start="onZoomStart" @zoom-end="onZoomEnd"/>
      <k-data-table v-if="timeSerie.pinned && timeSerie.table"
        :id="`${timeSerie.id}-timeseries-chart`" class="col q-pl-sm q-pr-sm" :ref="components[index].onTableRef"
        :schema="schema" :tables="timeSerie.series" />
    </div>
    <!-- Then visible charts -->
    <div v-for="(timeSerie, index) in timeSeries" class="col column justify-start no-wrap">
      <div v-if="timeSerie.visible && !timeSerie.pinned" class="row bg-grey-3 col col-auto">
        <KPanel :id="`${timeSerie.id}-header`" :content="components[index].header" class="col justify-start"/>
        <KPanel :id="`${timeSerie.id}-actions`" :content="components[index].actions" :context="timeSerie" class="col justify-end"/>
      </div>
      <k-time-series-chart v-if="timeSerie.visible && !timeSerie.pinned && !timeSerie.table"
        :id="`${timeSerie.id}-timeseries-chart`" class="col q-pl-sm q-pr-sm"
        :ref="components[index].onChartRef" :options="chartOptions" :time-series="timeSerie.series"
        :x-axis-key="xAxisKey" :y-axis-key="yAxisKey" :logarithmic="timeSerie.logarithmic"
        :start-time="startTime" :end-time="endTime" @zoom-start="onZoomStart" @zoom-end="onZoomEnd"/>
      <k-data-table v-if="timeSerie.visible && !timeSerie.pinned && timeSerie.table"
        :id="`${timeSerie.id}-timeseries-table`" class="col q-pl-sm q-pr-sm" :ref="components[index].onTableRef"
        :schema="schema" :tables="timeSerie.series" />
    </div>
  </div>
  <div v-else>
    <slot name="empty-time-series">
      <KStamp class="absolute-center" icon="las la-exclamation-circle" icon-size="3rem"
        :text="$t('KStackableTimeSeries.NO_DATA_AVAILABLE')" text-size="1rem"/>
    </slot>
  </div>
</template>

<script setup>
import _ from 'lodash'
import moment from 'moment'
import { ref, watch } from 'vue'
import { Layout } from '../../../../core/client/layout.js'
import KPanel from '../../../../core/client/components/KPanel.vue'
import KTimeSeriesChart from '../../../../core/client/components/chart/KTimeSeriesChart.vue'
import KDataTable from '../../../../core/client/components/chart/KDataTable.vue'

const emit = defineEmits(['zoom-start', 'zoom-end'])
// const timeseries = [
//   { label: 'group1', series: [] }
//   { label: 'group2', series: [] }
// ]
const props = defineProps({
  timeSeries: { type: Array, default: () => [] },
  xAxisKey: { type: String, default: 'x' },
  yAxisKey: { type: String, default: 'y' },
  schema: { type: [String, Object], default: null },
  actions: { type: Array, default: () => [] },
  chartOptions: { type: Object, default: () => ({}) },
  exportOptions: { type: Object, default: () => ({}) }
})

// data
const components = ref([])
const startTime = ref(null)
const endTime = ref(null)
const zoomHistory = ref([])

// expose
const exposed = {
  startTime,
  endTime,
  zoomHistory,
  restorePreviousZoom,
  update,
  exportData,
  exportSeries
}

// watch
watch(() => props.timeSeries, refresh)

// functions
function refresh () {
  zoomHistory.value = []
  // Keep track of previous components
  const previousComponents = components.value
  components.value = []
  props.timeSeries.forEach((timeSerie, index) => {
    // Avoid building component header/actions when the underlying time series has changed, eg hidden/shown
    let component = _.find(previousComponents, { timeSerie })
    if (component) {
      if (component.chart) component.chart.update()
      if (component.table) component.table.update()
    } else {
      // As context is different for each item we need to clone the global action configuration
      // otherwise context will always reference the last processed item
      const actions = Layout.bindContent(_.cloneDeep(props.actions), exposed)
      component = {
        header: [{ component: 'KStamp', text: timeSerie.label, direction: 'horizontal' }],
        actions,
        onChartRef: (ref) => { if (ref && !component.chart) component.chart = ref },
        onTableRef: (ref) => { if (ref && !component.table) component.table = ref },
        timeSerie
      }
    }
    components.value.push(component)
  })
}
function restorePreviousZoom () {
  if (!_.isEmpty(zoomHistory.value)) {
    const { start, end } = _.last(zoomHistory.value)
    startTime.value = start
    endTime.value = end
    zoomHistory.value.pop()
  }
  // Can we still zoom out ?
  return !_.isEmpty(zoomHistory.value)
}
function onZoomStart ({ chart, start, end }) {
  zoomHistory.value.push({ start, end })
  emit('zoom-start', { chart, start, end, zoomHistory })
}
function onZoomEnd ({ chart, start, end }) {
  startTime.value = moment.utc(start)
  endTime.value = moment.utc(end)
  emit('zoom-end', { chart, start, end, zoomHistory })
}
function update () {
  _.forEach(components.value, component => {
    if (component.chart) component.chart.update()
    if (component.table) component.table.update()
  })
}
function exportData (timeSerie) {
  const component = _.find(components.value, { timeSerie })
  if (component && component.table) component.table.exportData(_.get(props, 'exportOptions.data', {}))
}
function exportSeries (timeSerie) {
  const component = _.find(components.value, { timeSerie })
  if (component && component.chart) component.chart.exportSeries(_.get(props, 'exportOptions.series', {}))
}

// immediate
refresh()

// expose
defineExpose(exposed)
</script>
