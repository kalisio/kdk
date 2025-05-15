<template>
  <div 
    v-if="levels" 
    class="q-pa-sm col row items-center k-level-slider"
  >
    <div v-if="switchLabelSide">
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
      :markers="markers" 
      snap
      label
      :label-value="getFormattedLevel(level)" 
      :switch-label-side="!switchLabelSide"
      @change="onLevelChanged"
      class="q-py-sm text-primary" 
      :style="`height: ${height - 18}px;`"
    />
    <div v-if="!switchLabelSide">
      <div
        class="text-caption text-grey-9"
        style="writing-mode: vertical-lr; min-width: 1rem;"
      >
        {{ $t(label) }} - {{ getFormattedLevel(CurrentActivity.selectedLevel) }}
      </div>
    </div>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { ref, computed, watch } from 'vue'
import { useCurrentActivity } from '../../../../core/client/composables'

// Props
defineProps({
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

// Watch
watch(() => CurrentActivity.value.selectableLevels, (levels) => {
  if (levels.values) level.value = _.head(levels.values)
  else if (levels.range) level.value = _.get(levels.range, 'min', 0)
  else level.value = 0
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
  const unit = _.get(CurrentActivity.value.selectableLevels, 'unit')
  if (levels.value.values) return `${levels.value.values[level]} ${unit}`
  return `${level} ${unit}`
}
</script>

<style>
.k-level-slider {
  border: 1px solid lightgrey;
  background: white;
}
</style>
