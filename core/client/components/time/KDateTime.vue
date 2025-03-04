<template>
  <div
    class="row items-center no-wrap"
    :class="{ 'q-gutter-x-xs': dense }"
  >
    <!-- Date -->
    <KDate
      v-model="computedDateModel"
      :picker="computedDatePicker"
      :format="dateFormat"
      :placeholder="placeholder"
      :icon="icon"
      :disabled="disabled" 
      :dense="dense"
      :class="{ 'q-pl-xs': dense, 'q-pl-md': !dense, [dateClass]: true }"
    />
    <!-- Separator -->
    <div v-if="separator">{{ separator }}</div>
    <!-- Time -->
    <KTime
      v-model="computedTimeModel"
      :picker="computedTimePicker"
      :with-seconds="withSeconds"
      :format="timeFormat"
      :icon="null"
      :disabled="disabled || dateTime === null"
      :dense="dense"
      :class="{ 'q-pr-xs': dense, 'q-pr-md': !dense, [timeClass]: true }"
    />
  </div>
</template>

<script setup>
import _ from 'lodash'
import moment from 'moment'
import { ref, computed, watch } from 'vue'
import { toLocalTimezone } from '../../utils/utils.time.js'
import { Time } from '../../time.js'
import KDate from './KDate.vue'
import KTime from './KTime.vue'

// Props
const props = defineProps({
  modelValue: {
    type: String,
    default: () => null,
    validator: (value) => {
      if (value) return moment(value).isValid()
      return true
    }
  },
  datePicker: {
    type: Object,
    default: () => null
  },
  timePicker: {
    type: Object,
    default: () => null
  },
  withSeconds: {
    type: Boolean,
    default: false
  },
  dateFormat: {
    type: String,
    default: null
  },
  timeFormat: {
    type: String,
    default: null
  },
  dateClass: {
    type: String,
    default: ''
  },
  timeClass: {
    type: String,
    default: ''
  },
  separator: {
    type: String,
    default: '-'
  },
  min: {
    type: String,
    default: () => null,
    validator: (value) => {
      if (value) return moment(value).isValid()
      return true
    }
  },
  max: {
    type: String,
    default: () => null,
    validator: (value) => {
      if (value) return moment(value).isValid()
      return true
    }
  },
  timezone: {
    type: String,
    default: null
  },
  placeholder: {
    type: String,
    default: null
  },
  icon: {
    type: String,
    default: 'las la-calendar'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  dense: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['update:modelValue'])

// Data
const dateTime = ref(null)
const minDateTime = ref(null)
const maxDateTime = ref(null)
const dateMask = 'YYYY/MM/DD'
const timeMask = 'HH:mm:ss'

// Computed
const computedDateModel = computed({
  get: function () {
    return dateTime.value ? dateTime.value.format(dateMask) : null
  },
  set: function (value) {
    const { YYYY, MM, DD } = toYMD(value)
    if (!dateTime.value) dateTime.value = moment({ year: YYYY, month: MM, date: DD })
    else dateTime.value.set({ year: YYYY, month: MM, date: DD })
    emit('update:modelValue', dateTime.value.toISOString())
  }
})
const computedTimeModel = computed({
  get: function () {
    return dateTime.value ? dateTime.value.format(timeMask) : null
  },
  set: function (value) {
    const { HH, mm, ss } = toHMS(value)
    dateTime.value.set({ hour: HH, minute: mm, second: ss })
    emit('update:modelValue', dateTime.value.toISOString())
  }
})
const computedDatePicker = computed(() => {
  let picker = {}
  if (!_.isEmpty(props.min) || !_.isEmpty(props.max)) picker = { options: checkDate }
  return _.merge({}, props.datePicker, picker)
})
const computedTimePicker = computed(() => {
  let picker = {}
  if (!_.isEmpty(props.min) || !_.isEmpty(props.max)) picker = { options: checkTime }
  return _.merge({}, props.timePicker, picker)
})

// Watch
watch(() => props.modelValue, (value) => {
  dateTime.value = toLocalTimezone(props.modelValue, Time.getFormatTimezone())
})
watch(() => props.timezone, (value) => {
  dateTime.value = toLocalTimezone(props.modelValue, Time.getFormatTimezone())
  minDateTime.value = toLocalTimezone(props.min, Time.getFormatTimezone())
  maxDateTime.value = toLocalTimezone(props.max, Time.getFormatTimezone())
})
watch(() => props.min, (value) => {
  minDateTime.value = toLocalTimezone(props.min, Time.getFormatTimezone())
})
watch(() => props.max, (value) => {
  maxDateTime.value = toLocalTimezone(props.max, Time.getFormatTimezone())
})

// Functions
function checkDate (date) {
  const { YYYY, MM, DD } = toYMD(date)
  const dateToCheck = moment({
    year: YYYY,
    month: MM,
    date: DD,
    hour: dateTime.value ? dateTime.value.hour() : 0,
    minute: dateTime.value ? dateTime.value.minute() : 0
  })
  if (dateToCheck.isBefore(minDateTime.value)) return false
  if (dateToCheck.isAfter(maxDateTime.value)) return false
  return true
}
function checkTime (hours, minutes, seconds) {
  if (minDateTime.value) {
    const maxTimeToCheck = moment({
      year: dateTime.value.year(),
      month: dateTime.value.month(),
      date: dateTime.value.date(),
      hour: Number(hours),
      minute: Number(minutes) || 59,
      second: Number(seconds) || 59
    })
    if (maxTimeToCheck.isBefore(minDateTime.value)) return false
  }
  if (maxDateTime.value) {
    const minTimeToCheck = moment({
      year: dateTime.value.year(),
      month: dateTime.value.month(),
      date: dateTime.value.date(),
      hour: Number(hours),
      minute: Number(minutes) || 0,
      second: Number(seconds) || 0
    })
    if (minTimeToCheck.isAfter(maxDateTime.value)) return false
  }
  return true
}

// Functions
function toYMD (value) {
  return {
    YYYY: value.substring(0, 4),
    MM: value.substring(5, 7) - 1,
    DD: value.substring(8, 10)
  }
}
function toHMS (value) {
  return {
    HH: value.substring(0, 2),
    mm: value.substring(3, 5),
    ss: value.substring(6, 8)
  }
}

// Immediate
if (props.modelValue) dateTime.value = toLocalTimezone(props.modelValue, Time.getFormatTimezone())
if (props.min) minDateTime.value = toLocalTimezone(props.min, Time.getFormatTimezone())
if (props.max) maxDateTime.value = toLocalTimezone(props.max, Time.getFormatTimezone())
</script>
