import { iff } from 'feathers-hooks-common'
import { hooks as coreHooks } from '../../../../core/api'
import { marshallSpatialQuery, aggregateFeaturesQuery, asGeoJson } from '../../hooks'

function simplifyResult (hook) {
  // Only keep track of object IDs so that caller can at least get them if required
  if (Array.isArray(hook.result)) hook.result = hook.result.map(item => ({ _id: item._id }))
  return hook
}

module.exports = {
  before: {
    all: [coreHooks.marshallTimeQuery, coreHooks.convertObjectIDs(['layer'])],
    find: [coreHooks.marshallComparisonQuery, coreHooks.marshallSortQuery, marshallSpatialQuery,
      coreHooks.distinct, aggregateFeaturesQuery],
    get: [],
    create: [coreHooks.processTimes(['time'])],
    update: [coreHooks.processTimes(['time'])],
    patch: [coreHooks.processTimes(['time'])],
    remove: [coreHooks.marshallComparisonQuery, marshallSpatialQuery]
  },

  after: {
    all: [coreHooks.unprocessTimes(['time'])],
    find: [asGeoJson({ force: true })],
    get: [],
    // Avoid emitting events and full result on feature edition because we usually proceed with big batches
    create: [simplifyResult, coreHooks.skipEvents],
    update: [simplifyResult, coreHooks.skipEvents],
    patch: [simplifyResult, coreHooks.skipEvents],
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
