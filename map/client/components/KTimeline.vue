<template>
  <k-time-controller :style="timelineStyle"
    :key="timelineRefreshKey"
    :min="timeline.start"
    :max="timeline.end"
    :step="'h'"
    :value="timeline.current"
    :timeInterval="timelineInterval"
    :timeFormatter="timelineFormatter"
    @change="onTimelineUpdated"
  />
</template>

<script>
import moment from 'moment'

export default {
  name: 'k-timeline',
  inject: ['kActivity'],
  data () {
    const now = moment.utc()
    return {
      timeline: {
        start: now.clone().subtract({ days: 7 }).valueOf(),
        end: now.clone().add({ days: 7 }).valueOf(),
        current: now.clone().valueOf()
      },
      timelineInterval: this.getTimelineInterval(),
      timelineFormatter: this.getTimelineFormatter(),
      timelineRefreshKey: 0
    }
  },
  computed: {
    timelineStyle () {
      if (this.$q.screen.lt.md) return 'width: 70vw'
      return 'width: 80vw'
      // return `width: ${0.8 * this.kActivity.engineContainerWidth} + 'px'`
    }
  },
  methods: {
    updateTimeline (options) {
      if (options.start) this.timeline.start = options.start
      if (options.end) this.timeline.end = options.end
      // Clamp current time to range
      this.timeline.current = Math.max(Math.min(options.current, this.timeline.end), this.timeline.start)
      //
      // Make the component aware that it needs to refresh.
      //
      // See: http://michaelnthiessen.com/force-re-render and related to: https://github.com/kalisio/kano/issues/24
      //
      // Core issue is that the :value property of k-time-controller can be changed by this method, but this does not
      // affect the data element "this.currentValue" of the component which is only assigned once (see the expression
      // "currentValue: this.value" in mixin.range-compute.js).
      //
      // Since invoking "setupTimeline" means that the whole component simply needs to be recalculated (because we're
      // changing any/all of its props), forcing an update (using the ":key" technique) seem the simplest solution.
      //
      this.timelineRefreshKey = this.timelineRefreshKey + 1
    },
    setupTimeline () {
      const { start, end } = this.kActivity.getTimeRange()
      this.updateTimeline({
        start: start.valueOf(),
        end: end.valueOf(),
        current: this.timeline.current
      })
      this.kActivity.setCurrentTime(moment.utc(this.timeline.current))
    },
    getTimelineInterval () {
      // interval length: length of 1 day in milliseconds
      const length = 24 * 60 * 60000

      return {
        length,
        getIntervalStartValue (rangeStart) {
          const startTime = moment.utc(rangeStart)
          startTime.local()
          const hour = startTime.hours()
          const minute = startTime.minutes()
          let startValue
          // range starts on a day (ignoring seconds)
          if (hour === 0 && minute === 0) {
            startValue = rangeStart
          } else {
            const startOfDay = startTime.startOf('day')
            startOfDay.add({ days: 1 })
            startValue = startOfDay.valueOf()
          }
          return startValue
        },
        valueChanged (value, previousValue, step) {
          let changed = true
          if (step !== null) {
            changed = false
            if (previousValue === null) {
              changed = true
            } else {
              const difference = Math.abs(value - previousValue)
              switch (step) {
                case 'h':
                  changed = (difference >= 60 * 60000)
                  break
                case 'm':
                  changed = (difference >= 60000)
                  break
                default:
                  changed = true
              }
            }
          }
          return changed
        }
      }
    },
    getTimelineFormatter () {
      return {
        format: (value, type, displayOptions) => {
          const time = new Date(value)
          let label
          switch (type) {
            case 'interval':
              if (displayOptions.width >= 110) {
                label = this.kActivity.formatTime('date.long', time)
              } else {
                label = this.kActivity.formatTime('date.short', time)
              }
              break
            case 'pointer':
              label = `${this.kActivity.formatTime('date.long', time)} - ${this.kActivity.formatTime('time.short', time)}`
              break
            case 'indicator':
              label = this.kActivity.formatTime('time.short', time)
              break
          }
          return label
        }
      }
    },
    onTimelineUpdated (event) {
      // Only when drag stops to avoid fetching data permanently
      if (event.final) {
        this.kActivity.setCurrentTime(moment.utc(event.value))
      }
    },
    onTimechanged (time) {
      this.updateTimeline({ current: time.valueOf() })
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-time-controller'] = this.$load('time/KTimeController')
  },
  mounted () {
    this.kActivity.$on('current-time-changed', this.onTimechanged)
    this.kActivity.$on('forecast-model-changed', this.setupTimeline)
    // The event could have been raised before the component has been initialized, so initialize
    this.setupTimeline()
  },
  beforeDestroy () {
    this.kActivity.$off('current-time-changed', this.onTimechanged)
    this.kActivity.$off('forecast-model-changed', this.setupTimeline)
  }
}
</script>

<style lang="stylus">
</style>
