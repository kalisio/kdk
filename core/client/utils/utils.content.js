import _ from 'lodash'
import logger from 'loglevel'
import sift from 'sift'
import { Store } from '../store.js'

const Handlers = ['handler', 'visible', 'hidden', 'disabled', 'on.listener']
// Some bindings are not managed when reading content from config but externally on-demand, e.g. by KContent or KAction
// The content 'reserved' property is also used to recurse at caller level
const ReservedBindings = ['content', 'visible', 'hidden', 'route']

// Check if an object has a property according to its path.
// Similar to lodash has function which causes a bug in production build with Vue proxy objects
// It appears that with proxy objects it is safer to use the in operator or Reflect.has()
function hasProperty (object, path) {
  const keys = path.split('.')
  let currentObject = object
  for (const key of keys) {
    if (!currentObject || !(key in currentObject)) {
      return false
    }
    currentObject = currentObject[key]
  }
  return true
}

export function filterContent (content, filter) {
  // Handle non object content
  if (typeof content !== 'object') return content
  // Handle array and object case
  const isArray = Array.isArray(content)
  const modes = _.keys(content)
  let filteredContent = content
  if (!isArray) {
    // Recurse ?
    if (filteredContent.content) {
      filteredContent.content = filterContent(filteredContent.content, filter)
    } else {
      modes.forEach(mode => {
        const contentForMode = filteredContent[mode]
        filteredContent[mode] = filterContent(contentForMode, filter)
      })
    }
    filteredContent = [filteredContent]
  } else {
    filteredContent.forEach(item => {
      // Recurse ?
      if (item.content) {
        item.content = filterContent(item.content, filter)
      }
    })
  }
  // Apply filtering
  filteredContent = filteredContent.filter(sift(filter))
  return (isArray ? filteredContent : filteredContent[0])
}

// Perform binding between a configuration object and a given context object
export function bindContent (content, context, omit = []) {
  const components = _.flatMapDeep(content)
  _.forEach(components, (component) => {
    // Process component handlers
    Handlers.forEach(handler => bindHandler(component, handler, context))
    // Then process component props
    // It allows to write any property like { label: ':xxx' } and bind it
    // to a component property from the context like we do for handler
    bindProperties(component, context, omit)
    // Recursively bind the props/handlers on the sub content object
    if (component.content) bindContent(component.content, context, omit)
  })
  return content
}

export function bindProperties (item, context, omit = []) {
  if (Array.isArray(item)) {
    for (let i = 0; i < item.length; i++) {
      item[i] = bindProperties(item[i], context)
    }
  } else if (typeof item === 'object') {
    _.forOwn(item, (value, key) => {
      // Bind required properties only
      if (!ReservedBindings.includes(key) && !omit.includes(key)) {
        if (typeof value === 'string') {
          item[key] = getBoundValue(value, context)
        } else {
          item[key] = bindProperties(value, context)
        }
      }
    })
  }
  return item
}

export function bindHandler (component, path, context) {
  const handler = _.get(component, path)
  // Could be an array if multiple handlers to be called
  if (Array.isArray(handler)) {
    // Process all array elements, manage the case where the handler is simply a function/property name
    const handlers = handler.map(h => generateHandler(context, h.name || h, h.params))
    // In that specific case the result is a boolean AND operation
    _.set(component, path, (...args) => handlers.reduce((result, h) => result && h(...args), true))
  } else if (handler && typeof handler === 'object') {
    // Could be a structure with name and possibly params specified
    // :xxx is reserved for binding to internal property not function call
    if (handler.name) {
      if (!handler.name.startsWith(':')) {
        _.set(component, path, generateHandler(context, handler.name, handler.params))
      }
    } else {
      logger.debug(`[KDK] invalid handler binding for ${handler}: you must provide the name to the function to be called`)
    }
  } else if ((typeof handler === 'string') && !handler.startsWith(':')) {
    // Or only name if no params are specified
    // :xxx is reserved for binding to internal property not function call
    _.set(component, path, generateHandler(context, handler))
  }
  // Get back processed handler function
  return _.get(component, path)
}

export function generateHandler (context, name, params) {
  // When the handler can be a simple getter, eg is visible use case,
  // we allow a property value instead of a function and a logical NOT
  const isNot = name.startsWith('!')
  if (isNot) name = name.substring(1)
  return (...args) => {
    let result
    const handler = _.get(context, name)
    // Function call or property value read ?
    if (typeof handler === 'function') {
      // Provided parameters or simply forward arguments ?
      result = (params ? handler(...bindParams(params, context, args)) : handler(...args))
    } else {
      result = handler
    }
    // Logical NOT to be performed ?
    return (isNot ? !result : result)
  }
}

export function bindParams (params, context, args) {
  if (_.isNil(params)) {
    return params
  } else if (Array.isArray(params)) {
    return params.map(param => bindParams(param, context, args))
  } else if (typeof params === 'object') {
    return _.mapValues(params, (value, key) => bindParams(value, context, args))
  } else {
    return getBoundValue(params, context, args)
  }
}

export function getBoundValue (value, context, args) {
  // A parameter like :xxx means xxx is a property of the context, not a static value.
  // In that case remove trailing : and get property value dynamically.
  // A parameter like :n means the nth argument of the handler, not a static value.
  // In that case remove trailing : and get indexed argument dynamically.
  if ((typeof value === 'string') && value.startsWith(':')) {
    // From store or context ?
    if (value.startsWith(':store.')) {
      const path = value.replace(':store.', '')
      if (Store.has(path)) return Store.get(path)
    } else if (value.startsWith(':storeRef.')) {
      const path = value.replace(':storeRef.', '')
      // FIXME: we should test if the path exists but this causes
      // a bug in production build with Vue proxy objects
      // if (Store.has(path)) return Store.getRef(path)
      if (hasProperty(Store, path)) return Store.getRef(path)
      // Workaround if not possible to correctly check the path first
      // but it causes problems with values initialized to null
      // const result = Store.getRef(path)
      // if (!_.isNil(result)) return result
    } else {
      const path = value.substring(1)
      // Check for argument index
      const n = _.toNumber(path)
      if (_.isFinite(n)) return args[n]
      // FIXME: we should test if the path exists but this causes
      // a bug in production build with Vue proxy objects
      // if (_.has(context, path)) return _.get(context, path)
      if (hasProperty(context, path)) return _.get(context, path)
      // Workaround if not possible to correctly check the path first
      // but it causes problems with values initialized to null
      // const result = _.get(context, path)
      // if (!_.isNil(result)) return result
    }
    // Bound value not found
    return undefined
  }
  return value
}
