<template>
  <div class="q-pa-xs" :style="innerStyle">
    <!--
      Input area
     -->
    <q-input
      :label="pattern ? undefined: $tie(label)"
      v-model="pattern"
      clearable
      borderless
      dense
      debounce="500"
      @update:model-value="onSearch"
    >
      <template v-slot:before>
        <div class="row">
          <q-icon class="q-pl-xs" dense name="search" />
          <template v-for="item in items" :key="item.name">
            <q-chip
              square
              dense
              removable
              color="primary"
              text-color="white"
              size="md"
              @remove="onItemRemoved(item._id)"
            >
              <q-icon v-if="getItemIcon(item)" class="q-pr-sm" :name="getItemIcon(item)" />
              {{ getItemLabel(item) }}
            </q-chip>
          </template>
        </div>
      </template>
    </q-input>
    <!--
      Options menu
     -->
    <q-menu
      v-if="options.length > 0"
      no-focus
      no-refocus
      v-model="hasOptions"
    >
      <q-list style="min-width: 100px">
        <template v-for="option in options" :key="option.name">
          <q-item
            clickable
            @click="onItemSelected(option)"
            v-close-popup>
            <q-item-section v-if="getItemIcon(option)" avatar>
              <q-icon :name="getItemIcon(option)" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ getItemLabel(option) }}</q-item-label>
              <q-item-label caption>{{ getItemDescription(option) }}</q-item-label>
            </q-item-section>
        </q-item>
        </template>
      </q-list>
    </q-menu>
  </div>
</template>

<script>
import _ from 'lodash'
import { Filter } from '../../filter'
import { Search } from '../../search'

export default {
  props: {
    label: {
      type: String,
      default: 'KFilter.SEARCH_LABEL'
    },
    // TODO: keep this props for backward compatibility
    field: {
      type: String,
      default: 'name'
    },
    fields: {
      type: [String, Array],
      default: 'name'
    },
    description: {
      type: String,
      default: 'description'
    },
    services: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    innerStyle () {
      if (this.$q.screen.lt.md) return 'width: 80vw'
      if (this.$q.screen.lt.lg) return 'width: 60vw'
      return 'width: 50vw'
    },
    hasOptions: {
      get: function () {
        return this.options.length > 0
      },
      set: function (value) {
        if (!value) this.options = []
      }
    }
  },
  data () {
    return {
      pattern: Filter.getPattern(),
      items: Filter.getItems(),
      options: []
    }
  },
  methods: {
    getItemLabel (item) {
      return _.get(item, item.field)
    },
    getItemDescription (item) {
      return _.get(item, this.description)
    },
    getItemIcon (item) {
      return _.get(item, 'icon.name', _.get(item, 'icon'))
    },
    onItemSelected (item) {
      this.items.push(item)
      this.pattern = ''
      this.$store.patch('filter', { items: this.items, pattern: this.pattern })
    },
    onItemRemoved (itemId) {
      this.items = _.filter(this.items, item => { return item._id !== itemId })
      this.$store.patch('filter', { items: this.items, pattern: this.pattern })
    },
    async onSearch (pattern) {
      // take about a null pattern received when clearing the input
      if (_.isNull(pattern)) pattern = ''
      // update the pattern
      this.pattern = pattern
      this.$store.patch('filter', { pattern: this.pattern })
      // run the search if the pattern is not empty
      if (!_.isEmpty(pattern)) {
        const results = await Search.query(this.services, pattern)
        if (results.length > 0) {
          this.options = _.differenceWith(results, this.items, (item1, item2) => {
            return item1._id === item2._id
          })
        }
      }
    }
  },
  created () {
    // Initialize the filter, we keep track of any existing items previously set by another activity
    this.$store.patch('filter', { fields: this.fields || this.field, pattern: '' })
  },
  beforeUnmount () {
    this.items = []
    this.options = []
  },
  unmounted () {
    Filter.clear()
  }
}
</script>
