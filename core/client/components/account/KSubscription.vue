<template>
  <q-item>
    <!-- Fingerprint -->
    <q-item-section avatar>
      <q-icon
        :name="icon"
        size="2.5rem"
      />
    </q-item-section>
    <!-- Label -->
    <q-item-section>
      <q-item-label class="text-subtitle2">{{ label }}</q-item-label>
      <q-item-label caption>{{ lastActivity }}</q-item-label>
    </q-item-section>
    <!-- Actions -->
    <q-item-section side>
      <KPanel :content="bindedActions" />
    </q-item-section>
  </q-item>
</template>

<script setup>
import _ from 'lodash'
import { removeSubscription } from '@kalisio/feathers-webpush/client.js'
import { computed } from 'vue'
import { Dialog } from 'quasar'
import { Store, i18n, api, Time, utils } from '../..'
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
  return `lab la-${_.lowerCase(_.get(props.subscription, 'browser.name'))}`
})
const label = computed(() => {
  return _.capitalize(_.get(props.subscription, 'browser.name')) +
    ' (' + _.get(props.subscription, 'browser.version') + ') - ' +
    _.capitalize(_.get(props.subscription, 'system.os'))
})
const lastActivity = computed(() => {
  const timestamp = _.get(props.subscription, 'lastActivity')
  return i18n.t('KSubscription.LAST_ACTIVITY', { date: Time.format(timestamp, 'date.short'), time: Time.format(timestamp, 'time.long') })
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
  }).onOk(async () => {
    // Patch user subscriptions
    const user = Store.get('user')
    removeSubscription(user, props.subscription, 'subscriptions')
    api.service('api/users').patch(Store.user._id, { subscriptions: user.subscriptions })
  })
}
</script>
