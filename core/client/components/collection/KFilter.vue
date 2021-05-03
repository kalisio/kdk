<template>
   <q-select
    ref="select"
    class="q-pl-sm q-pr-sm"
    :style="computedStyle"
    v-model="items"
    :multiple="true"
    hide-dropdown-icon
    use-input
    autocomplete="off"
    clearable
    borderless
    dense
    :options="options"
    @filter="onSearch"
    @input="onSelected">
    <!-- Search icon -->
    <template v-slot:prepend>
      <q-icon class="q-pl-xs" dense name="search" />
    </template>
     <!-- Value display -->
    <template v-slot:selected-item="scope">
      <q-chip
        square
        removable
        @remove="scope.removeAtIndex(scope.index)"
        :tabindex="scope.tabindex"
        color="primary"
        text-color="white">
        <q-icon class="q-pr-sm" :name="getIcon(scope.opt)" />
        {{ getLabel(scope.opt) }}
      </q-chip>
    </template>
    <!-- Options display -->
    <template v-slot:option="scope">
      <q-item
        v-bind="scope.itemProps"
        v-on="scope.itemEvents"
      >
        <q-item-section avatar>
          <q-icon :name="getIcon(scope.opt)" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ getLabel(scope.opt) }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script>
import _ from 'lodash'
import { Filter } from '../../filter'
import { Search } from '../../search'

export default {
  name: 'k-filter',
  props: {
    field: {
      type: String,
      default: 'name'
    },
    services: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    computedStyle () {
      if (this.$q.screen.lt.md) return 'width: 80vw'
      if (this.$q.screen.lt.lg) return 'width: 60vw'
      return 'width: 50vw'
    }
  },
  data () {
    return {
      items: [],
      options: [],
      filter: Filter.get()
    }
  },
  methods: {
    getLabel (item) {
      return _.get(item, item.field)
    },
    getIcon (item) {
      return _.get(item, 'icon.name', _.get(item, 'icon', ''))
    },
    async onSearch (pattern, update, abort) {
      if (pattern.length < 2) {
        this.$store.patch('filter', { pattern: '' })
        abort()
        return
      }
      const results = await Search.query(this.services, pattern)
      update(() => {
        if (results.length > 0) {
          this.options = _.differenceWith(results, this.items, (item1, item2) => {
            return item1.value === item2.value
          })
          this.$refs.select.updateInputValue('')
        } else this.$store.patch('filter', { pattern })
      })
    },
    onSelected (item) {
      this.options = []
      if (!item) this.items = []
      this.$store.patch('filter', { items: this.items })
    }
  },
  created () {
    // Initialize the filter, we keep track of any existing items previously set by another activity
    this.$store.patch('filter', { field: this.field, pattern: '' })
    this.items = Filter.getItems()
  },
  beforeDestroy () {
    this.items = []
    this.options = []
  },
  destroyed () {
    Filter.clear()
  }
}
</script>
