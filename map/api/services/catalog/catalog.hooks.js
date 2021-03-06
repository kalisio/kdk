import _ from 'lodash'
import { setNow, discard } from 'feathers-hooks-common'
import { hooks as coreHooks } from '../../../../core/api'
import { filterLayers, updateLayerReferences } from '../../hooks'

module.exports = {
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
    find: [],
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
