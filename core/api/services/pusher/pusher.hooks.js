import { disallow } from 'feathers-hooks-common'
import { populatePushObject } from '../../hooks/index.js'

export default {
  before: {
    all: [disallow('external')],
    find: [],
    get: [],
    create: [populatePushObject],
    update: [],
    patch: [],
    remove: [populatePushObject]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
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
