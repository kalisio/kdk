import moment from 'moment'

export default {
  data () {
    return {
      timeline: {
        enabled: true,
        isTicking: false,
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
        // reset timer since interval is based on timeline step
        const resetTimer = this.timeline.isTicking && (step !== this.timeline.step)
        if (resetTimer) this.stopTimeline()
        this.timeline.step = step
        if (resetTimer) this.startTimeline()
      }

      this.$emit('timeline-changed', this.absoluteTimeline)
    },
    // make the timeline start ticking
    startTimeline () {
      if (this.timeline.isTicking) return

      this.timeline.isTicking = true
      // every step
      this.timeline.timerId = setInterval(() => { this.timelineTick(1) }, this.timeline.step.asMilliseconds())
    },
    // make the timeline stop ticking
    stopTimeline () {
      if (!this.timeline.isTicking) return

      clearInterval(this.timeline.timerId)
      this.timeline.isTicking = false
    },
    toggleTickingState () {
      if (this.timeline.isTicking) this.stopTimeline()
      else this.startTimeline()
    },
    timelineTick (offset) {
      const currentTime = this.currentTime.clone()
      currentTime.add(offset * this.timeline.step)
      this.setCurrentTime(currentTime)
    }
  }
}
