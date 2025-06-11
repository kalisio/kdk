import fuzzySearch from 'feathers-mongodb-fuzzy-search'
import { hooks as kdkCoreHooks } from '../../../../core/api/index.js'

export default {
  before: {
    all: [kdkCoreHooks.marshallHttpQuery],
    find: [
      fuzzySearch({ fields: ['name'] }),
      kdkCoreHooks.diacriticSearch()
    ],
    get: [],
    create: [kdkCoreHooks.checkUnique({ field: 'name' })],
    update: [kdkCoreHooks.checkUnique({ field: 'name' })],
    patch: [kdkCoreHooks.checkUnique({ field: 'name' })],
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
