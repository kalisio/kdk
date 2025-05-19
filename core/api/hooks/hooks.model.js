import _ from 'lodash'
import siftModule from 'sift'
import moment from 'moment'
import errors from '@feathersjs/errors'
import { objectifyIDs, toObjectIDs } from '../db.js'
import { marshallTimes, unmarshallTimes } from '../marshall.js'
import common from 'feathers-hooks-common'
import makeDebug from 'debug'

const { Conflict, BadRequest } = errors
const { getItems, replaceItems } = common
const sift = siftModule.default
const debug = makeDebug('kdk:core:model:hooks')

// Need to convert from server side types (moment dates) to basic JS types when "writing" to DB adapters
export function processTimes (properties) {
  return function (hook) {
    let items = getItems(hook)
    const isArray = Array.isArray(items)
    items = (isArray ? items : [items])
    items.forEach(item => marshallTimes(item, properties))
    replaceItems(hook, isArray ? items : items[0])
    return hook
  }
}

// Need to convert back to server side types (moment dates) from basic JS types when "reading" from DB adapters
export function unprocessTimes (properties) {
  return function (hook) {
    let items = getItems(hook)
    const isArray = Array.isArray(items)
    items = (isArray ? items : [items])
    items.forEach(item => unmarshallTimes(item, properties))
    replaceItems(hook, isArray ? items : items[0])
    return hook
  }
}

// The hook serialize allows to copy/move some properties within the objects holded by the hook
// It applies an array of rules defined by:
// - source: the path to the property to be copied
// - target: the path where to copy the property
// - delete: a flag to define whether the hook has to delete the source property
export function serialize (rules, options = {}) {
  return function (hook) {
    // Retrieve the items from the hook
    let items = getItems(hook)
    const isArray = Array.isArray(items)
    items = (isArray ? items : [items])
    // Apply the rules for each item
    items.forEach(item => {
      rules.forEach(rule => {
        let source = _.get(item, rule.source)
        if (!_.isNil(source)) {
          if (rule.filter) source = source.filter(sift(rule.filter))
          _.set(item, rule.target, source)
          if (rule.delete) {
            _.unset(item, rule.source)
          }
        } else if (options.throwOnNotFound || rule.throwOnNotFound) {
          throw new Error('Cannot find valid input value for property ' + rule.target)
        }
      })
    })
    // Replace the items within the hook
    replaceItems(hook, isArray ? items : items[0])
  }
}

// This hook allows to transform the values bound to '_id' like keys or
// operators (eg $ne, $in) provided as strings into Mongo ObjectIds
// It inspects hook data as well as query data
// If you have others properties to be converted use convertObjectIDs
export function processObjectIDs (hook) {
  let items = getItems(hook)
  const isArray = Array.isArray(items)
  items = (isArray ? items : [items])
  items.forEach(item => objectifyIDs(item))
  replaceItems(hook, isArray ? items : items[0])

  if (hook.params.query) objectifyIDs(hook.params.query)

  return hook
}

// The hook allows to transform a set of input properties as strings into Mongo ObjectIds
// It inspects hook data as well as query data
export function convertObjectIDs (properties) {
  return function (hook) {
    let items = getItems(hook)
    const isArray = Array.isArray(items)
    items = (isArray ? items : [items])
    items.forEach(item => toObjectIDs(item, properties))
    replaceItems(hook, isArray ? items : items[0])

    if (hook.params.query) toObjectIDs(hook.params.query, properties)

    return hook
  }
}

// Utility function used to convert from string to Dates a fixed set of properties on a given object
export function toDates (object, properties, asMoment) {
  properties.forEach(property => {
    let date = _.get(object, property)
    if (date) {
      // We use moment to validate the date
      date = moment.utc(date)
      if (date.isValid()) {
        if (!asMoment) {
          date = date.toDate()
        }
        _.set(object, property, date)
      }
    }
  })
}

// The hook allows to transform a set of input properties as strings into a Date/Moment objects
// It inspects hook data as well as query data
export function convertDates (properties, asMoment) {
  return function (hook) {
    let items = getItems(hook)
    const isArray = Array.isArray(items)
    items = (isArray ? items : [items])
    items.forEach(item => toDates(item, properties, asMoment))
    replaceItems(hook, isArray ? items : items[0])

    if (hook.params.query) toDates(hook.params.query, properties, asMoment)
    return hook
  }
}

// Utility function used to convert from string to JSON a fixed set of properties on a given object
export function toJson (object, properties) {
  properties.forEach(property => {
    const string = _.get(object, property)
    if (string && (typeof string === 'string')) {
      const json = JSON.parse(string)
      _.set(object, property, json)
    }
  })
}

