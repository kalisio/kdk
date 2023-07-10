<template>
  <KCard v-bind="$props" :actions="itemActions" :bind-actions="false"
    :options="{ nameField: 'endpoint' }">
    <!--
      Card icon
     -->
    <template v-slot:card-avatar>
      <q-avatar :icon="platformIcon" />
    </template>
    <!--
      Card description
     -->
    <template v-slot:card-description>
      <q-separator inset />
      <div class="row items-center">
        <q-avatar :icon="browserIcon" size="30px"/>
        {{ browserName }}
        {{ browserVersion }}
      </div>
      <cite v-if="lastActivity">{{$t('KSubscriptionCard.LAST_ACTIVITY')}} {{lastActivity.toLocaleString()}}</cite>
    </template>
  </KCard>
</template>

<script>
import _ from 'lodash'
import { Dialog } from 'quasar'
import { baseItem } from '../../mixins'
import KCard from '../collection/KCard'

export default {
  components: {
    KCard
  },
  mixins: [baseItem],
  computed: {
    platformIcon () {
      const platform = this.platformName.toLowerCase()

      if (platform.includes('win')) return 'fa-brands fa-windows'
      if (platform.includes('mac') || platform.includes('ios')) return 'fa-brands fa-apple'
      if (platform.includes('linux')) return 'fa-brands fa-linux'
      if (platform.includes('android')) return 'fa-brands fa-android'
      if (this.desktop) return 'fas fa-desktop'
      return 'fas fa-mobile-alt'
    },
    browserIcon () {
      const browser = this.browserName.toLowerCase()
  
      if (browser.includes('chrome')) return 'fa-brands fa-chrome'
      if (browser.includes('opera')) return 'fa-brands fa-opera'
      if (browser.includes('safari')) return 'fa-brands fa-safari'
      if (browser.includes('edge')) return 'fa-brands fa-edge'
      return 'fa-brands fa-internet-explorer'
    },
    platformName () {
      return (this.item.platform.name ? _.capitalize(this.item.platform.name.toLowerCase()) : '')
    },
    platformDesktop () {
      return this.item.platform.desktop ? true : false
    },
    browserName () {
      return (this.item.browser.name ? _.capitalize(this.item.browser.name.toLowerCase()) : '')
    },
    browserVersion () {
      return (this.item.browser.version ? _.capitalize(this.item.browser.version.toLowerCase()) : '')
    },
    lastActivity () {
      return this.item.lastActivity ? new Date(this.item.lastActivity) : null
    },
  },
  data () {
    return {
    }
  },
  methods: {
    unsubscribe (context) {
      const description = context.item.endpoint
      Dialog.create({
        title: this.$t('KSubscriptionCard.UNSUBSCRIBE_DIALOG_TITLE', { description }),
        message: this.$t('KSubscriptionCard.UNSUBSCRIBE_DIALOG_MESSAGE', { description }),
        html: true,
        ok: {
          label: this.$t('OK'),
          flat: true
        },
        cancel: {
          label: this.$t('CANCEL'),
          flat: true
        }
      }).onOk(() => {
        // TODO: unsubscribe
      })
    }
  }
}
</script>
