<template>
  <div class="q-pa-md column k-timeline">
    <!--
      Hour controls
     -->
    <div class="full-width row justify-center items-center">
      <q-btn dense flat round icon='las la-step-backward' color="secondary" @click="onPreviousStepClicked" />
      <q-btn dense flat round icon='las la-sync' color="secondary" @click="onClickReset" />
      <q-chip :label="kActivity.formatTime('date.long', time) + ' ' + kActivity.formatTime('time.long', time)" color="secondary" text-color="white" />
      <q-btn dense flat round :icon='realtimeIcon' color="secondary" @click="onToggleRealtime" />
      <q-btn dense flat round icon='las la-step-forward' color="secondary" @click="onNextStepClicked" />
    </div>
    <!--
      Hours bar
     -->
    <div class="full-width row items-center" @mouseover="stepsBarIsVisible = true" @mouseleave="stepsBarIsVisible = false">
      <div class="col-xs-2 col-sm-1 row justify-center">
        <q-btn flat round icon='las la-angle-left' color="secondary" @click="onPreviousHourClicked" />
      </div>
      <div class="col column">
        <transition appear enter-active-class="animated zoomIn" leave-active-class="animated zoomOut">
          <div v-if="stepsBarIsVisible" class="row justify-center q-ma-xs">
            <template v-for="(step, index) in steps">
              <q-chip :key="index" 
                dense flat size="md" 
                :outline="step.outline" 
                :color="step.color" 
                :text-color="step.textColor" 
                :label="step.label" 
                clickable @click="onStepClicked(index)" />
            </template>
          </div>
        </transition>
        <div class="row full-width">
          <template v-for="(hour, index) in hours">
            <div :key="index" :class="hour.class" style="height: 25px"  @click="onHourClicked(index, hours.length)">
              {{hour.label}}
            </div>
          </template>
        </div>
      </div>
      <div class="col-xs-2 col-sm-1 row justify-center">
        <q-btn flat round icon='las la-angle-right'  color="secondary" @click="onNextHourClicked" />
      </div>
    </div>
    <!--
      Days bar
     -->
    <div class="full-width row items-center" @mouseover="daysBarIsVisible = true" @mouseleave="daysBarIsVisible = false">
      <div class="col-xs-2 col-sm-1 row justify-center">
        <q-btn v-if="daysBarIsVisible" flat round icon='las la-angle-left' color="secondary" @click="onPreviousDayClicked" />
      </div>
      <div class="col row justify-center k-timeline-days-bar">
        <template v-for="(day, index) in days">
          <transition :key="index" appear enter-active-class="animated zoomIn" leave-active-class="animated zoomOut">
            <div v-if="daysBarIsVisible"   :class="day.class" style="height: 25px"  @click="onDayClicked(index, days.length)">
              {{day.label}}
            </div>
            <div v-else :key="index" :class="day.class" style="height: 8px" />
          </transition>
        </template>
      </div>
      <div class="col-xs-2 col-sm-1 row justify-center">
        <q-btn v-if="daysBarIsVisible" flat round icon='las la-angle-right'  color="secondary" @click="onNextDayClicked" />
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { colors } from 'quasar'

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
      daysBarIsVisible: false,
      stepsBarIsVisible: false
    }
  },
  computed: {
    steps () {
      let steps = []
      for (let s = 0; s < 60; s += this.step) {
        let m = this.time.minute()
        steps.push({
          label: this.kActivity.formatTime('time.short', this.time) + s.toString().padStart(2,0),
          color: m === s ? 'secondary' : 'grey-8',
          textColor: m === s ? 'white' : 'black',
          outline: m === s ? false : true
        })
      }
      return steps
    },
    hours () {
      let hours = []
      let size = 0
      if (this.$q.screen.gt.xs) size = 1
      if (this.$q.screen.gt.sm) size = 3
      if (this.$q.screen.gt.md) size = 5
      if (this.$q.screen.gt.lg) size = 7
      let start = moment(this.time).startOf('hour').subtract(size, 'hour')
      let end = moment(this.time).endOf('hour').add(size, 'hour')
      for (let h = moment(start); h.isBefore(end); h.add(1, 'hour')) {
        hours.push({
          label: this.kActivity.formatTime('time.short', h),
          class: 'col k-timeline-hour-frame text-caption ' + (this.time.hour() === h.hour() ? 'bg-secondary text-white' : 'bg-white text-black')
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
      let start = moment(this.time).startOf('day')
      let end = moment(this.time).endOf('day')
      if (size > 0) {
        start.subtract(size, 'day')
        end.add(size, 'day')
      }
      for (let d = moment(start); d.isBefore(end); d.add(1, 'day')) {
        days.push({
          label: this.kActivity.formatTime('date.short', d),
          class: 'col k-timeline-day-frame text-caption ' + (this.time.date() === d.date() ? 'bg-secondary text-white' : 'bg-' + this.monthColors[d.month()] +'-2 text-black')
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
      console.log(time)
      this.updateTime(moment(time))
    },
    onTimelineChanged (timeline) {
      onsole.log(timeline)
      this.begin = moment(timeline.begin)
      this.end = moment(timeline.end)
      this.step = timeline.step.asMilliseconds() / 1000
      this.time = moment(timeline.currentTime)
    }
  },
  created () {
    this.monthColors = ['red', 'purple', 'indigo', 'blue', 'cyan', 'green', 'pink', 'deep-purple', 'light-blue', 'teal', 'lime', 'amber']
  },
  mounted () {
    this.kActivity.$on('current-time-changed', this.onTimeChanged)
    this.kActivity.$on('timeline-changed', this.onTimelineChanged)
    this.updateTime(this.kActivity.currentTime)
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
  .k-timeline-step-frame, .k-timeline-hour-frame, .k-timeline-day-frame {
    padding-top: 2px
    text-align: center
    vertical-align: middle
    user-select: none; /* supported by Chrome and Opera */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
  }
  .k-timeline-hour-frame {
    border: solid 1px lightgrey
  }
  .k-timeline-step-frame:hover, .k-timeline-hour-frame:hover, .k-timeline-day-frame:hover {
    border-bottom: solid 3px $secondary
    //color: $secondary
  }
  .k-timeline-days-bar {
    border: solid 1px lightgrey
  }
</style>