// The hook allows to transform a set of input properties as strings into JSON objects
export function convertToJson (properties) {
  return function (hook) {
    let items = getItems(hook)
    const isArray = Array.isArray(items)
    items = (isArray ? items : [items])
    items.forEach(item => toJson(item, properties))
    replaceItems(hook, isArray ? items : items[0])

    return hook
  }
}

// Utility function used to convert from string to JSON a fixed set of properties on a given object
export function toString (object, properties) {
  properties.forEach(property => {
    const json = _.get(object, property)
    if (json && (typeof json === 'object')) _.set(object, property, JSON.stringify(json))
  })
}

// The hook allows to transform a set of input properties from JSON objects into strings
export function convertToString (properties) {
  return function (hook) {
    let items = getItems(hook)
    const isArray = Array.isArray(items)
    items = (isArray ? items : [items])
    items.forEach(item => toString(item, properties))
    replaceItems(hook, isArray ? items : items[0])

    return hook
  }
}

export async function populatePreviousObject (hook) {
  if (hook.type !== 'before') {
    throw new Error('The \'populatePreviousObject\' hook should only be used as a \'before\' hook.')
  }
  const item = getItems(hook)
  const id = (hook.id ? hook.id : _.get(item, '_id'))
  // Retrieve previous version of the item and make it available to next hooks
  if (id) {
    hook.params.previousItem = await hook.service.get(id.toString())
    debug('Populated previous object', hook.params.previousItem)
  }
  return hook
}

export function setAsDeleted (hook) {
  // Retrieve the items from the hook
  let items = getItems(hook)
  const isArray = Array.isArray(items)
  items = (isArray ? items : [items])
  // Apply the rules for each item
  items.forEach(item => _.set(item, 'deleted', true))
  // Replace the items within the hook
  replaceItems(hook, isArray ? items : items[0])
  return hook
}

export function setExpireAfter (delayInSeconds) {
  return function (hook) {
    if (hook.type !== 'before') {
      throw new Error('The \'setExpireAfter\' hook should only be used as a \'before\' hook.')
    }
    // Retrieve the items from the hook
    let items = getItems(hook)
    const isArray = Array.isArray(items)
    items = (isArray ? items : [items])
    // Apply the rules for each item
    const date = new Date(Date.now() + 1000 * delayInSeconds)
    items.forEach(item => _.set(item, 'expireAt', date))
    // Replace the items within the hook
    replaceItems(hook, isArray ? items : items[0])
    return hook
  }
}

// Allow to use the distinct function of MongoDB
export async function distinct (hook) {
  const params = hook.params
  const query = params.query
  if (!query || !query.$distinct) return hook
  const collection = hook.service.Model
  hook.result = await collection.distinct(query.$distinct, _.omit(query, ['$distinct']))
  return hook
}

// Check for already existing object according to given service/id field
export function checkUnique (options = {}) {
  return async (hook) => {
    if (hook.app) {
      const serviceConfig = hook.app.get(hook.service.name)
      if (serviceConfig && serviceConfig.checkUnique) options = serviceConfig.checkUnique
    }
    const service = (options.service ? hook.app.getService(options.service) : hook.service)
    const field = options.field || 'name'
    const id = _.get(hook, `data.${field}`)
    // If not updating ID skip
    if (id) {
      const query = { [options.field]: id }
      // Apply processing if required
      if (typeof options.query === 'function') options.query(query, hook)
      const result = await service.find({ query })
      // Pagination on/off ?
      const total = (Array.isArray(result) ? result.length : result.total)
      if (total > 0) {
        const error = new Conflict(`Object with ${options.field} equals to ${id} already exist for service ${service.name}`, {
          translation: {
            key: 'OBJECT_ID_ALREADY_TAKEN'
          }
        })
        // Raise error when creating if another object with the same ID exists
        if (hook.method === 'create') throw error
        // When updating/patching we should check if it's the same object or not
        const object = (Array.isArray(result) ? result[0] : result.data[0])
        if (object._id.toString() !== hook.id.toString()) throw error
      }
    }
    return hook
  }
}

// Prevent patch service calls from changing certain fields.
// Based on https://hooks-common.feathersjs.com/hooks.html#preventchanges
// but updated to handle dot notation
export function preventChanges (ifThrow, fieldNames) {
  return (hook) => {
    if ((hook.type !== 'before') || (hook.method !== 'patch')) {
      throw new Error('The \'preventChanges\' hook should only be used as a \'before\' patch hook.')
    }

    const data = { ...hook.data }
    // Check all data fields
    _.forOwn(hook.data, (value, key) => {
      fieldNames.forEach(name => {
        // If a prevented field is found or dot notation with a prevented field is used
        if ((key === name) || key.startsWith(`${name}.`)) {
          if (ifThrow) {
            throw new BadRequest(`Field ${name} may not be patched. (preventChanges)`)
          }
          delete data[key]
        }
      })
    })
    hook.data = data

    return hook
  }
}
