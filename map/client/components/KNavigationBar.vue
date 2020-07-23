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
        <k-location-input id="location-input" :user="true" :map="null" :search="false" :dense="true" style="" @input="onLocationChanged" />
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
      mode: 'toolbar'
    }
  },
  methods: {
    onLocationChanged (location) {
      if (location) this.kActivity.center(location.longitude, location.latitude)
    }
  },
  created () {
    this.$options.components['k-tool-bar'] = this.$load('layout/KToolBar')
    this.$options.components['k-position-indicator'] = this.$load('KPositionIndicator')
    this.$options.components['k-location-input'] = this.$load('KLocationInput')
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
