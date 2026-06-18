<template>
  <q-option-group
    class="q-pl-sm q-pr-md"
    v-model="selectedGeocoders"
    :options="availableGeocoders"
    type="toggle"
    size="xs"
  />
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  modelValue: {
    type: Array,
    required: true
  },
  geocoders: {
    type: Array,
    default: () => []
  }
})

// Emit
const emit = defineEmits(['update:modelValue'])

// Computed
const selectedGeocoders = computed({
  get: function () {
    return props.modelValue.map(g => g.value)
  },
  set: function (value) {
    emit('update:modelValue', props.geocoders.filter(g => value.includes(g.value)))
  }
})
const availableGeocoders = computed(() => {
  return [...props.geocoders].sort((g1, g2) => g1.label.localeCompare(g2.label))
})
</script>
