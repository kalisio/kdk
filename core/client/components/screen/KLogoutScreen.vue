<template>
  <k-screen title="KLogoutScreen.TITLE" :actions="actions" />
</template>

<script>
import KScreen from './KScreen.vue'
import { authentication } from '../../mixins'

export default {
  name: 'k-logout-screen',
  components: {
    KScreen
  },
  mixins: [authentication],
  mounted () {
    this.logout()
  }
}
</script>
