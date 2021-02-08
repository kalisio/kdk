<template>
  <k-action
    :id="id"
    :label="label"
    :tooltip="tooltip"
    :icon="icon"
    :color="color"
    :size="size"
    :badge="badge"
    :disabled="disabled">
    <template v-slot:content>
      <q-popup-proxy ref="popup" transition-show="scale" transition-hide="scale">
        <q-card>
          <q-card-section class="q-pa-xs q-gutter-lg">
            <q-date id="start-time-popup" v-model="minDateSelected"
              :title="formatedMinDate" :subtitle="$t('KTimeRangeChooser.FROM_DATE')"
              @input="onTimeRangeChanged()" :options="checkTimeRange"/>
            <q-date id="end-time-popup" v-model="maxDateSelected"
              :title="formatedMaxDate" :subtitle="$t('KTimeRangeChooser.TO_DATE')"
              @input="onTimeRangeChanged()" :options="checkTimeRange"/>
          </q-card-section>
        </q-card>
      </q-popup-proxy>
    </template>
  </k-action>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import { getLocale } from '../../utils'

export default {
  name: 'k-time-range-chooser',
  props: {
    id: {
      type: String,
      required: true
    },
    label: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: 'grey-9'
    },
    size: {
      type: String,
      default: 'sm'
    },
    badge: {
      type: Object,
      required: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    minDate () {
      return moment(this.minDateSelected, 'YYYY[/]MM[/]DD').startOf('day')
    },
    maxDate () {
      return moment(this.maxDateSelected, 'YYYY[/]MM[/]DD').endOf('day')
    },
    formatedMinDate () {
      return this.formatDate(this.minDate.toDate())
    },
    formatedMaxDate () {
      return this.formatDate(this.maxDate.toDate())
    },
    tooltip () {
      return this.$t('KTimeRangeChooser.FROM_DATE') + ' ' + this.formatedMinDate + ' ' + 
             this.$t('KTimeRangeChooser.TO_DATE') + ' ' + this.formatedMaxDate
    }
  },
  data () {
    const now = moment()
    // 1 month ago by default
    const minDateSelected = now.clone().subtract(1, 'months').startOf('day')
    const maxDateSelected = now.clone().endOf('day')

    return {
      minDateSelected: minDateSelected.format('YYYY[/]MM[/]DD'),
      maxDateSelected: maxDateSelected.format('YYYY[/]MM[/]DD'),
    }
  },
  methods: {
    checkTimeRange (date) {
      return moment(date).isSameOrBefore(moment())
    },
    formatDate (date) {
      return date.toLocaleString(getLocale(),
        { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    },
    onTimeRangeChanged () {
      this.$emit('time-range-choosed', { minDate: this.minDate, maxDate: this.maxDate })
    }
  },
  created () {
    // load the required components
    this.$options.components['k-action'] = this.$load('frame/KAction')
  }
}
</script>
