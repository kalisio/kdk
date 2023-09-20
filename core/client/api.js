import logger from 'loglevel'
import _ from 'lodash'
import sift from 'sift'
import moment from 'moment'
import jwtdecode from 'jwt-decode'
import feathers from '@feathersjs/client'
import { io } from 'socket.io-client'
import reactive from 'feathers-reactive/dist/feathers-reactive.js'
import configuration from 'config'
import { permissions } from '../common/index.js'
import { Store } from './store.js'
import { Events } from './events.js'

// Setup log level
if (_.get(configuration, 'logs.level')) {
  logger.setLevel(_.get(configuration, 'logs.level'), false)
} else {
  logger.setLevel('info')
}

export function createClient (config) {
  // Initiate the client
  const api = feathers()

  function getBaseUrlStorageKey () {
    return config.appName.toLowerCase() + '-baseUrl'
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
    if (!_.has(api.serviceOptions, name)) _.set(api.serviceOptions, name, options)
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
      api.use(servicePath, service || api.transporter.service(servicePath), {
        methods: options.methods
      })
    } else {
      api.use(servicePath, service)
    }
    service = api.service(servicePath)
    if (options.hooks) service.hooks(options.hooks)
    if (options.context) service.context = options.context
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
    // We can override the default app origin anyway
    let origin = config.origin || window.location.origin
    // Check for registered custom base Url if any
    if (window.localStorage.getItem(getBaseUrlStorageKey())) {
      origin = window.localStorage.getItem(getBaseUrlStorageKey())
    }
    return origin
  }

  api.can = function () {
    let service, context, resource
    // We can call this with different signatures
    // Last argument can always be an additional user,
    // if not defined the user is retrieved from the store
    const user = arguments[arguments.length - 1]
    const hasUser = _.has(user, 'abilities')
    const nbArguments = (hasUser ? arguments.length - 1 : arguments.length)
    // (operation, service, resource) or (operation, service, context, resource)
    const operation = arguments[0]
    service = arguments[1]
    // (operation, service, context, resource)
    if (nbArguments === 4) {
      context = arguments[2]
      resource = arguments[3]
    } else { // Either (operation, service, resource) or (operation, service, context)
      if (typeof arguments[2] === 'string') context = arguments[2]
      else resource = arguments[2]
    }
    // Service/Constext/Resource can be omitted, in this case it could be replaced by the user argument
    if (_.has(service, 'abilities')) service = undefined
    if (_.has(context, 'abilities')) context = undefined
    if (_.has(resource, 'abilities')) resource = undefined

    const abilities = (hasUser ? _.get(user, 'abilities') : Store.get('user.abilities'))
    logger.debug('Check for abilities ', operation, service, context, resource, abilities)
    if (!abilities) {
      logger.debug('Access denied without abilities')
      return false
    }
    let result
    // If no service we have a single generic operation
    if (service) {
      // Check for access to service fisrt
      const path = api.getServicePath(service, context, false)
      result = permissions.hasServiceAbilities(abilities, path)
      if (!result) {
        logger.debug('Access to service path ' + path + ' denied')
        return false
      } else if (operation === 'service') {
        // When we only check for service-level access return
        return true
      }
      // Then for access to resource
      result = permissions.hasResourceAbilities(abilities, operation, service, context, resource)
    } else {
      result = abilities.can(operation)
    }
    if (!result) {
      logger.debug('Access to resource denied')
    } else {
      logger.debug('Access to resource granted')
    }
    return result
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
  // By default we automatically renew JWT token before it expires
  api.renewJwtOnExpiration = function (authResult) {
    const { accessToken } = authResult
    const jwt = jwtdecode(accessToken)
    // Not expiring token (eg API)
    if (!jwt.exp) return
    const now = moment()
    const expiration = moment.unix(jwt.exp)
    // Setup a timeout to renew the token just before it expires if the user is still connected
    // Add a small delay to handle reauthentication time
    const delay = expiration.diff(now) - 2000
    setTimeout(() => {
      api.reAuthenticate(true)
    }, delay)
  }
  if (_.get(config, 'renewJwt', true)) {
    api.on('login', api.renewJwtOnExpiration)
  }
  // Object used to store configuration options for services
  api.serviceOptions = {}
  // Override Feathers configure that do not manage async operations,
  // here we also simply call the function given as parameter but await for it
  api.configure = async function (fn) {
    await fn.call(this, this)
    return this
  }

  return api
}

// We don't create a default client based on app configuration here
// as we don't know when the file will be imported first,
// eg it might be imported before another one updating the config.
// It is up to the application to instanciate the client when required.
export let api
export function initializeApi () {
  api = createClient(configuration)
  return api
}
