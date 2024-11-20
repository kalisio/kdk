import {
  checkPrerequisites,
  getPushSubscription,
  subscribePushNotifications,
  requestNotificationPermission,
  addSubscription
} from '@kalisio/feathers-webpush/client.js'
import { Notify } from 'quasar'
import logger from 'loglevel'
import _ from 'lodash'
import moment from 'moment'
import { i18n } from '../i18n.js'
import { Store } from '../store.js'
import { api } from '../api.js'
import { getPlatform } from './utils.platform.js'

export async function subscribeToPushNotifications () {
  // Check prerequisites & notification permission
  try {
    await checkPrerequisites()
    await requestNotificationPermission()
  } catch (error) {
    Notify.create({ type: 'negative', message: i18n.t(`errors.${error.code}`) })
    return
  }
  // Data
  const userService = api.service('api/users')
  const platform = getPlatform()
  const date = moment.utc().toISOString()
  const currentSubscription = await getPushSubscription()
  const user = Store.get('user')
  // Check if user is already subscribed
  if (currentSubscription && _.find(_.get(user, 'subscriptions', []), subscription => subscription.endpoint === currentSubscription.endpoint)) {
    // Patch subscription connection date
    const subscriptions = _.map(user.subscriptions, subscription => {
      if (subscription.endpoint === currentSubscription.endpoint) subscription.lastActivity = date
      return subscription
    })
    userService.patch(Store.user._id, { subscriptions: subscriptions })
    logger.debug(`[KDK] New connection with subscription endpoint: ${currentSubscription.endpoint}`)
    return
  }
  // Subscribe to web webpush notifications
  const subscription = await subscribePushNotifications(Store.get('capabilities.api.vapidPublicKey'))
  // Set platform informations
  subscription.browser = { name: platform.name, version: platform.version }
  subscription.platform = platform.platform
  subscription.lastActivity = date
  // Patch user subscriptions
  await addSubscription(user, subscription, 'subscriptions')
  userService.patch(Store.user._id, { subscriptions: user.subscriptions })
  logger.debug(`[KDK] New webpush subscription registered with endpoint: ${subscription.endpoint}`)
}
