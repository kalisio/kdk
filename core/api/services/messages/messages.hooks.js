import commonHooks from 'feathers-hooks-common'
import fuzzySearch from 'feathers-mongodb-fuzzy-search'
import { diacriticSearch, marshallComparisonQuery } from '../../hooks/index.js'

export default {
  before: {
    all: [],
    find: [
      fuzzySearch({ fields: ['title', 'body', 'author'] }),
      diacriticSearch(),
      marshallComparisonQuery
    ],
    get: [],
    create: [commonHooks.setNow('createdAt', 'updatedAt')],
    update: [
      commonHooks.discard('createdAt', 'updatedAt'),
      commonHooks.setNow('updatedAt')
    ],
    patch: [
      commonHooks.discard('createdAt', 'updatedAt'),
      commonHooks.setNow('updatedAt')
    ],
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
