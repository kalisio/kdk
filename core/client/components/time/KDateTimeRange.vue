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
import logger from 'loglevel'
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
const triggerEmit = _.debounce(() => {
  emit('update:modelValue', { start: startTimeModel.value, end: endTimeModel.value })
}, 100)

// Computed
const canDisplaySlider = computed(() => {
  return !_.isEmpty(props.slider) &&
         !_.isEmpty(props.min) &&
         !_.isEmpty(props.max)
})

// Watch
watch(() => props.modelValue, (value) => {
  if (value) {
    const start = moment(value.start)
    const end = moment(value.end)
    const min = moment(props.min)
    const max = moment(props.max)
    if (start.isBefore(min) || end.isAfter(max)) {
      logger.warn('[KDK] Invalid model value. The range should be bounded between min and max')
      return
    }
    startTimeModel.value = value.start
    endTimeModel.value = value.end
    const duration = moment.duration(max.diff(min)).asMilliseconds()
    if (duration === 0) {
      rangeModel.value.min = 0
      rangeModel.value.max = 100
    } else {
      rangeModel.value.min = 100 * moment.duration(start.diff(min)).asMilliseconds() / duration
      rangeModel.value.max = 100 * moment.duration(end.diff(min)).asMilliseconds() / duration
    }
  }
}, { immediate: true })
watch(() => [props.min, props.max], () => {
  if (_.isEmpty(props.max) || _.isEmpty(props.min)) return
  const min = moment(props.min)
  const max = moment(props.max)
  const duration = moment.duration(max.diff(min)).asMilliseconds()
  if (duration === 0) {
    startTimeModel.value = min
    endTimeModel.value = max
    rangeModel.value.min = 0
    rangeModel.value.max = 100
  } else {
    const start = moment(startTimeModel.value)
    const end = moment(endTimeModel.value)
    if (min.isSameOrAfter(start)) {
      startTimeModel.value = min
      rangeModel.value.min = 0
    } else {
      rangeModel.value.min = 100 * moment.duration(start.diff(min)).asMilliseconds() / duration
    }
    if (max.isSameOrBefore(end)) {
      endTimeModel.value = max
      rangeModel.value.max = 100
    } else {
      rangeModel.value.max = 100 * moment.duration(end.diff(min)).asMilliseconds() / duration
    }
  }
  triggerEmit()
}, { immediate: true })

// Functions
function onRangeChanged () {
  if (!_.isEmpty(props.min) && !_.isEmpty(props.max)) {
    const min = moment(props.min)
    const max = moment(props.max)
    const start = moment(startTimeModel.value)
    const end = moment(endTimeModel.value)
    const duration = moment.duration(max.diff(min)).asMilliseconds()
    if (duration > 0) {
      rangeModel.value.min = 100 * moment.duration(start.diff(min)).asMilliseconds() / duration
      rangeModel.value.max = 100 * moment.duration(end.diff(min)).asMilliseconds() / duration
    } else {
      rangeModel.value.min = 0
      rangeModel.value.max = 100
    }
  }
  triggerEmit()
}
function onSliderUpdated () {
  const min = moment(props.min)
  const max = moment(props.max)
  const duration = moment.duration(max.diff(min)).asMilliseconds()
  if (duration > 0) {
    startTimeModel.value = min.add(rangeModel.value.min / 100 * duration).toISOString()
    endTimeModel.value = max.subtract((1 - rangeModel.value.max / 100) * duration).toISOString()
  } else {
    startTimeModel.value = props.min
    endTimeModel.value = props.max
  }
}
function onSliderChanged () {
  triggerEmit()
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
