<template>
  <KTagFilter
    :options="options"
    :selection="selection"
    :alignment="computedAlignment"
    @selection-changed="onSelectionChanged"
  />
</template>

<script setup>
import _ from 'lodash'
import { computed } from 'vue'
import { useScreen, useCollectionFilter } from '../../composables'
import KTagFilter from '../tags/KTagFilter.vue'

// Props
const props = defineProps({
  alignment: {
    type: [String, Object],
    default: 'center'
  }
})

// Data
const { Screen } = useScreen()
const { tagsFilter, setTagsFilter } = useCollectionFilter()

// Computed
const selection = computed(() => {
  return _.get(tagsFilter.value, 'selection', [])
})
const options = computed(() => {
  return _.difference(_.get(tagsFilter.value, 'options'), selection.value)
})
const computedAlignment = computed(() => {
  if (_.isString(props.alignment)) return props.alignment
  return _.get(props.alignment, Screen.name)
})

// Function
function onSelectionChanged (selection) {
  setTagsFilter(selection, 'selection')
}
</script>
