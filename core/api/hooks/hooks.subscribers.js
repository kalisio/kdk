/*
import _ from 'lodash'
import makeDebug from 'debug'

const debug = makeDebug('kdk:core:subscribers:hooks')
*/

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
