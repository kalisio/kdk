<template>
  <div>
    <q-fab
      v-if="hasOptions"
      id="tags-filter-control"
      :model-value="modelValue"
      :icon="icon"
      :color="color"
      :flat="flat"
      direction="down"
      :vertical-actions-align="computedAlignment"
      padding="xs"
      @show="onShow"
      @hide="onHide"
    >
      <template v-for="tag in options" :key="tag.name">
        <q-fab-action
          :label="$tie(getLabel(tag))"
          :text-color="getTextColor(tag)"
          padding="1px"
          square
          @click="onTagAdded(tag)"
          :style="`background-color: ${getColor(tag)};`"
        />
      </template>
    </q-fab>
    <q-tooltip v-if="showTooltip">
      {{ $tie(props.tooltip) }}
    </q-tooltip>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { ref, computed, watch, useAttrs } from 'vue'
import { getHtmlColor, getContrastColor } from '../../utils/utils.colors.js'
import { useScreen } from '../../composables'

// Props
const props = defineProps({
  modelValue: {
    tye: Boolean,
    default: null
  },
  options: {
    type: Array,
    default: () => []
  },
  selection: {
    type: Array,
    default: () => []
  },
  icon: {
    type: String,
    default: 'las la-filter'
  },
  color: {
    type: String,
    default: 'grey-9'
  },
  flat: {
    type: Boolean,
    default: true
  },
  tooltip: {
    type: String,
    default: 'KTagsFilterControl.FILTER'
  },
  alignment: {
    type: [String, Object],
    default: 'center'
  },
  onSelectionChanged: {
    type: Function,
    default: () => {}
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'selection-changed', 'shown', 'hidden'])

// Data
const { Screen } = useScreen()
const attrs = useAttrs()
const showTooltip = ref(true)
const currentSelection = ref(props.selection)

// Computed
const options = computed(() => {
  return _.difference(props.options, currentSelection.value)
})
const hasOptions = computed(() => {
  return !_.isEmpty(props.options)
})
const computedAlignment = computed(() => {
  if (_.isString(props.alignment)) return props.alignment
  return _.get(props.alignment, Screen.name)
})

// Watch
watch(() => props.selection, (newSelection) => {
  currentSelection.value = newSelection
})

// Functions
function getLabel (tag) {
  return _.get(tag, 'label', tag.name)
}
function getColor (tag) {
  return getHtmlColor(tag.color)
}
function getTextColor (tag) {
  return tag.textColor || getContrastColor(tag.color)
}
function onTagAdded (tag) {
  currentSelection.value = _.concat(currentSelection.value, [tag])
  props.onSelectionChanged(currentSelection.value)
  emit('selection-changed', currentSelection.value)
}
function onShow () {
  showTooltip.value = false
  emit('update:modelValue', true)
  emit('shown', attrs.name)
}
function onHide () {
  showTooltip.value = true
  emit('update:modelValue', false)
  emit('hidden', attrs.name)
}
</script>
