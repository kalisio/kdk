import moment from 'moment'

export default {
  data () {
    return {
      timeline: {
        span: moment.duration('P2D'),
        offset: moment.duration('PT0M'),
        step: moment.duration('PT1H'),
        reference: moment.utc(),
        enabled: true
      }
    }
  },
  computed: {
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
    },
    updateTimeline ({ span, offset, step, reference } = {}) {
      if (span) this.timeline.span = span
      if (reference) this.timeline.reference = reference
      if (offset) this.timeline.offset = offset
      if (step) this.timeline.step = step
      this.$emit('timeline-changed', this.absoluteTimeline)
    },
    centerTimeline (reference) {
      this.timeline.reference = reference
      this.$emit('timeline-changed', this.absoluteTimeline)
    }
  },
  created () {
  },
  beforeDestroy () {
  }
}
