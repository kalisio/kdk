<template>
  <KScreen title="KLogoutScreen.TITLE" :actions="actions" />
</template>

<script>
import KScreen from './KScreen.vue'
import { authentication } from '../../mixins'

export default {
  components: {
    KScreen
  },
  mixins: [authentication],
  data () {
    return {
      actions: []
    }
  },
  created () {
    // configure this screen
    this.actions = this.$config('screens.logout.actions', this.actions)
  },
  mounted () {
    this.logout()
  }
}
</script>
