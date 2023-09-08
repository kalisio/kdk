import { hooks as coreHooks } from '../../../../core/api/index.js'
import {
  marshallSpatialQuery, aggregateFeaturesQuery, asGeoJson,
  simplifyResult, simplifyEvents, skipEvents, fuzzySearch
} from '../../hooks/index.js'

export default {
  before: {
    all: [coreHooks.marshallTimeQuery, coreHooks.convertObjectIDs(['layer'])],
    find: [coreHooks.marshallComparisonQuery, coreHooks.marshallSortQuery, marshallSpatialQuery,
      coreHooks.distinct, aggregateFeaturesQuery, coreHooks.aggregationQuery, fuzzySearch, coreHooks.diacriticSearch],
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
    // By default avoid emitting events and full result on feature edition because we usually proceed with big batches
    // On a per-case basis each application can activate all events/results if required or define a more evolved strategy
    create: [coreHooks.unprocessTimes(['time']), simplifyEvents, simplifyResult, skipEvents],
    update: [coreHooks.unprocessTimes(['time']), simplifyEvents, simplifyResult, skipEvents],
    patch: [coreHooks.unprocessTimes(['time']), simplifyEvents, simplifyResult, skipEvents],
    remove: [simplifyEvents, simplifyResult, skipEvents]
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
