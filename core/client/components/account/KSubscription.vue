<template>
  <q-item>
    <!-- icon -->
    <q-item-section avatar>
      <q-icon :name="icon" />
    </q-item-section>
    <!-- label -->
    <q-item-section>
      {{ label }}
    </q-item-section>
    <!-- actions -->
    <KPanel
      :content="bindedActions"
    />
  </q-item>
</template>

<script setup>
import _ from 'lodash'
import { unsubscribePushNotifications, removeSubscription } from '@kalisio/feathers-webpush/client.js'
import { computed } from 'vue'
import { Dialog } from 'quasar'
import { Store, i18n, api, utils } from '../..'
import KPanel from '../KPanel.vue'

// Props
const props = defineProps({
  subscription: {
    type: Object,
    required: true
  },
  actions: {
    type: Array,
    required: true
  }
})

// Computed
const icon = computed(() => {
  return 'lab la-' + _.get(props.subscription, 'browser.name')
})
const label = computed(() => {
  return _.get(props.subscription, 'browser.name') + ' (' + _.get(props.subscription, 'browser.version') + ')'
})
const bindedActions = computed(() => {
  return utils.bindContent(_.cloneDeep(props.actions), { unsubscribe })
})

// Functions
function unsubscribe () {
  const description = label.value
  Dialog.create({
    title: i18n.t('KSubscription.UNSUBSCRIBE_DIALOG_TITLE', { description }),
    message: i18n.t('KSubscription.UNSUBSCRIBE_DIALOG_MESSAGE', { description }),
    html: true,
    ok: {
      label: i18n.t('OK'),
      flat: true
    },
    cancel: {
      label: i18n.t('CANCEL'),
      flat: true
    }
  }).onOk(async() => {
    // Unsubscribe from web webpush notifications
    const subscription = await unsubscribePushNotifications()
    // Patch user subscriptions
    const user = Store.get('user')
    removeSubscription(user, subscription, 'subscriptions')
    api.service('api/users').patch(Store.user._id, { subscriptions: user.subscriptions })
  })
}
</script>