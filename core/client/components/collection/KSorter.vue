<template>
  <k-options-chooser
    :options="options"
    @option-chosen="onOptionChanged" />
</template>

<script>
export default {
  name: 'k-sorter',
  props: {
    options: {
      type: Array,
      default: () => [
        { icon: 'las la-sort-alpha-down', value: { field: 'name', order: 1 }, default: true },
        { icon: 'las la-sort-alpha-up', value: { field: 'name', order: -1 } }
      ]
    }
  },
  methods: {
    onOptionChanged (value) {
      this.$store.patch('sorter', value)
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-options-chooser'] = this.$load('input/KOptionsChooser')
    // Initialize the filter, we keep track of any existing items previously set by another activity
    this.$store.patch('sorter', { $sort: { } })
  },
  beforeDestroy () {
    // Reset the filter, we keep track of any existing items previously set by another activity
    this.$store.patch('sorter', { $sort: { } })
  }
}
</script>
