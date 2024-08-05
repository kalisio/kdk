<template>
  <q-tooltip
    anchor="center end"
    self="center middle"
    class="q-pa-none"
    :delay="500"
    :hide-delay="150"
    :transition-duration="150"
    style="border-radius: 100px; border: 1px solid var(--q-primary);"
  >
    <KLocationMap
      v-model="feature"
      style="min-width: 200px; min-height: 200px;"
    />
    <q-icon name="target" class="fixed-center" />
  </q-tooltip>
</template>

<script setup>
import { computed } from 'vue'
import KLocationMap from './KLocationMap.vue'

// Props
const props = defineProps({
  location: {
    type: Object,
    required: true
  }
})

// Data
const feature = computed(() => {
  return props.location
})
</script>
