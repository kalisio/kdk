<template>
  <k-item-chooser
    :multiselect="true"
    :services="services"
    :default-items="filter.items"
    @items-changed="onItemsChanged"
    @pattern-changed="onPatternChanged" />
</template>

<script>
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
      filter: this.$store.get('filter')
    }
  },
  methods: {
    onItemsChanged (items) {
      // Setup the filter, which then automatically updates the query
      this.$store.patch('filter', { items })
    },
    onPatternChanged (pattern) {
      // Setup the filter, which then automatically updates the query
      this.$store.patch('filter', { pattern })
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-item-chooser'] = this.$load('input/KItemChooser')
    // Initialize the filter, we keep track of any existing items previously set by another activity
    this.$store.patch('filter', { field: this.field, pattern: '' })
  },
  beforeDestroy () {
    // Reset the filter, we keep track of any existing items previously set by another activity
    this.$store.patch('filter', { pattern: '' })
  }   
}
</script>
