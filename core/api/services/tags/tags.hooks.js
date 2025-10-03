import fuzzySearch from 'feathers-mongodb-fuzzy-search'
import { diacriticSearch } from '../../hooks/hooks.query.js'
import { hooks as kdkCoreHooks } from '../../index.js'
import { reflectTagUpdate } from '../../hooks/hooks.tags.js'

function addFieldToCheckUnique (property) {
  return (query, hook) => {
    const value = hook.data[property]
    if (value === undefined) return
    query[property] = value
  }
}

export default {
  before: {
    all: [],
    find: [
      fuzzySearch({ fields: ['name'] }),
      diacriticSearch()
    ],
    get: [],
    create: [kdkCoreHooks.checkUnique({ field: 'name', query: addFieldToCheckUnique('service') })],
    update: [kdkCoreHooks.checkUnique({ field: 'name', query: addFieldToCheckUnique('service') }), kdkCoreHooks.populatePreviousObject],
    patch: [kdkCoreHooks.checkUnique({ field: 'name', query: addFieldToCheckUnique('service') }), kdkCoreHooks.populatePreviousObject],
    remove: [kdkCoreHooks.populatePreviousObject]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [reflectTagUpdate],
    patch: [reflectTagUpdate],
    remove: [reflectTagUpdate]
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
