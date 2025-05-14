<template>
  <q-layout
    :view="layout.view"
  >
    <!-- Left pane -->
    <div v-if="hasLeftPaneComponents">
      <q-page-sticky
        v-if="leftPane.opener"
        position="left"
        :offset="[openerOffset, 0]"
        class="k-left-pane-sticky"
      >
        <KOpener
          id="left-opener"
          v-model="isLeftPaneOpened"
          position="left"
        />
      </q-page-sticky>
      <q-drawer
        id="left-pane"
        v-model="isLeftPaneOpened"
        :width="leftPaneSize"
        side="left"
        overlay
        :behavior="$q.platform.is.mobile ? 'mobile' : 'desktop'"
        no-swipe-open
        no-swipe-close
        no-swipe-backdrop
        class="k-left-drawer"
      >
        <q-scroll-area class="fit">
          <KPanel
            id="left-panel"
            :content="leftPane.components"
            :mode="leftPane.mode"
            :filter="leftPane.filter"
            @triggered="closeLeftPane"
          />
        </q-scroll-area>
      </q-drawer>
    </div>
    <!-- Header -->
    <q-header
      v-if="hasHeaderComponents"
      v-model="isHeaderVisible"
    >
      <q-resize-observer @resize="onHeaderResized" />
      <KPanel
        id="header-panel"
        :content="header.components"
        :mode="header.mode"
        :filter="header.filter"
      />
    </q-header>
    <!-- Footer -->
    <q-footer
      v-if="hasFooterComponents"
      v-model="isFooterVisible"
    >
      <q-resize-observer @resize="onFooterResized" />
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
import _ from 'lodash'
import { ref, computed, watch } from 'vue'
import { computeResponsiveWidth } from '../../utils'
import { Layout } from '../../layout'
import KOpener from './KOpener.vue'
import KPanel from '../KPanel.vue'

// Data
const layout = Layout.get()
const leftPane = Layout.getPane('left')
const header = Layout.getHeader()
const footer = Layout.getFooter()
const openerOffset = ref(0)

// Computed
const hasHeaderComponents = computed(() => {
  return !_.isEmpty(header.components)
})
const isHeaderVisible = computed({
  get: function () {
    return header.visible
  },
  set: function (value) {
    Layout.setHeaderVisible(value)
  }
})
const hasFooterComponents = computed(() => {
  return !_.isEmpty(footer.components)
})
const isFooterVisible = computed({
  get: function () {
    return footer.visible
  },
  set: function (value) {
    Layout.setFooterVisible(value)
  }
})
const hasLeftPaneComponents = computed(() => {
  return !_.isEmpty(leftPane.components)
})
const leftPaneSize = computed(() => {
  return computeResponsiveWidth(leftPane.sizes)
})
const isLeftPaneOpened = computed({
  get: function () {
    return leftPane.visible
  },
  set: function (value) {
    Layout.setPaneVisible('left', value)
  }
})

// Watch
watch(() => leftPane.visible, (visible) => {
  if (visible) {
    setTimeout(() => {
      openerOffset.value = leftPaneSize.value
      document.addEventListener('click', clickOutsideLeftPanelListener, true)
    }, 100)
  } else {
    document.removeEventListener('click', clickOutsideLeftPanelListener, true)
    openerOffset.value = 0
  }
}, { immediate: true })
watch(leftPaneSize, () => {
  if (openerOffset.value > 0) openerOffset.value = leftPaneSize.value
})

// Functions
function closeLeftPane () {
  Layout.setPaneVisible('left', false)
}
function clickOutsideLeftPanelListener (event) {
  const leftPanelElement = document.getElementById('left-panel')
  if (leftPanelElement && leftPanelElement.contains(event.target)) return
  const leftOpenerElement = document.getElementById('left-opener')
  if (leftOpenerElement && leftOpenerElement.contains(event.target)) return
  Layout.setPaneVisible('left', false)
}
function onHeaderResized (size) {
  Layout.setHeaderSize([size.width, size.height])
}
function onFooterResized (size) {
  Layout.setFooterSize([size.width, size.height])
}
</script>

<style lang="scss">
.k-left-pane-sticky {
  z-index: v-bind('leftPane.zIndex');
}
.k-left-drawer {
  background-color: #FFFFFF;
  border-right: solid 1px lightgrey;
}
.k-left-drawer:hover {
  border-right: solid 1px $primary;
}
</style>
