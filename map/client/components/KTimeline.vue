<template>
  <div id="timeline" class="q-pa-xs column k-timeline">
    <!--
      Time controls
     -->
    <div class="full-width row justify-center items-center k-timeline-control">
      <q-btn id="timeline-backward" v-if="$q.screen.gt.xs" dense flat round icon='las la-step-backward' size="md" color="primary" @click="onPreviousStepClicked">
        <q-tooltip>{{$t('KTimeline.PREVIOUS_STEP')}}</q-tooltip>
      </q-btn>
      <q-btn id="timeline-date" dense flat round icon='las la-calendar' size="md" color="primary">
        <q-tooltip>{{$t('KTimeline.SET_DATE')}}</q-tooltip>
        <q-popup-proxy transition-show="scale" transition-hide="scale">
          <q-date v-model="date" :mask="calendarDateMask" today-btn minimal />
        </q-popup-proxy>
      </q-btn>
      <q-chip :label="formatTime(time, 'date.long') + ' ' + formatTime(time, 'time.long')" color="primary" text-color="white" :dense="$q.screen.lt.sm" />
      <q-btn id="timeline-now" dense flat round icon="las la-clock" size="md" color="primary" @click="onNowClicked">
        <q-tooltip>{{$t('KTimeline.SET_NOW')}}</q-tooltip>
        <q-badge v-if="timer !== undefined" floating transparent color="green">
          <q-icon name="las la-play" size="10px" color="white'" />
        </q-badge>
      </q-btn>
      <q-btn v-if="$q.screen.gt.xs" id="timeline-forward" dense flat round icon='las la-step-forward' size="md" color="primary" @click="onNextStepClicked">
        <q-tooltip>{{$t('KTimeline.NEXT_STEP')}}</q-tooltip>
      </q-btn>
    </div>
    <div v-if="!$q.screen.gt.xs" class="full-width row justify-around q-pt-xs">
      <k-panel id="timeline-actions" :content="actions" mode="mobile" color="primary" />
    </div>
    <!--
      Time bars
     -->
    <div v-if="$q.screen.gt.xs" class="q-pt-sm column">
      <div v-if="minutes.length > 0" class="row justify-center items-center">
        <template v-for="(minute, index) in minutes">
          <q-chip
            :id="'timeline-minutes-' + index"
            :key="index"
            dense flat outline :size="$q.screen.gt.sm ? '12px' : '10px'"
            :color="minute.color"
            :text-color="minute.textColor"
            :label="minute.label"
            clickable @click="onMinutesClicked(index)" />
        </template>
      </div>
      <div v-if="hours.length > 0" class="full-width row justify-center items-center">
        <q-btn id="timeline-previous-hour" dense flat round icon='las la-angle-left' color="primary" @click="onPreviousHourClicked">
          <q-tooltip>{{$t('KTimeline.PREVIOUS_HOUR')}}</q-tooltip>
        </q-btn>
        <template v-for="(hour, index) in hours">
          <div :id="'timeline-hours-' + index" :key="index" :class="hour.class"
            style="height: 25px"  @click="onHourClicked(index, hours.length)">
            {{hour.label}}
          </div>
        </template>
        <q-btn id="timeline-next-hour" flat round icon='las la-angle-right'  color="primary" @click="onNextHourClicked">
          <q-tooltip>{{$t('KTimeline.NEXT_HOUR')}}</q-tooltip>
        </q-btn>
      </div>
      <div class="row justify-center items-center">
        <q-btn id="timeline-previous-day" dense flat round icon='las la-calendar-minus' color="primary" @click="onPreviousDayClicked">
          <q-tooltip>{{$t('KTimeline.PREVIOUS_DAY')}}</q-tooltip>
        </q-btn>
        <template v-for="(day, index) in days">
          <q-chip
            :id="'timeline-days-' + index"
            :key="index"
            dense flat square outline size="md"
            :color="day.color"
            :text-color="day.textColor"
            :label="day.label"
            clickable @click="onDayClicked(index, days.length)" />
        </template>
        <q-btn id="timeline-next-day" dense flat round icon='las la-calendar-plus' color="primary" @click="onNextDayClicked">
          <q-tooltip>{{$t('KTimeline.NEXT_DAY')}}</q-tooltip>
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script>
import logger from 'loglevel'
import moment from 'moment'
import { Time } from '../../../core/client/time'

