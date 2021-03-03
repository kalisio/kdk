import _ from 'lodash'
import { setNow, discard } from 'feathers-hooks-common'
import { hooks as coreHooks } from '../../../../core/api'

module.exports = {
  before: {
    all: [],
    find: [hook => {
      const query = _.get(hook, 'params.query', {})
      // By default we only return layers and not views
      if (!query.type) query.type = { $ne: 'View' }
      _.set(hook, 'params.query', query)
    }],
    get: [],
    create: [
      coreHooks.convertObjectIDs(['baseQuery.layer']),
      coreHooks.convertToString(['schema.content']),
      setNow('createdAt', 'updatedAt')
    ],
    update: [
      coreHooks.convertObjectIDs(['baseQuery.layer']),
      coreHooks.convertToString(['schema.content']),
      discard('createdAt', 'updatedAt'),
      setNow('updatedAt')
    ],
    patch: [
      coreHooks.convertObjectIDs(['baseQuery.layer']),
      coreHooks.convertToString(['schema.content']),
      discard('createdAt', 'updatedAt'),
      setNow('updatedAt')
    ],
    remove: []
  },

  after: {
    all: [coreHooks.convertToJson(['schema.content'])],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [setNow('updatedAt')]
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
