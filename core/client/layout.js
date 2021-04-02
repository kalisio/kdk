import _ from 'lodash'
import path from 'path'
import logger from 'loglevel'
import sift from 'sift'
import { uid } from 'quasar'
import { Store } from './store'

const components = ['header', 'footer']
const handlers = ['handler', 'visible', 'on.listener']

// Export singleton
export const Layout = {
  initialize () {
    components.forEach(component => {
      Store.set(component, { content: null, mode: undefined, filter: {}, visible: false })
    })
  },
  getHeader () {
    return Store.get(components[0])
  },
  setHeader (content, mode, filter, visible) {
    Store.patch(components[0], { content, mode, filter, visible })
  },
  setHeaderMode (mode) {
    Store.patch(components[0], { mode })
  },
  setHeaderVisible (visible) {
    Store.patch(components[0], { visible })
  },
  clearHeader () {
    Store.patch(components[0], { content: null, mode: undefined, visible: false })
  },
  getFooter () {
    return Store.get(components[1])
  },
  setFooter (content, mode, filter, visible) {
    Store.patch(components[1], { content, mode, filter, visible })
  },
  setFooterMode (mode) {
    Store.patch(components[1], { mode })
  },
  setFooterVisible (visible) {
    Store.patch(components[1], { visible })
  },
  clearFooter () {
    Store.patch(components[1], { content: null, mode: undefined, visible: false })
  },
  getLeftDrawer () {
    return Store.get(components[2])
  },
  validateMode (content, mode) {
    // Check if mode has been voluntarily unset
    if (_.isNull(mode)) return null
    // Otherwise check if it exists or return first content
    const modes = _.keys(content)
    if (modes.includes(mode)) return mode
    else return _.head(modes)
  },
  filterContent (content, filter) {
    // Handle array and object case
    const isArray = Array.isArray(content)
    const modes = _.keys(content)
    let filteredContent = content
    // Recurse ?
    if (!isArray) {
      if (filteredContent.content) {
        filteredContent.content = this.filterContent(filteredContent.content, filter)
      } else {
        modes.forEach(mode => {
          const contentForMode = filteredContent[mode]
          filteredContent[mode] = this.filterContent(contentForMode, filter)
        })
      }
      filteredContent = [filteredContent]
    }
    // Apply filtering
    filteredContent = filteredContent.filter(sift(filter))
    return (isArray ? filteredContent : filteredContent[0])
  },
  getComponents (content, mode, context) {
    let components = []

    // Get component config for given mode if any
    if (Array.isArray(content)) {
      components = content
    } else {
      mode = this.validateMode(content, mode)
      components = _.get(content, mode)
    }
    // Apply filtering
    // components = this.filterContent(components, filter)
    const processedComponents = []
    // Then create component objects
    _.forEach(components, (component) => {
      let isVisible = _.get(component, 'visible', true)
      // Can be a functional call
      if (typeof isVisible === 'function') {
        isVisible = isVisible(context)
      }
      // If not a functional call the target property can be a reactive one
      // so that we "bind" it to the component instead of "filter" it here
      component.visible = isVisible
      // Define the component key
      const componentName = _.get(component, 'component', 'frame/KAction')
      const componentKey = _.kebabCase(path.basename(componentName))
      // Clone the component and add the required props
      component.componentName = componentName
      component.componentKey = componentKey
      component.uid = uid()
      processedComponents.push(component)
    })
    return processedComponents
  },
  bindParam (param, context) {
    return (typeof param === 'string') ? (param.startsWith(':') ? _.get(context, param.substring(1)) : param) : param
  },
  bindParams (params, context) {
    // A parameter like :xxx means xxx is a property of the component, not a static value
    // In that case remove trailing : and get property value dynamically
    if (_.isNil(params)) {
      return params
    } else if (Array.isArray(params)) {
      return params.map(param => this.bindParams(param, context))
    } else if (typeof params === 'object') {
      return _.mapValues(params, (value, key) => this.bindParams(value, context))
    } else {
      return this.bindParam(params, context)
    }
  },
  generateHandler (context, name, params) {
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
        result = (params ? handler(...this.bindParams(params, context)) : handler(...args))
      } else {
        result = handler
      }
      // Logical NOT to be performed ?
      return (isNot ? !result : result)
    }
  },
  bindHandler (component, path, context) {
    const handler = _.get(component, path)
    // Could be an array if multiple handlers to be called
    if (Array.isArray(handler)) {
      // Process all array elements, manage the case where the handler is simply a function/property name
      const handlers = handler.map(h => this.generateHandler(context, h.name || h, h.params))
      // In that specific case the result is a boolean AND operation
      _.set(component, path, (...args) => handlers.reduce((result, h) => result && h(...args), true))
    } else if (handler && typeof handler === 'object') {
      // Could be a structure with name and possibly params specified
      if (handler.name) {
        _.set(component, path, this.generateHandler(context, handler.name, handler.params))
      } else {
        logger.debug(`Invalid handler binding for ${handler}: you must provide the name to the function to be called`)
      }
    } else if (typeof handler === 'string') { // Or only name if no params are specified
      _.set(component, path, this.generateHandler(context, handler))
    }
    // Get back processed handler function
    return _.get(component, path)
  },
  bindProperties (item, context) {
    if (typeof item === 'string') {
      if (item.startsWith(':')) return _.get(context, item.substring(1))
    } else if (Array.isArray(item)) {
      for (let i = 0; i < item.length; i++) {
        item[i] = this.bindProperties(item[i], context)
      }
    } else if (typeof item === 'object') {
      _.forOwn(item, (value, key) => {
        // Skip 'reserved' property
        if ((key !== 'content') && (key !== 'bind')) item[key] = this.bindProperties(value, context)
      })
    }
    return item
  },
  // Perform binding between a configuration object and a given context object
  bindContent (content, context) {
    const components = _.flatMapDeep(content)
    _.forEach(components, (component) => {
      // Process component handlers
      handlers.forEach(handler => this.bindHandler(component, handler, context))
      // Then process component props
      // FIXME: don't know why but this generic binding function does not seem to work
      // It should allow to wrote any property like { label: ':xxx' } and bind it
      // to a component property from the context like we do for handler
      // this.bindProperties(component, context)
      // The only way to make it work is to add props at the root level
      const binding = component.bind ? component.bind : null
      if (binding) component.props = _.get(context, binding)
      // Recursively bind the props/handlers on the sub content object
      if (component.content) this.bindContent(component.content, context)
    })
    return content
  }
}
