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
        :text="feature.properties[namePath]"
        :minHeight="24"
        :maxHeight="204"
        :dense="true"
      />
      <!-- Map  -->
      <KLocationMap
        v-model="feature"
        style="min-height: 120px"
      />
    </div>
    <div v-else style="height: 142px">
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
import _ from 'lodash'
import { ref, watch } from 'vue'
import { utils as coreUtils } from '../../../../core.client'
import KLocationMap from './KLocationMap.vue'

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
  ...coreUtils.CardSectionProps
})

// Data
const feature = ref(null)

// Watch
watch(() => [props.item, props.locationPath], () => {
  if (_.get(props.item, 'type') === 'Feature') feature.value = _.cloneDeep(props.item)
  else feature.value = _.get(props.item, props.locationPath)
}, { immediate: true })
</script>
