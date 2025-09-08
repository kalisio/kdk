<template>
  <div
    id="position"
    class="row items-center no-padding k-position"
  >
    <span class="text-weight-regular q-pl-sm q-pr-sm">
      {{ formattedPosition }}
    </span>
    <KAction
      id="copy-position"
      icon="las la-copy"
      tooltip="KPosition.COPY"
      size="0.75rem"
      :handler="onCopy"
    />
    <q-separator 
      vertical
      color="grey-6"
      style="margin: 6px;"
    />    
    <KAction
      id="close-position"
      icon="cancel"
      tooltip="KPosition.CLOSE"
      size="0.75rem"
      :handler="onClose"
    />
  </div>
</template>

<script setup>
import _ from 'lodash'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { Notify, copyToClipboard } from 'quasar'
import { Store, Layout, i18n } from '../../../../core.client.js'
import { formatUserCoordinates } from '../../utils.js'
import { useCurrentActivity } from '../../composables/activity.js'
import KAction from '../../../../core/client/components/action/KAction.vue'

// Props
const props = defineProps({
  stickyId: {
    type: String,
    default: 'position-sticky'
  },
  targetId: {
    type: String,
    default: 'target-sticky'
  }
})

// Data
const { CurrentActivity } = useCurrentActivity()
const position = ref(null)

// Computed
const formattedPosition = computed(() => {
  if (_.isNil(position.value)) return i18n.t('KPosition.OUTSIDE_MAP')
  return formatUserCoordinates(position.value.latitude, position.value.longitude, Store.get('locationFormat', 'FFf'))
})

// Function
function updatePosition () {
  position.value = CurrentActivity.value.is2D() ? CurrentActivity.value.getCenter() : CurrentActivity.value.getCameraEllipsoidTarget()
}
async function onCopy () {
  try {
    await copyToClipboard(formattedPosition.value)
    Notify.create({ type: 'positive', message: i18n.t('KPosition.POSITION_COPIED') })
  } catch (error) {
    Notify.create({ type: 'negative', message: i18n.t('KPosition.CANNOT_COPY_POSITION') })
  }
}
async function onClose () {
  if (!_.isEmpty(props.stickyId)) Layout.hideSticky(props.stickyId)
}

onMounted(() => {
  // Show target sticky
  if (!_.isEmpty(props.targetId)) Layout.showSticky(props.targetId)
  // Listen move events
  if (CurrentActivity.value) {
    CurrentActivity.value.$engineEvents.on('movestart', updatePosition)
    CurrentActivity.value.$engineEvents.on('move', updatePosition)
    CurrentActivity.value.$engineEvents.on('moveend', updatePosition)
  }
  // Update the position
  updatePosition()
})
// Hooks
onBeforeUnmount(() => {
  if (!_.isEmpty(props.targetId)) Layout.hideSticky(props.targetId)
  // Stop listening move events
  if (CurrentActivity.value) {
    CurrentActivity.value.$engineEvents.off('movestart', updatePosition)
    CurrentActivity.value.$engineEvents.off('move', updatePosition)
    CurrentActivity.value.$engineEvents.off('moveend', updatePosition)
  }
})
</script>

<style lang="scss" scoped>
.k-position {
  border-radius: 24px;
  border: 1px solid #dedede;
  background-color: #dedede;
}
</style>
