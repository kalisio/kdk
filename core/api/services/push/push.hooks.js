import { deleteExpiredSubscriptions } from '@kalisio/feathers-webpush'
import { when, disallow } from 'feathers-hooks-common'
import { disallowExternalPush } from '../../hooks/index.js'

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [when(disallowExternalPush, disallow('external'))],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [deleteExpiredSubscriptions],
    update: [],
    patch: [],
    remove: []
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
