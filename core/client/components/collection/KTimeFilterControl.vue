<template>
  <KAction
    v-if="hasTimeRange"
    id="time-filter-control"
    icon="las la-clock"
    tooltip="KTimeFilterControl.FILTER"
    :handler="showTimeRangeSlider"
  />
</template>

<script setup>
import _ from 'lodash'
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
const timeFilter = CurrentActivityContext.state.timeFilter

// Computed
const min = computed(() => _.get(timeFilter, 'min'))
const max = computed(() => _.get(timeFilter, 'max'))
const hasTimeRange = computed(() => {
  return !_.isEmpty(min.value) && !_.isEmpty(max.value) && min.value !== max.value
})

// Functions
async function showTimeRangeSlider () {
  _.set(timeFilter, 'start', min.value)
  _.set(timeFilter, 'end', max.value)
}
</script>
