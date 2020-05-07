import { hooks as coreHooks } from '../../../../core/api'

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [coreHooks.convertObjectIDs(['baseQuery.layer']), coreHooks.convertToString(['schema.content'])],
    update: [coreHooks.convertObjectIDs(['baseQuery.layer']), coreHooks.convertToString(['schema.content'])],
    patch: [coreHooks.convertObjectIDs(['baseQuery.layer']), coreHooks.convertToString(['schema.content'])],
    remove: []
  },

  after: {
    all: [coreHooks.convertToJson(['schema.content'])],
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
