<template>
  <div>
    <q-fab
      v-if="hasOptions"
      id="tags-filter-control"
      icon="las la-filter"
      color="grey-9"
      flat
      direction="down"
      :vertical-actions-align="computedAlignment"
      padding="xs"
      @show="showTooltip = false"
      @hide="showTooltip = true"
    >
      <template v-for="tag in options" :key="tag.name">
        <q-fab-action
          :label="$tie(getLabel(tag))"
          :style="'background-color: ' + tag.color"
          :text-color="getTextColor(tag)"
          padding="1px"
          square
          @click="onTagAdded(tag)"
        />
      </template>
    </q-fab>
    <q-tooltip v-if="showTooltip">
      {{ $t('KTagsFilterControl.FILTER') }}
    </q-tooltip>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { ref, computed, watch } from 'vue'
import { getContrastColor } from '../../utils/utils.colors.js'
import { useScreen } from '../../composables'

// Props
const props = defineProps({
  options: {
    type: Array,
    default: () => []
  },
  selection: {
    type: Array,
    default: () => []
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
const emit = defineEmits(['selection-changed'])

// Data
const { Screen } = useScreen()
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
function getTextColor (tag) {
  return tag.textColor || getContrastColor(tag.color)
}
function onTagAdded (tag) {
  currentSelection.value = _.concat(currentSelection.value, [tag])
  props.onSelectionChanged(currentSelection.value)
  emit('selection-changed', currentSelection.value)
}

</script>
