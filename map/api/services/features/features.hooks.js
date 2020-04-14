import { hooks as coreHooks } from '../../../../core/api'
import { marshallSpatialQuery, aggregateFeaturesQuery, asGeoJson } from '../../hooks'

function emptyResult (hook) {
  if (Array.isArray(hook.result)) hook.result = []
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
    // Avoid emitting events/results on feature edition as we can proceed with big batches
    create: [emptyResult, coreHooks.skipEvents],
    update: [emptyResult, coreHooks.skipEvents],
    patch: [emptyResult, coreHooks.skipEvents],
    remove: [emptyResult, coreHooks.skipEvents]
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
