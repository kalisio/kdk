<template>
  <div class="q-pa-xs column k-timeline">
    <!--
      Time controls
     -->
    <div class="full-width row justify-center items-center k-timeline-control">
      <q-btn v-if="$q.screen.gt.xs" :size="$q.screen.gt.xs ? 'md' : 'sm'" dense flat round icon='las la-step-backward' color="secondary" @click="onPreviousStepClicked" />
      <q-btn :size="$q.screen.gt.xs ? 'md' : 'sm'" dense flat round icon='las la-calendar' color="secondary">
        <q-popup-proxy transition-show="scale" transition-hide="scale">
          <q-date v-model="date" :mask="calendarDateMask" today-btn minimal />
        </q-popup-proxy>
      </q-btn>
      <q-chip dense :label="kActivity.formatTime('date.long', time) + ' ' + kActivity.formatTime('time.long', time)" color="secondary" text-color="white" />
      <q-btn :size="$q.screen.gt.xs ? 'md' : 'sm'" dense flat round :icon="timer ? 'las la-stop' : 'las la-play'" color="secondary" @click="onRealtimeClicked" />
      <q-btn v-if="$q.screen.gt.xs" :size="$q.screen.gt.xs ? 'md' : 'sm'" dense flat round icon='las la-step-forward' color="secondary" @click="onNextStepClicked" />
    </div>
    <div v-if="!$q.screen.gt.xs" class="full-width row justify-around q-pt-xs">
      <q-btn :size="$q.screen.gt.xs ? 'md' : 'sm'" dense flat round color="secondary" icon='las la-calendar-minus' @click="onPreviousDayClicked" />
      <q-btn :size="$q.screen.gt.xs ? 'md' : 'sm'" dense flat round color="secondary" icon='las la-minus-square' @click="onPreviousHourClicked" />
      <q-btn :size="$q.screen.gt.xs ? 'md' : 'sm'" dense flat round icon='las la-step-backward' color="secondary" @click="onPreviousStepClicked" />
      <q-btn :size="$q.screen.gt.xs ? 'md' : 'sm'" dense flat round icon='las la-step-forward' color="secondary" @click="onNextStepClicked" />
      <q-btn :size="$q.screen.gt.xs ? 'md' : 'sm'" dense flat round color="secondary" icon='las la-plus-square' @click="onNextHourClicked" />
      <q-btn :size="$q.screen.gt.xs ? 'md' : 'sm'" dense flat round color="secondary" icon='las la-calendar-plus' @click="onNextDayClicked" />
    </div>
    <!--
      Time bars
     -->
    <div v-if="$q.screen.gt.xs" class="q-pt-sm column">
      <div v-if="timeline.step < 60" class="row justify-center items-center">
        <template v-for="(minute, index) in minutes">
          <q-chip 
            :key="index" 
            dense flat :size="$q.screen.gt.sm ? '12px' : '10px'" 
            :outline="minute.outline" 
            :color="minute.color" 
            :text-color="minute.textColor" 
            :label="minute.label" 
            clickable @click="onStepClicked(index)" />
        </template>
      </div>
      <div class="full-width row justify-center items-center">
        <q-btn dense flat round icon='las la-minus-square' color="secondary" @click="onPreviousHourClicked" />
        <template v-for="(hour, index) in hours">
          <div :key="index" :class="hour.class" style="height: 25px"  @click="onHourClicked(index, hours.length)">
            {{hour.label}}
          </div>          
        </template>
        <q-btn flat round icon='las la-plus-square'  color="secondary" @click="onNextHourClicked" />
      </div>
      <div class="row justify-center items-center">
        <q-btn dense flat round icon='las la-calendar-minus' color="secondary" @click="onPreviousDayClicked" />
        <template v-for="(day, index) in days">
          <q-chip 
            :key="index" 
            dense flat square size="md" 
            :outline="day.outline" 
            :color="day.color" 
            :text-color="day.textColor" 
            :label="day.label" 
            clickable @click="onDayClicked(index, days.length)" />
        </template>
        <q-btn dense flat round icon='las la-calendar-plus'  color="secondary" @click="onNextDayClicked" />
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { colors, debounce, date } from 'quasar'

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
      let minutes = []
      let start = moment(this.time).minute(0)
      let end = moment(this.time).minute(59)
      for (let m = moment(start); m.isBefore(end); m.add(this.timeline.step, 'm')) {
        minutes.push({
          label: m.minute().toString().padStart(2,0),
          color: m.isSame(this.time,'minute') ? 'secondary' : 'grey-8',
          textColor: m.isSame(this.time,'minute') ? 'white' : 'black',
          outline: m.isSame(this.time,'minute') ? false : true
        })
      }
      return minutes
    },
    hours () {
      let hours = []
      let size = 0
      if (this.$q.screen.gt.xs) size = 2
      if (this.$q.screen.gt.sm) size = 5
      if (this.$q.screen.gt.md) size = 7
      if (this.$q.screen.gt.lg) size = 10
      let start = moment(this.time).subtract(size, 'hour')
      let end = moment(this.time).add(size + 1, 'hour')
      for (let h = moment(start); h.isBefore(end); h.add(1, 'h')) {
        hours.push({
          label: this.kActivity.formatTime('time.short', h),
          class: 'col k-timeline-hour-frame text-caption ' + (h.isSame(this.time,'hour') ? 'bg-secondary text-white' : 'bg-grey-4 text-black')
        })
      }
      return hours
    },  
    days () {
      let days = []
      let size = 0
      if (this.$q.screen.gt.xs) size = 1
      if (this.$q.screen.gt.sm) size = 3
      if (this.$q.screen.gt.md) size = 5
      if (this.$q.screen.gt.lg) size = 7
      let start = moment(this.time).subtract(size, 'day')
      let end = moment(this.time).add(size + 1, 'day')
      for (let d = moment(start); d.isBefore(end); d.add(1, 'd')) {
        days.push({
          label: this.kActivity.formatTime('date.short', d),
          color: d.isSame(this.time, 'date') ? 'secondary' : this.monthColors[d.month()],
          textColor: d.isSame(this.time, 'date') ? 'white' : 'black',
          outline: d.isSame(this.time, 'date') ? false : true
        })
      }
      return days
    },
    date: {
      get: function () {
        return this.kActivity.currentTimeFormat.utc ? 
          this.time.format(this.calendarDateMask) :
          this.time.local().format(this.calendarDateMask)
      },
      set: function (value) {
        let time = this.kActivity.currentTimeFormat.utc ? moment(value, this.calendarDateMask) : moment(value, this.calendarDateMask).utc()
        time.minute(this.time.minute())
        time.hour(this.time.hour())
        this.setTime(time)
      }
    },
  },
  methods: {
    startTimeLoop () {
      this.setTime(moment.utc())
      this.kActivity.$off('current-time-changed', this.onTimeChanged)
      this.timer = setInterval(() => {
        const now = moment.utc()
        if (!this.time.isSame(now, 'minute')) {
          this.time = now 
          this.kActivity.setCurrentTime(this.time)
        }
      }, 15 * 1000)
    },
    stopTimeLoop () {
      clearInterval(this.timer)
      this.timer = undefined
      this.kActivity.$on('current-time-changed', this.onTimeChanged)
    },
    setTime (time, propagate = true) {
      if (this.timer) this.stopTimeLoop()
      this.time = time
      if (propagate) this.kActivity.setCurrentTime(time)
    },
    onStepClicked (index) {
      this.setTime(moment(this.time).minute(index * this.timeline.step))
    },
    onPreviousStepClicked () {
      let minutesToSubtract = this.timeline.step
      let remainder = this.time.minute() % this.timeline.step
      if (remainder > 0) {
        minutesToSubtract = remainder
      } 
      this.setTime(moment(this.time).subtract(minutesToSubtract, 'minute'))
    },
    onNextStepClicked () {
      let minutesToAdd = this.timeline.step
      let remainder = this.time.minute() % this.timeline.step
      if (remainder > 0) {
        minutesToAdd = this.timeline.step - remainder
      } 
      this.setTime(moment(this.time).add(minutesToAdd, 'minute'))
    },
    onHourClicked (index, length) {
      this.setTime(moment(this.time).add(index - Math.trunc(length / 2), 'hour'))
    },
    onPreviousHourClicked () {
      this.setTime(moment(this.time).subtract(1, 'hour'))
    },
    onNextHourClicked () {
      this.setTime(moment(this.time).add(1, 'hour'))
    },
    onDayClicked (index, length) {
      this.setTime(moment(this.time).add(index - Math.trunc(length / 2), 'day'))
    },
    onPreviousDayClicked () {
      this.setTime(moment(this.time).subtract(1, 'day'))
    },
    onNextDayClicked () {
      this.setTime(moment(this.time).add(1, 'day'))
    },
    onRealtimeClicked () {
      if (this.timer) this.stopTimeLoop()
      else this.startTimeLoop()
    },
    onTimeChanged (time) {
      this.setTime(time, false)
    }
  },
  created () {
    this.monthColors = ['red', 'purple', 'indigo', 'green', 'orange', 'green', 'pink', 'deep-purple', 'lime', 'teal', 'light-blue', 'amber']
  },
  mounted () {
    this.kActivity.$on('current-time-changed', this.onTimeChanged)
    // Set the time
    this.setTime(this.kActivity.currentTime)
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
  }
  .k-timeline:hover {
    border: solid 1px $primary
  }
  .k-timeline-control {
    padding: 5px
    border-bottom: solid 1px lightgrey
  }
  .k-timeline-hour-frame {
    border: solid 1px lightgrey
    padding-top: 2px
    text-align: center
    vertical-align: middle
    user-select: none; /* supported by Chrome and Opera */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
  }
  .k-timeline-hour-frame:hover {
    border-bottom: solid 3px $secondary
    //color: $secondary
  }
</style>
