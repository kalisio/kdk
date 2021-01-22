<template>
  <q-layout v-bind="config">
    <!--
      Header
     -->
    <q-header v-if="header.content" v-model="isHeaderVisible" v-bind="config.header" bordered>
      <k-panel id="header" :content="header.content" :mode="header.mode" />
    </q-header>    
    <!--
      Left drawer
    -->
    <q-drawer v-if="leftDrawer.content" v-model="isLeftDrawerVisible" v-bind="config.leftDrawer" side="left" bordered>
      <k-panel id="left-drawer" :content="leftDrawer.content" :mode="leftDrawer.mode" direction="vertical" />
    </q-drawer>
     <!--
      Right drawer
     -->
    <q-drawer v-if="rightDrawer.content" v-model="isRightDrawerVisible" v-bind="config.rightDrawer" side="right" bordered>
      <k-panel id="right-drawer" :content="rightDrawer.content" :mode="rightDrawer.mode" direction="vertical" />
    </q-drawer>
    <!--
      Footer
     -->
    <q-footer v-if="footer.content" v-model="isFooterVisible" v-bind="config.footer" bordered>
      <k-panel id="footer" :content="footer.content" :mode="footer.mode" />
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
    isHeaderVisible: {
      get: function () {
        return this.header.visible
      },
      set: function (value) {
        this.$store.patch('header', { visible: value })
      }
    },
    isLeftDrawerVisible: {
      get: function () {
        return this.leftDrawer.visible
      },
      set: function (value) {
        this.$store.patch('leftDrawer', { visible: value })
      }
    },
    isRightDrawerVisible: {
      get: function () {
        return this.rightDrawer.visible
      },
      set: function (value) {
        this.$store.patch('rightDrawer', { visible: value })
      }
    },
    isFooterVisible: {
      get: function () {
        return this.footer.visible
      },
      set: function (value) {
        this.$store.patch('footer', { visible: value })
      }
    }
  },
  data () {
    return {
      header: this.$store.get('header'),
      leftDrawer: this.$store.get('leftDrawer'),
      rightDrawer: this.$store.get('rightDrawer'),
      footer: this.$store.get('footer'),
      config: {}
    }
  },
  created () {
    // Load the required component
    this.$options.components['k-panel'] = this.$load('frame/KPanel')
    // Load the options from the configuration
    this.config = this.$config('layout')
    this.$store.patch('header', {
      content: _.get(this.config, 'header.content', null),
      mode: _.get(this.config, 'header.mode', undefined),
      visible: _.get(this.config, 'header.visible', false)
    })
    this.$store.patch('leftDrawer', {
      content: _.get(this.config, 'leftDrawer.content', null),
      mode: _.get(this.config, 'leftDrawer.mode', undefined),
      visible: _.get(this.config, 'leftDrawer.visible', false)
    })
    this.$store.patch('rightDrawer', {
      content: _.get(this.config, 'rightDrawer.content', null),
      mode: _.get(this.config, 'rightDrawer.mode', undefined),
      visible: _.get(this.config, 'rightDrawer.visible', false)
    })
    // Setup the footer using the configuration
    this.$store.patch('footer', {
      content: _.get(this.config, 'footer.content', null),
      mode: _.get(this.config, 'footer.mode', {}),
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
