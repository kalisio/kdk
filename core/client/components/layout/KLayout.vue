<template>
  <q-layout ref="layout" v-bind="options">
    <!--
      The AppBar
    -->
    <q-header>
      <k-app-bar id="app-bar" :has-left-drawer-toggle="!leftDrawerIsVisible" @left-drawer-toggled="toggleLeftDrawer" />
      <k-tab-bar id="tab-bar" />
      <k-search-bar id="search-bar" />
    </q-header>
    <!--
      The left drawer
    -->
    <q-drawer v-model="leftDrawerIsVisible" v-bind="options.leftDrawer" side="left" bordered>
      <div v-if="options.leftDrawer.behavior!=='mobile'" class="row justify-end">
        <q-btn id="left-drawer-close" flat color="secondary" icon="chevron_left" @click="toggleLeftDrawer" />
      </div>
      <div v-if="leftDrawerComponent!=''">
        <component :is="leftDrawerComponent" v-bind="leftDrawer.options" />
      </div>
    </q-drawer>
     <!--
      The right drawer
     -->
    <q-drawer v-model="rightDrawerIsVisible" v-bind="options.rightDrawer" side="right" bordered>
      <div v-if="options.rightDrawer.behavior!=='mobile'" class="row justify-start">
        <q-btn id="right-drawer-close" flat color="secondary" icon="chevron_right" @click="toggleRightDrawer" />
      </div>
      <div v-if="rightDrawerComponent!=''">
        <component :is="rightDrawerComponent" v-bind="rightDrawer.options" />
      </div>
    </q-drawer>
    <!--
      The Content area
    -->
    <q-page-container>
      <router-view />
    </q-page-container>
    <!--
     The Fab
    -->
    <k-fab />
  </q-layout>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'k-layout',
  provide () {
    return {
      klayout: this
    }
  },
  computed: {
    leftDrawerComponent () {
      if (!this.leftDrawer || this.leftDrawer.component === '') return ''
      const componentKey = _.kebabCase(this.leftDrawer.component)
      this.$options.components[componentKey] = this.$load(this.leftDrawer.component)
      return componentKey
    },
    rightDrawerComponent () {
      if (!this.rightDrawer || this.rightDrawer.component === '') return ''
      const componentKey = _.kebabCase(this.rightDrawer.component)
      this.$options.components[componentKey] = this.$load(this.rightDrawer.component)
      return componentKey
    }
  },
  data () {
    return {
      leftDrawer: this.$store.get('leftDrawer'),
      leftDrawerIsVisible: false,
      rightDrawer: this.$store.get('rightDrawer'),
      rightDrawerIsVisible: false,
      options: {}
    }
  },
  methods: {
    showLeftDrawer () {
      this.leftDrawerIsVisible = true
    },
    hideLeftDrawer () {
      this.leftDrawerIsVisible = false
    },
    toggleLeftDrawer () {
      this.leftDrawerIsVisible = !this.leftDrawerIsVisible
    },
    showRightDrawer () {
      this.rightDrawerIsVisible = true
    },
    hideRightDrawer () {
      this.rightDrawerIsVisible = false
    },
    toggleRightDrawer () {
      this.rightDrawerIsVisible = !this.rightDrawerIsVisible
    }
  },
  created () {
    // Load the options from the configuration
    this.options = this.$config('layout')
    // Load the required components
    this.$options.components['k-app-bar'] = this.$load(_.get(this.options, 'appBar', 'layout/KAppBar'))
    this.$options.components['k-search-bar'] = this.$load(_.get(this.options, 'searchBar', 'layout/KSearchBar'))
    this.$options.components['k-tab-bar'] = this.$load(_.get(this.options, 'tabBar', 'layout/KTabBar'))
    this.$options.components['k-fab'] = this.$load(_.get(this.options, 'fab', 'layout/KFab'))
    // Setup the left and right drawers
    this.$store.patch('leftDrawer', {
      component: _.get(this.options, 'leftDrawer.component.name', ''),
      options: _.get(this.options, 'leftDrawer.component.options', {})
    })
    this.leftDrawerIsVisible = _.get(this.options, 'leftDrawer.isVisible', false)
    this.$store.patch('rightDrawer', {
      component: _.get(this.options, 'rightDrawer.component.name', ''),
      options: _.get(this.options, 'rightDrawer.component.options', {})
    })
    this.rightDrawerIsVisible = _.get(this.options, 'rightDrawer.isVisible', false)
  }
}
</script>
