<template>
  <q-btn
    id="date-button"
    :icon="icon"
    :label="label"
    flat
    no-caps
    :disable="disabled"
    :dense="dense"
  >
    <q-popup-proxy>
      <q-date
        id="date-picker"
        v-model="model"
        v-bind="picker"
      />
    </q-popup-proxy>
  </q-btn>
</template>

<script setup>
import _ from 'lodash'
import moment from 'moment'
import { computed } from 'vue'
import { Time } from '../../time.js'

// Props
const props = defineProps({
  modelValue: {
    type: String,
    default: () => null
  },
  options: {
    type: Object,
    default: () => {}
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
const icon = computed(() => {
  return _.get(props.options, 'icon')
})
const label = computed(() => {
  if (props.modelValue) return moment(props.modelValue, mask).format(format.value)
  return _.get(props.options, 'helper')
})
const model = computed({
  get: function () {
    return props.modelValue
  },
  set: function (value) {
    emit('update:modelValue', value)
  }
})
const format = computed(() => {
  const dateDateFormat = _.get(Time.getFormat(), 'date.short')
  const defaultYearFormat = _.get(Time.getFormat(), 'year.long')
  return _.get(props.options, 'format', `${dateDateFormat}/${defaultYearFormat}`)
})
const picker = computed(() => {
  return _.merge({}, _.get(props.options, 'picker'), { mask })
})

</script>
