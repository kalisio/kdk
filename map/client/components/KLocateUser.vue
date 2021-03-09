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
export default {
  name: 'k-locate-user',
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
    // Load the required components
    this.$options.components['k-action'] = this.$load('frame/KAction')
    // Update the geolocation
    if (await this.$geolocation.update()) this.isEnabled = true
  }
}
</script>
