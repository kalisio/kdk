import common from 'feathers-hooks-common'

const { disallow, discard } = common

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [disallow()],
    patch: [disallow()],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [discard('buffer')],
    update: [],
    patch: [],
    remove: [discard('buffer')]
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
