<template>
  <div v-if="rows.length > 0">
    <q-resize-observer @resize="onResized" />
    <KScrollArea :maxHeight="height">
      <q-table
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
import { downloadAsBlob } from '../../utils'
import { useSchema } from '../../composables'
import { Time } from '../../time'
import { i18n } from '../../i18n'

// const timeserie = {
//   variable: { } variable definition
//   data:
//   label:
//   color:
//   unit:
// }

const props = defineProps({
  tables: { type: Array, default: () => [] },
  schema: { type: [String, Object], default: null },
  nbRowsPerPage: { type: Number, default: 10 }
})

defineExpose({
  update,
  exportData
})

// data
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

// computed

// watch
watch(() => props.tables, update)
watch(() => props.schema, update)

async function update () {
  await compile(props.schema)
  columns.value = []
  const invisibleColumns = []
  _.forOwn(schema.value.properties, (value, key) => {
    const type = _.get(value, 'type')
    // FIXME: allow for custom representation of complex objects
    if (type === 'object') return
    const label = _.get(value, 'field.label', _.get(value, 'field.helper', key))
    const visible = _.get(value, 'field.visible', true)
    if (!visible) invisibleColumns.push(key)
    const format = _.get(value, 'format')
    const path = _.get(value, 'field.path', key)
    columns.value.push({
      name: key,
      // Check if we have a translation key or directly the label content
      label: i18n.tie(label),
      // This will support GeoJson out-of-the-box
      field: row => _.get(row, path, _.get(row, `properties.${path}`)),
      align: 'center',
      sortable: true,
      format: (value) => {
        switch (type) {
          case 'number':
            return (value ? _.toNumber(value).toFixed(2) : '')
          case 'integer':
            return (value ? _.toNumber(value).toFixed(0) : '')
          case 'string':
            if (!value) return ''
            if (format === 'date-time') return `${Time.format(value, 'date.short')} - ${Time.format(value, 'time.short')}`
            if (format === 'date') return `${Time.format(value, 'date.short')}`
            if (format === 'time') return `${Time.format(value, 'time.short')}`
            return value
          default:
            return (value ? value.toString() : '')
        }
      }
    })
  })
  visibleColumns.value = _.map(columns.value.filter(column => !invisibleColumns.includes(column.name)), 'name')
  rows.value = []
  for (const table of props.tables) {
    const data = await table.data
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
        if (type === 'string') {
          if (format === 'date-time') data = moment.utc(data).format()
          if (format === 'date') data = moment.utc(data).format()
          if (format === 'time') data = moment.utc(data).format()
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

// immediate
update()
</script>
