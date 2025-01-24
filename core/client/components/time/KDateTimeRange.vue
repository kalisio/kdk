<template>
  <div>
    <div class="row items-center q-gutter-x-sm no-wrap">
      <!-- Start dateTime -->
      <KDateTime
          v-model="startModel"
          :options="props.options.dateTime || props.options"
          :min="rangeMin"
          :max="rangeMax"
          :disabled="disabled"
          :dense="dense"
          :date-only="dateOnly"
      />

      <div class="q-px-sm" v-if="displaySlider">
        <Teleport to="#responsive-range-container" v-if="isMounted" :disabled="$q.screen.gt.sm">
          <q-range
              v-model="rangeModel"
              v-bind="props.range"
              @update:model-value="setDateTimeRangeFromSliderPosition()"
              @change="emitRangeChange()"
              style="min-width: 200px"
          />
        </Teleport>
      </div>
      <div v-else>
        {{ separator }}
      </div>
      <!-- End dateTime -->
      <KDateTime
          v-model="endModel"
          :options="props.options.dateTime || props.options"
          :min="startDateTime ? startDateTime.toISOString() : null"
          :max="rangeMax"
          :disabled="disabled || startDateTime === null"
          :dense="dense"
          :date-only="dateOnly"
      />
    </div>
    <div class="row items-center q-px-sm q-gutter-x-sm no-wrap" id="responsive-range-container" v-if="displaySlider">

    </div>
  </div>

</template>

<script setup>
import _ from 'lodash'
import moment from 'moment'
import { ref, computed, watch, onMounted } from 'vue'
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
  },
  dateOnly: {
    type: Boolean,
    default: false
  },
  range: {
    type: Object,
    default: () => {}
  }
})

// Emits
const emit = defineEmits(['update:modelValue'])

// Data
const isMounted = ref(false)
const startDateTime = ref(null)
const endDateTime = ref(null)
const rangeModel = ref({
  min: 0,
  max: 100
})
const rangeStep = ref(0)

// Computed
const startModel = computed({
  get: function () {
    return startDateTime.value ? startDateTime.value.toISOString() : null
  },
  set: function (value) {
    if (endDateTime.value) {
      if (moment.utc(value).isAfter(endDateTime.value)) endDateTime.value = moment(value)
    } else {
      endDateTime.value = moment(value)
    }
    emit('update:modelValue', { start: value, end: endDateTime.value.toISOString() })
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

const displaySlider = computed(() => {
  return !!(props.range && props.min && props.max)
})
const rangeMin = computed(() => {
  return props.dateOnly ? getDateWithoutTime(props.min, 'start').toISOString() : moment(props.min).utc().toISOString()
})
const rangeMax = computed(() => {
  return props.dateOnly ? getDateWithoutTime(props.max, 'end').toISOString() : moment(props.max).utc().toISOString()
})

// Watch
watch(() => props.modelValue, (value) => {
  startDateTime.value = value ? moment(value.start).utc() : null
  endDateTime.value = value ? moment(value.end).utc() : null
  if (displaySlider.value) {
    setSliderPositionFromDateTimeRAnge()
  }
})

// Immediate
if (props.modelValue) {
  startDateTime.value = moment(props.modelValue.start).utc()
  endDateTime.value = moment(props.modelValue.end).utc()

  if (displaySlider.value) {
    if (props.dateOnly) {
      startDateTime.value = getDateWithoutTime(props.modelValue.start, 'start')
      endDateTime.value = getDateWithoutTime(props.modelValue.end, 'end')
    }
    rangeStep.value = (moment(rangeMax.value).diff(moment(rangeMin.value)) / (props.range.max - props.range.min))
    setSliderPositionFromDateTimeRAnge()
  }
}

// Functions
function getDateWithoutTime (dateTime, type = 'start') {
  const date = moment.isMoment(dateTime) ? dateTime : moment(dateTime)
  return type === 'start' ? date.startOf('day') : date.endOf('day')
}
function setDateTimeRangeFromSliderPosition () {
  startDateTime.value = moment(rangeMin.value).add(rangeStep.value * rangeModel.value.min, 'milliseconds')
  endDateTime.value = moment(rangeMin.value).add(rangeStep.value * rangeModel.value.max, 'milliseconds')
}
function emitRangeChange () {
  emit('update:modelValue', { start: startDateTime.value.toISOString(), end: endDateTime.value.toISOString() })
}
function setSliderPositionFromDateTimeRAnge () {
  if (props.dateOnly) {
    rangeModel.value.min = Math.floor((getDateWithoutTime(props.modelValue.start, 'start').diff(moment(rangeMin.value))) / rangeStep.value)
    rangeModel.value.max = Math.ceil((getDateWithoutTime(props.modelValue.end, 'end').diff(moment(rangeMin.value))) / rangeStep.value)
  } else {
    rangeModel.value.min = Math.floor((moment(props.modelValue.start).diff(moment(rangeMin.value))) / rangeStep.value)
    rangeModel.value.max = Math.ceil((moment(props.modelValue.end).diff(moment(rangeMin.value))) / rangeStep.value)
  }
}

onMounted(() => {
  isMounted.value = true
})

</script>
