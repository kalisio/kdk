<template>
  <div class="row justify-start items-center q-pl-sm q-pr-sm no-wrap">
    <div id="start-date" class="k-datetime text-body2">
      {{ formattedStartDate }}
      <q-tooltip>{{ $t('KAbsoluteTimeRange.PICK_START_DATE_LABEL') }}</q-tooltip>
      <q-popup-proxy ref="popup" transition-show="scale" transition-hide="scale">
        <q-date
          id="start-date-popup"
          v-model="startDate"
          :mask="dateFormat"
          :title="startDate"
          :options="checkStartDate"
          @update:model-value="onTimeRangeChanged"
        />
      </q-popup-proxy>
    </div>
    <div>&nbsp;</div>
    <div id="start-time" class="k-datetime text-body2">
      {{ formattedStartTime }}
      <q-tooltip>{{ $t('KAbsoluteTimeRange.PICK_START_TIME_LABEL') }}</q-tooltip>
      <q-popup-proxy ref="popup" transition-show="scale" transition-hide="scale">
        <q-time
          id="start-time-popup"
          v-model="startTime"
          :mask="hourFormat"
          :options="checkStartTime"
          @update:model-value="onTimeRangeChanged"
        />
      </q-popup-proxy>
    </div>
    <div>&nbsp;-&nbsp;</div>
    <div id="end-date" class="k-datetime text-body2">
      {{ formattedEndDate }}
      <q-tooltip>{{ $t('KAbsoluteTimeRange.PICK_END_DATE_LABEL') }}</q-tooltip>
      <q-popup-proxy ref="popup" transition-show="scale" transition-hide="scale">
        <q-date
          id="end-date-popup"
          v-model="endDate"
          :mask="dateFormat"
          :title="endDate"
          :options="checkEndDate"
          @update:model-value="onTimeRangeChanged"
        />
      </q-popup-proxy>
    </div>
    <div>&nbsp;</div>
    <div id="end-time" class="k-datetime text-body2">
      {{ formattedEndTime }}
      <q-tooltip>{{ $t('KAbsoluteTimeRange.PICK_END_TIME_LABEL') }}</q-tooltip>
      <q-popup-proxy ref="popup" transition-show="scale" transition-hide="scale">
        <q-time
          id="end-time-popup"
          v-model="endTime"
          :mask="hourFormat"
          :options="checkEndTime"
          @update:model-value="onTimeRangeChanged"
        />
      </q-popup-proxy>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { Events } from '../../events'
import { Time } from '../../time'
import moment from 'moment'

// Data
const timeRange = Time.getRange()
const dateFormat = 'DD/MM/YYYY'
const hourFormat = 'HH:mm'
const checkDateFormat = 'YYYY/MM/DD'
const startDate = ref(toQuasarDate(timeRange.start))
const startTime = ref(toQuasarTime(timeRange.start))
const endDate = ref(toQuasarDate(timeRange.end))
const endTime = ref(toQuasarDate(timeRange.end))

// Computed
const start = computed(() => {
  const date = fromQuasarDate(startDate.value, dateFormat)
  const time = fromQuasarTime(startTime.value, hourFormat)
  date.set({ hour: time.hour(), minute: time.minute() })
  return date.utc()
})
const formattedStartDate = computed(() => {
  return Time.format(start.value, 'date.short')
})
const formattedStartTime = computed(() => {
  return Time.format(start.value, 'time.long')
})
const end = computed(() => {
  const date = fromQuasarDate(endDate.value, dateFormat)
  const time = fromQuasarTime(endTime.value, hourFormat)
  date.set({ hour: time.hour(), minute: time.minute() })
  return date.utc()
})
const formattedEndDate = computed(() => {
  return Time.format(end.value, 'date.short')
})
const formattedEndTime = computed(() => {
  return Time.format(end.value, 'time.long')
})

// Functions

// Convert from moment date/time to quasar format in local time zone
function toQuasarDate (date) {
  return Time.convertToLocal(date).format(dateFormat)
}
function toQuasarTime (date) {
  return Time.convertToLocal(date).format(hourFormat)
}
// Convert from quasar format in local time zone to moment date/time
function fromQuasarDate (date, format) {
  return (Time.getFormatTimezone()
    ? moment.tz(date, format, Time.getFormatTimezone())
    : moment(date, format))
}
function fromQuasarTime (time, format) {
  return (Time.getFormatTimezone()
    ? moment.tz(time, format, Time.getFormatTimezone())
    : moment(time, format))
}
function checkStartDate (date) {
  date = fromQuasarDate(date, checkDateFormat)
  const time = fromQuasarTime(startTime.value, hourFormat)
  date.set({ hour: time.hour(), minute: time.minute() })
  return date.utc().isBefore(end.value)
}
function checkStartTime (hour, minute) {
  const date = fromQuasarDate(startDate.value, dateFormat)
  date.set({ hour, minute })
  return date.utc().isBefore(end.value)
}
function checkEndDate (date) {
  date = fromQuasarDate(date, checkDateFormat)
  const time = fromQuasarTime(endTime.value, hourFormat)
  date.set({ hour: time.hour(), minute: time.minute() })
  return date.utc().isAfter(start.value)
}
function checkEndTime (hour, minute) {
  const date = fromQuasarDate(endDate.value, dateFormat)
  date.set({ hour, minute })
  return date.utc().isAfter(start.value)
}
function onTimeRangeChanged () {
  Time.patchRange({ start: start.value, end: end.value })
}
function onTimeRangeUpdated () {
  const { start, end } = Time.getRange()
  startDate.value = toQuasarDate(start)
  startTime.value = toQuasarTime(start)
  endDate.value = toQuasarDate(end)
  endTime.value = toQuasarTime(end)
}

// Hooks
onMounted(() => {
  Events.on('time-range-changed', onTimeRangeUpdated)
})

onBeforeUnmount(() => {
  Events.off('time-range-changed', onTimeRangeUpdated)
})
</script>

<style lang="scss">
  .k-datetime:hover {
    cursor: pointer;
  }
</style>
