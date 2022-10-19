import _ from 'lodash'
import common from 'feathers-hooks-common'
import { hooks as coreHooks } from '../../../../core/api/index.js'
import { filterLayers, updateLayerReferences, getDefaultCategories, getDefaultLegends } from '../../hooks/index.js'

const { setNow, discard } = common

export default {
  before: {
    all: [],
    find: [
      filterLayers
    ],
    get: [],
    create: [
      coreHooks.checkUnique({ field: 'name', query: (query, hook) => { query.type = _.get(hook, 'data.type') } }),
      coreHooks.convertObjectIDs(['baseQuery.layer']),
      coreHooks.convertToString(['schema.content']),
      setNow('createdAt', 'updatedAt')
    ],
    update: [
      coreHooks.populatePreviousObject,
      coreHooks.checkUnique({ field: 'name', query: (query, hook) => { query.type = _.get(hook, 'params.previousItem.type') } }),
      coreHooks.convertObjectIDs(['baseQuery.layer']),
      coreHooks.convertToString(['schema.content']),
      discard('createdAt', 'updatedAt'),
      setNow('updatedAt')
    ],
    patch: [
      coreHooks.populatePreviousObject,
      coreHooks.checkUnique({ field: 'name', query: (query, hook) => { query.type = _.get(hook, 'params.previousItem.type') } }),
      coreHooks.convertObjectIDs(['baseQuery.layer']),
      coreHooks.convertToString(['schema.content']),
      discard('createdAt', 'updatedAt'),
      setNow('updatedAt')
    ],
    remove: [
      coreHooks.populatePreviousObject
    ]
  },

  after: {
    all: [
      coreHooks.convertToJson(['schema.content'])
    ],
    find: [
      // Merge built-in categories with user-defined ones
      getDefaultCategories,
      getDefaultLegends
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
