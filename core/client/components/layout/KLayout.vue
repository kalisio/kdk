<template>
  <q-layout ref="layout" v-bind="options">
    <!--
      AppBar, TabBar and SearchBar
    -->
    <q-header>
      <k-app-bar id="app-bar" :has-left-drawer-toggle="!isLeftDrawerVisible" @left-drawer-toggled="toggleLeftDrawer" />
      <k-tab-bar id="tab-bar" />
      <k-search-bar id="search-bar" />
    </q-header>
    <!--
      Left drawer
    -->
    <q-drawer v-if="leftDrawerComponent" v-model="isLeftDrawerVisible" v-bind="options.leftDrawer" side="left" bordered>
      <component :is="leftDrawerComponent" v-bind="leftDrawer.options" />
    </q-drawer>
     <!--
      Right drawer
     -->
    <q-drawer v-if="rightDrawerComponent" v-model="isRightDrawerVisible" v-bind="options.rightDrawer" side="right" bordered>
      <component :is="rightDrawerComponent" v-bind="rightDrawer.options" />
    </q-drawer>
     <!--
      Footer
     -->
    <q-footer v-if="footerComponent" v-model="isFooterVisible" v-bind="options.footer" bordered>
      <component :is="footerComponent" v-bind="footer.options" />
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
  provide () {
    return {
      klayout: this
    }
  },
  computed: {
    leftDrawerComponent () {
      if (!this.leftDrawer || !this.leftDrawer.component) return null
      const componentKey = _.kebabCase(this.leftDrawer.component)
      this.$options.components[componentKey] = this.$load(this.leftDrawer.component)
      return componentKey
    },
    rightDrawerComponent () {
      if (!this.rightDrawer || !this.rightDrawer.component) return null
      const componentKey = _.kebabCase(this.rightDrawer.component)
      this.$options.components[componentKey] = this.$load(this.rightDrawer.component)
      return componentKey
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
      isLeftDrawerVisible: false,
      rightDrawer: this.$store.get('rightDrawer'),
      isRightDrawerVisible: false,
      footer: this.$store.get('footer'),
      isFooterVisible: true,
      options: {}
    }
  },
  methods: {
    showLeftDrawer () {
      this.isLeftDrawerVisible = true
    },
    hideLeftDrawer () {
      this.isLeftDrawerVisible = false
    },
    toggleLeftDrawer () {
      this.isLeftDrawerVisible = !this.isLeftDrawerVisible
    },
    showRightDrawer () {
      this.isRightDrawerVisible = true
    },
    hideRightDrawer () {
      this.isRightDrawerVisible = false
    },
    toggleRightDrawer () {
      this.isRightDrawerVisible = !this.isRightDrawerVisible
    },
    showFooter () {
      this.isFooterVisible = true
    },
    hideFooter () {
      this.isFooterVisible = false
    },
    toggleFooter () {
      this.isFooterVisible = !this.isFooterVisible
    }
  },
  created () {
    // Load the options from the configuration
    this.options = this.$config('layout')
    // Load the required components
    this.$options.components['k-app-bar'] = this.$load(_.get(this.options, 'appBar', 'layout/KAppBar'))
    this.$options.components['k-search-bar'] = this.$load(_.get(this.options, 'searchBar', 'layout/KSearchBar'))
    this.$options.components['k-tab-bar'] = this.$load(_.get(this.options, 'tabBar', 'layout/KTabBar'))
    // Setup the left and right drawers
    this.$store.patch('leftDrawer', {
      component: _.get(this.options, 'leftDrawer.component.name', null),
      options: _.get(this.options, 'leftDrawer.component.options', {})
    })
    this.$store.patch('rightDrawer', {
      component: _.get(this.options, 'rightDrawer.component.name', null),
      options: _.get(this.options, 'rightDrawer.component.options', {})
    })
    // Setup the footer
    this.$store.patch('footer', {
      component: _.get(this.options, 'footer.component.name', null),
      options: _.get(this.options, 'footer.component.options', {})
    })
  }
}
</script>

<style>
.q-drawer__opener {
  width: 0px;
}
</style>
