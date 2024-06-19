<template>
  <div v-if="rows.length > 0">
    <q-resize-observer @resize="onResized" />
    <KScrollArea :maxHeight="height">
      <q-table class="data-table-background"
        :rows="rows"
        :columns="columns"
        :visible-columns="visibleColumns"
        v-model:pagination="pagination"
      >
        <template v-slot:top>
          <q-select v-model="visibleColumns" multiple borderless dense options-dense
            :display-value="$t('KDataTable.TABLE_COLUMNS')" emit-value map-options
            :options="columns" option-value="name" style="min-width: 150px"/>
        </template>
    </q-table>
    </KScrollArea>
  </div>
  <div v-else>
    <div slot="empty-section">
      <div class="row justify-center">
        <KStamp icon="las la-exclamation-circle" icon-size="1.6rem" :text="$t('KDataTable.NO_DATA_AVAILABLE')" direction="horizontal" />
      </div>
    </div>
  </div>
</template>

<script setup>
import _ from 'lodash'
import moment from 'moment'
import Papa from 'papaparse'
import { ref, watch } from 'vue'
 import { downloadAsBlob, convertTimeSerie } from '../../utils'
import { useSchema } from '../../composables'
import { Units } from '../../units.js'
import { Time } from '../../time.js'
import { i18n } from '../../i18n.js'

// Props
const props = defineProps({
  tables: {
    type: Array,
    default: () => []
  },
  schema: {
    type: [String, Object],
    default: () => null
  },
  formatters: {
    type: Object,
    default: () => null
  },
  nbRowsPerPage: {
    type: Number,
    default: 10
  }
})

// Data
const { schema, compile } = useSchema()
const pagination = ref({
  // sortBy: '_id',
  descending: false,
  page: 1,
  rowsPerPage: props.nbRowsPerPage
})
const rows = ref([])
const columns = ref([])
const visibleColumns = ref([])
const height = ref(0)
// Used to store template compilers per field
const compilers = {}
const exportCompilers = {}
let propertiesToConvert = []

// Watch
watch(() => props.tables, update)
watch(() => props.schema, update)

// Functions
async function update () {
  await compile(props.schema)
  columns.value = []
  const invisibleColumns = []
  propertiesToConvert = []
  _.forOwn(schema.value.properties, (value, key) => {
    const type = _.get(value, 'type')
    // FIXME: allow for custom representation of complex objects
    if (type === 'object') return
    const label = _.get(value, 'field.label', _.get(value, 'field.helper', key))
    const convertToDefaultUnit = _.get(value, 'field.defaultUnit', false)
    if (convertToDefaultUnit) propertiesToConvert.push(key)
    const visible = _.get(value, 'field.visible', true)
    if (!visible) invisibleColumns.push(key)
    const formatter = _.has(value, 'field.formatter') ? _.get(props.formatters, value.field.formatter) : null
    const format = _.get(value, 'format')
    const path = _.get(value, 'field.path', key)
    if (_.has(value, 'field.template')) {
      compilers[key] = _.template(_.get(value, 'field.template'))
      // By default export as visualized
      exportCompilers[key] = compilers[key]
    } // Custom export template if any
    if (_.has(value, 'field.exportTemplate')) {
      exportCompilers[key] = _.template(_.get(value, 'field.exportTemplate'))
    }
    columns.value.push({
      name: key,
      // Check if we have a translation key or directly the label content
      label: i18n.tie(label),
      // This will support GeoJson out-of-the-box
      field: row => _.get(row, path, _.get(row, `properties.${path}`)),
      align: 'center',
      sortable: true,
      format: (value, row) => {
        if (formatter) return formatter(value, row)
        if (_.isNil(value)) return ''
        if (compilers[key]) return compilers[key]({ value, row, i18n, Units, Time, moment })
        switch (type) {
          case 'number':
            return Units.format(_.toNumber(value))
          case 'integer':
            return _.toNumber(value).toFixed(0)
          case 'string':
            if (format === 'date-time') return `${Time.format(value, 'date.short')}/${Time.format(value, 'year.short')} - ${Time.format(value, 'time.long')}`
            if (format === 'date') return `${Time.format(value, 'date.short')}/${Time.format(value, 'year.short')}`
            if (format === 'time') return `${Time.format(value, 'time.long')}`
            return value
          default:
            return value.toString()
        }
      }
    })
  })
  visibleColumns.value = _.map(columns.value.filter(column => !invisibleColumns.includes(column.name)), 'name')
  rows.value = []
  for (const table of props.tables) {
    const data = await table.data
    convertTimeSerie(data, table.variable, propertiesToConvert)
    rows.value = rows.value.concat(data)
  }
}
function onResized (size) {
  height.value = size.height
}
async function exportData (options = {}) {
  // Convert to json
  const json = []
  for (let i = 0; i < props.tables.length; i++) {
    const table = props.tables[i]
    const data = await table.data
    await convertTimeSerie(data, table.variable, propertiesToConvert)
    for (const item of data) {
      const row = {}
      _.forOwn(schema.value.properties, (value, key) => {
        const type = _.get(value, 'type')
        // FIXME: allow for custom representation of complex objects
        if (type === 'object') return
        const label = _.get(value, 'field.label', _.get(value, 'field.helper', key))
        const visible = visibleColumns.value.includes(key)
        // Skip invisible columns in export
        if (options.visibleOnly && !visible) return
        const format = _.get(value, 'format')
        const path = _.get(value, 'field.path', key)
        // This will support GeoJson out-of-the-box
        let data = _.get(item, path, _.get(item, `properties.${path}`))
        if (_.isNil(data)) data = ''
        else if (exportCompilers[key]) data = exportCompilers[key]({ value: data, row: item, i18n, Units, Time, moment })
        else if (type === 'string') {
          if (format === 'date-time') data = moment.utc(data).toISOString()
          if (format === 'date') data = moment.utc(data).toISOString()
          if (format === 'time') data = moment.utc(data).toISOString()
        }
        // Check if we have a translation key or directly the label content
        row[options.labelAsHeader ? `${i18n.tie(label)}` : key] = data
      })
      json.push(row)
    }
  }
  // Convert to csv
  const csv = Papa.unparse(json)
  downloadAsBlob(csv, _.template(options.filename || i18n.t('KDataTable.DATA_EXPORT_FILE'))(), 'text/csv;charset=utf-8;')
}

// Immediate
update()

// Exposed
defineExpose({
  update,
  exportData
})
</script>

<style lang="scss" scoped>
.data-table-background {
  background-color: $table-background
}
</style>
