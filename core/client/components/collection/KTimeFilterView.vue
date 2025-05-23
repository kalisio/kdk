<template>
  <div v-if="hasSelection"
    class="q-px-sm q-py-xs row items-center q-gutter-x-sm no-wrap k-time-filter"
    style="width: 800px; max-width: 90vw"
  >
    <KDateTimeRange
      v-model="timeRangeModel"
      :min="minTimeRange"
      :max="maxTimeRange"
      :date-format="dateFormat"
      :date-class="textClass"
      :time-class="textClass"
      :slider="slider"
      :icon="null"
      dense
      class="col text-caption"
    />
    <KAction
      id="clear-time-range"
      icon="cancel"
      color="grey-7"
      size="12px"
      :handler="onClear"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCurrentActivity, useScreen } from '../../composables'

// Props
defineProps({
  dateFormat: {
    type: String,
    default: null
  }
})

// Data
const { dense } = useScreen()
const { CurrentActivityContext } = useCurrentActivity()
const { state } = CurrentActivityContext

// Computed
const hasSelection = computed(() => {
  return state.timeFilter && startTimeRange.value && endTimeRange.value
})
const startTimeRange = computed(() => {
  return state.timeFilter.start
})
const endTimeRange = computed(() => {
  return state.timeFilter.end
})
const minTimeRange = computed(() => {
  return state.timeFilter.min
})
const maxTimeRange = computed(() => {
  return state.timeFilter.max
})
const timeRangeModel = computed({
  get: function () {
    return {
      start: startTimeRange.value,
      end: endTimeRange.value
    }
  },
  set: function (value) {
    Object.assign(state.timeFilter, {
      start: value.start,
      end: value.end
    })
  }
})
const textClass = computed(() => {
  return dense.value ? 'text-caption' : 'text-body2 text-weight-regular'
})
const slider = computed(() => {
  return {
    stacked: dense.value,
    color: 'grey-9',
    thumbSize: dense.value ? '12px' : '16px'
  }
})

// Functions
function onClear () {
  Object.assign(state.timeFilter, {
    start: null,
    end: null
  })
}
</script>

<style lang="scss" scoped>
.k-time-filter {
  padding-left: 8px;
  padding-right: 4px;
  border-radius: 24px;
  border: 1px solid lightgrey;
  background-color: #dedede
}
</style>
