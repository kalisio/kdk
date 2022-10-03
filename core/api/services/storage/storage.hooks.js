import common from 'feathers-hooks-common'
import { populateAttachmentResource, attachToResource, detachFromResource } from '../../hooks/index.js'

const { disallow, discard, iff } = common

export default {
  before: {
    all: [],
    find: [disallow()],
    get: [],
    create: [
      populateAttachmentResource
    ],
    update: [disallow()],
    patch: [disallow()],
    remove: [populateAttachmentResource]
  },

  after: {
    all: [],
    find: [],
    get: [],
    // Let the attachment on the resource object occur only when resource has been found
    create: [
      iff(hook => hook.params.resource, attachToResource), discard('uri')
    ],
    update: [],
    patch: [],
    // Let the detachment on the resource object occur only when resource has been found
    remove: [iff(hook => hook.params.resource, detachFromResource), discard('uri')]
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
