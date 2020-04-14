import makeDebug from 'debug'
import _ from 'lodash'
import { getItems } from 'feathers-hooks-common'
import { populateObject } from './hooks.query'

const debug = makeDebug('kdk:core:pusher:hooks')

export function populatePushObject (hook) {
  if (hook.type !== 'before') {
    throw new Error('The \'populatePushObject\' hook should only be used as a \'before\' hook.')
  }

  // This hook is only for some of the operations
  let action = ''
  if (hook.data) {
    action = hook.data.action
  } else if (hook.params && hook.params.query) {
    action = hook.params.query.action
  }

  if (action === 'device') return Promise.resolve(hook)
  else return populateObject({ serviceField: 'pushObjectService', idField: 'pushObject', throwOnNotFound: true })(hook)
}

export async function createTopic (hook) {
  if (hook.type !== 'after') {
    throw new Error('The \'createTopic\' hook should only be used as a \'before\' hook.')
  }

  const pusherService = hook.app.getService('pusher')
  hook.result = await pusherService.create(
    { action: 'topic' }, {
      pushObject: hook.result,
      pushObjectService: hook.service
    })
  debug('Added topic to object ' + hook.result._id.toString() + ' from service ' + hook.service.path)
  return hook
}

export async function removeTopic (hook) {
  if (hook.type !== 'after') {
    throw new Error('The \'removeTopic\' hook should only be used as a \'after\' hook.')
  }

  const pusherService = hook.app.getService('pusher')
  await pusherService.remove(hook.result._id.toString(), {
    query: { action: 'topic' },
    pushObject: hook.result,
    pushObjectService: hook.service,
    patch: hook.method !== 'remove' // Do not patch object when it is deleted
  })
  debug('Removed topic on object ' + hook.result._id.toString() + ' from service ' + hook.service.path)
  return hook
}

export async function subscribeSubjectsToResourceTopic (hook) {
  if (!hook.params.resource || !hook.params.resource.topics) return Promise.resolve(hook)

  const pusherService = hook.app.getService('pusher')
  const subscriptions = await pusherService.create(
    { action: 'subscriptions' }, {
      pushObject: hook.params.resource,
      pushObjectService: hook.params.resourcesService,
      users: hook.params.subjects
    })
  debug('Subscribed ' + subscriptions.length + ' users on topic object ' + hook.params.resource._id.toString() + ' from service ' + (hook.params.resourcesService.path || hook.params.resourcesService.name), hook.params.subjects)
  return hook
}

export async function unsubscribeSubjectsFromResourceTopic (hook) {
  if (!hook.params.resource || !hook.params.resource.topics) return Promise.resolve(hook)

  const pusherService = hook.app.getService('pusher')
  const unsubscriptions = await pusherService.remove(hook.params.resource._id.toString(), {
    query: { action: 'subscriptions' },
    pushObject: hook.params.resource,
    pushObjectService: hook.params.resourcesService,
    users: hook.params.subjects
  })
  debug('Unsubscribed ' + unsubscriptions.length + ' users on topic object ' + hook.params.resource._id.toString() + ' from service ' + (hook.params.resourcesService.path || hook.params.resourcesService.name), hook.params.subjects)
  return hook
}

