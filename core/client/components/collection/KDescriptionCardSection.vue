<template>
  <KCardSection
    :title="$t('KDescriptionCardSection.TITLE')"
    :actions="actions"
    :context="context"
    :dense="dense"
    style="position: relative"
  >
    <KTextArea
      v-if="description"
      :text="description"
      :minHeight="48"
      :dense="dense"
    />
    <div v-else :style="`height: 44px; position: relative`">
      <KStamp
        text="KDescriptionCardSection.NO_DESCRIPTION"
        icon="las la-comment-alt"
        iconSize="24px"
        direction="horizontal"
        class="absolute-center"
      />
    </div>
  </KCardSection>
</template>

<script setup>
import _ from 'lodash'
import { computed } from 'vue'
import KCardSection from './KCardSection.vue'
import KTextArea from '../KTextArea.vue'

// Props
const props = defineProps({
  item: {
    type: Object,
    default: () => null
  },
  descriptionPath: {
    type: String,
    default: 'description'
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

// Computed
const description = computed(() => {
  return _.get(props.item, props.descriptionPath)
})
</script>
