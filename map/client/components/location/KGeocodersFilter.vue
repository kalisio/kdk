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
import _ from 'lodash'
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
    return props.modelValue
  },
  set: function (value) {
    emit('update:modelValue', value)
  }
})
const availableGeocoders = computed(() => {
  return _.sortBy(props.geocoders, ['label'])
})
</script>
