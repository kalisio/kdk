<template>
   <q-select
    ref="select"
    class="q-pl-sm q-pr-sm"
    v-model="items"
    :multiple="true"
    hide-dropdown-icon
    use-input
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
        removable
        @remove="scope.removeAtIndex(scope.index)"
        :tabindex="scope.tabindex"
        color="primary"
        text-color="white"
        :icon="scope.opt.icon"
        :label="scope.opt.label" />
    </template>
    <!-- Options display -->
    <template v-slot:option="scope">
      <q-item
        v-bind="scope.itemProps"
        v-on="scope.itemEvents"
      >
        <q-item-section v-if="scope.opt.icon" avatar>
          <q-icon :name="scope.opt.icon" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ scope.opt.label }}</q-item-label>
          <q-item-label caption>{{ scope.opt.description }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script>
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
  data () {
    return {
      items: [],
      options: [],
      filter: this.$store.get('filter')
    }
  },
  methods: {
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
      this.$store.patch('filter', { items: _.map(this.items, item => { return item.data }) })
    }
  },
  created () {
    // Initialize the filter, we keep track of any existing items previously set by another activity
    this.$store.patch('filter', { field: this.field, pattern: '' })
  },
  beforeDestroy () {
    // Reset the filter, we keep track of any existing items previously set by another activity
    this.$store.patch('filter', { pattern: '', items: [] })
  }
}
</script>
