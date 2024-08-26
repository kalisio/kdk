import fuzzySearch from 'feathers-mongodb-fuzzy-search'
import commonHooks from 'feathers-hooks-common'
import { diacriticSearch } from '../../hooks/index.js'

export default {
  before: {
    all: [],
    find: [
      fuzzySearch({ fields: ['title', 'body', 'author'] }),
      diacriticSearch()
    ],
    get: [],
    create: [commonHooks.setNow('createdAt')],
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
