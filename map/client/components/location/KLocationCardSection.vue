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
        :class="{
          'cursor-pointer': renderer === 'tip' || clickable,
          'k-clickable-text': renderer === 'tip' || clickable
        }"
        @click="onClicked"
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
      return _.isNil(value) || ['map', 'tip', 'none'].includes(value)
    }
  },
  clickable: {
    type: Boolean,
    default: false
  },
  ...coreUtils.CardSectionProps
})

// Emit
const emit = defineEmits(['clicked'])

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

// Functions
function onClicked () {
  if (props.clickable) emit('clicked')
}
</script>

<style lang="scss" scoped>
.k-clickable-text:hover {
  font-weight: 405;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  box-shadow: 0 6px 0 rgba(0, 0, 0, 0.05), 0 -6px 0 rgba(0, 0, 0, 0.05), 4px 0 0 rgba(0, 0, 0, 0.05), -4px 0 0 rgba(0, 0, 0, 0.05);
}
</style>