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
        :planet="planet"
        :project="project"
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
import { toRefs } from 'vue'
import KLocationMap from './KLocationMap.vue'

// props
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
  },
  planet: {
    type: String,
    default: ''
  },
  project: {
    type: Object,
    default: null
  }
})

// data
const { location: feature } = toRefs(props)

</script>
