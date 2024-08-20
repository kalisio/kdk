import _ from 'lodash'
import { hooks as coreHooks } from '../../../../core/api/index.js'
import {
  marshallSpatialQuery, aggregateFeaturesQuery, asGeoJson,
  simplifyResult, simplifyEvents, skipEvents, fuzzySearch
} from '../../hooks/index.js'

// Allow to control real-time events emission if required
const emitEvents = (hook) => {
  _.set(hook, 'params.emitEvents', _.get(hook, 'params.query.emitEvents'))
  _.unset(hook, 'params.query.emitEvents')
}
// Allow to control full result emission if required
const fullResult = (hook) => {
  _.set(hook, 'params.fullResult', _.get(hook, 'params.query.fullResult'))
  _.unset(hook, 'params.query.fullResult')
}

export default {
  before: {
    all: [coreHooks.marshallTimeQuery, coreHooks.convertObjectIDs(['layer'])],
    find: [coreHooks.marshallComparisonQuery, coreHooks.marshallSortQuery, marshallSpatialQuery,
      coreHooks.distinct, aggregateFeaturesQuery, coreHooks.aggregationQuery, fuzzySearch, coreHooks.diacriticSearch()],
    get: [],
    create: [coreHooks.processTimes(['time']), fullResult, emitEvents],
    update: [coreHooks.processTimes(['time']), fullResult, emitEvents],
    patch: [coreHooks.processTimes(['time']), fullResult, emitEvents],
    remove: [coreHooks.marshallComparisonQuery, marshallSpatialQuery, fullResult, emitEvents]
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
