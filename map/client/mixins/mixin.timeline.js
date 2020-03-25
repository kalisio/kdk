import moment from 'moment'

export default {
  data () {
    return {
      timeline: {
        enabled: true,
        isTicking: false,
        isRealtime: false,
        span: moment.duration('P2D'),
        offset: moment.duration('PT0M'),
        step: moment.duration('PT1H'),
        reference: moment.utc()
      }
    }
  },
  computed: {
    // returns absolute values for begin,end time of the timeline
    absoluteTimeline () {
      const begin = this.timeline.reference.clone()
      const end = begin.clone().add(this.timeline.span)
      begin.subtract(this.timeline.offset)
      end.subtract(this.timeline.offset)
      return {
        begin: begin,
        end: end,
        reference: this.timeline.reference,
        step: this.timeline.step
      }
    },
    isTimelineTickingRealtime () {
      return this.timeline.isTicking && this.timeline.isRealtime
    }
  },
  methods: {
    enableTimeline () {
      this.timeline.enabled = true
    },
    disableTimeline () {
      this.timeline.enabled = false
      // stop running timeline if currently running
      this.stopTimeline()
    },
    // configures the timeline
    updateTimeline ({ span, offset, step, reference } = {}) {
      if (span) this.timeline.span = span
      if (reference) this.timeline.reference = reference
      if (offset) this.timeline.offset = offset
      if (step) {
        // reset timer since non realtime interval is based on timeline step
        const resetTimer = this.timeline.isTicking && !this.timeline.isRealtime && (step !== this.timeline.step)
        if (resetTimer) this.stopTimeline()
        this.timeline.step = step
        if (resetTimer) this.startTimeline(false)
      }

      this.$emit('timeline-changed', this.absoluteTimeline)
    },
    // make the timeline start ticking
    startTimeline (realtime) {
      if (this.timeline.isTicking) {
        if (this.timeline.isRealtime === realtime) return
        // otherwise, we have to stop timeline before restarting it in realtime mode
        this.stopTimeline()
      }

      this.timeline.isTicking = true
      this.timeline.isRealtime = realtime
      if (realtime) {
        const now = moment()
        this.updateTimeline({ reference: now })
        this.setCurrentTime(now)

        // every 30s
        this.timeline.timerId = setInterval(() => {
          const now = moment()
          console.log('rt tick')
          this.updateTimeline({ reference: now })
          this.setCurrentTime(now)
        }, 30 * 1000)
      } else {
        // every step
        this.timeline.timerId = setInterval(() => {
          this.timelineMove(1)
        }, this.timeline.step.asMilliseconds())
      }
    },
    // make the timeline stop ticking
    stopTimeline () {
      if (!this.timeline.isTicking) return

      clearInterval(this.timeline.timerId)
      this.timeline.isTicking = false
    },
    // move time by timeline step increments
    timelineMove (offset) {
      const currentTime = this.currentTime.clone()
      currentTime.add(offset * this.timeline.step)
      this.setCurrentTime(currentTime)
    }
  },
  beforeDestroy () {
    // make sure all setInterval get cleared
    this.stopTimeline()
  }
}
