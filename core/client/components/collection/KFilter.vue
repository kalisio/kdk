<template>
  <k-item-chooser
    :multiselect="true"
    :services="services"
    :default-items="items"
    @changed="onItemsChanged" />
</template>

<script>
import { Events } from '../../events'

export default {
  name: 'k-search',
  props: {
    field: {
      type: String,
      default: 'name'
    },
    services: {
      type: Array,
      default: () => []
    },
    items: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    onItemsChanged (items, pattern) {
      const query = {}
      // Handle the pattern
      if (pattern !== '') {
        query[this.field] = { $search: pattern }
      }
      // Handle the selection
      items.forEach(item => {
        // We must have only one item per service
        const queryPath = item.service + '.' + item.field
        query[queryPath] = item[item.field]
      })
      this.$emit('filter-changed', query)
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-item-chooser'] = this.$load('input/KItemChooser')
  }
}
</script>
