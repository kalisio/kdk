<template>
  <KAction
    v-if="hasTimeRange"
    id="time-filter-action"
    icon="las la-clock"
    tooltip="C3XTimeFilterAction.FILTER"
    :handler="showTimeRangeSlider"
  />
</template>

<script setup>
import { computed } from 'vue'
import { useCurrentActivity } from '../../composables'

// Props
defineProps({
  service: {
    type: String,
    default: 'events'
  }
})

// Data
const { CurrentActivityContext } = useCurrentActivity()
const { state } = CurrentActivityContext

// Computed
const hasTimeRange = computed(() => {
  return state.timeFilter && state.timeFilter.min !== state.timeFilter.max
})

// Functions
async function showTimeRangeSlider () {
  Object.assign(state.timeFilter, {
    start: state.timeFilter.min,
    end: state.timeFilter.max
  })
}
</script>
