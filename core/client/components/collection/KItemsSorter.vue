<template>
  <div>
    <KOptionsChooser
      :options="options"
      :tooltip="tooltip"
      @option-chosen="onOptionChosen"
      />
  </div>
</template>

<script setup>
import KOptionsChooser from '../input/KOptionsChooser.vue'

// Props
const props = defineProps({
  options: {
    type: Array,
    default: () => [
      { icon: 'las la-sort-alpha-down', value: { field: 'name', order: 1 }, default: true },
      { icon: 'las la-sort-alpha-up', value: { field: 'name', order: -1 } }
    ]
  },
  tooltip: {
    type: String,
    default: 'KSorter.SORT'
  },
  onOptionChanged: {
    type: Function,
    default: () => {}
  }
})

// Emits
const emit = defineEmits(['option-changed'])

// Functions
function onOptionChosen (value) {
  props.onOptionChanged(value)
  emit('option-changed', value)
}

</script>
