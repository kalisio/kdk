<template>
  <div v-if="isVisible" class="row items-center k-navigation-bar no-wrap">
    <!--
      Before section
    -->
    <template v-if="(mode ==='toolbar') && hasBeforeActions">
      <k-tool-bar :actions="navigationBar.actions.before" />
    </template>
    <!--
      The location input
    -->
    <template v-if="hasLocationInput">
      <q-btn v-if="(mode === 'searchbar')" icon="arrow_back" color="primary" round flat @click="mode = 'toolbar'" >
        <q-tooltip>{{ $t('KNavigationBar.BACK') }}</q-tooltip>
      </q-btn>
      <k-location-input
        :class="(mode === 'searchbar') ? 'full-width q-pr-sm' : ''"
        :user="(mode === 'toolbar')"
        :map="null"
        :search="(mode === 'searchbar')"
        :dense="true"
        :style=""
        @input="onLocationChanged" />
      <q-btn v-if="(mode === 'toolbar')" icon="search" color="primary" round flat @click="mode = 'searchbar'" >
        <q-tooltip>{{ $t('KNavigationBar.SEARCH') }}</q-tooltip>
      </q-btn>
    </template>
    <!--
      After section
    -->
    <template v-if="(mode === 'toolbar') && hasAfterActions">
      <k-tool-bar :actions="navigationBar.actions.after" />
    </template>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'k-navigation-bar',
  inject: ['kActivity'],
  data () {
    return {
      navigationBar: this.$store.get('navigationBar'),
      mode: 'toolbar'
    }
  },
  computed: {
    hasBeforeActions () { return _.get(this.navigationBar, 'actions.before', []).length > 0 },
    hasAfterActions () { return _.get(this.navigationBar, 'actions.after', []).length > 0 },
    hasLocationInput () { return _.get(this.navigationBar, 'locationInput') },
    isVisible () { return this.hasBeforeActions || this.hasAfterActions || this.hasLocationInput }
  },
  methods: {
    onLocationChanged (location) {
      if (location) this.kActivity.center(location.longitude, location.latitude)
    }
  },
  created () {
    this.$options.components['k-tool-bar'] = this.$load('layout/KToolBar')
    this.$options.components['k-location-input'] = this.$load('KLocationInput')
  }
}
</script>

<style lang="stylus">
.k-navigation-bar {
  border: solid 1px lightgrey;
  border-radius: 8px;
  background: #ffffff
}

.k-navigation-bar:hover {
  border: solid 1px $primary;
}
</style>
