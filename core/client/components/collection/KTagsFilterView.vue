<template>
  <KTagSelection
    :selection="selection"
    @selection-changed="onSelectionChanged"
  />
</template>

<script setup>
import _ from 'lodash'
import { computed } from 'vue'
import { useCollectionFilter } from '../../composables'
import KTagSelection from '../tags/KTagSelection.vue'

// Data
const { tagsFilter, setTagsFilter } = useCollectionFilter()

// Computed
const selection = computed(() => {
  return _.get(tagsFilter.value, 'selection')
})

// Functions
function onSelectionChanged (selection) {
  setTagsFilter(selection, 'selection')
}
</script>
