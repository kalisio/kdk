<template>
  <KAction
    v-if="CurrentActivity"
    id="locate-user"
    icon="las la-crosshairs"
    tooltip="mixins.activity.SHOW_USER_LOCATION"
    :toggle="{ tooltip: 'mixins.activity.HIDE_USER_LOCATION' }"
    :toggled="isToggled"
    :disabled="!isEnabled "
    @toggled="onToggled"
  />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import KAction from '../../../../core/client/components/action/KAction.vue'
import { useCurrentActivity } from '../../composables'
import { Geolocation } from '../../geolocation.js'

// Data
const { CurrentActivity } = useCurrentActivity()
const isEnabled = ref(true)
const isToggled = ref(false)

// Functions
async function onToggled (context, toggled) {
  if (toggled) {
    await Geolocation.update()
    if (Geolocation.get().error) isEnabled.value = false
    else {
      CurrentActivity.value.showUserLocation()
      isToggled.value = true
    }
  } else {
    CurrentActivity.value.hideUserLocation()
    isToggled.value = false
  }
}

// Hooks
onMounted(() => {
  if (CurrentActivity.value) isToggled.value = CurrentActivity.value.isUserLocationVisible()
  
})
onBeforeUnmount(() => {
  if (CurrentActivity.value) CurrentActivity.value.hideUserLocation()
})
</script>
