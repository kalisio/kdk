import logger from 'loglevel'
import _ from 'lodash'
import sift from 'sift'
import moment from 'moment'
import jwtdecode from 'jwt-decode'
import feathers from '@feathersjs/client'
import { io } from 'socket.io-client'
import reactive from 'feathers-reactive/dist/feathers-reactive.js'
import { createBrowserRepo, AutomergeService } from '@kalisio/feathers-automerge/lib/index.js'
import configuration from 'config'
import { permissions } from '../common/index.js'
import { Store } from './store.js'
import { Events } from './events.js'
import * as hooks from './hooks/index.js'

// Disable default feathers behavior of re-authenticating on disconnect
feathers.authentication.AuthenticationClient.prototype.handleSocket = () => {}

export async function createClient (config) {
  // Setup log level
  if (_.get(configuration, 'logs.level')) {
    logger.setLevel(_.get(configuration, 'logs.level'), false)
  } else {
    logger.setLevel('info')
  }
  // Initiate the client
  const api = feathers()
  if (configuration.automerge) {
    api.set('repo', createBrowserRepo(window.location.origin + '/' + (configuration.automerge.syncServerWsPath || '')))
  }
  // Initialize connection state/listeners
  api.isDisconnected = !navigator.onLine
  addEventListener('online', () => {
    api.isDisconnected = false
    Events.emit('navigator-reconnected', api)
  })
  addEventListener('offline', () => {
    api.isDisconnected = true
    Events.emit('navigator-disconnected', api)
  })
  // This can force to use offline services it they exist even if connected
  api.useLocalFirst = config.useLocalFirst
  api.setLocalFirstEnabled = function (enabled) {
    api.useLocalFirst = enabled
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
  api.getServicePath = function (name, context, withApiPrefix = true) {
    // Defaults to global service path on "nil" context
    let path = name
    if (!_.isEmpty(context)) {
      // Context is given as string ID or object ?
      if (typeof context === 'string') {
        // 'global' keyword is to get the global service
        if (context !== 'global') path = context + '/' + name
      } else if (context._id) {
        path = context._id + '/' + name
      }
    }
    if (withApiPrefix) {
      path = config.apiPath + '/' + path
    }
    // Take care that feathers strip slashes
    if (path.startsWith('/')) path = path.substr(1)
    return path
  }
  // If no context is given the current from the store will be retrieved (if any)
  // and the associated contextual service returned (if any)
  api.getServiceInstance = function (name, context, options = {}) {
    // Depending on the create option we don't directly use service() here
    // as it will automatically create a new service wrapper even if it does not exist
    let service
    // If a context is given use it
    if (!_.isEmpty(context)) {
      const servicePath = api.getServicePath(name, context)
      service = (options.create ? api.service(servicePath) : api.services[servicePath])
    } else { // Otherwise check for a potential current context to be used
      const currentContext = Store.get('context')
      const contextualPath = api.getServicePath(name, currentContext)
      const contextualService = api.services[contextualPath]
      const globalPath = api.getServicePath(name)
      const globalService = api.services[globalPath]
      // If one of the service do exist use it, contextual one first
      service = contextualService || globalService
      // Otherwise as a fallback create a new global service as we don't really know if context should apply,
      // if so the app should declare it upfront
      if (!service && options.create) {
        service = api.service(globalPath)
      }
    }
    return service
  }
  // Check if an online, ie "standard", version of a service is available
  api.getOnlineService = function (name, context, options = {}) {
    return api.getServiceInstance(name, context, Object.assign({ create: true }, options))
  }
  // Check if an offline version of a service is available
  api.getOfflineService = function (name, context, options = {}) {
    return api.getServiceInstance(`${name}-offline`, context, Object.assign({ create: false }, options))
  }
  api.getService = function (name, context, options = {}) {
    let service
    // When offline try to use offline service version if any
    if (api.isDisconnected || api.useLocalFirst) {
      service = api.getOfflineService(name, context, options)
      // In local first mode we allow to use remote service if offline one doesn't exist
      if (!service && !api.useLocalFirst) {
        // Do not throw as a lot of components expect services to be available at initialization, eg
        // api.getService('xxx').on('event', () => ...)
        // In this case we simply warn and return the wrapper to the online service.
        // However, it is up to the application to make sure of not using such components when offline
        // throw new Error('Cannot retrieve offline service ' + name + ' for context ' + (typeof context === 'object' ? context._id : context))
        logger.warn('[KDK] Cannot retrieve offline service ' + name + ' for context ' + (typeof context === 'object' ? context._id : context))
      }
    }
    if (!service) {
      service = api.getOnlineService(name, context, options)
      if (!service) {
        throw new Error('Cannot retrieve service ' + name + ' for context ' + (typeof context === 'object' ? context._id : context))
      }
    }
    return service
  }
  // Used to create a frontend only service with its options
  api.createService = function (name, options = {}) {
    const servicePath = api.getServicePath(name, options.context)
    // Service object/constructor fucntion provided ?
    let service = options.service
    // If we get a function try to call it assuming it will return the service object
    if (typeof service === 'function') {
      service = service(name, api, options)
    }
    // Otherwise initialize a default wrapper
    if (!service) service = api.transporter.service(servicePath)
    // Register service up-front (required for custom methods)
    api.use(servicePath, service, options)
    service = api.service(servicePath)
    if (options.hooks) service.hooks(options.hooks)
    if (options.context) service.context = options.context
    service.path = servicePath
    return service
  }
  // Used to create a frontend only service to be used in offline mode
  // based on an online service name, will snapshot service data by default
  api.createOfflineService = async function (serviceName, options = {}) {
    const offlineServiceName = `${serviceName}-offline`
    let offlineService = api.getOfflineService(serviceName)

    if (!offlineService) {
      // Pass options not used internally for offline management as service options and store it along with service
      const serviceOptions = _.omit(options, ['hooks', 'documentHandle'])
      // Take care that feathers strip slashes, go from /api to api/
      const path = config.apiPath.substr(1) + '/' + serviceName
      offlineService = api.createService(offlineServiceName, {
        /*
        service: createOfflineService({
          id: '_id',
          name: 'offline_services',
          storeName: serviceName,
          multi: true,
          storage: ['IndexedDB'],
          // FIXME: this should not be hard-coded as it depends on the service
          // For now we set it at the max value but if a component
          // does not explicitly set the limit it will get a lot of data
          paginate: { default: 5000, max: 5000 }
        }),
        */
        service: new AutomergeService(options.documentHandle, {
          idField: '_id',
          path
        }),
        // Set required default hooks
        hooks: _.defaultsDeep(_.get(options, 'hooks'), {
          before: {
            all: [hooks.ensureSerializable, hooks.removeServerSideParameters],
            create: [hooks.generateId]
          }
        }),
        ...serviceOptions
      })
    }

    return offlineService
  }
  api.removeService = function (name, context) {
    const path = api.getServicePath(name, context)
    api.unuse(path)
  }
  // Helper functions to access/alter config used at creation time
  api.getConfig = function (path) {
    return (path ? _.get(config, path) : config)
  }
  api.setConfig = function (path, value) {
    _.set(config, path, value)
  }
  api.hasConfig = function (path, value) {
    return _.has(config, path, value)
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
    logger.debug('[KDK] Check for abilities ', operation, service, context, resource, abilities)
    if (!abilities) {
      logger.debug('[KDK] Access denied without abilities')
      return false
    }
    let result
    // If no service we have a single generic operation
    if (service) {
      // Check for access to service fisrt
      const path = api.getServicePath(service, context, false)
      result = permissions.hasServiceAbilities(abilities, path)
      if (!result) {
        logger.debug('[KDK] Access to service path ' + path + ' denied')
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
      logger.debug('[KDK] Access to resource denied')
    } else {
      logger.debug('[KDK] Access to resource granted')
    }
    return result
  }

  const origin = api.getConfig('domain')
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
    // Disable default socketio behavior of buffering messages when disconnected
    // Also keep track of connection state with the server
    api.socket.io.on('reconnect', async () => {
      api.isDisconnected = false
      api.socket.sendBuffer = []
      // Re-authenticate on reconnect
      await api.reAuthenticate(true)
      Events.emit('websocket-reconnected', api)
      logger.info('[KDK] Socket has been reconnected')
    })
    api.socket.io.on('reconnect_error', () => {
      api.isDisconnected = true
      Events.emit('websocket-disconnected', api)
      logger.error(new Error('[KDK] Socket has been disconnected'))
    })
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
  // Override Feathers configure that do not manage async operations,
  // here we also simply call the function given as parameter but await for it
  api.configure = async function (fn) {
    await fn.call(this, this)
    return this
  }

  // Define domain in config if not forced
  if (!api.getConfig('domain')) api.setConfig('domain', window.location.origin)

  // It appears that navigator.onLine is not reliable so that
  // we perform an actual request to the domain in order to ensure we are online.
  // We avoid CORS errors with a request to your own origin.
  // We also add a random query parameter to prevent cached responses.
  if (!api.isDisconnected) {
    try {
      const url = new URL(api.getConfig('domain'))
      url.searchParams.set('random', Math.random().toFixed(18).substring(2, 18))
      await window.fetch(url.toString(), { method: 'HEAD' })
    } catch (error) {
      api.isDisconnected = true
      Events.emit('navigator-disconnected', api)
      logger.warn(`[KDK] Cannot request target domain ${api.getConfig('domain')}, setting state to offline`, error)
    }
  }

  return api
}

// We don't create a default client based on app configuration here
// as we don't know when the file will be imported first,
// eg it might be imported before another one updating the config.
// It is up to the application to instantiate the client when required.
export let api
export async function initializeApi (fn) {
  api = await createClient(configuration)
  if (fn) fn.call(api, configuration)
  return api
}
