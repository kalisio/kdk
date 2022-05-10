<template>
  <k-screen :actions="actions">
    <div class="column justify-center">
      <blockquote class="text-right">
        <p>{{$t('KLogout.SIGN_OFF_LABEL')}}&nbsp;<cite>{{appName}}</cite>.</p>
        <small v-if="publisherName"><cite>{{publisherName}}</cite></small>
      </blockquote>
    </div>
  </k-screen>
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
  data () {
    return {
      appName: 'KDK',
      publisherName: 'Kalisio',
      actions: []
    }
  },
  created () {
    // configure this screen
    this.appName = this.$config('appName', this.appName)
    this.publisherName = this.$config('publisher', this.publisherName)
    this.actions = this.$config('screens.logout.actions', this.actions)
  },
  mounted () {
    this.logout()
  }
}
</script>
