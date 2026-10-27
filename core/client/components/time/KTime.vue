<template>
  <q-btn v-bind="computedButton">
    <q-popup-proxy>
      <q-time v-if="withMinutes"
        id="time-picker"
        v-model="computedModel"
        v-bind="computedPicker"
      />
      <!-- QTime always goes to the minute view once the hour is selected, use a simple hour grid instead -->
      <q-card v-else
        id="time-picker"
        class="q-pa-sm"
      >
        <!-- 6 hours per row, a dense round button being 2em wide plus 1em spacing -->
        <div
          class="row q-gutter-xs"
          style="width: 18em"
        >
          <q-btn v-for="hour in hours"
            :key="hour"
            :id="'hour-' + hour"
            :label="formatHour(hour)"
            :flat="hour !== selectedHour"
            :unelevated="hour === selectedHour"
            :color="hour === selectedHour ? 'primary' : undefined"
            :disable="!isHourInSelection(hour)"
            round
            dense
            no-caps
            v-close-popup
            @click="onHourSelected(hour)"
          />
        </div>
      </q-card>
    </q-popup-proxy>
  </q-btn>
</template>

<script setup>
import _ from 'lodash'
import { tz } from 'moment-timezone'
import { computed } from 'vue'
import { Time } from '../../time.js'
import { i18n } from '../../i18n.js'

// Props
const props = defineProps({
  modelValue: {
    type: String,
    default: null
  },
  picker: {
    type: Object,
    default: () => null
  },
  withMinutes: {
    type: Boolean,
    default: true
  },
  withSeconds: {
    type: Boolean,
    default: false
  },
  format: {
    type: String,
    default: null
  },
  placeholder: {
    type: String,
    default: null
  },
  icon: {
    type: String,
    default: 'las la-clock'
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
const mask = 'HH:mm:ss'
const hours = _.range(24)

// Computed
const computedModel = computed({
  get: function () {
    return props.modelValue
  },
  set: function (value) {
    emit('update:modelValue', value)
  }
})
const computedButton = computed(() => {
  // compute format
  let format = props.format
  if (_.isEmpty(format)) format = _.get(Time.getFormat(), props.withMinutes ? 'time.long' : 'time.short')
  // compute label
  let label
  if (!_.isEmpty(computedModel.value)) label = tz(computedModel.value, mask, Time.getFormatTimezone()).format(format)
  else label = i18n.tie(props.placeholder)
  // define button spec
  const spec = {
    id: 'time-button',
    label,
    flat: true,
    noCaps: true,
    disable: props.disabled,
    dense: true,
    class: props.dense ? 'q-px-xs' : 'q-pa-sm'
  }
  // add icon if defined
  if (props.icon) spec.icon = props.icon
  return spec
})
const computedPicker = computed(() => {
  const picker = {
    mask,
    withSeconds: props.withSeconds
  }
  return _.merge({}, props.picker, picker)
})
const selectedHour = computed(() => {
  return _.isEmpty(computedModel.value) ? null : _.toNumber(computedModel.value.substring(0, 2))
})

// Functions
function formatHour (hour) {
  return _.padStart(hour, 2, '0')
}
function isHourInSelection (hour) {
  // Mimic the QTime logic
  const { hourOptions, options } = props.picker || {}
  if (hourOptions) return hourOptions.includes(hour)
  if (options) return options(hour, null, null)
  return true
}
function onHourSelected (hour) {
  computedModel.value = `${formatHour(hour)}:00:00`
}
</script>
