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
      TODO: additional information<br/>
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
      const platform = this.platform.toLowerCase()
      return (platform.includes('windows')
        ? 'fas fa-windows'
        : (platform.includes('android')
            ? 'fas fa-android'
            : (platform.includes('ios') ? 'fas fa-apple' : 'fas fa-mobile-alt')))
    },
    platform () {
      return (this.item.platform ? _.capitalize(this.item.platform.toLowerCase()) : '')
    },
    lastActivity () {
      return this.item.lastActivity ? new Date(this.item.lastActivity) : null
    }
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
