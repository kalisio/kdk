<template>
  <k-screen title="KErrorScreen.TITLE" :actions="action">
   
  </k-screen>
</template>

<script>
import KScreen from './KScreen.vue'
import KPanel from '../frame/KPanel.vue'

export default {
  name: 'k-error-screen',
  components: {
    KScreen
  },
  data () {
    return {
      actions: [{
        id: 'go-home-action',
        icon: 'las la-home',
        label: 'KErrorScreen.GO_HOME_LABEL',
        renderer: 'form-button',
        route: { name: 'index' }
      }]
    }
  },
  created () {
    // Configure this screen
    this.message = this.$config('screens.error.message', this.message)
    this.actions = this.$config('screens.error.actions', this.actions)
  }
}
</script>
