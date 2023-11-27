import commonHooks from 'feathers-hooks-common'

export default {
  before: {
    all: [],
    find: [commonHooks.disallow()],
    get: [commonHooks.disallow()],
    create: [],
    update: [commonHooks.disallow()],
    patch: [commonHooks.disallow()],
    remove: [commonHooks.disallow()]
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
