import _ from 'lodash'
import { api } from '../api.js'

export function getCollectionService (name, context) {
  return api.getService(name, context)
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

export async function getDistinctValues (service, field, filter = {}) {
  const query = _.merge({}, filter, { $distinct: field })
  const values = await service.find({ query })
  if (Array.isArray(values)) return values
  return [values]
}

export async function searchText (service, text, caseSensitive = false, diacriticSensitive = false, filter = {}) {
  const query = _.merge({ 
    $text: { 
      $search: text, 
      $caseSensitive: caseSensitive,
      $diacriticSensitive: diacriticSensitive
    }
  }, filter)
  return service.find({ query })
}

export async function containsText (service, field, text, caseSensitive = false, diacriticSensitive = false, filter = {}) {
  const response = await searchText(service, text, caseSensitive, diacriticSensitive, filter)
  for (const item of response.data) {
    const value = _.get(item, field)
    if (value) {
      if (_.size(text) === _.size(value)) {
        let target = text
        let other = value
        if (!diacriticSensitive) {
          target = _.deburr(target)
          other = _.deburr(other)
        }
        if (!caseSensitive) {
          target = _.toUpper(target)
          other = _.toUpper(other)
        }
        if (target === other) return true
      }
    }
  }
  return false
}
