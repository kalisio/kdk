<template>
  <!-- Content -->
  <div v-if="items && items.length > 0">
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
      <template v-slot:body="props" v-if="hasRenderer">
        <q-tr :props="props">
          <q-td :props="props" key="actions" v-if="hasSelection">
            <q-checkbox :model-value="props.selected" @update:model-value="(val) => props.selected = val" />
          </q-td>
          <q-td v-for="(item, index) in renderer" :key="item.key" :props="props">
            <component
              v-if="item.component"
              :item="item"
              :row="props.row"
              :is="loadComponent(item.component)"
            />
            <p v-else>{{ props.row.properties[`${item.key}`] }}</p>
          </q-td>
          <q-td :props="props" key="actions">
            <KPanel
              id="item-actions"
              :content="itemActions"
              :context="{ item: props.row }"
            />
          </q-td>
        </q-tr>
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
  <!-- Empty slot -->
  <div v-else-if="items && items.length === 0"
    id="table-empty"
  >
    <slot name="empty">
      <div class="row justify-center">
        <KStamp
          icon="las la-exclamation-circle"
          icon-size="1.6rem"
          :text="$t('KTable.EMPTY_TABLE')"
          direction="horizontal"
          class="q-pa-md"
        />
      </div>
    </slot>
  </div>
  <!-- Initializing slot -->
  <div v-else id="grid-initializing">
    <slot name="initializing">
      <div class="row justify-center">
        <q-spinner
          color="primary"
          size="2rem"
        />
      </div>
    </slot>
  </div>
</template>

<script setup>
import _ from 'lodash'
import moment from 'moment'
import { ref, computed, watch, toRefs, onBeforeMount, onBeforeUnmount } from 'vue'
import KPanel from '../KPanel.vue'
import KStamp from '../KStamp.vue'
import { Events } from '../../events.js'
import { i18n } from '../../i18n.js'
import { useCollection, useSchema } from '../../composables'
import { loadComponent } from '../../utils/index.js'

const emit = defineEmits(['selection-changed', 'collection-refreshed'])

// Props
const props = defineProps({
  renderer: {
    type: Array,
    default: () => {
      return []
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
  },
  schema: {
    type: [String, Object],
    default: null
  },
  processor: {
    type: Function,
    default: undefined
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
const filterQuery = computed(() => Object.assign({}, props.filterQuery, tableQuery.value))
const renderer = computed(() => props.renderer)
const hasRenderer = computed(() => _.isArray(props.renderer) && !_.isEmpty(props.renderer))
const hasSelection = computed(() => !_.isString(props.selection))

const { schema, compile } = useSchema()
// Add sort query into collection options
const options = Object.assign({ filterQuery }, _.omit(toRefs(props), ['filterQuery']))
const { items, nbTotalItems, nbPages, currentPage, refreshCollection, resetCollection } = useCollection(options)

// Watch
watch(items, onCollectionRefreshed)
watch(schema, () => {
  processSchema()
  resetCollection()
})
watch(() => props.schema, async (value) => {
  await compile(props.schema || `${props.service}.get`)
})
watch(nbTotalItems, () => {
  // Update pagination for table
  pagination.value.rowsNumber = nbTotalItems.value
})

// Functions
function processSchema () {
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
  columns.value.push({
    name: 'actions',
    align: 'center'
  })
  visibleColumns.value = columns.value.map(column => column.name)
}
function onRequest (props) {
  const { page, rowsPerPage, sortBy, descending } = props.pagination
  const geoJson = (_.get(items.value, '[0].type') === 'Feature')
  currentPage.value = page
  if (pagination.value.descending !== descending || pagination.value.sortBy !== sortBy) {
    sortBy === null ? tableQuery.value.$sort = { _id: 1 } : tableQuery.value.$sort = { [geoJson ? `properties.${sortBy}` : sortBy]: (descending ? -1 : 1) }
    options.filterQuery.value = Object.assign({}, props.filterQuery, tableQuery.value)
  } else {
    refreshCollection()
  }
  // Don't forget to update local pagination object
  pagination.value.page = page
  pagination.value.rowsPerPage = rowsPerPage
  pagination.value.sortBy = sortBy
  pagination.value.descending = descending
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

// Hooks
onBeforeMount(async () => {
  // This will launch collection refresh
  await compile(props.schema || `${props.service}.get`)
  refreshCollection()
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

<style lang="scss" scoped>
p {
  margin: 0;
}
</style>
