<template>
  <div class="row items-center q-gutter-x-sm no-wrap">
    <!-- Start dateTime -->
    <KDateTime
      v-model="startModel"
      :options="props.options.dateTime || props.options"
      :min="props.min"
      :max="props.max"
      :disabled="disabled"
      :dense="dense"
    />
    <div>
      {{ separator }}
    </div>
    <!-- End dateTime -->
    <KDateTime
      v-model="endModel"
      :options="props.options.dateTime || props.options"
      :min="startDateTime ? startDateTime.toISOString() : null"
      :max="props.max"
      :disabled="disabled || startDateTime === null"
      :dense="dense"
    />
  </div>
</template>

<script setup>
import _ from 'lodash'
import moment from 'moment'
import { ref, computed, watch } from 'vue'
import KDateTime from './KDateTime.vue'

// Props
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => null,
    validator: (value) => {
      if (value && value.start && !moment(value.start).isValid()) return false
      if (value && value.end && !moment(value.end).isValid()) return false
      return true
    }
  },
  options: {
    type: Object,
    default: () => {}
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
  }
})

// Emits
const emit = defineEmits(['update:modelValue'])

// Data
const startDateTime = ref(null)
const endDateTime = ref(null)

// Computed
const startModel = computed({
  get: function () {
    return startDateTime.value ? startDateTime.value.toISOString() : null
  },
  set: function (value) {
    if (endDateTime.value) {
      if (moment.utc(value).isAfter(endDateTime.value)) endDateTime.value = value
    } else {
      endDateTime.value = value
    }
    emit('update:modelValue', { start: value, end: endDateTime.value })
  }
})
const endModel = computed({
  get: function () {
    return endDateTime.value ? endDateTime.value.toISOString() : null
  },
  set: function (value) {
    emit('update:modelValue', { start: startDateTime.value.toISOString(), end: value })
  }
})
const separator = computed(() => {
  return _.get(props.options, 'separator', '/')
})

// Watch
watch(() => props.modelValue, (value) => {
  startDateTime.value = value ? moment.utc(value.start) : null
  endDateTime.value = value ? moment.utc(value.end) : null
})

// Immediate
if (props.modelValue) {
  startDateTime.value = moment.utc(props.modelValue.start)
  endDateTime.value = moment.utc(props.modelValue.end)
}
</script>
