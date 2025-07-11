<template>
  <KItemsSorter v-bind="$props" @option-changed="onOptionChanged" />
</template>

<script setup>
import _ from 'lodash'
import { onMounted, onBeforeUnmount } from 'vue'
import { Store } from '../../store.js'
import KItemsSorter from './KItemsSorter.vue'

// Props
const props = defineProps({
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
})

// Functions
function onOptionChanged (value) {
  Store.patch('sorter', value)
}

onMounted(() => {
  // Initialize the sorter
  let defaultOption = _.find(props.options, { default: true })
  if (!defaultOption) defaultOption = _.head(props.options) || {}
  Store.patch('sorter', defaultOption.value)
})

onBeforeUnmount(() => {
  // Reset the filter, we keep track of any existing items previously set by another activity
  Store.patch('sorter', {})
})
</script>
