import _ from 'lodash'
import { Store } from './store'

const components = ['header', 'footer', 'leftDrawer']

// Export singleton
export const Layout = {
  initialize () {
    components.forEach(component => {
      Store.set(component, { content: null, mode: undefined, visible: false })
    })
  },
  getHeader () {
    return Store.get(components[0])
  },
  setHeader (content, mode, visible) {
    Store.patch(components[0], { content, mode, visible })
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
  setFooter (content, mode, visible) {
    Store.patch(components[1], { content, mode, visible })
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
  setLeftDrawer (content, mode, visible) {
    Store.patch(components[2], { content, mode, visible })
  },
  setLeftDrawerMode (mode) {
    Store.patch(components[2], { mode })
  },
  setLeftDrawerVisible (visible) {
    Store.patch(components[2], { visible })
  },
  clearLeftDrawer () {
    Store.patch(components[2], { content: null, mode: undefined, visible: false })
  },
  validateMode (content, mode) {
    // Check if mode has been voluntarily unset
    if (_.isNull(mode)) return null
    // Otherwise check if it exists or return first content
    const modes = _.keys(content)
    if (modes.includes(mode)) return mode
    return _.head(modes)
  },
  bindParam (param, context) {
    return (typeof param === 'string') ?
      (param.startsWith(':') ? _.get(context, param.substring(1)) : param) :
      param
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
    let handler = _.get(context, name)
    return (...args) => {
      let result
      // Function call or property value read ?
      if (typeof handler === 'function') {
        // Provided parameters or simply forward arguments ?
        result = (params ?
          handler(...this.bindParams(params, context)) :
          handler(...args))
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
    }
    // Could be a structure with name and possibly params specified
    else if (handler && typeof handler === 'object') {
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
  // Perform binding between a configuration object and a given context object
  bindContent (content, context) {
    const components = _.flatMapDeep(content)
    _.forEach(components, (component) => {
      // Process component visibility state
      this.bindHandler(component, 'visible', context)
      // Process component handler
      this.bindHandler(component, 'handler', context)
      // Process component listener
      this.bindHandler(component, 'on.listener', context)
      // Process component props
      const binding = component.bind ? component.bind : null
      if (binding) component.props = _.get(context, binding)
      // Recursively bind the handlers on the sub content object
      if (component.content) this.bindContent(component.content, context)
    })
    return content
  }
}
