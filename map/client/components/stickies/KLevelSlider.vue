<template>
  <div v-if="isVisible && props.visible"
    class="k-level-slider flex items-baseline justify-center bg-white q-px-sm q-py-md">
    <p v-if="props.switchLabelSide" class="text-accent text-caption no-margin"
      style="writing-mode: vertical-lr; transform-origin: center; transform: rotate(180deg);">
      <b>{{ $t(CurrentActivity.selectableLevels.label) }} - {{ getFormattedLevel(CurrentActivity.selectedLevel) }}</b>
    </p>
    <q-slider v-if="dataArray" snap class="text-primary" v-model="sliderVal" :vertical="props.vertical"
      :reverse="props.reverse ?? props.vertical" :height="150" :width="4" :markers="props.markers" :label-always="false"
      :max="dataArray.length - 1" label :label-value="getFormattedLevel(dataArray[sliderVal])"
      :switch-label-side="props.switchLabelSide ? !props.switchLabelSide : props.vertical" @change="onLevelChanged" />
    <q-slider v-else class="text-primary" :model-value="sliderVal" :vertical="props.vertical"
      :reverse="props.reverse ?? props.vertical" :height="150" :width="4" :markers="props.markers" :label-always="false"
      :min="sliderMinValue" :max="sliderMaxValue" :step="sliderInterval" label
      :label-value="getFormattedLevel(sliderVal)"
      :switch-label-side="props.switchLabelSide ? !props.switchLabelSide : props.vertical" @change="onLevelChanged"
      @update:model-value="val => sliderVal = val" />
    <p v-if="!props.switchLabelSide" class="text-accent text-caption no-margin"
      style="writing-mode: vertical-lr; transform-origin: center; transform: rotate(180deg);">
      <b>{{ $t(CurrentActivity.selectableLevels.label) }} - {{ getFormattedLevel(CurrentActivity.selectedLevel) }}</b>
    </p>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { computed, ref } from 'vue'
import { useCurrentActivity } from '../../../../core/client/composables'

// Props
const props = defineProps({
  vertical: {
    type: Boolean,
    default: false
  },
  reverse: {
    type: Boolean,
    default: null
  },
  visible: {
    type: Boolean,
    default: true
  },
  switchLabelSide: {
    type: Boolean,
    default: null
  },
  markers: {
    type: Boolean,
    default: true
  }
})

// Data
const { CurrentActivity } = useCurrentActivity()
const sliderVal = ref(0)

// Computed
const isVisible = computed(() => sliderValues.value ? sliderValues.value.length > 0 : (sliderMinValue.value !== undefined && sliderMaxValue.value !== undefined))
// const isLazy = computed(() => _.get(CurrentActivity.value.selectableLevels, 'lazy', true))
const sliderValues = computed(() => _.get(CurrentActivity.value.selectableLevels, 'values'))
const dataArray = computed(() => sliderValues.value ? [...sliderValues.value].sort((a, b) => a - b) : null)
const sliderMinValue = computed(() => _.get(CurrentActivity.value.selectableLevels, 'range.min'))
const sliderMaxValue = computed(() => _.get(CurrentActivity.value.selectableLevels, 'range.max'))
const sliderInterval = computed(() => _.get(CurrentActivity.value.selectableLevels, 'range.interval', 1))

// Functions
function onLevelChanged (level) {
  if (dataArray.value) {
    CurrentActivity.value.setSelectedLevel(dataArray.value[level])
  } else {
    CurrentActivity.value.setSelectedLevel(level)
  }
}
function getFormattedLevel (level) {
  const unit = _.get(CurrentActivity.value.selectableLevels, 'unit')
  return `${level || CurrentActivity.value.selectedLevel} ${unit}`
}
</script>

<style>
.k-level-slider {
  border: 1px solid lightgrey;
}
</style>
