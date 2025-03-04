<template>
  <KDateTimeRange
    v-model="dateTimeRangeModel"
    :min="min"
    :max="max"
    :dense="dense"
    :disabled="disabled"
  />
</template>

<script setup>
import moment from 'moment'
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { Events } from '../../events'
import { Time } from '../../time'
import KDateTimeRange from './KDateTimeRange.vue'

defineProps({
  min: {
    type: String,
    default: () => null,
    validator: (value) => {
      if (value) return moment(value).isValid()
      return true
    }
  },
  max: {
    type: String,
    default: () => null,
    validator: (value) => {
      if (value) return moment(value).isValid()
      return true
    }
  },
  disabled: {
    type: Boolean,
    default: false
  },
  dense: {
    type: Boolean,
    default: true
  }
})

// Data
const { start, end } = Time.getRange()
const dateTimeRangeModel = ref({
  start: start.toISOString(),
  end: end.toISOString()
})

// Watch
watch(dateTimeRangeModel, (newDateTimeRange, oldDateTimeRange) => {
  Time.patchRange({
    start: moment(newDateTimeRange.start),
    end: moment(newDateTimeRange.end)
  })
})

// Functions
function onTimeRangeUpdated () {
  const { start, end } = Time.getRange()
  dateTimeRangeModel.value = {
    start: start.toISOString(),
    end: end.toISOString()
  }
}

// Hooks
onMounted(() => {
  Events.on('time-range-changed', onTimeRangeUpdated)
})
onBeforeUnmount(() => {
  Events.off('time-range-changed', onTimeRangeUpdated)
})
</script>
