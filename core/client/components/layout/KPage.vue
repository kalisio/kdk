<template>
  <q-page :padding="padding">
    <!--
      Specific page content
     -->
    <slot name="page-content"></slot>
    <!--
      Managed stickies
     -->
    <q-page-sticky position="top" :offset="widgetOffset">
      <k-window ref="window" />
    </q-page-sticky>
    <q-page-sticky v-if="hasLeftDrawerOpener && hasLeftDrawerComponent" position="left">
      <k-opener v-model="isLeftDrawerOpened" position="left"  />
    </q-page-sticky>
    <q-page-sticky v-if="hasRightDrawerOpener && hasRightDrawerComponent" position="right">
      <k-opener  v-model="isRightDrawerOpened" position="right" />
    </q-page-sticky>
    <q-page-sticky v-if="hasFooterOpened && hasFooterComponent" position="bottom">
      <k-opener  v-model="isFooterOpened" position="bottom" />
    </q-page-sticky>
    <q-page-sticky position="bottom-right" :offset="fabOffset">
      <k-fab />
    </q-page-sticky>
  </q-page>
</template>

<script>
export default {
  name: 'k-page',
  inject: ['klayout'],
  props: {
    padding: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      widgetOffset: [0, 0],
      fabOffset: [16, 16],
      hasLeftDrawerOpener: false,
      hasLeftDrawerComponent: !!this.klayout.leftDrawer.component,
      isLeftDrawerOpened: this.klayout.isLeftDrawerVisible,
      hasRightDrawerOpener: false,
      hasRightDrawerComponent: !!this.klayout.rightDrawer.component,
      isRightDrawerOpened: this.klayout.isRightDrawerVisible,
      hasFooterOpened: false,
      hasFooterComponent: !!this.klayout.footer.component,
      isFooterOpened: this.klayout.isFooterVisible
    }
  },
  watch: {
    'klayout.isLeftDrawerVisible': function (isVisible) {
      this.isLeftDrawerOpened = isVisible
    },
    'klayout.leftDrawer.component': function (component) {
      this.hasLeftDrawerComponent = !!component
    },
    isLeftDrawerOpened: function (isOpened) {
      this.klayout.isLeftDrawerVisible = isOpened
    },
    'klayout.isRightDrawerVisible': function (isVisible) {
      this.isRightDrawerOpened = isVisible
    },
    'klayout.rightDrawer.component': function (component) {
      this.hasRightDrawerComponent = !!component
    },
    isRightDrawerOpened: function (isOpened) {
      this.klayout.isRightDrawerVisible = isOpened
    },
    'klayout.isFooterVisible': function (isVisible) {
      this.isRightDrawerOpened = isVisible
    },
    'klayout.footer.component': function (component) {
      this.hashasFooterComponent = !!component
    },
    isFooterOpened: function (isOpened) {
      this.klayout.isFooterVisible = isOpened
    }
  },
  created () {
    // load the required components
    this.$options.components['k-opener'] = this.$load('frame/KOpener')
    this.$options.components['k-window'] = this.$load('layout/KWindow')
    this.$options.components['k-fab'] = this.$load('layout/KFab')
    // Read drawers configuration to check whether openers have to be displayed or not
    this.hasLeftDrawerOpener = this.$config('layout.leftDrawer.opener', false)
    this.hasRightDrawerOpener = this.$config('layout.rightDrawer.opener', false)
    this.hasFooterOpened = this.$config('layout.footer.opener', false)
  }
}
</script>
