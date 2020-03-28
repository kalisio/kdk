<template>
  <q-page :padding="padding">

    <!--
      Specific page content
     -->
    <slot name="page-content"></slot>

    <!--
      Managed stickies
     -->      
    <q-page-sticky v-if="hasLeftDrawerOpener" position="left">
      <k-opener v-model="isLeftDrawerOpened" position="left"  />
    </q-page-sticky>

    <q-page-sticky v-if="hasRightDrawerOpener" position="right">
      <k-opener  v-model="isRightDrawerOpened" position="right" />
    </q-page-sticky>

    <q-page-sticky v-if="hasFooterOpened" position="bottom">
      <k-opener  v-model="isFooterOpened" position="bottom" />
    </q-page-sticky>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
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
      hasLeftDrawerOpener: false,
      isLeftDrawerOpened: this.klayout.isLeftDrawerVisible,
      hasRightDrawerOpener: false,
      isRightDrawerOpened: this.klayout.isRightDrawerVisible,
      hasFooterOpened: false,
      isFooterOpened: this.klayout.isFooterVisible
    }
  },
  watch: {
    'klayout.isLeftDrawerVisible': function (isVisible) {
      this.isLeftDrawerOpened=isVisible
    },
    isLeftDrawerOpened: function (isOpened) {
      this.klayout.isLeftDrawerVisible=isOpened
    },
    'klayout.isRightDrawerVisible': function (isVisible) {
      this.isRightDrawerOpened=isVisible
    },
    isRightDrawerOpened: function (isOpened) {
      this.klayout.isRightDrawerVisible=isOpened
    },
    'klayout.isFooterVisible': function (isVisible) {
      this.isRightDrawerOpened=isVisible
    },
    isFooterOpened: function (isOpened) {
      this.klayout.isFooterVisible=isOpened
    }
  },
  created () {
    // load the required components
    this.$options.components['k-opener'] = this.$load('frame/KOpener')
    this.$options.components['k-fab'] = this.$load('layout/KFab')
    // Read drawers configuration to check whether openers have to be displayed or not
    this.hasLeftDrawerOpener = this.$config('layout.leftDrawer.opener', false)
    this.hasRightDrawerOpener = this.$config('layout.rightDrawer.opener', false)
    this.hasFooterOpened = this.$config('layout.footer.opener', false)
  }
}
</script>