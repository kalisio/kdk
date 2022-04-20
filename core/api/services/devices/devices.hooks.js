import { disallow } from 'feathers-hooks-common'

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [disallow('external')],
    update: [],
    patch: [],
    remove: []
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
