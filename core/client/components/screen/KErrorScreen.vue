<template>
  <KScreen :title="message" :actions="actions" />
</template>

<script>
import KScreen from './KScreen.vue'

export default {
  components: {
    KScreen
  },
  data () {
    return {
      message: 'KErrorScreen.MESSAGE',
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
