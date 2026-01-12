<template>
  <KTagFilter
    :options="options"
    :selection="tagsFilterSelection"
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
const {
  tagsFilterOptions,
  tagsFilterSelection,
  setTagsFilterSelection
} = useCollectionFilter()

// Computed
const options = computed(() => {
  return _.difference(tagsFilterOptions.value, tagsFilterSelection.value)
})
const computedAlignment = computed(() => {
  if (_.isString(props.alignment)) return props.alignment
  return _.get(props.alignment, Screen.name)
})

// Function
function onSelectionChanged (selection) {
  setTagsFilterSelection(selection)
}
</script>
