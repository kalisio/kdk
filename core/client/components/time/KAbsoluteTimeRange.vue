<template>
  <KDateTimeRange
    v-model="dateTimeRangeModel"
    :options="dateTimeRangeOptions"
    :min="props.min"
    :max="props.max"
    :dense="props.dense"
    :disabled="props.disabled"
  />
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import KDateTimeRange from './KDateTimeRange.vue'
import { Events } from '../../events'
import { Time } from '../../time'
import moment from 'moment'

const props = defineProps({
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
const dateTimeRangeOptions = ref({
  separator: '-',
  date: {
    format: 'DD/MM/YYYY'
  }
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
