import fuzzySearch from 'feathers-mongodb-fuzzy-search'
import { diacriticSearch } from '../../hooks/hooks.query.js'
import { cacheTagBeforeUpdate, reflectTagUpdate } from '../../hooks/hooks.tags.js'

export default {
  before: {
    all: [],
    find: [
      fuzzySearch({ fields: ['name'] }),
      diacriticSearch()
    ],
    get: [],
    create: [],
    update: [cacheTagBeforeUpdate],
    patch: [cacheTagBeforeUpdate],
    remove: [cacheTagBeforeUpdate]
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
