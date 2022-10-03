<template>
  <KOptionsChooser
    :options="options"
    :tooltip="tooltip"
    @option-chosen="onOptionChanged"
  />
</template>

<script>
import _ from 'lodash'
import KOptionsChooser from '../input/KOptionsChooser.vue'

export default {
  components: {
    KOptionsChooser
  },
  props: {
    options: {
      type: Array,
      default: () => [
        { icon: 'las la-sort-alpha-down', value: { field: 'name', order: 1 }, default: true },
        { icon: 'las la-sort-alpha-up', value: { field: 'name', order: -1 } }
      ]
    },
    tooltip: {
      type: String,
      default: 'KSorter.SORT'
    }
  },
  methods: {
    onOptionChanged (value) {
      this.$store.patch('sorter', value)
    }
  },
  created () {
    // Initialize the sorter
    let defaultOption = _.find(this.options, { default: true })
    if (!defaultOption) defaultOption = _.head(this.options) || {}
    this.$store.patch('sorter', defaultOption.value)
  },
  beforeUnmount () {
    // Reset the filter, we keep track of any existing items previously set by another activity
    this.$store.patch('sorter', {})
  }
}
</script>
