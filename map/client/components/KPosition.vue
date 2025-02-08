<template>
  <div 
    v-if="CurrentActivity && state.position"
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
    <KAction
      id="hide-position"
      icon="cancel"
      tooltip="KPosition.HIDE"      
      size="sm"
      :handler="onHide"
    />
  </div>
</template>

<script setup>
import _ from 'lodash'
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { Notify, copyToClipboard } from 'quasar'
import { Store, Layout, i18n, utils as kdkCoreUtils } from '../../../core.client'
import { formatUserCoordinates } from '../utils'
import { useCurrentActivity } from '../composables/activity.js'
import KAction from '../../../core/client/components/action/KAction.vue'

// Props
const props = defineProps({
  size: {
    type: Number,
    default: 48
  }
})

// Data
const { CurrentActivityContext, CurrentActivity } = useCurrentActivity()
const { state } = CurrentActivityContext
const position = ref(state.position)

// Computed
const formattedPosition = computed(() => {
  if (_.isNil(position.value)) return i18n.t('KPositionIndicator.OUTSIDE_MAP')
  return formatUserCoordinates(position.value.latitude, position.value.longitude, Store.get('locationFormat', 'FFf'))
})

// Watch
watch(() => state.position, () => {
  if (state.position) show()
  else hide()
})

// Function
function updatePosition () {
  position.value = CurrentActivity.value.is2D() ? CurrentActivity.value.getCenter() : CurrentActivity.value.getCameraEllipsoidTarget()
}
function show () {
  // Update page content with sticky target
  const target = {
    id: 'position-target',
    component: 'QImg',
    src: 'icons/kdk/target.svg',
    height: `${props.size}px`,
    width: `${props.size}px`,
    position: 'center',
    offset: [0, -props.size / 2],
    style: 'pointer-events: none; background-color: #00000020; border-radius: 50%;'
  }
  console.log(target)
  kdkCoreUtils.bindContent(target, CurrentActivity.value)
  const stickies = Layout.getStickies().components
  stickies.splice(stickies.length, 0, target)
  // Listen move events
  CurrentActivity.value.$engineEvents.on('movestart', updatePosition)
  CurrentActivity.value.$engineEvents.on('move', updatePosition)
  CurrentActivity.value.$engineEvents.on('moveend', updatePosition)
  // Update the position
  updatePosition()
}
function hide () {
  const stickies = Layout.getStickies().components
  const index = _.findIndex(stickies, component => component.id === 'position-target')
  if (index >= 0) stickies.splice(index, 1)
  // Stop listening move events
  CurrentActivity.value.$engineEvents.off('movestart', updatePosition)
  CurrentActivity.value.$engineEvents.off('move', updatePosition)
  CurrentActivity.value.$engineEvents.off('moveend', updatePosition) 
}
async function onCopy () {
  try {
    await copyToClipboard(formattedPosition.value)
    Notify.create({ type: 'positive', message: i18n.t('KPositionIndicator.POSITION_COPIED') })
  } catch (error) {
    Notify.create({ type: 'negative', message: i18n.t('KPositionIndicator.CANNOT_COPY_POSITION') })
  }
}
function onHide () {
  Object.assign(state, { position: false })
}

// Hooks
onBeforeUnmount(() => {
  if (state.position) onHide()
})
</script>

<style lang="scss" scoped>
.k-position {
  border-radius: 24px;
  border: 1px solid #dedede;
  background-color: #dedede;
}
</style>