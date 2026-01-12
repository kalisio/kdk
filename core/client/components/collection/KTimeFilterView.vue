<template>
  <div v-if="hasTimeFilterRange && hasTimeFilterSelection"
    class="row items-center q-gutter-x-sm no-wrap k-time-filter"
    style="width: 800px; max-width: 90vw"
  >
    <KDateTimeRange
      v-model="selectionModel"
      :min="min"
      :max="max"
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
import _ from 'lodash'
import { computed } from 'vue'
import { useScreen, useCollectionFilter } from '../../composables'

// Props
defineProps({
  dateFormat: {
    type: String,
    default: null
  }
})

// Data
const { dense } = useScreen()
const {
  timeFilterRange,
  timeFilterSelection,
  hasTimeFilterRange,
  hasTimeFilterSelection,
  setTimeFilterSelection,
  clearTimeFilterSelection
} = useCollectionFilter()

// Computed
const min = computed(() => _.get(timeFilterRange.value, 'min'))
const max = computed(() => _.get(timeFilterRange.value, 'max'))
const start = computed(() => _.get(timeFilterSelection.value, 'start'))
const end = computed(() => _.get(timeFilterSelection.value, 'end'))
const selectionModel = computed({
  get: function () {
    return {
      start: start.value,
      end: end.value
    }
  },
  set: function (value) {
    setTimeFilterSelection({ start: value.start, end: value.end })
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
  clearTimeFilterSelection()
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
