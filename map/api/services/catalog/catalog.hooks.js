import { hooks as coreHooks } from '../../../../core/api'

module.exports = {
  before: {
    all: [],
    find: [hook => {
      const query = hook.params.query || {}
      // Filter objects according to target type (either layers or services)
      if (query.type) {
        switch (query.type) {
          case 'service':
            // Nothing special todo
            break
          case 'layer':
          default:
            query.type = { $ne: 'service' }
            break
        }
      }
    }],
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
