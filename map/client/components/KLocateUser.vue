<template>
  <KAction
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
import { ref, inject } from 'vue'
import KAction from '../../../core/client/components/KAction.vue'
import { Geolocation } from '../geolocation.js'

// inject
const kActivity = inject('kActivity')

// data
const isEnabled = ref(true)
const isToggled = ref(kActivity.isUserLocationVisible())

// function
async function onToggled (context, toggled) {
  if (toggled) {
    await Geolocation.update()
    if (Geolocation.get().error) isEnabled.value = false
    else kActivity.showUserLocation()
  } else {
    kActivity.hideUserLocation()
  }
}

</script>
