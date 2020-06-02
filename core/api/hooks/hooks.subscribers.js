import _ from 'lodash'
import { Forbidden } from '@feathersjs/errors'
import makeDebug from 'debug'

const debug = makeDebug('kdk:core:subscribers:hooks')

export async function preventRemoveSubscriber (hook) {
  if (hook.type !== 'before') {
    throw new Error('The \'preventRemoveSubscriber\' hook should only be used as a \'before\' hook.')
  }

  // Checks whether a user as removed the subscriber
  const userId = _.get(hook.params, 'user._id', undefined)
  if (userId) {
    debug('preventRemoveSubscriber: ' + userId + ' removed ' + hook.id)
    return hook
  }

  // Check whether a subscriber has unsusbsribed
  const code = _.get(hook.params, 'query.code', undefined)
  if (code) {
    const subscriber = await hook.service.get(hook.id)
    if (subscriber.verificationCode === code) return hook
    throw new Forbidden('You are not allowed to delete the subscriber', {
      translation: { key: 'REMOVE_SUBSCRIBER_INVALID_CODE' }
    })
  }

  // Forbid the operation
  debug('preventRemoveSubscriber: no verification code')
  throw new Forbidden('You are not allowed to delete the subscriber', {
    translation: { key: 'REMOVE_SUBSCRIBER_NOT_ALLOWED' }
  })
}

export async function subscribeToOrganisationSubscriptions (hook) {
  /* if (!hook.params.resource || !hook.params.resource.topics) return Promise.resolve(hook)

  const pusherService = hook.app.getService('pusher')
  const subscriptions = await pusherService.create(
    { action: 'subscriptions' }, {
      pushObject: hook.params.resource,
      pushObjectService: hook.params.resourcesService,
      users: hook.params.subjects
    })
  debug('Subscribed ' + subscriptions.length + ' users on topic object ' + hook.params.resource._id.toString() + ' from service ' + (hook.params.resourcesService.path || hook.params.resourcesService.name), hook.params.subjects) */
  return hook
}

export async function unsubscribeFromOrganisationSubscriptions (hook) {
  /* if (!hook.params.resource || !hook.params.resource.topics) return Promise.resolve(hook)

  const pusherService = hook.app.getService('pusher')
  const subscriptions = await pusherService.create(
    { action: 'subscriptions' }, {
      pushObject: hook.params.resource,
      pushObjectService: hook.params.resourcesService,
      users: hook.params.subjects
    })
  debug('Subscribed ' + subscriptions.length + ' users on topic object ' + hook.params.resource._id.toString() + ' from service ' + (hook.params.resourcesService.path || hook.params.resourcesService.name), hook.params.subjects) */
  return hook
}
