<template>
  <k-card v-bind="$props" :itemActions="actions" />
</template>

<script>
import { Dialog } from 'quasar'
import mixins from '../../mixins'

export default {
  name: 'k-subscriber-card',
  mixins: [mixins.baseItem],
  computed: {
    expireAt () {
      return this.item.expireAt ? new Date(this.item.expireAt) : null
    }
  },
  methods: {
    refreshActions () {
      this.clearActions()
      if (this.$can('remove', 'subscribers', this.contextId, { resource: this.contextId })) {
        this.registerMenuAction({
          name: 'remove-subscriber',
          label: this.$t('KSubscriberCard.REMOVE_LABEL'),
          icon: 'las la-minus-circle',
          handler: this.removeSubscriber
        })
      }
    },
    removeSubscriber (subscriber) {
      Dialog.create({
        title: this.$t('KSubscriberCard.REMOVE_DIALOG_TITLE', { subscriber: subscriber.name }),
        message: this.$t('KSubscriberCard.REMOVE_DIALOG_MESSAGE', { subscriber: subscriber.name }),
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
        const subscribersService = this.$api.getService('subscribers', this.contextId)
        subscribersService.remove(subscriber.phone)
      })
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-card'] = this.$load('collection/KCard')
  }
}
</script>
