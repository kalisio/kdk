import logger from 'loglevel'
import _ from 'lodash'
import sift from 'sift'
import feathers from '@feathersjs/client'
import { io } from 'socket.io-client'
import reactive from 'feathers-reactive/dist/feathers-reactive.js'
import config from 'config'
import { Platform } from 'quasar'
import { permissions } from '../common/index.js'
import { Store } from './store.js'
import { Events } from './events.js'

function getBaseUrlStorageKey () {
  return config.appName + '-baseUrl'
}

// Matchers that can be added to customize route guards
let matchers = []

function siftMatcher (originalQuery) {
  // Filter out Feathers specific operators like $limit, $skip, etc.
  // (copied from https://github.com/feathersjs-ecosystem/feathers-reactive)
  const keysToOmit = Object.keys(originalQuery).filter(key => key.charCodeAt(0) === 36)
  let query = _.omit(originalQuery, ...keysToOmit)
  // Compatibility with fuzzy search that use $search query syntax
  _.forOwn(query, (value, key) => {
    if ((typeof value === 'object') && _.has(value, '$search')) {
      query[key] = { $regex: new RegExp(_.get(value, '$search'), 'i') }
    }
  })
  // Run registered matchers
  for (const matcher of matchers) {
    query = matcher(query)
  }
  return sift(query)
}

export const api = feathers()

// Setup the api

api.registerMatcher = function (matcher) {
  if (!matchers.includes(matcher)) {
    matchers.push(matcher)
  }
}
api.unregisterMatcher = function (matcher) {
  matchers = matchers.filter(registeredMatcher => registeredMatcher !== matcher)
}
api.matcher = siftMatcher

// This avoid managing the API path before each service name
// If a context is not given it will be retrieved from the store if any and used for contextual services
api.getServicePath = function (name, context, withApiPrefix = true) {
  const options = _.get(api.serviceOptions, name, {})
  let path
  // For non-contextual services path is always the name
  if (!options.context) {
    path = name
  } else {
    // Context is given as string ID or object ?
    if (typeof context === 'string') {
      if (context) path = context + '/' + name
      // Force global context on empty string
      else path = name
    } else if (typeof context === 'object') {
      if (context && context._id) path = context._id + '/' + name
      // Force global context on empty object
      else path = name
    } else {
      // Otherwise test for current context as service is registered as contextual
      const context = Store.get('context')
      if (context) {
        path = api.getServicePath(name, context, false)
      } else {
        // Because it could also be registered as global with the same name fallback
        path = name
      }
    }
  }

  if (withApiPrefix) {
    path = config.apiPath + '/' + path
  }
  return path
}
api.getService = function (name, context) {
  const path = api.getServicePath(name, context)
  const service = api.service(path)
  if (!service) {
    throw new Error('Cannot retrieve service ' + name + ' for context ' + (typeof context === 'object' ? context._id : context))
  }
  // Store the path on first call
  if (!service.path) service.path = path
  return service
}
// Used to register an existing backend service with its options
api.declareService = function (name, options = {}) {
  _.set(api.serviceOptions, name, options)
}
api.getServiceOptions = function (name) {
  return _.get(api.serviceOptions, name)
}
// Used to create a frontend only service with its options
api.createService = function (name, options = {}) {
  let servicePath = options.path || name
  let contextId
  if (options.context) {
    contextId = (typeof options.context === 'object' ? options.context._id : options.context)
    servicePath = contextId + '/' + servicePath
  }
  servicePath = config.apiPath + '/' + servicePath
  if (servicePath.startsWith('/')) servicePath = servicePath.substr(1)
  api.declareService(name, options)
  let service = options.service
  // If we get a function try to call it assuming it will return the service object
  if (typeof service === 'function') {
    service = service(name, api, options)
  }
  // Need to register services with custom methods
  if (options.methods) {
    api.use(servicePath, api.transporter.service(servicePath), {
      methods: options.methods
    })
  } else {
    api.use(servicePath, service)
  }
  service = api.service(servicePath)
  if (options.hooks) service.hooks(options.hooks)
  return service
}
// Change the base URL/domain to be used (useful for mobile apps)
api.setBaseUrl = function (baseUrl) {
  window.localStorage.setItem(getBaseUrlStorageKey(), baseUrl)
  // Updating this setting live does not seem to work well in Feathers
  // For now the caller should simply "reload" the app
  /*
  if (config.transport === 'http') {
    Object.keys(this.services).forEach(path => {
      const service = this.service(path)
      if (service.base) {
        service.base = `${baseUrl}/${path}`
      }
    })
  } else {
    let socket = io(baseUrl, {
      transports: ['websocket'],
      path: (config.apiPath || '/') + 'ws'
    })
    this.configure(feathers.socketio(socket))
  }
  */
}

