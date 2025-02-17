import _ from 'lodash'
import common from 'feathers-hooks-common'
import fuzzySearch from 'feathers-mongodb-fuzzy-search'
import { hooks as coreHooks } from '../../../../core/api/index.js'
import { filterLayers, updateLayerReferences, updateProjects,
         getDefaultCategories, getDefaultSublegends } from '../../hooks/index.js'

const { setNow, discard, when } = common

export default {
  before: {
    all: [coreHooks.marshallHttpQuery],
    find: [
      fuzzySearch({ fields: ['name'] }), coreHooks.diacriticSearch(), filterLayers, coreHooks.distinct
    ],
    get: [],
    create: [
      coreHooks.checkUnique({ field: 'name', query: (query, hook) => { query.type = _.get(hook, 'data.type') } }),
      coreHooks.convertToString(['baseQuery', 'schema.content', 'filters']),
      setNow('createdAt', 'updatedAt'),
      // This allow to use keys for base queries like 'properties.xxx': 'yyy'
      (hook) => { _.set(hook, 'params.mongodb.checkKeys', false) }
    ],
    update: [
      coreHooks.populatePreviousObject,
      coreHooks.checkUnique({ field: 'name', query: (query, hook) => { query.type = _.get(hook, 'params.previousItem.type') } }),
      coreHooks.convertToString(['baseQuery', 'schema.content', 'filters']),
      discard('createdAt', 'updatedAt'),
      setNow('updatedAt')
    ],
    patch: [
      coreHooks.populatePreviousObject,
      coreHooks.checkUnique({ field: 'name', query: (query, hook) => { query.type = _.get(hook, 'params.previousItem.type') } }),
      coreHooks.convertToString(['baseQuery', 'schema.content', 'filters']),
      discard('createdAt', 'updatedAt'),
      setNow('updatedAt')
    ],
    remove: [
      coreHooks.populatePreviousObject
    ]
  },

  after: {
    all: [
      coreHooks.convertToJson(['baseQuery', 'schema.content', 'filters']),
      coreHooks.convertObjectIDs(['baseQuery.layer'])
    ],
    find: [
      // Merge built-in categories/sublegends (if provided) with user-defined ones
      getDefaultCategories, getDefaultSublegends
    ],
    get: [],
    create: [],
    update: [
      updateLayerReferences
    ],
    patch: [
      updateLayerReferences
    ],
    remove: [
      setNow('updatedAt'),
      updateLayerReferences,
      updateProjects
    ]
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
