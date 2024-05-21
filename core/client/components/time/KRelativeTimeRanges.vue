<template>
  <k-panel
    id="time-ranges"
    :content="content"
    action-renderer="item"
    :dense="dense"
    direction="vertical"
  />
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import { Time } from '../../time'
import KPanel from '../KPanel.vue'

export default {
  name: 'k-relative-time-ranges',
  components: {
    KPanel
  },
  props: {
    ranges: {
      type: Array,
      default: () => []
    },
    dense: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    content () {
      return _.filter(this.defaultRanges, range => {
        return _.indexOf(this.ranges, range.id) > -1
      })
    }
  },
  methods: {
    rangeTriggered (duration) {
      const end = moment(Time.getCurrentTime())
      const start = moment(Time.getCurrentTime()).add(duration)
      // Revert range if duration in past
      if (duration.asMilliseconds() > 0) Time.patchRange({ start: end, end: start })
      else Time.patchRange({ start, end })
    }
  },
  created () {
    this.defaultRanges = [
      {
        id: 'last-hour',
        label: 'KRelativeTimeRanges.LAST_HOUR_LABEL',
        handler: () => this.rangeTriggered(moment.duration(-1, 'hours'))
      },
      {
        id: 'next-hour',
        label: 'KRelativeTimeRanges.NEXT_HOUR_LABEL',
        handler: () => this.rangeTriggered(moment.duration(1, 'hours'))
      },
      {
        id: 'last-2-hours',
        label: 'KRelativeTimeRanges.LAST_2_HOURS_LABEL',
        handler: () => this.rangeTriggered(moment.duration(-2, 'hours'))
      },
      {
        id: 'next-2-hours',
        label: 'KRelativeTimeRanges.NEXT_2_HOURS_LABEL',
        handler: () => this.rangeTriggered(moment.duration(2, 'hours'))
      },
      {
        id: 'last-3-hours',
        label: 'KRelativeTimeRanges.LAST_3_HOURS_LABEL',
        handler: () => this.rangeTriggered(moment.duration(-3, 'hours'))
      },
      {
        id: 'next-3-hours',
        label: 'KRelativeTimeRanges.NEXT_3_HOURS_LABEL',
        handler: () => this.rangeTriggered(moment.duration(3, 'hours'))
      },
      {
        id: 'last-6-hours',
        label: 'KRelativeTimeRanges.LAST_6_HOURS_LABEL',
        handler: () => this.rangeTriggered(moment.duration(-6, 'hours'))
      },
      {
        id: 'next-6-hours',
        label: 'KRelativeTimeRanges.NEXT_6_HOURS_LABEL',
        handler: () => this.rangeTriggered(moment.duration(6, 'hours'))
      },
      {
        id: 'last-12-hours',
        label: 'KRelativeTimeRanges.LAST_12_HOURS_LABEL',
        handler: () => this.rangeTriggered(moment.duration(-12, 'hours'))
      },
      {
        id: 'next-12-hours',
        label: 'KRelativeTimeRanges.NEXT_12_HOURS_LABEL',
        handler: () => this.rangeTriggered(moment.duration(12, 'hours'))
      },
      {
        id: 'last-day',
        label: 'KRelativeTimeRanges.LAST_DAY_LABEL',
        handler: () => this.rangeTriggered(moment.duration(-1, 'days'))
      },
      {
        id: 'next-day',
        label: 'KRelativeTimeRanges.NEXT_DAY_LABEL',
        handler: () => this.rangeTriggered(moment.duration(1, 'days'))
      },
      {
        id: 'last-2-days',
        label: 'KRelativeTimeRanges.LAST_2_DAYS_LABEL',
        handler: () => this.rangeTriggered(moment.duration(-2, 'days'))
      },
      {
        id: 'next-2-days',
        label: 'KRelativeTimeRanges.NEXT_2_DAYS_LABEL',
        handler: () => this.rangeTriggered(moment.duration(2, 'days'))
      },
      {
        id: 'last-3-days',
        label: 'KRelativeTimeRanges.LAST_3_DAYS_LABEL',
        handler: () => this.rangeTriggered(moment.duration(-3, 'days'))
      },
      {
        id: 'next-3-days',
        label: 'KRelativeTimeRanges.NEXT_3_DAYS_LABEL',
        handler: () => this.rangeTriggered(moment.duration(3, 'days'))
      },
      {
        id: 'last-week',
        label: 'KRelativeTimeRanges.LAST_WEEK_LABEL',
        handler: () => this.rangeTriggered(moment.duration(-1, 'weeks'))
      },
      {
        id: 'next-week',
        label: 'KRelativeTimeRanges.NEXT_WEEK_LABEL',
        handler: () => this.rangeTriggered(moment.duration(1, 'weeks'))
      },
      {
        id: 'last-2-weeks',
        label: 'KRelativeTimeRanges.LAST_2_WEEKS_LABEL',
        handler: () => this.rangeTriggered(moment.duration(-2, 'weeks'))
      },
      {
        id: 'next-2-weeks',
        label: 'KRelativeTimeRanges.NEXT_2_WEEKS_LABEL',
        handler: () => this.rangeTriggered(moment.duration(2, 'weeks'))
      },
      {
        id: 'last-month',
        label: 'KRelativeTimeRanges.LAST_MONTH_LABEL',
        handler: () => this.rangeTriggered(moment.duration(-1, 'months'))
      },
      {
        id: 'next-month',
        label: 'KRelativeTimeRanges.NEXT_MONTH_LABEL',
        handler: () => this.rangeTriggered(moment.duration(1, 'months'))
      },
      {
        id: 'last-3-months',
        label: 'KRelativeTimeRanges.LAST_3_MONTHS_LABEL',
        handler: () => this.rangeTriggered(moment.duration(-3, 'months'))
      },
      {
        id: 'next-3-months',
        label: 'KRelativeTimeRanges.NEXT_3_MONTHS_LABEL',
        handler: () => this.rangeTriggered(moment.duration(3, 'months'))
      },
      {
        id: 'last-6-months',
        label: 'KRelativeTimeRanges.LAST_6_MONTHS_LABEL',
        handler: () => this.rangeTriggered(moment.duration(-6, 'months'))
      },
      {
        id: 'next-6-months',
        label: 'KRelativeTimeRanges.NEXT_6_MONTHS_LABEL',
        handler: () => this.rangeTriggered(moment.duration(6, 'months'))
      },
      {
        id: 'last-year',
        label: 'KRelativeTimeRanges.LAST_YEAR_LABEL',
        handler: () => this.rangeTriggered(moment.duration(-1, 'years'))
      },
      {
        id: 'next-year',
        label: 'KRelativeTimeRanges.NEXT_YEAR_LABEL',
        handler: () => this.rangeTriggered(moment.duration(1, 'years'))
      }
    ]
  }
}
</script>
