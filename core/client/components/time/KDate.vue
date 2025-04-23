<template>
  <q-btn v-bind="computedButton">
    <q-popup-proxy>
      <q-date
        id="date-picker"
        v-model="computedModel"
        v-bind="computedPicker"
      />
    </q-popup-proxy>
  </q-btn>
</template>

<script setup>
import _ from 'lodash'
import moment from 'moment'
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
const mask = 'YYYY/MM/DD'

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
  if (_.isEmpty(format)) {
    const dateFormat = _.get(Time.getFormat(), 'date.short')
    const yearFormat = _.get(Time.getFormat(), 'year.long')
    format = `${dateFormat}/${yearFormat}`
  }
  // compute label
  let label
  if (!_.isEmpty(computedModel.value)) label = moment(computedModel.value, mask).format(format)
  else label = i18n.tie(props.placeholder)
  // define button spec
  const spec = {
    id: 'date-button',
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
  const picker = { mask }
  return _.merge({}, props.picker, picker)
})

// Immediate
if (_.isNull(props.modelValue) &&
    _.isEmpty(props.placeholder)) computedModel.value = moment.utc().format(mask)
</script>
