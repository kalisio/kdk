import { hooks as coreHooks } from '../../../../core/api/index.js'
import { marshallSpatialQuery, aggregateFeaturesQuery, asGeoJson } from '../../hooks/index.js'

function simplifyResult (hook) {
  // Only keep track of object IDs so that caller can at least get them if required
  if (Array.isArray(hook.result)) hook.result = hook.result.map(item => ({ _id: item._id }))
  return hook
}

export default {
  before: {
    all: [coreHooks.marshallTimeQuery, coreHooks.convertObjectIDs(['layer'])],
    find: [coreHooks.marshallComparisonQuery, coreHooks.marshallSortQuery, marshallSpatialQuery,
      coreHooks.distinct, aggregateFeaturesQuery, coreHooks.aggregationQuery],
    get: [],
    create: [coreHooks.processTimes(['time'])],
    update: [coreHooks.processTimes(['time'])],
    patch: [coreHooks.processTimes(['time'])],
    remove: [coreHooks.marshallComparisonQuery, marshallSpatialQuery]
  },

  after: {
    all: [],
    find: [coreHooks.unprocessTimes(['time']), asGeoJson({ force: true })],
    get: [],
    // Avoid emitting events and full result on feature edition because we usually proceed with big batches
    create: [coreHooks.unprocessTimes(['time']), simplifyResult, coreHooks.skipEvents],
    update: [coreHooks.unprocessTimes(['time']), simplifyResult, coreHooks.skipEvents],
    patch: [coreHooks.unprocessTimes(['time']), simplifyResult, coreHooks.skipEvents],
    remove: [simplifyResult, coreHooks.skipEvents]
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
