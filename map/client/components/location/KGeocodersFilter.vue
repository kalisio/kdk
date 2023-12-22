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
import { useCurrentActivity } from '../../composables'

const { getActivityProject } = useCurrentActivity({ selection: false, probe: false })
const project = getActivityProject()

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
  const geocoders = props.geocoders.filter(geocoder => {
    if (project && geocoder.value.startsWith('kano:')) {
      const service = geocoder.value.replace('kano:', '')
      // Depending on the layer the geocoding source (i.e. collection/service) is not the same
      let layer = _.find(project.layers, { service })
      if (!layer) layer = _.find(project.layers, { probeService: service })
      return layer
    }
    return true
  })
  return _.sortBy(geocoders, ['label'])
})
</script>