export default {
  name: 'k-timeline',
  inject: ['kActivity'],
  data () {
    return {
      timer: undefined,
      time: moment.utc(),
      calendarDateMask: 'YYYY-MM-DD',
      // Make this reactive
      timeSettings: Time.get()
    }
  },
  computed: {
    step () {
      // For now we do not handle step > 60 minutes
      return Math.min(this.timeSettings.step, 60)
    },
    minutes () {
      const minutes = []
      if (this.step < 60) {
        const start = moment.utc(this.time).minute(0)
        const end = moment.utc(this.time).minute(59)
        for (let m = moment.utc(start); m.isBefore(end); m.add(this.step, 'm')) {
          minutes.push({
            label: m.minute().toString().padStart(2, 0),
            color: m.isSame(this.time, 'minute') ? 'primary' : 'grey-7',
            textColor: m.isSame(this.time, 'minute') ? 'white' : 'black'
          })
        }
      }
      return minutes
    },
    hours () {
      const hours = []
      let size = 0
      if (this.$q.screen.gt.xs) size = 2
      if (this.$q.screen.gt.sm) size = 5
      if (this.$q.screen.gt.md) size = 8
      if (this.$q.screen.gt.lg) size = 10
      const start = moment.utc(this.time).subtract(size, 'hour')
      const end = moment.utc(this.time).add((size + 1), 'hour')
      for (let h = moment.utc(start); h.isBefore(end); h.add(1, 'h')) {
        hours.push({
          label: Time.format(h, 'time.short'),
          class: 'col k-timeline-hour-frame text-caption ' + (h.isSame(this.time, 'hour') ? 'k-timeline-hour-selected' : '')
        })
      }
      return hours
    },
    days () {
      const days = []
      let size = 0
      if (this.$q.screen.gt.xs) size = 1
      if (this.$q.screen.gt.sm) size = 3
      if (this.$q.screen.gt.md) size = 5
      if (this.$q.screen.gt.lg) size = 7
      const start = moment.utc(this.time).subtract(size, 'day')
      const end = moment.utc(this.time).add(size + 1, 'day')
      for (let d = moment.utc(start); d.isBefore(end); d.add(1, 'd')) {
        days.push({
          label: Time.format(d, 'date.short'),
          color: d.isSame(this.time, 'date') ? 'primary' : this.monthColors[d.month()],
          textColor: d.isSame(this.time, 'date') ? 'white' : 'black'
        })
      }
      return days
    },
    date: {
      get: function () {
        // Assume locale if timezone not provided
        return Time.getFormatTimezone()
          ? moment(this.time).tz(Time.getFormatTimezone()).format(this.calendarDateMask)
          : moment(this.time).local().format(this.calendarDateMask)
      },
      set: function (value) {
        let time
        // Assume locale if timezone not provided
        if (Time.getFormatTimezone()) {
          time = moment.tz(value, this.calendarDateMask, this.getFormatTimezone())
        } else {
          time = moment(value, this.calendarDateMask)
        }
        time.hour(this.time.hour())
        time.minute(this.time.minute())
        this.setTime(moment.utc(time))
      }
    }
  },
  methods: {
    formatTime (time, format) {
      return Time.format(time, format)
    },
    startTimeLoop () {
      this.setTime(moment.utc())
      this.timer = setInterval(() => {
        this.time = moment.utc()
        this.$events.$off('time-current-time-changed', this.onTimeChanged)
        Time.setCurrentTime(this.time)
        this.$events.$on('time-current-time-changed', this.onTimeChanged)
      }, 1000 * this.timeSettings.interval)
    },
    stopTimeLoop () {
      clearInterval(this.timer)
      this.timer = undefined
    },
    setTime (time, propagate = true) {
      if (!time.isValid()) {
        logger.error('the provided time is invalid')
        return
      }
      if (time.utcOffset() > 0) {
        logger.error('the provided time should be in UTC')
        return
      }
      if (this.timer) this.stopTimeLoop()
      this.time = time.clone()
      this.$events.$off('time-current-time-changed', this.onTimeChanged)
      if (propagate) Time.setCurrentTime(moment.utc(time))
      this.$events.$on('time-current-time-changed', this.onTimeChanged)
    },
    onPreviousStepClicked () {
      let minutesToSubtract = this.step
      const remainder = (this.time.minute() + this.time.hour() * 60) % this.step
      if (remainder > 0) {
        minutesToSubtract = remainder
      }
      this.setTime(this.time.subtract(minutesToSubtract, 'minute'))
    },
    onNextStepClicked () {
      let minutesToAdd = this.step
      const remainder = (this.time.minute() + this.time.hour() * 60) % this.step
      if (remainder > 0) {
        minutesToAdd = this.step - remainder
      }
      this.setTime(this.time.add(minutesToAdd, 'minute'))
    },
    onMinutesClicked (index) {
      this.setTime(this.time.minute(index * this.step))
    },
    onHourClicked (index, length) {
      this.setTime(this.time.add((index - Math.trunc(length / 2)), 'hour'))
    },
    onPreviousHourClicked () {
      this.setTime(this.time.subtract(1, 'hour'))
    },
    onNextHourClicked () {
      this.setTime(this.time.add(1, 'hour'))
    },
    onDayClicked (index, length) {
      this.setTime(this.time.add((index - Math.trunc(length / 2)), 'day'))
    },
    onPreviousDayClicked () {
      this.setTime(this.time.subtract(1, 'day'))
    },
    onNextDayClicked () {
      this.setTime(this.time.add(1, 'day'))
    },
    onNowClicked () {
      this.startTimeLoop()
    },
    onTimeChanged (time) {
      // When updating settings the root time object is sent instead of just the current time
      this.setTime(time.currentTime || time, false)
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-panel'] = this.$load('frame/KPanel')
    // Define the colors assgigned to the months
    this.monthColors = ['red', 'purple', 'indigo', 'green', 'orange', 'green', 'pink', 'deep-purple', 'lime', 'teal', 'light-blue', 'amber']
    // Define the actions
    this.actions = {
      mobile: [
        { id: 'previous-day', icon: 'las la-calendar-minus', tooltip: this.$t('KTimeline.PREVIOUS_DAY'), handler: this.onPreviousDayClicked },
        { id: 'previous-hour', icon: 'las la-angle-left', tooltip: this.$t('KTimeline.PREVIOUS_HOUR'), handler: this.onPreviousHourClicked },
        { id: 'previous-step', icon: 'las la-step-backward', tooltip: this.$t('KTimeline.PREVIOUS_STEP'), handler: this.onPreviousStepClicked },
        { id: 'next-step', icon: 'las la-step-forward', tooltip: this.$t('KTimeline.NEXT_STEP'), handler: this.onNextStepClicked },
        { id: 'next-hour', icon: 'las la-angle-right', tooltip: this.$t('KTimeline.NEXT_HOUR'), handler: this.onNextHourClicked },
        { id: 'next-day', icon: 'las la-calendar-plus', tooltip: this.$t('KTimeline.NEXT_DAY'), handler: this.onNextDayClicked }
      ]
    }
  },
  mounted () {
    this.$events.$on('time-current-time-changed', this.onTimeChanged)
    // Set the time
    this.setTime(Time.getCurrentTime(), false)
  },
  beforeDestroy () {
    this.$events.$off('time-current-time-changed', this.onTimeChanged)
  }
}
</script>

<style lang="scss">
  .k-timeline {
    background: #ffffff;
    border: solid 1px lightgrey;
    border-radius: 5px;
    width: 60vw;
  }
  .k-timeline:hover {
    border: solid 1px $primary;
    cursor: mouse;
  }
  .k-timeline-control {
    padding: 5px;
    border-bottom: solid 1px lightgrey;
  }
  .k-timeline-hour-frame {
    border-bottom: solid 5px $grey-5;
    border-left: solid 1px white;
    border-right: solid 1px white;
    text-align: center;
    vertical-align: middle;
    user-select: none; /* supported by Chrome and Opera */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
  }
  .k-timeline-hour-selected {
    border-bottom: solid 5px $primary;
  }
  .k-timeline-hour-frame:hover {
    border-bottom: solid 5px $primary;
  }
</style>
