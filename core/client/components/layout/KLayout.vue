<template>
  <q-layout v-bind="config">
    <!--
      Header
     -->
    <q-header v-if="header.content" v-model="isHeaderVisible" v-bind="config.header" bordered>
      <k-panel id="header" :content="header.content" :mode="header.mode" :filter="header.filter" />
    </q-header>
    <!--
      Footer
     -->
    <q-footer v-if="footer.content" v-model="isFooterVisible" v-bind="config.footer" bordered>
      <k-panel id="footer" :content="footer.content" :mode="footer.mode" :filter="footer.filter" />
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
    }
  },
  data () {
    return {
      header: this.$layout.getHeader(),
      footer: this.$layout.getFooter(),
      config: {}
    }
  },
  created () {
    // Load the required component
    this.$options.components['k-panel'] = this.$load('frame/KPanel')
    // Load the options from the configuration
    this.config = this.$config('layout')
    // Configure the header
    if (this.config.header) {
      const header = this.config.header
      this.$layout.setHeader(_.get(header, 'content', null), _.get(header, 'mode', undefined),
        _.get(header, 'filter', {}), _.get(header, 'visible', false))
    }
    // Configure the footer
    if (this.config.footer) {
      const footer = this.config.footer
      this.$layout.setFooter(_.get(footer, 'content', null), _.get(footer, 'mode', undefined),
        _.get(footer, 'filter', {}), _.get(footer, 'visible', false))
    }
  }
}
</script>
