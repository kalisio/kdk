<template>
  <k-screen :title="$t('KLogout.TITLE')" :links="links">
    <div slot="screen-content">
      <div class="column justify-center">
        <div>
          <blockquote class="text-right">
            <p>{{$t('KLogout.SIGN_OFF_LABEL')}}&nbsp;<cite>{{appName}}</cite>.</p>
            <small v-if="publisherName"><cite>{{publisherName}}</cite></small>
          </blockquote>
        </div>
      </div>
    </div>
  </k-screen>
</template>

<script>
import { QIcon } from 'quasar'
import { KScreen } from '../frame'
import { authentication } from '../../mixins'

export default {
  name: 'k-logout',
  components: {
    KScreen,
    QIcon
  },
  mixins: [authentication],
  data () {
    return {
      appName: '',
      publisherName: '',
      links: []
    }
  },
  created () {
    // configure this screen
    this.appName = this.$config('appName')
    this.publisherName = this.$config('publisher', 'Kalisio')
    this.links = this.$config('screens.logout.links', [])
    // Logout
    this.logout()
  }
}
</script>
