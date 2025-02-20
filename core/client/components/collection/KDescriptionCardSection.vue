<template>
  <KCardSection
    :title="computedTitle"
    :actions="actions"
    :actionsFilter="actionsFilter"
    :hide-separator="hideSeparator"
    :hide-header="hideHeader"
    :dense="dense"
  >
    <KTextArea
      v-if="computedDescription"
      :text="computedDescription"
      :minHeight="48"
      :dense="dense"
    />
    <div v-else :style="`height: 44px; position: relative`">
      <KStamp
        text="KDescriptionCardSection.NO_DESCRIPTION"
        icon="las la-exclamation-circle"
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
import { CardSectionProps } from '../../utils/utils.items.js'
import { i18n } from '../../i18n.js'
import KCardSection from './KCardSection.vue'
import KTextArea from '../KTextArea.vue'

// Props
const props = defineProps({
  descriptionPath: {
    type: String,
    default: 'description'
  },
  ...CardSectionProps
})

// Computed
const computedTitle = computed(() => {
  return _.isEmpty(props.title) ? i18n.t('KDescriptionCardSection.TITLE') : props.title
})
const computedDescription = computed(() => {
  return _.get(props.item, props.descriptionPath)
})
</script>
