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

<script>
import moment from 'moment'
import { Time } from '../../time'

const dateFormat = 'DD/MM/YYYY'
const hourFormat = 'HH:mm'
const checkDateFormat = 'YYYY/MM/DD'

// Convert from moment date/time to quasar format in local time zone
function toQuasarDate(date) {
  return Time.convertToLocal(date).format(dateFormat)
}
function toQuasarTime(date) {
  return Time.convertToLocal(date).format(hourFormat)
}
// Convert from quasar format in local time zone to moment date/time
function fromQuasarDate(date, format) {
  return (Time.getFormatTimezone() ?
    moment.tz(date, format, Time.getFormatTimezone()) :
    moment(date, format))
}
function fromQuasarTime(time, format) {
  return (Time.getFormatTimezone() ?
    moment.tz(time, format, Time.getFormatTimezone()) :
    moment(time, format))
}

export default {
  name: 'k-absolute-time-range',
  props: {
    dense: {
      type: Boolean,
      default: false
    }
  },
  data () {
    const { start, end } = Time.getRange()
    return {
      dateFormat,
      hourFormat,
      checkDateFormat,
      startDate: toQuasarDate(start),
      startTime: toQuasarTime(start),
      endDate: toQuasarDate(end),
      endTime: toQuasarTime(end)
    }
  },
  computed: {
    start () {
      const date = fromQuasarDate(this.startDate, this.dateFormat)
      const time = fromQuasarTime(this.startTime, this.hourFormat)
      date.set({ hour: time.hour(), minute: time.minute() })
      return date.utc()
    },
    formattedStartDate () {
      return Time.format(this.start, 'date.short')
    },
    formattedStartTime () {
      return Time.format(this.start, 'time.long')
    },
    end () {
      const date = fromQuasarDate(this.endDate, this.dateFormat)
      const time = fromQuasarTime(this.endTime, this.hourFormat)
      date.set({ hour: time.hour(), minute: time.minute() })
      return date.utc()
    },
    formattedEndDate () {
      return Time.format(this.end, 'date.short')
    },
    formattedEndTime () {
      return Time.format(this.end, 'time.long')
    }
  },
  methods: {
    checkStartDate (date) {
      date = fromQuasarDate(date, this.checkDateFormat)
      const time = fromQuasarTime(this.startTime, this.hourFormat)
      date.set({ hour: time.hour(), minute: time.minute() })
      return date.utc().isBefore(this.end)
    },
    checkStartTime (hour, minute) {
      const date = fromQuasarDate(this.startDate, this.dateFormat)
      date.set({ hour, minute })
      return date.utc().isBefore(this.end)
    },
    checkEndDate (date) {
      date = fromQuasarDate(date, this.checkDateFormat)
      const time = fromQuasarTime(this.endTime, this.hourFormat)
      date.set({ hour: time.hour(), minute: time.minute() })
      return date.utc().isAfter(this.start)
    },
    checkEndTime (hour, minute) {
      const date = fromQuasarDate(this.endDate, this.dateFormat)
      date.set({ hour, minute })
      return date.utc().isAfter(this.start)
    },
    onTimeRangeChanged () {
      Time.patchRange({ start: this.start, end: this.end })
    },
    onTimeRangeUpdated () {
      const { start, end } = Time.getRange()
      this.startDate = toQuasarDate(start)
      this.startTime = toQuasarTime(start)
      this.endDate = toQuasarDate(end)
      this.endTime = toQuasarTime(end)
    }
  },
  created () {
    this.$events.on('time-range-changed', () => this.onTimeRangeUpdated())
  },
  beforeUnmount () {
    this.$events.off('time-range-changed', () => this.onTimeRangeUpdated())
  }
}
</script>

<style lang="scss">
  .k-datetime:hover {
    cursor: pointer;
  }
</style>
