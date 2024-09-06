<template>
  <KCardSection
    :title="$t('KLocationCardSection.TITLE')"
    :actions="actions"
    :context="context"
    :dense="dense"
    style="position: relative"
  >
    <div v-if="feature" class="full-width column">
      <!-- Description -->
      <KTextArea
        :text="feature.properties.name"
        :minHeight="44"
        :maxHeight="204"
        :dense="true"
      />
      <!-- Map  -->
      <KLocationMap
        v-model="feature"
        style="min-height: 140px"
      />
    </div>
    <div v-else style="height: 184px">
      <div class="absolute-center">
        <KStamp
          icon="las la-map-marker"
          text="KLocationCardSection.NO_LOCATION"
        />
      </div>
    </div>
  </KCardSection>
</template>

<script setup>
import { ref, watch } from 'vue'
import KLocationMap from './KLocationMap.vue'

// Props
const props = defineProps({
  location: {
    type: Object,
    default: () => null
  },
  actions: {
    type: [Object, Array],
    default: () => null
  },
  context: {
    type: Object,
    default: () => null
  },
  dense: {
    type: Boolean,
    default: false
  }
})

// Data
const feature = ref(null)

// Watch
watch(() => props.location, (value) => {
  feature.value = value
}, { immediate: true })
</script>
