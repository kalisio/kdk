<template>
  <div id="navigation-bar" class="column k-navigation-bar">
    <div class="row items-center q-gutter-sm no-wrap">
      <!--
        Track mode
       -->
      <template v-if="mode === 'trackbar' && hasPositionIndicator">
        <q-btn id="navigation-back" icon="las la-arrow-left" color="primary" round flat @click="mode = 'toolbar'" >
          <q-tooltip>{{ $t('KNavigationBar.BACK') }}</q-tooltip>
        </q-btn>
        <q-separator vertical />
        <k-position-indicator />
      </template>
      <!--
        Search mode
       -->
      <template v-if="mode === 'searchbar' && hasLocationInput">
        <q-btn id="navigation-back" icon="las la-arrow-left" color="primary" round flat @click="mode = 'toolbar'" >
          <q-tooltip>{{ $t('KNavigationBar.BACK') }}</q-tooltip>
        </q-btn>
        <q-separator vertical />
        <k-location-input class="full-width q-pr-sm" :user="false" :map="null" :search="true" :dense="true" style="" @input="onLocationChanged" />
      </template>
      <!--
        Toolbar maode
       -->
      <template v-if="mode === 'toolbar'">
        <!-- Before section -->
        <k-tool-bar v-if="hasBeforeActions" :actions="navigationBar.actions.before" color="primary" />
        <!-- Location indicator  -->
        <q-btn v-if="hasPositionIndicator" id="track-location"
          icon="las la-crosshairs" color="primary" round flat @click="mode = 'trackbar'" >
          <q-tooltip>{{ $t('KNavigationBar.TRACK') }}</q-tooltip>
        </q-btn>
        <!-- Location input -->
        <q-btn v-if="hasLocationInput" id="search-location"
          icon="las la-search" color="primary" round flat @click="mode = 'searchbar'" >
          <q-tooltip>{{ $t('KNavigationBar.SEARCH') }}</q-tooltip>
        </q-btn>
        <k-location-input id="location-input" :user="geolocationAvailable" :geolocated="geolocated" :map="null" :search="false" :dense="true" style="" @input="onLocationChanged" />
         <!-- After section -->
        <k-tool-bar v-if="hasAfterActions" :actions="navigationBar.actions.after" color="primary" />
      </template>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'k-navigation-bar',
  inject: ['kActivity'],
  computed: {
    hasBeforeActions () {
      return _.get(this.navigationBar, 'actions.before', []).length > 0
    },
    hasAfterActions () {
      return _.get(this.navigationBar, 'actions.after', []).length > 0
    },
    hasPositionIndicator () {
      return _.get(this.navigationBar, 'positionIndicator', true)
    },
    hasLocationInput () {
      return _.get(this.navigationBar, 'locationInput', true)
    }
  },
  data () {
    return {
      navigationBar: this.$store.get('navigationBar'),
      mode: 'toolbar',
      geolocated: false,
      geolocationAvailable: true
    }
  },
  methods: {
    onLocationChanged (location) {
      // On search simply center on requested location
      // On geolocation toggle user location
      if (this.mode === 'searchbar') {
        this.kActivity.center(location.longitude, location.latitude)
      } else if (!this.kActivity.isUserLocationVisible()) {
        this.kActivity.showUserLocation()
        this.geolocated = true
      } else {
        this.kActivity.hideUserLocation()
        this.geolocated = false
      }
    },
    geolocate () {
      if (!this.kActivity.engineReady) {
        // logger.error('Engine not ready to geolocate')
        return
      }
      const position = this.$store.get('user.position')
      if (position) this.kActivity.center(position.longitude, position.latitude)
    },
    onGeolocationError (error) {
      // Remove geolocation action if not allowed by user
      if (error.code === 'GEOLOCATION_PERMISSION_DENIED') {
        this.geolocationAvailable = false
      }
    }
  },
  created () {
    this.$options.components['k-tool-bar'] = this.$load('layout/KToolBar')
    this.$options.components['k-position-indicator'] = this.$load('KPositionIndicator')
    this.$options.components['k-location-input'] = this.$load('KLocationInput')
    this.$events.$on('user-position-changed', this.geolocate)
    this.$events.$on('error', this.onGeolocationError)
    // Check for any geolocation error that has already occured
    if (this.$store.has('user.positionError')) this.onGeolocationError(this.$store.get('user.positionError'))
  },
  beforeDestroy () {
    this.$events.$off('user-position-changed', this.geolocate)
    this.$events.$off('error', this.onGeolocationError)
  }
}
</script>

<style lang="stylus">
.k-navigation-bar {
  border: solid 1px lightgrey;
  border-radius: 5px;
  background: #ffffff
}

.k-navigation-bar:hover {
  border: solid 1px $primary;
}
</style>
