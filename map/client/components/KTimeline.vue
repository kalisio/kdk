<template>
  <div class="q-pa-xs column k-timeline">
    <!--
      Time controls
     -->
    <div class="full-width row justify-center items-center k-timeline-control">
      <q-btn v-if="$q.screen.gt.xs" :size="$q.screen.gt.xs ? 'md' : 'sm'" dense flat round icon='las la-step-backward' color="secondary" @click="onPreviousStepClicked" />
      <q-btn :size="$q.screen.gt.xs ? 'md' : 'sm'" dense flat round icon='las la-sync' color="secondary" @click="onClickReset" />
      <q-chip dense :label="kActivity.formatTime('date.long', time) + ' ' + kActivity.formatTime('time.long', time)" color="secondary" text-color="white" />
      <q-btn :size="$q.screen.gt.xs ? 'md' : 'sm'" dense flat round :icon='realtimeIcon' color="secondary" @click="onToggleRealtime" />
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
      <div class="row justify-center items-center">
        <template v-for="(step, index) in minutes">
          <q-chip 
            :key="index" 
            dense flat :size="$q.screen.gt.sm ? '12px' : '10px'" 
            :outline="step.outline" 
            :color="step.color" 
            :text-color="step.textColor" 
            :label="step.label" 
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
import { colors, debounce } from 'quasar'

export default {
  name: 'k-timeline',
  inject: ['kActivity'],
  data () {
    const now = moment().utc()
    return {
      time: now,
      begin: moment(now).subtract(15, 'days'),
      end: moment(now).add(15, 'days'),
      step: 10,
    }
  },
  computed: {
    minutes () {
      let minutes = []
      let start = moment(this.time).minute(0)
      let end = moment(this.time).minute(59)
      for (let m = moment(start); m.isBefore(end); m.add(this.step, 'm')) {
        minutes.push({
          label: m.minute().toString().padStart(2,0),
          color: this.time.minute() === m.minute() ? 'secondary' : 'grey-8',
          textColor: this.time.minute() === m.minute() ? 'white' : 'black',
          outline: this.time.minute() === m.minute() ? false : true
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
      let start = moment(this.time).startOf('hour').subtract(size, 'hour')
      let end = moment(this.time).endOf('hour').add(size, 'hour')
      for (let h = moment(start); h.isBefore(end); h.add(1, 'h')) {
        hours.push({
          label: this.kActivity.formatTime('time.short', h),
          class: 'col k-timeline-hour-frame text-caption ' + (this.time.hour() === h.hour() ? 'bg-secondary text-white' : 'bg-grey-4 text-black')
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
      let start = moment(this.time).startOf('day').subtract(size, 'day')
      let end = moment(this.time).endOf('day').add(size, 'day')
      for (let d = moment(start); d.isBefore(end); d.add(1, 'd')) {
        days.push({
          label: this.kActivity.formatTime('date.short', d),
          color: this.time.date() === d.date() ? 'secondary' : this.monthColors[d.month()],
          textColor: this.time.date() === d.date() ? 'white' : 'black',
          outline: this.time.date() === d.date() ? false : true
        })
      }
      return days
    },
    realtimeIcon () {
      return this.kActivity.isTimelineTickingRealtime ? 'las la-stop' : 'las la-play'
    }
  },
  methods: {
    updateTime (time) {
      this.time = time
      this.kActivity.stopTimeline()
      this.kActivity.setCurrentTime(time)
    },
    onStepClicked (index) {
      this.updateTime(moment(this.time).minute(index * this.step))
    },
    onPreviousStepClicked () {
      let minutesToSubtract = this.step
      let remainder = this.time.minute() % this.step
      if (remainder > 0) {
        minutesToSubtract = remainder
      } 
      this.updateTime(moment(this.time).subtract(minutesToSubtract, 'minute'))
    },
    onNextStepClicked () {
      let minutesToAdd = this.step
      let remainder = this.time.minute() % this.step
      if (remainder > 0) {
        minutesToAdd = this.step - remainder
      } 
      this.updateTime(moment(this.time).add(minutesToAdd, 'minute'))
    },
    onHourClicked (index, length) {
      this.updateTime(moment(this.time).add(index - Math.trunc(length / 2), 'hour'))
    },
    onPreviousHourClicked () {
      this.updateTime(moment(this.time).subtract(1, 'hour'))
    },
    onNextHourClicked () {
      this.updateTime(moment(this.time).add(1, 'hour'))
    },
    onDayClicked (index, length) {
      this.updateTime(moment(this.time).add(index - Math.trunc(length / 2), 'day'))
    },
    onPreviousDayClicked () {
      this.updateTime(moment(this.time).subtract(1, 'day'))
    },
    onNextDayClicked () {
      this.updateTime(moment(this.time).add(1, 'day'))
    },
    onToggleRealtime () {
      if (this.kActivity.isTimelineTickingRealtime) this.kActivity.stopTimeline()
      else this.kActivity.startTimeline(true)
    },
    onClickReset () {
      this.kActivity.stopTimeline()
      this.kActivity.resetTimeline()
    },
    onTimeChanged (time) {
      this.updateTime(moment(time))
    },
    onTimelineChanged (timeline) {
      this.begin = moment(timeline.begin)
      this.end = moment(timeline.end)
      this.step = timeline.step.minutes()
      this.time = moment(timeline.currentTime)
    }
  },
  created () {
    this.monthColors = ['red', 'purple', 'indigo', 'green', 'orange', 'green', 'pink', 'deep-purple', 'lime', 'teal', 'light-blue', 'amber']
  },
  mounted () {
    this.kActivity.$on('current-time-changed', this.onTimeChanged)
    this.kActivity.$on('timeline-changed', this.onTimelineChanged)
    // Configure the timeline
    this.onTimelineChanged(this.kActivity.timeline)
  },
  beforeDestroy () {
    this.kActivity.$off('current-time-changed', this.onTimeChanged)
    this.kActivity.$off('timeline-changed', this.onTimelineChanged)
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
