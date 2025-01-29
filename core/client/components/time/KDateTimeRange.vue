<template>
  <div>
    <div class="row items-center q-gutter-x-sm no-wrap">
      <!-- Start dateTime -->
      <KDateTime
        v-model="startModel"
        :options="options"
        :min="rangeMin"
        :max="rangeMax"
        :disabled="disabled"
        :dense="dense"
        :date-only="dateOnly"
      />
      <div v-if="displaySlider"
        class="q-px-sm"
      >
        <Teleport v-if="isMounted"
          to="#responsive-range-container"
          :disabled="disableTeleport"
        >
          <q-range
            v-model="rangeModel"
            v-bind="props.slider.range"
            @update:model-value="setDateTimeRangeFromSliderPosition()"
            @change="emitRangeChange()"
            style="min-width: 200px; padding-top: 4px;"
            dense
          />
        </Teleport>
      </div>
      <div v-else>
        {{ separator }}
      </div>
      <!-- End dateTime -->
      <KDateTime
        v-model="endModel"
        :options="options"
        :min="startDateTime ? startDateTime.toISOString() : null"
        :max="rangeMax"
        :disabled="disabled || startDateTime === null"
        :dense="dense"
        :date-only="dateOnly"
      />
    </div>
    <div v-if="displaySlider"
      id="responsive-range-container"
      class="row items-center q-px-sm q-gutter-x-sm no-wrap"
    >
    </div>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { useQuasar } from 'quasar'
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
  },
  dateOnly: {
    type: Boolean,
    default: false
  },
  slider: {
    type: Object,
    default: () => {
      return {show:false}
    }
  }
})

// Emits
const emit = defineEmits(['update:modelValue'])

// Data
const $q = useQuasar()
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
  return !!(props.slider.show && props.min && props.max)
})
const rangeMin = computed(() => {
  return props.dateOnly ? getDateWithoutTime(props.min, 'start').toISOString() : moment(props.min).utc().toISOString()
})
const rangeMax = computed(() => {
  return props.dateOnly ? getDateWithoutTime(props.max, 'end').toISOString() : moment(props.max).utc().toISOString()
})
const disableTeleport = computed(() => {
  let disable = false
  if (props.slider) {
    switch (props.slider.position) {
      case 'bottom':
        disable = false
        break
      case 'between':
        disable = true
        break
      case 'auto':
      default:
        if ($q.screen.gt.sm) {
          disable = true
        }
        break
    }
  }
  return disable
})

// Watch
watch(() => props.modelValue, (value) => {
  startDateTime.value = value ? moment(value.start).utc() : null
  endDateTime.value = value ? moment(value.end).utc() : null
  if (displaySlider.value) {
    setSliderPositionFromDateTimeRAnge()
  }
})

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

// Hooks
onMounted(() => {
  isMounted.value = true
})

// Immediate
if (props.modelValue) {
  startDateTime.value = moment(props.modelValue.start).utc()
  endDateTime.value = moment(props.modelValue.end).utc()
  if (displaySlider.value) {
    if(props.slider.range && props.slider.range.min) {
      rangeModel.value.min = props.slider.range.min
    }
    if(props.slider.range && props.slider.range.max) {
      rangeModel.value.max = props.slider.range.max
    }
    if (props.dateOnly) {
      startDateTime.value = getDateWithoutTime(props.modelValue.start, 'start')
      endDateTime.value = getDateWithoutTime(props.modelValue.end, 'end')
    }
    rangeStep.value = (moment(rangeMax.value).diff(moment(rangeMin.value)) / (rangeModel.value.max - rangeModel.value.min))
    setSliderPositionFromDateTimeRAnge()
  }
}
</script>
