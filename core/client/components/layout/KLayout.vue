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
        this.$layout.setHeaderVisible(value)
      }
    },
    isFooterVisible: {
      get: function () {
        return this.footer.visible
      },
      set: function (value) {
        this.$layout.setFooterVisible(value)
      }
    },
    isLeftDrawerVisible: {
      get: function () {
        return this.leftDrawer.visible
      },
      set: function (value) {
        this.$layout.setLeftDrawerVisible(value)
      }
    },
    isRightDrawerVisible: {
      get: function () {
        return this.rightDrawer.visible
      },
      set: function (value) {
        this.$layout.setRightDrawerVisible(value)
      }
    }
  },
  data () {
    return {
      header: this.$layout.getHeader(),
      footer: this.$layout.getFooter(),
      leftDrawer: this.$layout.getLeftDrawer(),
      rightDrawer: this.$layout.getRightDrawer(),
      config: {}
    }
  },
  created () {
    // Load the required component
    this.$options.components['k-panel'] = this.$load('frame/KPanel')
    // Load the options from the configuration
    this.config = this.$config('layout')
    // Configures the components if needed
    if (this.config.header) {
      const header = this.config.header
      this.$layout.setHeader(_.get(header, 'content', null), _.get(header, 'mode', undefined), _.get(header, 'visible', false))
    }
    if (this.config.footer) {
      const footer = this.config.footer
      this.$layout.setFooter(_.get(footer, 'content', null), _.get(footer, 'mode', undefined), _.get(footer, 'visible', false))
    }
    if (this.config.leftDrawer) {
      const leftDrawer = this.config.leftDrawer
      this.$layout.setLeftDrawer(_.get(leftDrawer, 'content', null), _.get(leftDrawer, 'mode', undefined), _.get(leftDrawer, 'visible', false))
    }
    if (this.config.rightDrawer) {
      const rightDrawer = this.config.rightDrawer
      this.$layout.setRightDrawer(_.get(rightDrawer, 'content', null), _.get(rightDrawer, 'mode', undefined), _.get(rightDrawer, 'visible', false))
    }
  }
}
</script>

<style>
.q-drawer__opener {
  width: 0px;
}
</style>
