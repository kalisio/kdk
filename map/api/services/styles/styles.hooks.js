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
    create: [
      // Usually conversion of _id to ObjectID is performed by an app-evel hook, which is not yet setup when creating the service.
      // As we can create features when initializing layer service/data we add it here as well to ensure it will work fine anyway.
      kdkCoreHooks.convertObjectIDs(['_id']),
      kdkCoreHooks.checkUnique({ field: 'name' })
    ],
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
