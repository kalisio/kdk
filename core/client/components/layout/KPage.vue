<template>
  <q-page :padding="padding">

    <!--
      Specific page content
     -->
    <slot name="page-content">
    </slot>

    <!--
      Managed stickies
     -->      
    <q-page-sticky v-if="hasLeftDrawerOpener" position="left">
      <k-drawer-opener position="left" />
    </q-page-sticky>

    <q-page-sticky v-if="hasRightDrawerOpener" position="right">
      <k-drawer-opener position="right" />
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
      hasRightDrawerOpener: false
    }
  },
  created () {
    // load the required components
    this.$options.components['k-drawer-opener'] = this.$load('layout/KDrawerOpener')
    this.$options.components['k-fab'] = this.$load('layout/KFab')
    // Read drawers configuration to check whether openers have to be displayed or not
    this.hasLeftDrawerOpener = this.$config('layout.leftDrawer.opener', false)
    this.hasRightDrawerOpener = this.$config('layout.rightDrawer.opener', false)
  }
}
</script>