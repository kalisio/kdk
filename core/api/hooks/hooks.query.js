import _ from 'lodash'
import { marshallComparisonFields, marshallTime, marshallBooleanFields, marshallNumberFields, marshallDateFields } from '../marshall.js'
import mongodb from 'mongodb'
import makeDebug from 'debug'
import { makeDiacriticPattern } from '../../common/utils.js'

const { ObjectID } = mongodb
const debug = makeDebug('kdk:core:query:hooks')

export function marshallTimeQuery (hook) {
  const query = hook.params.query
  if (query) {
    // Need to convert from client/server side types : string or moment dates
    marshallTime(query, 'time')
  }
}

export function marshallComparisonQuery (hook) {
  const query = hook.params.query
  if (query) {
    // Complex queries might have nested objects so we call a recursive function to handle this
    marshallComparisonFields(query)
  }
}

export function marshallSortQuery (hook) {
  const query = hook.params.query
  if (query && query.$sort) {
    // Complex queries might have nested objects so we call a recursive function to handle this
    marshallNumberFields(query.$sort)
  }
}

export function marshallCollationQuery (hook) {
  const query = hook.params.query
  if (!query) return
  // Locale shortcut or whole query provided
  if (query.$locale) {
    hook.params.collation = { locale: query.$locale }
    delete query.$locale
  } else if (query.$collation) {
    hook.params.collation = query.$collation
    delete query.$collation
  }
  return hook
}

export function marshallHttpQuery (hook) {
  const provider = _.get(hook.params, 'provider')
  if (provider !== 'rest') return hook
  const query = hook.params.query
  if (query) {
    // Need to convert from client/server side types : numbers, boolean, dates, ...
    // ORder matters here as a boolean can be converted to number (0/1)
    marshallNumberFields(query)
    marshallBooleanFields(query)
    marshallDateFields(query)
  }
}

export async function aggregationQuery (hook) {
  const query = hook.params.query
  if (!query) return
  const service = hook.service
  if (query.$aggregation) {
    const collection = service.Model
    // Set result to avoid service DB call
    hook.result = await collection.aggregate(query.$aggregation.pipeline, query.$aggregation.options).toArray()
  }
  return hook
}

export function populateObject (options) {
  return async function (hook) {
    const app = hook.app
    const data = hook.data
    const params = hook.params
    const query = params.query
    const context = hook.service.context
    const idProperty = options.nameIdAs || options.idField
    const serviceProperty = options.nameServiceAs || options.serviceField

    // Check if not already done
    if (typeof _.get(params, idProperty) === 'object') {
      debug(`Skipping populating ${idProperty} as already done`)
      return hook
    }
    if (typeof _.get(params, serviceProperty) === 'object') {
      debug(`Skipping populating ${serviceProperty} as already done`)
      return hook
    }

    // Get service where we can find the object to populate
    // Make hook usable with query params as well and service name or real object
    let service = _.get(data, options.serviceField) || _.get(query, options.serviceField)
    if (typeof service === 'string') {
      const message = `Cannot find the service for ${options.serviceField} = ${service} to dynamically populate.`
      service = app.getService(service, context)
      if (!service) {
        if (options.throwOnNotFound) throw new Error(message)
        else return hook
      }
    } else if (!service) {
      if (options.throwOnNotFound) throw new Error(`No ${options.serviceField} given to dynamically populate.`)
      else return hook
    }
    // Then the object ID
    const id = _.get(data, options.idField) || _.get(query, options.idField) || _.get(hook, 'id')
    if (!id) {
      if (options.throwOnNotFound) throw new Error(`Cannot find the ${options.idField} to dynamically populate.`)
      else return hook
    }
    debug(`Populating ${idProperty} with ID ${id}`)
    // Set the retrieved service on the same field or given one in hook params
    _.set(params, serviceProperty, service)
    // Let it work with id/name string or real object
    if (typeof id === 'string' || ObjectID.isValid(id)) {
      const args = { user: hook.params.user }
      let object
      try {
        // Get by ID or name ?
        if (ObjectID.isValid(id)) {
          object = await service.get(id.toString(), args)
        } else {
          Object.assign(args, { query: { name: id.toString() }, paginate: false })
          const results = await service.find(args)
          if (results.length >= 0) object = results[0]
        }
      } catch (error) {
        // Not found error is managed hereafter
        if (error.code !== 404) throw error
      }
      if (!object) {
        if (options.throwOnNotFound) throw new Error(`Cannot find object with id ${id} to dynamically populate.`)
        else return hook
      }
      // Set the retrieved object on the same field or given one in hook params
      _.set(params, idProperty, object)
      return hook
    } else {
      // Set the object on the same field or given one in hook params
      _.set(params, idProperty, id)
      return hook
    }
  }
}

