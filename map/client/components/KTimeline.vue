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
      <q-chip :label="kActivity.formatTime('date.long', time) + ' ' + kActivity.formatTime('time.long', time)" color="primary" text-color="white" :dense="$q.screen.lt.sm" />
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
      <k-tool-bar :actions="getActions('mobile')" color="primary" dense />
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
        <q-btn id="timeline-next-day" dense flat round icon='las la-calendar-plus'  color="primary" @click="onNextDayClicked">
          <q-tooltip>{{$t('KTimeline.NEXT_DAY')}}</q-tooltip>
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import logger from 'loglevel'
import moment from 'moment'

export default {
  name: 'k-timeline',
  inject: ['kActivity'],
  data () {
    return {
      timeline: this.$store.get('timeline'),
      timer: undefined,
      time: moment.utc(),
      calendarDateMask: 'YYYY-MM-DD'
    }
  },
  computed: {
    minutes () {
      const minutes = []
      const step = this.getStep()
      if (step < 60) {
        const start = moment.utc(this.time).minute(0)
        const end = moment.utc(this.time).minute(59)
        for (let m = moment.utc(start); m.isBefore(end); m.add(step, 'm')) {
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
          label: this.kActivity.formatTime('time.short', h),
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
          label: this.kActivity.formatTime('date.short', d),
          color: d.isSame(this.time, 'date') ? 'primary' : this.monthColors[d.month()],
          textColor: d.isSame(this.time, 'date') ? 'white' : 'black'
        })
      }
      return days
    },
    date: {
      get: function () {
        return this.kActivity.currentTimeFormat.utc
          ? this.time.format(this.calendarDateMask)
          : moment(this.time).local().format(this.calendarDateMask)
      },
      set: function (value) {
        let time
        if (this.kActivity.currentTimeFormat.utc) {
          time = moment.utc(value, this.calendarDateMask)
          time.hour(this.time.hour())
          time.minute(this.time.minute())
        } else {
          time = moment(value, this.calendarDateMask)
          const localTime = moment(this.time.valueOf())
          time.hour(localTime.hour())
          time.minute(localTime.minute())
          time = moment.utc(time)
        }
        this.setTime(time)
      }
    }
  },
  methods: {
    getStep () {
      // For now we do not handle step > 60 minutes
      return Math.min(this.timeline.step, 60)
    },
    getActions (scope) {
      return _.get(this.actions, scope)
    },
    startTimeLoop () {
      this.setTime(moment.utc())
      this.timer = setInterval(() => {
        const now = moment.utc()
        if (!this.time.isSame(now, 'minute')) {
          this.time = now
          this.kActivity.$off('current-time-changed', this.onTimeChanged)
          this.kActivity.setCurrentTime(this.time)
          this.kActivity.$on('current-time-changed', this.onTimeChanged)
        }
      }, 15 * 1000)
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
      this.kActivity.$off('current-time-changed', this.onTimeChanged)
      if (propagate) this.kActivity.setCurrentTime(moment.utc(time))
      this.kActivity.$on('current-time-changed', this.onTimeChanged)
    },
    onPreviousStepClicked () {
      let minutesToSubtract = this.getStep()
      const remainder = (this.time.minute() + this.time.hour() * 60) % this.getStep()
      if (remainder > 0) {
        minutesToSubtract = remainder
      }
      this.setTime(this.time.subtract(minutesToSubtract, 'minute'))
    },
    onNextStepClicked () {
      let minutesToAdd = this.getStep()
      const remainder = (this.time.minute() + this.time.hour() * 60) % this.getStep()
      if (remainder > 0) {
        minutesToAdd = this.getStep() - remainder
      }
      this.setTime(this.time.add(minutesToAdd, 'minute'))
    },
    onMinutesClicked (index) {
      this.setTime(this.time.minute(index * this.getStep()))
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
      this.setTime(time, false)
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-tool-bar'] = this.$load('layout/KToolBar')
    // Define the colors assgigned to the months
    this.monthColors = ['red', 'purple', 'indigo', 'green', 'orange', 'green', 'pink', 'deep-purple', 'lime', 'teal', 'light-blue', 'amber']
    // Define the actions
    this.actions = {
      mobile: [
        { name: 'previousDay', icon: 'las la-calendar-minus', label: this.$t('KTimeline.PREVIOUS_DAY'), handler: this.onPreviousDayClicked },
        { name: 'previousHour', icon: 'las la-angle-left', label: this.$t('KTimeline.PREVIOUS_HOUR'), handler: this.onPreviousHourClicked },
        { name: 'previousStep', icon: 'las la-step-backward', label: this.$t('KTimeline.PREVIOUS_STEP'), handler: this.onPreviousStepClicked },
        { name: 'nextStep', icon: 'las la-step-forward', label: this.$t('KTimeline.NEXT_STEP'), handler: this.onNextStepClicked },
        { name: 'nextHour', icon: 'las la-angle-right', label: this.$t('KTimeline.NEXT_HOUR'), handler: this.onNectHourClicked },
        { name: 'nextDay', icon: 'las la-calendar-plus', label: this.$t('KTimeline.NEXT_DAY'), handler: this.onNextDayClicked }
      ]
    }
  },
  mounted () {
    this.kActivity.$on('current-time-changed', this.onTimeChanged)
    // Set the time
    this.setTime(this.kActivity.currentTime, false)
  },
  beforeDestroy () {
    this.kActivity.$off('current-time-changed', this.onTimeChanged)
  }
}
</script>

<style lang="stylus">
  .k-timeline {
    background: #ffffff
    border: solid 1px lightgrey
    border-radius: 5px
    width: 60vw
  }
  .k-timeline:hover {
    border: solid 1px $primary
    cursor: mouse
  }
  .k-timeline-control {
    padding: 5px
    border-bottom: solid 1px lightgrey
  }
  .k-timeline-hour-frame {
    border-bottom: solid 5px $grey-5
    border-left: solid 1px white
    border-right: solid 1px white
    text-align: center
    vertical-align: middle
    user-select: none; /* supported by Chrome and Opera */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
  }
  .k-timeline-hour-selected {
    border-bottom: solid 5px $primary
  }
  .k-timeline-hour-frame:hover {
    border-bottom: solid 5px $primary
    //color: $primary
  }
</style>
