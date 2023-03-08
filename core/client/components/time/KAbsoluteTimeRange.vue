<template>
  <div class="row justify-start items-center q-pl-sm q-pr-sm no-wrap">
    <div id="start-date" class="k-datetime text-body2">
      {{ formattedStartDate }}
      <q-tooltip>{{ $t('KAbsoluteTimeRange.PICK_START_DATE_LABEL') }}</q-tooltip>
      <q-popup-proxy ref="popup" transition-show="scale" transition-hide="scale">
        <q-date
          id="start-date-popup"
          v-model="startDate"
          mask="DD/MM/YYYY"
          :title="startDate"
          @input="onTimeRangeChanged"
          :options="checkStartDate" />
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
          mask="HH:mm"
          @input="onTimeRangeChanged"
          :options="checkStartTime" />
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
          mask="DD/MM/YYYY"
          :title="endDate"
          @input="onTimeRangeChanged"
          :options="checkEndDate" />
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
          mask="HH:mm"
          @input="onTimeRangeChanged"
          :options="checkEndTime" />
        </q-popup-proxy>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { Time } from '../../time'

export default {
  name: 'k-absolute-time-range',
  props: {
    dense: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    formattedStartDate () {
      return Time.format(this.range.start, 'date.short')
    },
    startDate: {
      get: function () {
        return Time.convertToLocal(this.range.start).format('DD/MM/YYYY')
      },
      set: function (value) {
        const date = moment(value, 'DD/MM/YYYY').utc()
        this.range = {
          start: this.range.start.set({ year: date.year(), month: date.month(), date: date.date() }),
          end: this.range.end
        }
      }
    },
    formattedStartTime () {
      return Time.format(this.range.start, 'time.long')
    },
    startTime: {
      get: function () {
        return Time.convertToLocal(this.range.start).format('HH:mm')
      },
      set: function (value) {
        const time = moment(value, 'HH:mm').utc()
        this.range = {
          start: this.range.start.set({ hour: time.hour(), minute: time.minute() }),
          end: this.range.end
        }
      }
    },
    formattedEndDate () {
      return Time.format(this.range.end, 'date.short')
    },
    endDate: {
      get: function () {
        return Time.convertToLocal(this.range.end).format('DD/MM/YYYY')
      },
      set: function (value) {
        const date = moment(value, 'DD/MM').utc()
        this.range = {
          start: this.range.start,
          end: this.range.end.set({ month: date.month(), date: date.date() })
        }
      }
    },
    formattedEndTime () {
      return Time.format(this.range.end, 'time.long')
    },
    endTime: {
      get: function () {
        return Time.convertToLocal(this.range.end).format('HH:mm')
      },
      set: function (value) {
        const time = moment(value, 'HH:mm').utc()
        this.range = {
          start: this.range.start,
          end: this.range.end.set({ hour: time.hour(), minute: time.minute() })
        }
      }
    }
  },
  data () {
    return {
      range: Time.getRange()
    }
  },
  methods: {
    checkStartDate (date) {
      const dateToCheck = moment({
        year: date.substring(0, 4),
        month: date.substring(5, 7) - 1,
        date: date.substring(8, 10),
        hour: this.range.start.hour(),
        minute: this.range.start.minute()
      }).utc()
      return dateToCheck.isBefore(this.range.end)
    },
    checkStartTime (hour, minute) {
      const timeToCheck = moment({
        year: this.range.start.year(),
        month: this.range.start.month(),
        date: this.range.start.date(),
        hour: hour,
        minute: minute
      }).utc()
      return timeToCheck.isBefore(this.range.end)
    },
    checkEndDate (date) {
      const dateToCheck = moment({
        year: date.substring(0, 4),
        month: date.substring(5, 7) - 1,
        date: date.substring(8, 10),
        hour: this.range.end.hour(),
        minute: this.range.end.minute()
      }).utc()
      return dateToCheck.isAfter(this.range.start)
    },
    checkEndTime (hour, minute) {
      const timeToCheck = moment({
        year: this.range.end.year(),
        month: this.range.end.month(),
        date: this.range.end.date(),
        hour: hour,
        minute: minute
      }).utc()
      return timeToCheck.isAfter(this.range.start)
    },
    onTimeRangeChanged () {
      Time.patchRange({ start: this.range.start, end: this.range.end })
    }
  }
}
</script>

<style lang="scss">
  .k-datetime:hover {
    cursor: pointer;
  }
</style>
