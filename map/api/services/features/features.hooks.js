import _ from 'lodash'
import common from 'feathers-hooks-common'
import { hooks as coreHooks } from '../../../../core/api/index.js'
import {
  marshallSpatialQuery, aggregateFeaturesQuery, asGeoJson,
  simplifyResult, simplifyEvents, skipEvents, fuzzySearch
} from '../../hooks/index.js'

const { getItems, replaceItems } = common

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
// Allow upsert if required
const upsert = (hook) => {
  _.set(hook, 'params.mongodb', { upsert: _.get(hook, 'params.query.upsert', false) })
  _.unset(hook, 'params.query.upsert')
}
// Feathers does not return anything in this case
const upsertResult = async (hook) => {
  if (_.get(hook, 'params.mongodb.upsert', false)) {
    let items = getItems(hook)
    const isArray = Array.isArray(items)
    items = (isArray ? items : [items])
    const collection = await hook.service.find({
      query: _.get(hook, 'params.query', {}),
      paginate: false
    })
    replaceItems(hook, isArray ? collection.features : collection.features[0])
  }
  return hook
}

export default {
  before: {
    all: [coreHooks.marshallTimeQuery, coreHooks.convertObjectIDs(['layer'])],
    find: [coreHooks.marshallComparisonQuery, coreHooks.marshallSortQuery, marshallSpatialQuery,
      coreHooks.distinct, aggregateFeaturesQuery, coreHooks.aggregationQuery, fuzzySearch, coreHooks.diacriticSearch()],
    get: [],
    // Usually conversion of _id to ObjectID is performed by an app-evel hook, which is not yet setup when creating the service.
    // As we can create features when initializing layer service/data we add it here as well to ensure it will work fine anyway.
    create: [coreHooks.processTimes(['time']), coreHooks.convertObjectIDs(['_id']), fullResult, emitEvents],
    update: [upsert, coreHooks.processTimes(['time']), fullResult, emitEvents],
    patch: [upsert, coreHooks.processTimes(['time']), fullResult, emitEvents],
    remove: [coreHooks.marshallComparisonQuery, marshallSpatialQuery, fullResult, emitEvents],
    formatGeoJSON: []
  },

  after: {
    all: [],
    find: [coreHooks.unprocessTimes(['time']), asGeoJson({ force: true })],
    get: [],
    // By default avoid emitting events and full result on feature edition because we usually proceed with big batches
    // On a per-case basis each application can activate all events/results if required or define a more evolved strategy
    create: [coreHooks.unprocessTimes(['time']), simplifyEvents, simplifyResult, skipEvents],
    update: [coreHooks.unprocessTimes(['time']), upsertResult, simplifyEvents, simplifyResult, skipEvents],
    patch: [coreHooks.unprocessTimes(['time']), upsertResult, simplifyEvents, simplifyResult, skipEvents],
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
