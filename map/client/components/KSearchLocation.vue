<template>
  <k-place-chooser v-model="location" :dense="dense" />
</template>

<script>
export default {
  name: 'k-search-location',
  inject: ['kActivity'],
  props: {
    dense: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      location: null
    }
  },
  watch: {
    location: function (value) {
      if (this.location) this.kActivity.center(this.location.longitude, this.location.latitude)
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-place-chooser'] = this.$load('input/KPlaceChooser')
  }
}
</script>
