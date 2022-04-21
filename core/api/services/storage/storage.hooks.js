// import { getBase64DataURI } from 'dauria'
import common from 'feathers-hooks-common'
import { populateAttachmentResource, attachToResource, detachFromResource } from '../../hooks/index.js'

const { disallow, discard, iff } = common

export default {
  before: {
    all: [],
    find: [disallow()],
    get: [],
    create: [
      populateAttachmentResource,
      (hook) => {
        // If form multipart data transform to data buffer for blob service
        if (!hook.data.uri && hook.params.file) {
          // Before https://github.com/feathersjs-ecosystem/feathers-blob/releases/tag/v1.5.0 only data URI were supported
          // hook.data.uri = getBase64DataURI(hook.params.file.buffer, hook.params.file.mimetype)
          // Now raw buffers are
          hook.data.buffer = hook.params.file.buffer
          hook.data.contentType = hook.params.file.mimetype
        }
        // Makes uploaded files public when required
        if (hook.data.public) hook.params.s3 = { ACL: 'public-read' }
      }
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
      (hook) => {
        // If form multipart data get filename
        if (hook.params.file) {
          hook.result.name = hook.params.file.originalname
        }
        if (hook.data.name) {
          hook.result.name = hook.data.name
        }
      },
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
