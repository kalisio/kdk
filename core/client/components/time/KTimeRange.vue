<template>
  <div class="row justify-center items-center q-gutter-x-none">
    <div class="q-pl-md">{{ $t('KTimeRange.START_LABEL') }}</div>
    <k-action
      id="start-time-action"
      tooltip="KTimeRange.PICK_START_DATE_LABEL"
      :label="formattedStart">
      <template v-slot:content>
        <q-popup-proxy ref="popup" transition-show="scale" transition-hide="scale">
          <q-date id="start-time-popup" v-model="formattedStart" mask="DD/MM/YY"
            :title="formattedStart" :subtitle="$t('KTimeRange.START_LABEL')"
            @input="onTimeRangeChanged" :options="checkTimeRange" />          
        </q-popup-proxy>
      </template>
    </k-action>
    <div class="q-pl-md">{{ $t('KTimeRange.END_LABEL') }}</div>
    <k-action
      id="end-time-action"
      tooltip="KTimeRange.PICK_END_DATE_LABEL"
      :label="formattedEnd">
      <template v-slot:content>
        <q-popup-proxy ref="popup" transition-show="scale" transition-hide="scale">
          <q-date id="end-time-popup" v-model="formattedEnd" mask="DD/MM/YY"
            :title="formattedEnd" :subtitle="$t('KTimeRange.END_LABEL')"
            @input="onTimeRangeChanged" :options="checkTimeLimit" />          
        </q-popup-proxy>
      </template>
    </k-action>
    <q-separator vertical size="2" />
    <k-menu
      id="plan-selector"
      icon="las la-calendar"
      :content="entries" 
      action-renderer="item" />
  </div>
</template>

<script>
import moment from 'moment'
import { Time } from '../../time'
import KAction from '../frame/KAction.vue'
import KStamp from '../frame/KStamp.vue'
import KMenu from '../menu/KMenu.vue'

export default {
  name: 'k-time-range',
  components: {
    KAction,
    KStamp,
    KMenu
  },
  computed: {
    formattedStart: {
      get: function () {
        return this.start.format('DD/MM/YY')
      },
      set: function (value) {
        this.start = moment(value, 'DD/MM/YY')
      }
    },
    formattedEnd: {
      get: function () {
        return this.end.format('DD/MM/YY')
      },
      set: function (value) {
        this.end = moment(value, 'DD/MM/YY')
      }
    }
  },
  data () {
    return {
      start: Time.getRange().start,
      end: Time.getRange().end,
      entries: [
        { 
          id: 'last-day', label: 'KTimeRange.LAST_DAY_LABEL', 
          handler: () => this.quickRangeTriggered(moment.duration(1, 'days'))
        },
        { 
          id: 'last-2-days', label: 'KTimeRange.LAST_2_DAYS_LABEL', 
          handler: () => this.quickRangeTriggered(moment.duration(2, 'days'))
        },
        {
          id: 'last-3-days', label: 'KTimeRange.LAST_3_DAYS_LABEL', 
          handler: () => this.quickRangeTriggered(moment.duration(3, 'days'))
        },
        { 
          id: 'last-week', label: 'KTimeRange.LAST_WEEK_LABEL', 
          handler: () => this.quickRangeTriggered(moment.duration(1, 'weeks'))
        },
        { 
          id: 'last-2-weeks', label: 'KTimeRange.LAST_2_WEEKS_LABEL', 
          handler: () => this.quickRangeTriggered(moment.duration(2, 'weeks'))
        },
        { 
          id: 'last-month', label: 'KTimeRange.LAST_MONTH_LABEL', 
          handler: () => this.quickRangeTriggered(moment.duration(1, 'months'))
        },
        { 
          id: 'last-3-months', label: 'KTimeRange.LAST_3_MONTHS_LABEL', 
          handler: () => this.quickRangeTriggered(moment.duration(3, 'months'))
        },
        { 
          id: 'last-6-months', label: 'KTimeRange.LAST_6_MONTHS_LABEL', 
          handler: () => this.quickRangeTriggered(moment.duration(6, 'months'))
        },
        { 
          id: 'last-year', label: 'KTimeRange.LAST_YEAR_LABEL', 
          handler: () => this.quickRangeTriggered(moment.duration(1, 'years'))
        }
      ]
    }
  },
  methods: {
    checkTimeRange (date) {
      return moment(date).isSameOrBefore(this.end)
    },
    checkTimeLimit (date) {
      return moment(date).isSameOrBefore(moment()) && moment(date).isAfter(this.start)
    },
    quickRangeTriggered (duration) {
      this.end = moment()
      this.start = moment().subtract(duration).startOf('day')
      this.onTimeRangeChanged()
    },
    onTimeRangeChanged () {
      Time.patchRange({ start: this.start, end: this.end })
    }
  },
  beforeDestroy () {
    // Reset the filter, we keep track of any existing items previously set by another activity
    this.$store.patch('sorter', {})
  }
}
</script>
