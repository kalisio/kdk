import fuzzySearch from 'feathers-mongodb-fuzzy-search'
import { hooks as kdkCoreHooks } from '../../../../core/api/index.js'

export default {
  before: {
    all: [],
    find: [
      fuzzySearch({ fields: ['name'] }),
      kdkCoreHooks.diacriticSearch()
    ],
    get: [],
    create: [],
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
