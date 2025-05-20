<template>
  <q-tooltip
    v-model="showTip"
    :target="target"
    :anchor="anchor"
    :self="self"
    :offset="offset"
    :delay="delay"
    :no-parent-event="noParentEvent"
    class="q-pa-none"
    style="border-radius: 100px; border: 1px solid var(--q-primary);"
  >
    <KLocationMap
      v-model="locationModel"
      :engine-options="engineOptions"
      style="min-width: 200px; min-height: 200px;"
    />
    <q-icon name="target" class="fixed-center" />
  </q-tooltip>
</template>

<script setup>
import _ from 'lodash'
import config from 'config'
import { computed } from 'vue'
import KLocationMap from './KLocationMap.vue'

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: null
  },
  location: {
    type: Object,
    default: () => null
  },
  target: {
    type: [Boolean, String],
    default: true
  },
  anchor: {
    type: String,
    default: 'bottom middle'
  },
  self: {
    type: String,
    default: 'top middle'
  },
  offset: {
    type: Array,
    default: [14, 14]
  },
  delay: {
    type: Number,
    default: 500
  },
  noParentEvent: {
    type: Boolean,
    default: false
  }
})

// Emit
const emit = defineEmits(['update:modelValue'])

// Computed
const showTip = computed({
  get: function () {
    return props.modelValue
  },
  set: function (value) {
    emit('update:modelValue', value)
  }
})
const locationModel = computed({
  get: function () {
    return props.location
  }
})
const engineOptions = computed(() => {
  const options = _.cloneDeep(_.get(config, 'engines.leaflet'))
  _.set(options, 'viewer.scale', false)
  return options
})
</script>
