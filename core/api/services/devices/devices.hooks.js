import common from 'feathers-hooks-common'

const { disallow } = common

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