export function updateSubjectSubscriptions (options) {
  return async function (hook) {
    function isTopicObjectEqual (object1, object2) {
      return _.isEqual(object1.topics, object2.topics)
    }

    const item = getItems(hook)
    // Field might be on the service object or subject
    let topics = (options.subjectAsItem
      ? _.get(item, options.field) : _.get(hook.params, 'user.' + options.field))
    if (!topics) {
      debug('No subscriptions to update for object ', item)
      return Promise.resolve(hook)
    }

    // Service can be contextual, look for context on initiator service
    const itemService = hook.app.getService(options.service, hook.service.context)
    const pusherService = hook.app.getService('pusher')
    topics = (Array.isArray(topics) ? topics : [topics])
    // Retrieve previous version of the item
    let previousTopics = _.get(hook.params.previousItem, options.field)
    if (previousTopics) {
      previousTopics = (Array.isArray(previousTopics) ? previousTopics : [previousTopics])
      // Find common topics
      const commonTopics = _.intersectionWith(topics, previousTopics, isTopicObjectEqual)
      // Unsubscribe removed topics
      let removedTopics = _.differenceWith(previousTopics, commonTopics, isTopicObjectEqual)
      // Apply filter if any
      if (typeof options.filter === 'function') {
        removedTopics = options.filter('unsubscribe', removedTopics)
      }
      debug('Removing topic subscriptions for object ', item, removedTopics, hook.params.user)
      const unsubscribePromises = removedTopics.map(topic => pusherService.remove(topic._id.toString(), {
        query: { action: 'subscriptions' },
        pushObject: topic,
        pushObjectService: itemService,
        users: [(options.subjectAsItem ? item : hook.params.user)]
      }))
      // And subscribe new ones
      let addedTopics = _.differenceWith(topics, commonTopics, isTopicObjectEqual)
      // Apply filter if any
      if (typeof options.filter === 'function') {
        addedTopics = options.filter('subscribe', addedTopics)
      }
      debug('Adding topic subscriptions for object ', item, addedTopics, hook.params.user)
      const subscribePromises = addedTopics.map(topic => pusherService.create(
        { action: 'subscriptions' }, {
          pushObject: topic,
          pushObjectService: itemService,
          users: [(options.subjectAsItem ? item : hook.params.user)]
        }))
      const results = await Promise.all([Promise.all(unsubscribePromises), Promise.all(subscribePromises)])
      for (let i = 0; i < results[0].length; i++) {
        const unsubscriptions = results[0][i]
        const topic = removedTopics[i]
        if (unsubscriptions.length > 0) {
          debug('Unsubscribed from topic ' + topic)
        } else {
          debug('No unsubscription on topic ' + topic)
        }
      }
      for (let i = 0; i < results[1].length; i++) {
        const subscriptions = results[1][i]
        const topic = addedTopics[i]
        if (subscriptions.length > 0) {
          debug('Subscribed from topic ', topic)
        } else {
          debug('No subscription on topic ', topic)
        }
      }
    } else {
      if (hook.method !== 'remove') {
        // Subscribed new topics
        debug('Adding topic subscriptions for object ', item, topics, hook.params.user)
        // Apply filter if any
        if (typeof options.filter === 'function') {
          topics = options.filter('subscribe', topics)
        }
        const subscribePromises = topics.map(topic => pusherService.create(
          { action: 'subscriptions' }, {
            pushObject: topic,
            pushObjectService: itemService,
            users: [(options.subjectAsItem ? item : hook.params.user)]
          }))
        const results = await Promise.all(subscribePromises)
        for (let i = 0; i < results.length; i++) {
          const subscriptions = results[i]
          const topic = topics[i]
          if (subscriptions.length > 0) {
            debug('Subscribed from topic ', topic)
          } else {
            debug('No subscription on topic ', topic)
          }
        }
      } else {
        // Subscribed new topics
        debug('Removing topic subscriptions for object ', item, topics, hook.params.user)
        // Apply filter if any
        if (typeof options.filter === 'function') {
          topics = options.filter('unsubscribe', topics)
        }
        const unsubscribePromises = topics.map(topic => pusherService.remove(topic._id.toString(), {
          query: { action: 'subscriptions' },
          pushObject: topic,
          pushObjectService: itemService,
          users: [(options.subjectAsItem ? item : hook.params.user)]
        }))
        const results = await Promise.all(unsubscribePromises)
        for (let i = 0; i < results.length; i++) {
          const unsubscriptions = results[i]
          const topic = topics[i]
          if (unsubscriptions.length > 0) {
            debug('Unsubscribed from topic ', topic)
          } else {
            debug('No unsubscription on topic ', topic)
          }
        }
      }
    }

    return hook
  }
}
