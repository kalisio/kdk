<template>
  <q-layout ref="layout" v-bind="config">
    <!--
      AppBar, TabBar and SearchBar
    -->
    <q-header>
      <k-app-bar id="app-bar" />
      <k-tab-bar id="tab-bar" />
      <k-search-bar id="search-bar" />
    </q-header>
    <!--
      Left drawer
    -->
    <q-drawer v-if="leftDrawerComponent" v-model="isLeftDrawerVisible" v-bind="config.leftDrawer" side="left" bordered>
      <component :is="leftDrawerComponent" v-bind="leftDrawer.props" />
    </q-drawer>
     <!--
      Right drawer
     -->
    <q-drawer v-if="rightDrawerComponent" v-model="isRightDrawerVisible" v-bind="config.rightDrawer" side="right" bordered>
      <component :is="rightDrawerComponent" v-bind="rightDrawer.props" />
    </q-drawer>
     <!--
      Footer
     -->
    <q-footer v-if="footerComponent" v-model="isFooterVisible" v-bind="config.footer" bordered>
      <component :is="footerComponent" v-bind="footer.props" />
    </q-footer>
    <!--
      Page container
    -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'k-layout',
  computed: {
    isLeftDrawerVisible: {
      get: function () {
        return this.leftDrawer.visible
      },
      set: function (value) {
        this.$store.patch('leftDrawer', { visible: value })
      }
    },
    leftDrawerComponent () {
      if (!this.leftDrawer || !this.leftDrawer.component) return null
      const componentKey = _.kebabCase(this.leftDrawer.component)
      this.$options.components[componentKey] = this.$load(this.leftDrawer.component)
      return componentKey
    },
    isRightDrawerVisible: {
      get: function () {
        return this.rightDrawer.visible
      },
      set: function (value) {
        this.$store.patch('rightDrawer', { visible: value })
      }
    },
    rightDrawerComponent () {
      if (!this.rightDrawer || !this.rightDrawer.component) return null
      const componentKey = _.kebabCase(this.rightDrawer.component)
      this.$options.components[componentKey] = this.$load(this.rightDrawer.component)
      return componentKey
    },
    isFooterVisible: {
      get: function () {
        return this.footer.visible
      },
      set: function (value) {
        this.$store.patch('footer', { visible: value })
      }
    },
    footerComponent () {
      if (!this.footer || !this.footer.component) return null
      const componentKey = _.kebabCase(this.footer.component)
      this.$options.components[componentKey] = this.$load(this.footer.component)
      return componentKey
    }
  },
  data () {
    return {
      leftDrawer: this.$store.get('leftDrawer'),
      rightDrawer: this.$store.get('rightDrawer'),
      footer: this.$store.get('footer'),
      config: {}
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-app-bar'] = this.$load('layout/KAppBar')
    this.$options.components['k-search-bar'] = this.$load('layout/KSearchBar')
    this.$options.components['k-tab-bar'] = this.$load('layout/KTabBar')
    // Load the options from the configuration
    this.config = this.$config('layout')
    // Setup the left drawer using the configuration
    this.$store.patch('leftDrawer', {
      component: _.get(this.config, 'leftDrawer.component.name', null),
      props: _.get(this.config, 'leftDrawer.component.props', {}),
      visible: _.get(this.config, 'leftDrawer.visible', false)
    })
    // Setup the right drawer using the configuration
    this.$store.patch('rightDrawer', {
      component: _.get(this.config, 'rightDrawer.component.name', null),
      props: _.get(this.config, 'rightDrawer.component.props', {}),
      visible: _.get(this.config, 'rightDrawer.visible', false)
    })
    // Setup the footer using the configuration
    this.$store.patch('footer', {
      component: _.get(this.config, 'footer.component.name', null),
      props: _.get(this.config, 'footer.component.props', {}),
      visible: _.get(this.config, 'footer.visible', false)
    })
  }
}
</script>

<style>
.q-drawer__opener {
  width: 0px;
}
</style>
