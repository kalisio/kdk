import _ from 'lodash'
import { hooks as coreHooks } from '../../../../core/api'

module.exports = {
  before: {
    all: [],
    find: [hook => {
      let query = _.get(hook, 'params.query', {})
      // By default we only return layers and not views
      if (!query.type) query.type = { $ne: 'View' }
      _.set(hook, 'params.query', query)
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
