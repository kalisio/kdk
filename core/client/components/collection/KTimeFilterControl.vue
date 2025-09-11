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
import { useCollectionFilter } from '../../composables'

// Props
defineProps({
  service: {
    type: String,
    required: true
  }
})

// Data
const { timeFilter, setTimeFilter } = useCollectionFilter()

// Computed
const min = computed(() => _.get(timeFilter.value, 'min'))
const max = computed(() => _.get(timeFilter.value, 'max'))
const hasTimeRange = computed(() => {
  return !_.isEmpty(min.value) && !_.isEmpty(max.value) && min.value !== max.value
})

// Functions
async function showTimeRangeSlider () {
  setTimeFilter(min.value, 'start')
  setTimeFilter(max.value, 'end')
}
</script>
