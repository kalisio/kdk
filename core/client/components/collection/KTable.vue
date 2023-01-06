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

<script>
import _ from 'lodash'
import moment from 'moment'
import KPanel from '../KPanel.vue'
import KStamp from '../KStamp.vue'
import { service, schemaProxy, baseCollection } from '../../mixins'

export default {
  mixins: [
    service,
    schemaProxy,
    baseCollection
  ],
  components: {
    KStamp,
    KPanel
  },
  props: {
    itemActions: {
      type: [Object, Array],
      default: () => null
    },
    baseQuery: {
      type: Object,
      default: () => {}
    },
    filterQuery: {
      type: Object,
      default: () => {}
    },
    title: {
      type: String
    },
    selection: {
      type: String
    },
    listStrategy: {
      type: String
    }
  },
  computed: {
    selectableColumns () {
      // Remove special column used for actions
      return this.columns.filter(column => column.name !== 'actions')
    }
  },
  data () {
    return {
      tableQuery: {
        $sort: { _id: 1 } // Implicit default sort
      },
      columns: [],
      visibleColumns: [],
      selectedItems: [],
      pagination: {
        sortBy: '_id',
        descending: false,
        page: 1,
        rowsPerPage: this.nbItemsPerPage
      }
    }
  },
  watch: {
    baseQuery: function () {
      this.resetCollection()
    },
    filterQuery: function () {
      this.resetCollection()
    },
    schema: function (schema) {
      if (this.schema) {
        this.processSchema()
        this.resetCollection()
      }
    }
  },
  methods: {
    getCollectionBaseQuery () {
      return this.baseQuery
    },
    getCollectionFilterQuery () {
      return Object.assign({}, this.tableQuery, this.filterQuery)
    },
    processSchema () {
      this.columns = [{
        name: 'actions',
        align: 'center'
      }]
      _.forOwn(this.schema.properties, (value, key) => {
        const type = _.get(value, 'type')
        // FIXME: allow for custom representation of complex objects
        if (type === 'object') return
        const label = _.get(value, 'field.label', _.get(value, 'field.helper', key))
        const format = _.get(value, 'format')
        this.columns.push({
          name: key,
          // Check if we have a translation key or directly the label content
          label: this.$tie(label),
          // This will support GeoJson out-of-the-box
          field: row => _.get(row, key, _.get(row, `properties.${key}`)),
          align: 'center',
          sortable: true,
          format: (value) => {
            switch (type) {
              case 'number':
                return (value ? value.toFixed(2) : '')
              case 'integer':
                return (value ? value.toFixed(0) : '')
              case 'string':
                return (value ? (format === 'date-time' ? moment.utc(value).format() : value) : '')
              default:
                return (value ? value.toString() : '')
            }
          }
        })
      })
      this.visibleColumns = this.columns.map(column => column.name)
    },
    onCollectionRefreshed () {
      baseCollection.methods.onCollectionRefreshed.call(this)
      // Update pagination for table
      this.pagination.rowsNumber = this.nbTotalItems
    },
    onRequest (props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination
      const geoJson = (_.get(this.items, '[0].type') === 'Feature')
      this.currentPage = page
      this.tableQuery.$sort = { [geoJson ? `properties.${sortBy}` : sortBy]: (descending ? -1 : 1) }
      this.refreshCollection()
      // don't forget to update local pagination object
      this.pagination.page = page
      this.pagination.rowsPerPage = rowsPerPage
      this.pagination.sortBy = sortBy
      this.pagination.descending = descending
    },
    onSelectionChanged (data) {
      if (this.selection === 'single') {
        if (data.added) this.onItemSelected(data.rows[0])
        else this.onItemSelected(null)
      } else {
        if (data.added) this.onItemsSelected(this.selectedItems.concat(data.rows))
        else this.onItemsSelected(this.selectedItems.filter(item => !_.find(data.rows, { _id: item._id })))
      }
    }
  },
  async created () {
    // Whenever the user abilities are updated, update collection as well
    this.$events.on('user-abilities-changed', this.refreshCollection)
    await this.loadSchema(this.service + '.get')
  },
  beforeUnmount () {
    this.$events.off('user-abilities-changed', this.refreshCollection)
  }
}
</script>
