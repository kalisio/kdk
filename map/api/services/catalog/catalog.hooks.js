import _ from 'lodash'
import { setNow, discard } from 'feathers-hooks-common'
import { hooks as coreHooks } from '../../../../core/api'
import { filterContexts, updateContexts } from '../../hooks'

module.exports = {
  before: {
    all: [],
    find: [
      filterContexts
    ],
    get: [],
    create: [
      coreHooks.checkUnique({ field: 'name' }),
      coreHooks.convertObjectIDs(['baseQuery.layer']),
      coreHooks.convertToString(['schema.content']),
      setNow('createdAt', 'updatedAt')
    ],
    update: [
      coreHooks.populatePreviousObject,
      coreHooks.checkUnique({ field: 'name' }),
      coreHooks.convertObjectIDs(['baseQuery.layer']),
      coreHooks.convertToString(['schema.content']),
      discard('createdAt', 'updatedAt'),
      setNow('updatedAt')
    ],
    patch: [
      coreHooks.populatePreviousObject,
      coreHooks.checkUnique({ field: 'name' }),
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
      updateContexts
    ],
    patch: [
      updateContexts
    ],
    remove: [
      setNow('updatedAt'),
      updateContexts
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
