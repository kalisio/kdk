<template>
  <q-layout
    v-if="layout"
    v-bind="layout.options"
  >
    <!-- Header -->
    <q-header
      v-if="header.components"
      v-model="isHeaderVisible"
    >
      <KPanel
        id="header-panel"
        :content="header.components"
        :mode="header.mode"
        :filter="header.filter"
      />
    </q-header>
    <!-- Footer -->
    <q-footer
      v-if="footer.components"
      v-model="isFooterVisible"
    >
      <KPanel
        id="footer-panel"
        :content="footer.components"
        :mode="footer.mode"
        :filter="footer.filter"
      />
    </q-footer>
    <!-- Page container -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed } from 'vue'
import { Layout } from '../../layout'
import KPanel from '../KPanel.vue'

// Data
const layout = Layout.get()
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
</script>
