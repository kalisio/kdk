<template>
  <div class="row items-center no-wrap">
    <!-- Date -->
    <KDate
      v-model="dateModel"
      :options="dateOptions"
      :disabled="disabled"
      :dense="dense"
    />
    <template v-if="!props.dateOnly">
      <!-- Separator -->
      <div v-if="separator">{{ separator }}</div>
      <!-- Time -->
      <KTime
          v-model="timeModel"
          :options="timeOptions"
          :disabled="disabled || dateTime === null"
          :dense="dense"
      />
    </template>

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
  timezone: {
    type: String,
    default: null
  },
  options: {
    type: Object,
    default: () => {}
  },
  format: {
    type: String,
    default: 'YYYY/MM/DD HH:mm',
    validator: (value) => {
      return !_.isEmpty(value) && value.split(' ').length === 2
    }
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
  disabled: {
    type: Boolean,
    default: false
  },
  dense: {
    type: Boolean,
    default: false
  },
  dateOnly: {
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
const dateModel = computed({
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
const dateOptions = computed(() => {
  return _.merge({}, _.get(props.options, 'date'), { picker: { options: checkDate } })
})
const timeModel = computed({
  get: function () {
    return dateTime.value ? dateTime.value.format(timeMask) : null
  },
  set: function (value) {
    const { HH, mm, ss } = toHMS(value)
    dateTime.value.set({ hour: HH, minute: mm, second: ss })
    emit('update:modelValue', dateTime.value.toISOString())
  }
})
const timeOptions = computed(() => {
  return _.merge({}, _.get(props.options, 'time'), { picker: { options: checkTime } })
})
const separator = computed(() => {
  return _.get(props.options, 'separator')
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
  if (minDateTime.value && dateToCheck.isBefore(minDateTime.value)) return false
  if (maxDateTime.value && dateToCheck.isAfter(maxDateTime.value)) return false
  return true
}
function checkTime (hours, minutes, seconds) {
  const timeToCheck = moment({
    year: dateTime.value.year(),
    month: dateTime.value.month(),
    date: dateTime.value.date(),
    hour: hours || dateTime.value.hour(),
    minute: minutes || dateTime.value.minute(),
    second: seconds || dateTime.value.second()
  })
  if (minDateTime.value && timeToCheck.isBefore(minDateTime.value)) return false
  if (maxDateTime.value && timeToCheck.isAfter(maxDateTime.value)) return false
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