api.getBaseUrl = function () {
  // let isMobile = Platform.is.cordova || Platform.is.ios
  let origin = Platform.is.cordova ? config.domain : window.location.origin
  // Check for registered custom base Url if any
  if (window.localStorage.getItem(getBaseUrlStorageKey())) {
    origin = window.localStorage.getItem(getBaseUrlStorageKey())
  }
  return origin
}

api.can = function () {
  let operation, service, context, resource, user
  // We can call this with different signatures
  // Last argument can always be an additional user,
  // if not defined the user is retrieved from the store
  user = arguments[arguments.length - 1]
  const hasUser = _.has(user, 'abilities')
  const nbArguments = (hasUser ? arguments.length - 1 : arguments.length)
  // (operation, service, resource) or (operation, service, context, resource)
  operation = arguments[0]
  service = arguments[1]
  if (nbArguments === 4) {
    context = arguments[2]
    resource = arguments[3]
  } else {
    resource = arguments[2]
  }
  // Resource can be omitted, in this case it will be replaced by the user argument
  if (_.has(resource, 'abilities')) resource = undefined
  
  const abilities = _.get(user, 'abilities', Store.get('user.abilities'))
  logger.debug('Check for abilities ', operation, service, context, resource, abilities)
  if (!abilities) {
    logger.debug('Access denied without abilities')
    return false
  }
  // Check for access to service fisrt
  const path = api.getServicePath(service, context, false)
  let result = permissions.hasServiceAbilities(abilities, path)
  if (!result) {
    logger.debug('Access to service path ' + path + ' denied')
    return false
  } else if (operation === 'service') {
    // When we only check for service-level access return
    return true
  }
  // Then for access to resource
  result = permissions.hasResourceAbilities(abilities, operation, service, context, resource)
  if (!result) {
    logger.debug('Access to resource denied')
  } else {
    logger.debug('Access to resource granted')
  }
  return result
}

// Setup log level
if (config.logs && config.logs.level) {
  logger.setLevel(config.logs.level, false)
} else {
  logger.setLevel('info')
}
const origin = api.getBaseUrl()
if (config.transport === 'http') {
  api.transporter = feathers.rest(origin).fetch(window.fetch.bind(window))
  api.configure(api.transporter)
} else {
  api.socket = io(origin, {
    transports: ['websocket'],
    path: (config.apiPath || '/') + 'ws'
  })
  api.transporter = feathers.socketio(api.socket, { timeout: config.apiTimeout || 10000 })
  api.configure(api.transporter)
  // Retrieve our specific errors on rate-limiting
  api.socket.on('rate-limit', (error) => Events.emit('error', error))
}
api.configure(feathers.authentication({
  storage: window.localStorage,
  storageKey: config.apiJwt || 'feathers-jwt',
  path: config.apiPath + '/authentication'
}))
api.configure(reactive({
  idField: '_id',
  matcher: siftMatcher // Our custom matcher to handle fuzzy search
}))
// Object used to store configuration options for services
api.serviceOptions = {}
