<template>
  <div v-if="items.length > 0">
    <q-table
      :title="title"
      :rows="items"
      :columns="columns"
      :visible-columns="visibleColumns"
      :selection="selection"
      v-model:selected="selectedItems"
      @selection="onSelectionChanged"
      row-key="_id"
      v-model:pagination="pagination"
      :rows-per-page-options="[]"
      @request="onRequest"
    >
      <template v-slot:top="props">
        <q-select v-model="visibleColumns" multiple borderless dense options-dense
          :display-value="$t('KTable.TABLE_COLUMNS')" emit-value map-options
          :options="selectableColumns" option-value="name" style="min-width: 150px"/>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <KPanel
            id="item-actions"
            :content="itemActions"
            :context="{ item: props.row }"
          />
        </q-td>
      </template>
    </q-table>
  </div>
  <div v-else>
    <div slot="empty-section">
      <div class="row justify-center">
        <KStamp icon="las la-exclamation-circle" icon-size="1.6rem" :text="$t('KTable.EMPTY_TABLE')" direction="horizontal" />
      </div>
    </div>
  </div>
</template>

<script setup>
import _ from 'lodash'
import moment from 'moment'
import { ref, reactive, computed, watch, onBeforeMount, onBeforeUnmount } from 'vue'
import KPanel from '../KPanel.vue'
import KStamp from '../KStamp.vue'
import { Events } from '../../events.js'
import { i18n } from '../../i18n.js'
import { useCollection, useSchema } from '../../composables'

const emit = defineEmits(['selection-changed', 'collection-refreshed'])

// Props
const props = defineProps({
  renderer: {
    type: Object,
    default: () => {
      return {
        component: 'collection/KItem'
      }
    }
  },
  itemActions: {
    type: [Object, Array],
    default: () => null
  },
  title: {
    type: String
  },
  selection: {
    type: String
  },
  contextId: {
    type: String,
    default: undefined
  },
  service: {
    type: String,
    required: true
  },
  baseQuery: {
    type: Object,
    default: function () {
      return {}
    }
  },
  filterQuery: {
    type: Object,
    default: function () {
      return {}
    }
  },
  listStrategy: {
    type: String,
    default: 'smart'
  },
  nbItemsPerPage: {
    type: Number,
    default: 12
  }
})

// Data
const tableQuery = ref({
  $sort: { _id: 1 } // Implicit default sort
})
const columns = ref([])
const visibleColumns = ref([])
const selectedItems = ref([])
const pagination = ref({
  sortBy: '_id',
  descending: false,
  page: 1,
  rowsPerPage: props.nbItemsPerPage,
  rowsNumber: 0
})

// Computed
// Remove special column used for actions
const selectableColumns = computed(() => columns.value.filter(column => column.name !== 'actions'))

const { schema, compile } = useSchema()
// Add sort query into collection options
const options = Object.assign(reactive({ filterQuery: Object.assign({}, props.filterQuery, tableQuery.value) }), _.omit(props, ['filterQuery']))
const { items, nbTotalItems, nbPages, currentPage, refreshCollection, resetCollection } = useCollection(options)

// Functions
function processSchema () {
  columns.value = [{
    name: 'actions',
    align: 'center'
  }]
  _.forOwn(schema.value.properties, (value, key) => {
    const type = _.get(value, 'type')
    // FIXME: allow for custom representation of complex objects
    if (type === 'object') return
    const label = _.get(value, 'field.label', _.get(value, 'field.helper', key))
    const options = _.get(value, 'field.options', [])
    const format = _.get(value, 'format')
    columns.value.push({
      name: key,
      // Check if we have a translation key or directly the label content
      label: i18n.tie(label),
      // This will support GeoJson out-of-the-box
      field: row => _.get(row, key, _.get(row, `properties.${key}`)),
      align: 'center',
      sortable: true,
      format: (value) => {
        // Check if the corresponding value is mapped according to an option list
        const option = _.find(options, { value })
        if (option && option.label) value = option.label
        switch (type) {
          case 'number':
            return (value ? value.toFixed(2) : '')
          case 'integer':
            return (value ? value.toFixed(0) : '')
          case 'string':
            return (value ? (format === 'date-time' ? moment.utc(value).toISOString() : value) : '')
          default:
            return (value ? value.toString() : '')
        }
      }
    })
  })
  visibleColumns.value = columns.value.map(column => column.name)
}
function onRequest (props) {
  const { page, rowsPerPage, sortBy, descending } = props.pagination
  const geoJson = (_.get(items.value, '[0].type') === 'Feature')
  currentPage.value = page
  tableQuery.value.$sort = { [geoJson ? `properties.${sortBy}` : sortBy]: (descending ? -1 : 1) }
  // Don't forget to update local pagination object
  pagination.value.page = page
  pagination.value.rowsPerPage = rowsPerPage
  pagination.value.sortBy = sortBy
  pagination.value.descending = descending
  // This will trigger a collection refresh
  options.filterQuery = Object.assign({}, props.filterQuery, tableQuery.value)
}
function onSelectionChanged (data) {
  if (props.selection === 'single') {
    if (data.added) emit('selection-changed', data.rows[0])
    else emit('selection-changed', null)
  } else {
    if (data.added) emit('selection-changed', selectedItems.value.concat(data.rows))
    else emit('selection-changed', selectedItems.value.filter(item => !_.find(data.rows, { _id: item._id })))
  }
}
function onCollectionRefreshed () {
  emit('collection-refreshed', items.value)
}

// Lifecycle hooks

// Emit events so that embbeding components can be aware of it
watch(items, onCollectionRefreshed)
watch(schema, () => {
  processSchema()
  resetCollection()
})
watch(nbTotalItems, () => {
  // Update pagination for table
  pagination.value.rowsNumber = nbTotalItems.value
})

onBeforeMount(async () => {
  // This will launch collection refresh
  await compile(props.service + '.get')
  // Whenever the user abilities are updated, update collection as well
  Events.on('user-abilities-changed', refreshCollection)
})

onBeforeUnmount(() => {
  Events.off('user-abilities-changed', refreshCollection)
})

// Expose
defineExpose({
  items,
  nbTotalItems,
  nbPages,
  currentPage,
  refreshCollection,
  resetCollection
})
</script>
