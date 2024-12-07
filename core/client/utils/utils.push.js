import _ from 'lodash'
import logger from 'loglevel'
import moment from 'moment'
import { Notify } from 'quasar'
import {
  checkPrerequisites,
  getPushSubscription,
  subscribePushNotifications,
  requestNotificationPermission,
  addSubscription
} from '@kalisio/feathers-webpush/client.js'
import { i18n } from '../i18n.js'
import { Store } from '../store.js'
import { api } from '../api.js'
import { Platform } from '../platform.js'

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
  const date = moment.utc().toISOString()
  const currentSubscription = await getPushSubscription()
  const user = Store.get('user')
  if (!user) {
    logger.error(`[KDK] User must be authenticated before calling 'subscribeToPushNotifications'`)
  }
  // Check if user is already subscribed
  if (currentSubscription && _.find(_.get(user, 'subscriptions', []), subscription => subscription.endpoint === currentSubscription.endpoint)) {
    // Patch subscription connection date
    const subscriptions = _.map(user.subscriptions, subscription => {
      if (subscription.endpoint === currentSubscription.endpoint) subscription.lastActivity = date
      return subscription
    })
    userService.patch(user._id, { subscriptions: subscriptions })
    logger.debug(`[KDK] New connection with subscription endpoint: ${currentSubscription.endpoint}`)
    return
  }
  // Subscribe to web webpush notifications
  const subscription = await subscribePushNotifications(Store.get('capabilities.api.vapidPublicKey'))
  // Set platform information's
  subscription.fingerprint = Platform.fingerprint
  subscription.browser = _.pick(Platform.getData('browser'), ['name', 'version'])
  subscription.system = _.pick(Platform.getData('system'), ['os'])
  subscription.lastActivity = date
  // Patch user subscriptions
  await addSubscription(user, subscription, 'subscriptions')
  userService.patch(user._id, { subscriptions: user.subscriptions })
  logger.debug(`[KDK] New webpush subscription registered with endpoint: ${subscription.endpoint}`)
}
