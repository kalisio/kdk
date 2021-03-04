<template>
  <k-place-chooser @place-chosen="onPlaceChosen" />
</template>

<script>
export default {
  name: 'k-search-location',
  inject: ['kActivity'],
  methods: {
    onPlaceChosen (location) {
      console.log(location)
      if (location) this.kActivity.center(location.longitude, location.latitude)
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-place-chooser'] = this.$load('input/KPlaceChooser')
  }
}
</script>
