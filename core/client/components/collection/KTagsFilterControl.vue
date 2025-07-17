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
import { useCurrentActivity, useScreen } from '../../composables'
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
const { CurrentActivityContext } = useCurrentActivity()
const tagsFilter = CurrentActivityContext.state.tagsFilter

// Computed
const selection = computed(() => {
  return _.get(tagsFilter, 'selection', [])
})
const options = computed(() => {
  return _.difference(_.get(tagsFilter, 'options'), selection.value)
})
const computedAlignment = computed(() => {
  if (_.isString(props.alignment)) return props.alignment
  return _.get(props.alignment, Screen.name)
})

// Function
function onSelectionChanged (selection) {
  _.set(tagsFilter, 'selection', selection)
}
</script>
