<template>
  <KZoomControl v-if="levels && zoomButtons" :vertical="false" />
  <div
    v-if="levels"
    class="q-pa-sm col row flex-center k-level-slider"
  >
    <div v-if="props.switchLabelSide">
      <div
        class="text-caption text-grey-9"
        style="writing-mode: vertical-rl; min-width: 1rem;"
      >
        {{ $t(label) }} - {{ getFormattedLevel(CurrentActivity.selectedLevel) }}
      </div>
    </div>

    <q-slider
      v-model="level"
      vertical
      reverse
      :min="sliderMin"
      :max="sliderMax"
      :step="sliderStep"
      :markers="props.markers"
      snap
      label
      :label-value="getFormattedLevel(level)"
      :switch-label-side="!props.switchLabelSide"
      @change="onLevelChanged"
      class="q-py-sm text-primary"
      :style="`height: ${props.height - 18}px;`"
    />
    <div v-if="!props.switchLabelSide">
      <div
        class="text-caption text-grey-9"
        style="writing-mode: vertical-lr; min-width: 1rem;"
      >
        {{ $t(label) }} - {{ getFormattedLevel(level) }}
      </div>
    </div>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { ref, computed, watch } from 'vue'
import { useCurrentActivity } from '../../../../core/client/composables'
import KZoomControl from './KZoomControl.vue'

// Props
const props = defineProps({
  height: {
    type: Number,
    default: 300
  },
  markers: {
    type: Boolean,
    default: true
  },
  switchLabelSide: {
    type: Boolean,
    default: null
  },
  zoomButtons: {
    type: Boolean,
    default: false
  }
})

// Data
const { CurrentActivity } = useCurrentActivity()
const level = ref(0)

// Computed
const levels = computed(() => {
  const selectableLevels = _.get(CurrentActivity.value, 'selectableLevels')
  return !_.isEmpty(selectableLevels) ? selectableLevels : null
})
const unit = computed(() => {
  const selectableLevels = _.get(CurrentActivity.value, 'selectableLevels')
  return !_.isEmpty(selectableLevels) ? selectableLevels.unit : ''
})
const label = computed(() => {
  return _.get(levels.value, 'label')
})
const sliderMin = computed(() => {
  if (levels.value.values) return 0
  return _.get(levels.value.range, 'min', 0)
})
const sliderMax = computed(() => {
  if (levels.value.values) return _.size(levels.value.values) - 1
  return _.get(levels.value.range, 'max', 100)
})
const sliderStep = computed(() => {
  if (levels.value.values) return 1
  return _.get(levels.value, 'range.interval', 10)
})
const borderTop = computed(() => props.zoomButtons ? '0' : '1px')

// Watch
watch(() => CurrentActivity.value.selectedLevel, (selectedLevel) => {
  if (levels.value && levels.value.values) level.value = levels.value.values.indexOf(selectedLevel)
  else level.value = selectedLevel
})

// Functions
function onLevelChanged (level) {
  if (levels.value.values) {
    CurrentActivity.value.setSelectedLevel(levels.value.values[level])
  } else {
    CurrentActivity.value.setSelectedLevel(level)
  }
}
function getFormattedLevel (level) {
  if (levels.value.values) return `${levels.value.values[level]} ${unit.value}`
  return `${level} ${unit.value}`
}
</script>

<style>
.k-level-slider {
  border: 1px solid lightgrey;
  border-top: v-bind(borderTop);
  background: white;
}
</style>
