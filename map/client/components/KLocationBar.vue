<template>
  <div class="row items-center q-pa-none">
    <!--
      The location input
     -->
    <div v-show="isVisible" :style="inputWidth()">
      <k-location-input
        class="k-location-bar-frame"
        :location-map="null"
        :dense="true"
        @input="onLocationChanged" />
    </div>
    <!--
        The toggle control
      -->
    <q-btn :icon="isVisible ? 'chevron_left' : 'search'" :dense="isVisible" color="secondary" @click="toggle()">
    </q-btn>
  </div>
</template>

<script>
import * as mixins from '../mixins'

export default {
  name: 'k-location-bar',
  mixins: [
    mixins.geolocation
  ],
  data () {
    return {
      isVisible: false
    }
  },
  methods: {
    inputWidth () {
      if (this.$q.screen.lt.xs) return 'width: 50vw'
      if (this.$q.screen.lt.sm) return 'width: 60vw'
      if (this.$q.screen.lt.md) return 'width: 70vw'
      if (this.$q.screen.lt.lg) return 'width: 80vw'
      return 'width: 85vw'
    },
    toggle () {
      this.isVisible = !this.isVisible
    },
    onLocationChanged (location) {
      if (location) this.$emit('location-changed', location)
    }
  },
  created () {
    this.$options.components['k-location-input'] = this.$load('KLocationInput')
  }
}
</script>

<style>
.k-location-bar-frame {
  border: solid 1px lightgrey;
  border-radius: 8px;
  background: #ffffff
}

.k-location-bar-frame:hover {
  border: solid 1px grey;
}
</style>
