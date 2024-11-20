<template>
  <q-btn
    id="time-button"
    :icon="icon"
    :label="label"
    flat
    no-caps
    :disable="disabled"
    :dense="dense"
  >
    <q-popup-proxy>
      <q-time
        id="time-picker"
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
const mask = 'HH:mm:ss'

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
  const defaultFormat = _.get(Time.getFormat(), 'time.long')
  return _.get(props.options, 'format', defaultFormat)
})
const picker = computed(() => {
  return _.merge({}, _.get(props.options, 'picker'), { mask })
})
</script>
