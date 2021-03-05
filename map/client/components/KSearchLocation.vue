<template>
  <k-place-chooser @place-chosen="onPlaceChosen" :style="computedStyle" />
</template>

<script>
export default {
  name: 'k-search-location',
  inject: ['kActivity'],
  computed: {
    computedStyle () {
      if (this.$q.screen.lt.md) return 'width: 90vw'
      if (this.$q.screen.lt.lg) return 'width: 60vw'
      return 'width: 50vw'
    }
  },
  methods: {
    onPlaceChosen (location) {
      if (location) this.kActivity.center(location.longitude, location.latitude)
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-place-chooser'] = this.$load('input/KPlaceChooser')
  }
}
</script>
