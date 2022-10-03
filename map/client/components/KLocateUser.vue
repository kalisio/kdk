<template>
  <KAction
    id="locate-user"
    icon="las la-crosshairs"
    tooltip="mixins.activity.SHOW_USER_LOCATION"
    :toggle="{ tooltip: 'mixins.activity.HIDE_USER_LOCATION' }"
    :toggled="isToggled"
    :disabled="!isEnabled "
    @triggered="onClicked"
  />
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'
import KAction from '../../../core/client/components/frame/KAction.vue'
import { Geolocation } from '../geolocation.js'

// inject
const kActivity = inject('kActivity')

// data
const isEnabled = ref(false)
const isToggled = ref(kActivity.isUserLocationVisible())

// function
function onClicked (context, toggled) {
  if (toggled) kActivity.showUserLocation()
  else kActivity.hideUserLocation()
}

// hook
onMounted(async () => {
  if (await Geolocation.update()) isEnabled.value = true
})
</script>
