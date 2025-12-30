<template>
  <KCardSection
    :title="$t('KLocationCardSection.TITLE')"
    :actions="actions"
    :actionsFilter="actionsFilter"
    :hideHeader="hideHeader"
    :dense="dense"
  >
    <div v-if="feature" class="full-width column">
      <!-- Description -->
      <KTextArea
        :text="locationName"
        :minHeight="24"
        :maxHeight="204"
        :dense="true"
        :class="{ 'cursor-pointer': renderer === 'tip'}"
      />
      <!-- Map  -->
      <KLocationMap
        v-if="renderer === 'map'"
        v-model="feature"
        style="min-height: 120px"
      />
      <KLocationTip
        v-else-if="renderer === 'tip'"
        :location="feature"
        anchor="bottom left"
        self="top left"
      />
    </div>
    <div v-else style="height: 142px; position: relative;">
      <KStamp
        icon="las la-map-marker"
        text="KLocationCardSection.NO_LOCATION"
        class="absolute-center"
      />
    </div>
  </KCardSection>
</template>

<script setup>
import _ from 'lodash'
import { ref, watch, computed } from 'vue'
import { utils as coreUtils } from '../../../../core.client'
import KLocationMap from './KLocationMap.vue'
import KLocationTip from './KLocationTip.vue'

// Props
const props = defineProps({
  locationPath: {
    type: String,
    default: 'location'
  },
  namePath: {
    type: String,
    default: 'name'
  },
  renderer: {
    type: String,
    default: 'map',
    validator: (value) => {
      return _.isNil(value) || ['map', 'tip'].includes(value)
    }
  },
  ...coreUtils.CardSectionProps
})

// Data
const feature = ref(null)

// Computed
const locationName = computed(() => {
  return _.get(feature.value, `properties.${props.namePath}`)
})

// Watch
watch(() => [props.item, props.locationPath], () => {
  if (_.get(props.item, 'type') === 'Feature') feature.value = _.cloneDeep(props.item)
  else feature.value = _.get(props.item, props.locationPath)
}, { immediate: true })
</script>