export function unpopulateObject (options) {
  return function (hook) {
    const params = hook.params
    const idProperty = options.nameIdAs || options.idField
    const serviceProperty = options.nameServiceAs || options.serviceField

    // Check if not already done
    _.unset(params, idProperty)
    _.unset(params, serviceProperty)

    return hook
  }
}

export function populateObjects (options) {
  return async function (hook) {
    const app = hook.app
    const data = hook.data
    const params = hook.params
    const query = params.query
    const context = hook.service.context
    const idProperty = options.nameIdAs || options.idField
    const serviceProperty = options.nameServiceAs || options.serviceField

    // Check if not already done
    if (Array.isArray(_.get(params, idProperty))) {
      debug(`Skipping populating ${idProperty} as already done`)
      return hook
    }
    if (typeof _.get(params, serviceProperty) === 'object') {
      debug(`Skipping populating ${serviceProperty} as already done`)
      return hook
    }

    // Get service where we can find the object to populate
    // Make hook usable with query params as well and service name or real object
    let service = _.get(data, options.serviceField) || _.get(query, options.serviceField)
    if (typeof service === 'string') {
      const message = `Cannot find the service for ${options.serviceField} = ${service} to dynamically populate.`
      service = app.getService(service, context)
      if (!service) {
        if (options.throwOnNotFound) throw new Error(message)
        else return hook
      }
    } else if (!service) {
      if (options.throwOnNotFound) throw new Error(`No ${options.serviceField} given to dynamically populate.`)
      else return hook
    }

    // Set the retrieved service on the same field or given one in hook params
    _.set(params, serviceProperty, service)

    // Then the object ID
    const id = _.get(data, options.idField) || _.get(query, options.idField)
    // If no ID given we perform a find, no pagination to be sure we get all objects
    if (!id) {
      debug(`Populating ${idProperty}`)
      const objects = await service.find({ query: {}, paginate: false, user: hook.params.user })
      // Set the retrieved objects on the same field or given one in hook params
      debug(`Populated ${objects.length} ${idProperty}`)
      _.set(params, idProperty, objects)
      return hook
    } else {
      debug(`Populating ${idProperty} with ID ${id}`)
      // Let it work with id/name string or real object
      if (typeof id === 'string' || ObjectID.isValid(id)) {
        let object
        try {
          // Get by ID or name ?
          if (ObjectID.isValid(id)) {
            object = await service.get(id.toString(), { user: hook.params.user })
          } else {
            const results = await service.find({ query: { name: id.toString() }, paginate: false, user: hook.params.user })
            if (results.length >= 0) object = results[0]
          }
        } catch (error) {
          // Not found error is managed hereafter
          if (error.code !== 404) throw error
        }
        if (!object) {
          if (options.throwOnNotFound) throw new Error(`Cannot find ${options.idField} = ${id} to dynamically populate.`)
          else return hook
        }
        // Set the retrieved object on the same field or given one in hook params
        _.set(params, idProperty, [object])
        return hook
      } else {
        // Set the object on the same field or given one in hook params
        _.set(params, idProperty, [id])
        return hook
      }
    }
  }
}

export function unpopulateObjects (options) {
  // These are similar behaviour
  return unpopulateObject(options)
}

// Used to manage diacritic insensitive fuzzy search
export function diacriticSearch (options = {}) {
  return hook => {
    const query = hook.params.query
    _.forOwn(query, (value, key) => {
      // Check if applicable
      if (value.$regex && !value.$regex.diacritic && value.$regex.source && !value.$diacriticSensitive) {
        // Take care to support as well case sensitivity by keeping flags
        query[key].$regex = new RegExp(makeDiacriticPattern(value.$regex.source), value.$regex.flags)
        // Custom internal property to make the hook reentrant
        query[key].$regex.diacritic = true
      }
    })
  }
}
