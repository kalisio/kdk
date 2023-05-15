import _ from 'lodash'
import common from 'feathers-hooks-common'
import { hooks as coreHooks } from '../../../../core/api/index.js'
import { filterLayers, updateLayerReferences, getDefaultCategories, getDefaultSublegends } from '../../hooks/index.js'

const { setNow, discard } = common

export default {
  before: {
    all: [],
    find: [
      filterLayers, coreHooks.distinct
    ],
    get: [],
    create: [
      coreHooks.checkUnique({ field: 'name', query: (query, hook) => { query.type = _.get(hook, 'data.type') } }),
      coreHooks.convertObjectIDs(['baseQuery.layer']),
      coreHooks.convertToString(['schema.content', 'filters']),
      setNow('createdAt', 'updatedAt'),
      // This allow to use keys for base queries like 'properties.xxx': 'yyy'
      (hook) => { _.set(hook, 'params.mongodb.checkKeys', false) }
    ],
    update: [
      coreHooks.populatePreviousObject,
      coreHooks.checkUnique({ field: 'name', query: (query, hook) => { query.type = _.get(hook, 'params.previousItem.type') } }),
      coreHooks.convertObjectIDs(['baseQuery.layer']),
      coreHooks.convertToString(['schema.content', 'filters']),
      discard('createdAt', 'updatedAt'),
      setNow('updatedAt')
    ],
    patch: [
      coreHooks.populatePreviousObject,
      coreHooks.checkUnique({ field: 'name', query: (query, hook) => { query.type = _.get(hook, 'params.previousItem.type') } }),
      coreHooks.convertObjectIDs(['baseQuery.layer']),
      coreHooks.convertToString(['schema.content', 'filters']),
      discard('createdAt', 'updatedAt'),
      setNow('updatedAt')
    ],
    remove: [
      coreHooks.populatePreviousObject
    ]
  },

  after: {
    all: [
      coreHooks.convertToJson(['schema.content', 'filters'])
    ],
    find: [
      // Merge built-in categories with user-defined ones
      getDefaultCategories,
      getDefaultSublegends
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
      updateLayerReferences
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
