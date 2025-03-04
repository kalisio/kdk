<template>
  <div 
    class="column"
  >
    <div class="full-width row items-center justify-between no-wrap">
      <!-- Start dateTime -->
      <KDateTime
        v-model="startTimeModel"
        :date-picker="datePicker"
        :time-picker="timePicker"
        :date-format="dateFormat"
        :time-format="timeFormat"
        :date-class="dateClass"
        :time-class="timeClass"
        :separator="dateTimeSeparator"
        :min="min"
        :max="endTimeModel"
        :timezone="timezone"
        :icon="icon"
        :disabled="disabled"
        :dense="dense"
        @update:modelValue="onRangeChanged"
      />
      <div v-if="canDisplaySlider"
        class="col q-px-sm"
      >
        <Teleport v-if="isMounted"
          to="#responsive-range-container"
          :disabled="!slider.stacked"
        >
          <q-range
            v-model="rangeModel"
            v-bind="props.slider"
            :disable="min === max"
            dense
            class="q-px-sm full-width"
            @update:model-value="onSliderUpdated()"
            @change="onSliderChanged()"            
          />
        </Teleport>
      </div>
      <div v-else>
        {{ separator }}
      </div>
      <!-- End dateTime -->
      <KDateTime
        v-model="endTimeModel"
        :date-picker="datePicker"
        :time-picker="timePicker"
        :date-format="dateFormat"
        :time-format="timeFormat"
        :date-class="dateClass"
        :time-class="timeClass"
        :separator="dateTimeSeparator"
        :min="startTimeModel"
        :max="max"
        :timezone="timezone"
        :icon="icon"
        :disabled="disabled"
        :dense="dense"
        @update:modelValue="onRangeChanged"
      />
    </div>
    <div v-if="canDisplaySlider"
      id="responsive-range-container"
    >
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
    default: '/'
  },
  dateTimeSeparator: {
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
  slider: {
    type: Object,
    default: () => null
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
const startTimeModel = ref(null)
const endTimeModel = ref(null)
const rangeModel = ref({
  min: 0,
  max: 100
})
const isMounted = ref(false)

// Computed
const canDisplaySlider = computed(() => {
  return !_.isEmpty(props.slider) && 
         !_.isEmpty(props.min) && 
         !_.isEmpty(props.max)
})

// Watch
watch(() => props.modelValue, (value) => {
  if (value) {
    startTimeModel.value = value.start
    endTimeModel.value = value.end
  }
})
watch(() => props.min, (newValue, oldValue) => {
  if (_.isEmpty(props.max)) return
  if (rangeModel.value.min === 0) startTimeModel.value = newValue
  else {
    const min = moment(props.min)
    const max = moment(props.max)
    const start = moment(startTimeModel.value)
    let duration = moment.duration(max.diff(min)).asMilliseconds()
    if (duration > 0) rangeModel.value.min = 100 * moment.duration(start.diff(min)).asMilliseconds() / duration
    else rangeModel.value.min = 0
  }
  emit('update:modelValue', { start: startTimeModel.value, end: endTimeModel.value })
})
watch(() => props.max, (newValue, oldValue) => {
  if (_.isEmpty(props.min)) return
  if (rangeModel.value.max === 100) endTimeModel.value = newValue
  else {
    const min = moment(props.min)
    const max = moment(props.max)
    const end = moment(endTimeModel.value)
    let duration = moment.duration(max.diff(min)).asMilliseconds()
    if (duration > 0) rangeModel.value.max = 100 * moment.duration(end.diff(min)).asMilliseconds() / duration
    else rangeModel.value.max = 100
  }
  emit('update:modelValue', { start: startTimeModel.value, end: endTimeModel.value })
})

// Functions
function onRangeChanged () {
  if (!_.isEmpty(props.min && !_.isEmpty(props.max))) {
    const min = moment(props.min)
    const max = moment(props.max)
    const start = moment(startTimeModel.value)
    const end = moment(endTimeModel.value)
    let duration = moment.duration(max.diff(min)).asMilliseconds()
    if (duration > 0) {
      rangeModel.value.min = 100 * moment.duration(start.diff(min)).asMilliseconds() / duration
      rangeModel.value.max = 100 * moment.duration(end.diff(min)).asMilliseconds() / duration
    } else {
      rangeModel.value.min = 0
      rangeModel.value.max = 100
    }
  }
  emit('update:modelValue', { start: startTimeModel.value, end: endTimeModel.value })
}
function onSliderUpdated () {
  const min = moment(props.min)
  const max = moment(props.max)
  let duration = moment.duration(max.diff(min)).asMilliseconds()
  if (duration > 0) {
    startTimeModel.value = min.add(rangeModel.value.min / 100 * duration).toISOString()
    endTimeModel.value = max.subtract((1 - rangeModel.value.max / 100) * duration).toISOString()
  } else {
    startTimeModel.value = props.min
    endTimeModel.value = props.max
  }
}
function onSliderChanged () {
  emit('update:modelValue', { start: startTimeModel.value, end: endTimeModel.value })
}

// Hooks
onMounted(() => {
  isMounted.value = true
})

// Immediate
if (props.modelValue) {
  startTimeModel.value = props.modelValue.start
  endTimeModel.value = props.modelValue.end
  onRangeChanged()
}
</script>
