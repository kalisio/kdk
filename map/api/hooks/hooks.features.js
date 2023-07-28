import _ from 'lodash'
import moment from 'moment'
import bbox from '@turf/bbox'
import makeDebug from 'debug'
import feathers from '@feathersjs/feathers'
import common from 'feathers-hooks-common'
import mongodbFuzzySearch from 'feathers-mongodb-fuzzy-search'
import { hooks as coreHooks, unmarshallTime } from '../../../core/api/index.js'

const { defaultEventMap } = feathers
const { iff, getItems, replaceItems } = common
const debug = makeDebug('kdk:map:features:hooks')

function getTimeRange (features) {
  let startTime, endTime
  features.forEach(feature => {
    if (feature.time) {
      const time = moment.utc(feature.time)
      if (!startTime || time.isBefore(startTime)) startTime = time
      if (!endTime || time.isAfter(endTime)) endTime = time
    }
  })
  return { startTime, endTime }
}

function getBBox (features) {
  return bbox({ type: 'FeatureCollection', features })
}

function getLayers (features) {
  return _.union(features.filter(feature => feature.layer).map(feature => feature.layer))
}

export function simplifyResult (hook) {
  const service = hook.service
  const method = hook.method
  const result = getItems(hook)
  const simplifyResult = _.get(service, 'options.simplifyResult', ['create', 'update', 'patch', 'remove'])
  // Only keep track of object IDs so that caller can at least get them if required
  if (simplifyResult.includes(method) && Array.isArray(result)) {
    debug(`Simplifying multi result for ${method} method on service ${service.name}`)
    replaceItems(hook, result.map(item => ({ _id: item._id })))
  }
  return hook
}

export function skipEvents (hook) {
  const service = hook.service
  const method = hook.method
  const event = defaultEventMap[method]
  const result = getItems(hook)
  const skipEvents = _.get(service, 'options.skipEvents', ['created', 'updated', 'patched', 'removed'])
  const simplifyEvents = _.get(service, 'options.simplifyEvents', [])
  // Even if we emit simplified events we skip standard feathers events to emit our own version
  let skip = skipEvents.includes(event) || simplifyEvents.includes(event)
  skip = skip && Array.isArray(result)
  if (skip) debug(`Skipping standard event ${event} for multi operation on service ${service.name}`)
  return iff(hook => skip, coreHooks.skipEvents)(hook)
}

export function simplifyEvents (hook) {
  const service = hook.service
  const params = hook.params
  const data = hook.data
  const query = params.query || {}
  unmarshallTime(query, 'time')
  const method = hook.method
  const event = defaultEventMap[method]
  const result = getItems(hook)
  const simplifyEvents = _.get(service, 'options.simplifyEvents', [])
  if (simplifyEvents.includes(event) && Array.isArray(result)) {
    debug(`Simplifying event ${event} for multi operation on service ${service.name}`)
    // Keep track of query selector when updating/patching/removing in batch
    const payload = (event === 'created' ? {} : { data })
    // Add information about updated time range/spatial extent so that client can decide what to do
    Object.assign(payload, {
      query,
      total: result.length,
      bbox: getBBox(result),
      layers: getLayers(result)
    }, getTimeRange(result))
    service.emit(event, payload)
  }
  return hook
}

export function fuzzySearch (hook) {
  const service = hook.service
  const featureLabel = _.castArray(_.get(service, 'options.featureLabel', []))
  const fields = featureLabel.map((prop) => 'properties.' + prop)
  return featureLabel.length ? mongodbFuzzySearch({ fields: fields })(hook) : hook
}
