<template>
  <div
    id="position"
    class="row items-center no-padding k-position"
  >
    <span class="text-caption q-pl-sm q-pr-sm">
      {{ formattedPosition }}
    </span>
    <KAction
      id="copy-position"
      icon="las la-copy"
      tooltip="KPosition.COPY"
      size="sm"
      :handler="onCopy"
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
  target: {
    type: String,
    default: 'target-sticky'
  }
})

// Data
const { CurrentActivity } = useCurrentActivity()
const position = ref(null)

// Computed
const formattedPosition = computed(() => {
  if (_.isNil(position.value)) return i18n.t('KPositionIndicator.OUTSIDE_MAP')
  return formatUserCoordinates(position.value.latitude, position.value.longitude, Store.get('locationFormat', 'FFf'))
})

// Function
function updatePosition () {
  position.value = CurrentActivity.value.is2D() ? CurrentActivity.value.getCenter() : CurrentActivity.value.getCameraEllipsoidTarget()
}
async function onCopy () {
  try {
    await copyToClipboard(formattedPosition.value)
    Notify.create({ type: 'positive', message: i18n.t('KPositionIndicator.POSITION_COPIED') })
  } catch (error) {
    Notify.create({ type: 'negative', message: i18n.t('KPositionIndicator.CANNOT_COPY_POSITION') })
  }
}

onMounted(() => {
  // Show target sticky
  if (props.target) Layout.showSticky(props.target)
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
  if (props.target) Layout.hideSticky(props.target)
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
