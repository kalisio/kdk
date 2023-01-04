<template>
  <q-layout v-bind="config">
    <!--
      Header
     -->
    <q-header
      v-if="header.contents"
      v-model="isHeaderVisible"
      v-bind="config.header"
      bordered
    >
      <KPanel
        id="header"
        :content="header.content"
        :mode="header.mode"
        :filter="header.filter"
      />
    </q-header>
    <!--
      Footer
     -->
    <q-footer
      v-if="footer.content"
      v-model="isFooterVisible"
      v-bind="config.footer"
      bordered
    >
      <KPanel
        id="footer"
        :content="footer.content"
        :mode="footer.mode"
        :filter="footer.filter"
      />
    </q-footer>
    <!--
      Page container
    -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import _ from 'lodash'
import config from 'config'
import { computed } from 'vue'
import { Layout } from '../../layout.js'
import KPanel from '../frame/KPanel.vue'

// Data
const header = Layout.getHeader()
const footer = Layout.getFooter()

// Compputed
const isHeaderVisible = computed({
  get: function () {
    return header.visible
  },
  set: function (value) {
    Layout.setHeaderVisible(value)
  }
})
const isFooterVisible = computed({
  get: function () {
    return footer.visible
  },
  set: function (value) {
    Layout.setFooterVisible(value)
  }
})

// Immediate
const headerConfig = _.get(config, 'layout.header')
if (headerConfig) {
  Layout.setHeader(
    _.get(headerConfig, 'content', null),
    _.get(headerConfig, 'mode', undefined),
    _.get(headerConfig, 'filter', {}),
    _.get(headerConfig, 'visible', false))
}
const footerConfig = _.get(config, 'layout.footer')
if (footerConfig) {
  Layout.setFooter(
    _.get(footerConfig, 'content', null),
    _.get(footerConfig, 'mode', undefined),
    _.get(footerConfig, 'filter', {}),
    _.get(footerConfig, 'visible', false))
}
</script>
