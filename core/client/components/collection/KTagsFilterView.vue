<template>
  <KTagSelection
    :selection="selection"
    @selection-changed="onSelectionChanged"
  />
</template>

<script setup>
import _ from 'lodash'
import { computed } from 'vue'
import { useCurrentActivity } from '../../composables'
import KTagSelection from '../tags/KTagSelection.vue'

// Data
const { CurrentActivityContext } = useCurrentActivity()
const { state } = CurrentActivityContext

// Computed
const selection = computed(() => {
  return state.tagsFilter.selection
})

// Functions
function onSelectionChanged (selection) {
  _.set(state.tagsFilter, 'selection', selection)
}
</script>
