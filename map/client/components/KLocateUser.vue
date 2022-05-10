<template>
  <k-action
    id="locate-user"
    icon="las la-crosshairs"
    tooltip="mixins.activity.SHOW_USER_LOCATION"
    :toggle="{ tooltip: 'mixins.activity.HIDE_USER_LOCATION' }"
    :toggled="isToggled"
    :disabled="!isEnabled "
    @triggered="onClicked" />
</template>

<script>
import KAction from '../../../core/client/components/frame/KAction.vue'

export default {
  name: 'k-locate-user',
  components: {
    KAction
  },
  inject: ['kActivity'],
  data () {
    return {
      isEnabled: false,
      isToggled: this.kActivity.isUserLocationVisible()
    }
  },
  methods: {
    onClicked (context, toggled) {
      if (toggled) this.kActivity.showUserLocation()
      else this.kActivity.hideUserLocation()
    }
  },
  async created () {
    // Update the geolocation
    if (await this.$geolocation.update()) this.isEnabled = true
  }
}
</script>
