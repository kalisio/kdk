<template>
  <div class="row justify-start items-center q-pl-sm q-pr-sm no-wrap">
    <div class="k-datetime text-body2">
      {{ startDate }}
      <q-tooltip>{{ $t('KAbsoluteTimeRange.PICK_START_DATE_LABEL') }}</q-tooltip>
      <q-popup-proxy ref="popup" transition-show="scale" transition-hide="scale">
        <q-date
          id="start-time-popup"
          v-model="startDate"
          mask="DD/MM"
          :title="startDate"
          :subtitle="$t('KAbsoluteTimeRange.PICK_START_DATE_LABEL')"
          @input="onTimeRangeChanged"
          :options="checkStartDate" />
        </q-popup-proxy>
    </div>
    <div>&nbsp;</div>
    <div class="k-datetime text-body2">
      {{ startTime }}
      <q-tooltip>{{ $t('KAbsoluteTimeRange.PICK_START_TIME_LABEL') }}</q-tooltip>
      <q-popup-proxy ref="popup" transition-show="scale" transition-hide="scale">
        <q-time
          id="start-time-popup"
          v-model="startTime"
          mask="HH:mm"
          :title="startTime"
          :subtitle="$t('KAbsoluteTimeRange.PICK_START_TIME_LABEL')"
          @input="onTimeRangeChanged"
          :options="checkStartTime" />
        </q-popup-proxy>
    </div>
    <div>&nbsp;-&nbsp;</div>
    <div class="k-datetime text-body2">
      {{ endDate }}
      <q-tooltip>{{ $t('KAbsoluteTimeRange.PICK_END_DATE_LABEL') }}</q-tooltip>
      <q-popup-proxy ref="popup" transition-show="scale" transition-hide="scale">
        <q-date
          id="start-time-popup"
          v-model="endDate"
          mask="DD/MM"
          :title="endDate"
          :subtitle="$t('KAbsoluteTimeRange.PICK_END_DATE_LABEL')"
          @input="onTimeRangeChanged"
          :options="checkEndDate" />
        </q-popup-proxy>
    </div>
    <div>&nbsp;</div>
    <div class="k-datetime text-body2">
      {{ endTime }}
      <q-tooltip>{{ $t('KAbsoluteTimeRange.PICK_END_TIME_LABEL') }}</q-tooltip>
      <q-popup-proxy ref="popup" transition-show="scale" transition-hide="scale">
        <q-time
          id="end-time-popup"
          v-model="endTime"
          mask="HH:mm"
          :title="endTime"
          :subtitle="$t('KAbsoluteTimeRange.PICK_END_TIME_LABEL')"
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
    startDate: {
      get: function () {
        return Time.format(this.start, 'date.short')
      },
      set: function (value) {
        const date = moment(value, 'DD/MM')
        this.start.set({ month: date.month(), date: date.date() })
      }
    },
    startTime: {
      get: function () {
        return Time.format(this.start, 'time.long')
      },
      set: function (value) {
        const time = moment(value, 'HH:mm').utc()
        this.start.set({ hour: time.hour(), minute: time.minute() })
      }
    },
    endDate: {
      get: function () {
        return Time.format(this.end, 'date.short')
      },
      set: function (value) {
        const date = moment(value, 'DD/MM')
        this.end.set({ month: date.month(), date: date.date() })
      }
    },
    endTime: {
      get: function () {
        return Time.format(this.end, 'time.long')
      },
      set: function (value) {
        const time = moment(value, 'HH:mm').utc()
        this.end.set({ hour: time.hour(), minute: time.minute() })
      }
    }
  },
  data () {
    return {
      start: Time.getRange().start,
      end: Time.getRange().end
    }
  },
  methods: {
    checkStartDate (date) {
      const dateToCheck = moment({
        year: date.substring(0, 4),
        month: date.substring(5, 7) - 1,
        date: date.substring(8, 10),
        hour: this.start.hour(),
        minute: this.start.minute()
      }).utc()
      return dateToCheck.isBefore(this.end)
    },
    checkStartTime (hour, minute) {
      const timeToCheck = moment({
        year: this.start.year(),
        month: this.start.month(),
        date: this.start.date(),
        hour: hour,
        minute: minute
      }).utc()
      return timeToCheck.isBefore(this.end)
    },
    checkEndDate (date) {
      const dateToCheck = moment({
        year: date.substring(0, 4),
        month: date.substring(5, 7) - 1,
        date: date.substring(8, 10),
        hour: this.end.hour(),
        minute: this.end.minute()
      }).utc()
      return dateToCheck.isAfter(this.start)
    },
    checkEndTime (hour, minute) {
      const timeToCheck = moment({
        year: this.end.year(),
        month: this.end.month(),
        date: this.end.date(),
        hour: hour,
        minute: minute
      }).utc()
      return timeToCheck.isAfter(this.start)
    },
    onTimeRangeChanged () {
      Time.patchRange({ start: this.start, end: this.end })
    }
  }
}
</script>

<style lang="scss">
  .k-datetime:hover {
    cursor: pointer;
  }
</style>
