<template>
  <k-action 
    id="locate-user" 
    icon="las la-crosshairs" 
    tooltip="mixins.activity.SHOW_USER_LOCATION" 
    :toggle="{ tooltip: 'mixins.activity.HIDE_USER_LOCATION' }"
    :disabled="!isEnabled "
    @triggered="onClicked" />
</template>

<script>
export default {
  name: 'k-locate-user',
  inject: ['kActivity'],
  props: {
    dense: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      isEnabled: false
    }
  },
  methods: {
    onClicked (isToggled) {
      if (isToggled) this.kActivity.showUserLocation()
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
