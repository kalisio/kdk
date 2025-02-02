import _ from 'lodash'
import { api, Context } from '@kalisio/kdk/core.client.js'

export function getCollectionService (serviceName, serviceContext) {
  if (!serviceContext) return api.getService(serviceName)
  if (serviceContext === 'context') {
    if (!Context.get()) throw new Error(`[KDK] Cannot retrieve service '${serviceName}': undefined Context`)
    return api.getService(serviceName, Context.get()._id)
  }
  return api.getService(serviceName, serviceContext)
}

export async function listItems (service, fields, filter= {}, limit = 50) {
  return service.find({ query: _.merge({}, filter, { $limit: limit, $select: fields }) })
}

export async function getOldestItem (service, field = 'createdAt', filter = {}) {
  const response = await service.find({ query: _.merge({}, filter, { $sort: {[field]: 1 }, $limit: 1 }) })
  return _.get(response, 'data[0]')
}

export async function getOldestTime (service, field = 'createdAt', filter = {}) {
  const oldestItem = await getOldestItem (service, field, filter)
  return _.get(oldestItem, field)
}

export async function getLatestItem (service, field = 'createdAt', filter = {}) {
  const response = await service.find({ query: _.merge({}, filter, { $sort: {[field]: -1 }, $limit: 1 }) })
  return _.get(response, 'data[0]')
}

export async function getLatestTime (service, field = 'createdAt', filter = {}) {
  const latestItem = await getLatestItem (service, field, filter)
  return _.get(latestItem, field)
}

export async function enumerateField (service, field, filter = {}) {
  const query = _.merge({}, filter, { $distinct: field })
  const values = await service.find({ query })
  if (Array.isArray(values)) return values
  return [values]
}