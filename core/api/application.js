import path from 'path'
import url from 'url'
import makeDebug from 'debug'
import logger from 'winston'
import _ from 'lodash'
import siftModule from 'sift'
import 'winston-daily-rotate-file'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import { RateLimiter as SocketLimiter } from 'limiter'
import HttpLimiter from 'express-rate-limit'
import feathers from '@feathersjs/feathers'
import configuration from '@feathersjs/configuration'
import errors from '@feathersjs/errors'
import express from '@feathersjs/express'
import socketio from '@feathersjs/socketio'
import mongodb from 'mongodb'
import { Database, idToString } from './db.js'
import auth from './authentication.js'

const debug = makeDebug('kdk:core:application')
const debugLimiter = makeDebug('kdk:core:application:limiter')
const { TooManyRequests, Forbidden, BadRequest } = errors
const { ObjectID } = mongodb
const { rest } = express
const sift = siftModule.default

function tooManyRequests (socket, message, key) {
  debug(message)
  const error = new TooManyRequests(message, { translation: { key } })
  socket.emit('rate-limit', error)
  // Add a timeout so that error message is correctly handled
  setTimeout(() => socket.disconnect(true), 3000)
}

export function declareService (path, app, service, middlewares = {}) {
  const feathersPath = app.get('apiPath') + '/' + path
  const feathersService = app.service(feathersPath)
  // Some internal Feathers service might internally declare the service
  if (feathersService) {
    return feathersService
  }
  // Initialize our service by providing any middleware as well
  let args = [feathersPath]
  if (middlewares.before) args = args.concat(middlewares.before)
  args.push(service)
  if (middlewares.after) args = args.concat(middlewares.after)
  app.use.apply(app, args)
  debug('Service declared on path ' + feathersPath)
  // Return the Feathers service, ie base service + Feathers' internals
  return app.service(feathersPath)
}

export async function configureService (name, service, servicesPath) {
  try {
    const hooks = (await import(url.pathToFileURL(path.join(servicesPath, name, `${name}.hooks.js`)))).default
    service.hooks(hooks)
    debug(name + ' service hooks configured on path ' + servicesPath)
  } catch (error) {
    debug('No ' + name + ' service hooks configured on path ' + servicesPath)
    if (error.code !== 'ERR_MODULE_NOT_FOUND') {
      // Log error in this case as this might be linked to a syntax error in required file
      debug(error)
    }
    // As this is optionnal this require has to fail silently
  }

  try {
    const channels = (await import(url.pathToFileURL(path.join(servicesPath, name, `${name}.channels.js`)))).default
    _.forOwn(channels, (publisher, event) => {
      if (event === 'all') service.publish(publisher)
      else service.publish(event, publisher)
    })
    debug(name + ' service channels configured on path ' + servicesPath)
  } catch (error) {
    debug('No ' + name + ' service channels configured on path ' + servicesPath)
    if (error.code !== 'ERR_MODULE_NOT_FOUND') {
      // Log error in this case as this might be linked to a syntax error in required file
      debug(error)
    }
    // As this is optionnal this require has to fail silently
  }

  return service
}

export function createProxyService (options) {
  const targetService = options.service
  function proxyParams (params) {
    if (options.params) {
      let proxiedParams
      if (typeof options.params === 'function') {
        proxiedParams = options.params(params)
      } else {
        proxiedParams = _.merge(params, options.params)
      }
      return proxiedParams
    } else return params
  }
  function proxyId (id) {
    if (options.id) return options.id(id)
    else return id
  }
  function proxyData (data) {
    if (options.data) return options.data(data)
    else return data
  }
  function proxyResult (data) {
    if (options.result) return options.result(data)
    else return data
  }
  return {
    async find (params) { return proxyResult(await targetService.find(proxyParams(params))) },
    async get (id, params) { return proxyResult(await targetService.get(proxyId(id), proxyParams(params))) },
    async create (data, params) { return proxyResult(await targetService.create(proxyData(data), proxyParams(params))) },
    async update (id, data, params) { return proxyResult(await targetService.update(proxyId(id), proxyData(data), proxyParams(params))) },
    async patch (id, data, params) { return proxyResult(await targetService.patch(proxyId(id), proxyData(data), proxyParams(params))) },
    async remove (id, params) { return proxyResult(await targetService.remove(proxyId(id), proxyParams(params))) }
  }
}

async function createService (name, app, options = {}) {
  const createFeathersService = (await import('feathers-' + app.db.adapter)).default

  const paginate = app.get('paginate')
  const serviceOptions = Object.assign({
    name: name,
    paginate,
    whitelist: ['$exists', '$distinct', '$groupBy', '$search', '$aggregate']
  }, options)
  if (serviceOptions.disabled) return undefined
  // For DB services a model has to be provided
  const fileName = serviceOptions.fileName || name

  let dbService = false
  try {
    if (serviceOptions.modelsPath) {
      const configureModel = (await import(url.pathToFileURL(path.join(serviceOptions.modelsPath, `${fileName}.model.${app.db.adapter}.js`)))).default
      configureModel(app, serviceOptions)
      dbService = true
    }
  } catch (error) {
    debug('No ' + fileName + ' service model configured on path ' + serviceOptions.modelsPath)
    if (error.code !== 'ERR_MODULE_NOT_FOUND') {
      // Log error in this case as this might be linked to a syntax error in required file
      debug(error)
    }
    // As this is optionnal this require has to fail silently
  }

  // Initialize our service with any options it requires
  let service
  if (dbService) {
    service = createFeathersService(serviceOptions)
    dbService = service
  } else if (serviceOptions.proxy) {
    service = createProxyService(serviceOptions.proxy)
  } else {
    // Otherwise we expect the service to be provided as a Feathers service interface
    service = (await import(url.pathToFileURL(path.join(serviceOptions.servicesPath, fileName, `${fileName}.service.js`)))).default
    // If we get a function try to call it assuming it will return the service object
    if (typeof service === 'function') {
      service = service(name, app, serviceOptions)
    }
    // Need to set this manually for services not using class inheritance or default adapters
    if (serviceOptions.events) service.events = serviceOptions.events
  }

  // Get our initialized service so that we can register hooks and filters
  let servicePath = serviceOptions.path || name
  let contextId
  if (serviceOptions.context) {
    contextId = idToString(serviceOptions.context)
    servicePath = contextId + '/' + servicePath
  }
  service = declareService(servicePath, app, service, serviceOptions.middlewares)
  // Register hooks and event filters
  service = await configureService(fileName, service, serviceOptions.servicesPath)
  // Optionnally a specific service mixin can be provided, apply it
  if (dbService && serviceOptions.servicesPath) {
    try {
      let serviceMixin = (await import(url.pathToFileURL(path.join(serviceOptions.servicesPath, fileName, `${fileName}.service.js`)))).default
      // If we get a function try to call it assuming it will return the mixin object
      if (typeof serviceMixin === 'function') {
        serviceMixin = await serviceMixin.bind(dbService)(fileName, app, serviceOptions)
      }
      service.mixin(serviceMixin)
    } catch (error) {
      debug('No ' + fileName + ' service mixin configured on path ' + serviceOptions.servicesPath)
      if (error.code !== 'ERR_MODULE_NOT_FOUND') {
        // Log error in this case as this might be linked to a syntax error in required file
        debug(error)
      }
      // As this is optionnal this require has to fail silently
    }
  }
  // Then configuration
  service.name = name
  service.app = app
  service.options = serviceOptions
  service.path = servicePath
  service.context = serviceOptions.context

  // Add some utility functions
  service.getPath = function (withApiPrefix) {
    let path = service.path
    if (withApiPrefix) {
      path = app.get('apiPath') + '/' + path
    }
    return path
  }
  service.getContextId = function () {
    return contextId // As string
  }

  debug(service.name + ' service registration completed')
  app.emit('service', service)

  return service
}

export function createWebhook (path, app, options = {}) {
  let webhookPath = path
  if (options.context) {
    webhookPath = idToString(options.context) + '/' + webhookPath
  }
  const isAllowed = (payload) => {
    // Default is to expose all services/operations
    if (!options.filter) return true
    const result = [payload].filter(sift(options.filter))
    return result.length > 0
  }

  app.post(app.get('apiPath') + '/webhooks/' + webhookPath, async (req, res, next) => {
    const payload = req.body
    const config = app.get('authentication')
    res.set('content-type', 'application/json')
    const params = {}
    try {
      if (options.preprocessor) {
        await options.preprocessor(req, res, payload)
      }
      // Authenticate when required
      if (config) {
        try {
          // Token is in header or payload
          const header = req.headers.authorization
          let accessToken
          if (header) {
            // Should be of the form: 'Bearer xxx'
            const tokens = header.match(/(\S+)\s+(\S+)/)
            if (tokens.length >= 2) accessToken = tokens[2]
          } else {
            accessToken = payload.accessToken
          }
          const tokenPayload = await app.service('authentication').verifyAccessToken(accessToken, config.jwtOptions)
          params.user = await app.getService('users').get(tokenPayload.userId)
          params.checkAuthorisation = true
        } catch (error) {
          throw new Forbidden('Could not verify webhook')
        }
      }
      if (req.headers['content-type'] !== 'application/json') {
        throw new BadRequest('Webhooks expect application/json content type')
      }
      if (!isAllowed(payload)) throw new Forbidden('Service or operation not allowed for webhook')
      const service = app.getService(payload.service, options.context || payload.context)
      if (!service) throw new BadRequest('Service could not be found')
      if (typeof service[payload.operation] !== 'function') throw new BadRequest('Service operation could not be found')
      const args = []
      // Get/Update/Patch/Remove
      const operationsWithId = ['get', 'update', 'patch', 'remove']
      if (operationsWithId.includes(payload.operation)) {
        if (!_.has(payload, 'id')) throw new BadRequest('Missing id for operation')
        args.push(_.get(payload, 'id'))
      }
      // Create/Update/Patch
      const operationsWithData = ['create', 'update', 'patch']
      if (operationsWithData.includes(payload.operation)) {
        if (!_.has(payload, 'data')) throw new BadRequest('Missing data for operation')
        args.push(_.get(payload, 'data'))
      }
      // Params
      args.push(params)
      if (options.postprocessor) {
        await options.postprocessor(service, args, payload)
      }
      try {
        const result = await service[payload.operation].apply(service, args)
        // Send back result
        res.json(result)
      } catch (error) {
        throw new BadRequest('Service operation could not be performed')
      }
    } catch (error) {
      // Send back error
      res.status(error.code).json(error.toJSON())
    }
  })

  debug(`Webhook ${webhookPath} registration completed`)
}

function setupLogger (app) {
  debug('Setup application loggers')
  const logsConfig = app.get('logs')
  // Use winston default logger
  app.logger = logger
  // Remove winston defaults
  try {
    logger.clear()
  } catch (error) {
    // Logger might be down, use console
    console.error('Could not remove default logger transport(s)', error)
  }
  // We have one entry per log type
  const logsTypes = logsConfig ? Object.getOwnPropertyNames(logsConfig) : []
  // Create corresponding winston transports with options
  logsTypes.forEach(logType => {
    const options = logsConfig[logType]
    // Setup default log level if not defined
    if (!options.level) {
      options.level = (process.env.NODE_ENV === 'development' ? 'debug' : 'info')
    }
    try {
      logger.add(new logger.transports[logType](options))
    } catch (error) {
      // Logger might be down, use console
      console.error('Could not setup default log levels', error)
    }
  })
}

function setupSockets (app) {
  const apiLimiter = app.get('apiLimiter')
  const connections = {}
  let nbConnections = 0

  return io => {
    // By default EventEmitters will print a warning if more than 10 listeners are added for a particular event.
    // The value can be set to Infinity (or 0) to indicate an unlimited number of listeners.
    io.sockets.setMaxListeners(0)
    const maxConnections = _.get(apiLimiter, 'websocket.maxConcurrency', 0)
    const maxIpConnections = _.get(apiLimiter, 'websocket.concurrency', 0)

    io.on('connection', socket => {
      nbConnections++
      debug(`New socket connection on server with pid ${process.pid}`, socket.id, socket.conn.remoteAddress, nbConnections)
      // Setup disconnect handler first
      socket.on('disconnect', (reason) => {
        nbConnections--
        debug(reason)
        debug(`Socket disconnection on server with pid ${process.pid}`, socket.id, socket.conn.remoteAddress, nbConnections)
        if (maxIpConnections > 0) {
          const nbIpConnections = _.get(connections, socket.conn.remoteAddress) - 1
          debug('Total number of connections for', socket.id, socket.conn.remoteAddress, nbIpConnections)
          _.set(connections, socket.conn.remoteAddress, nbIpConnections)
        }
      })
      if (maxConnections > 0) {
        if (nbConnections > maxConnections) {
          tooManyRequests(socket, 'Too many concurrent connections (rate limiting)', 'RATE_LIMITING_CONCURRENCY')
          return
        }
      }
      if (maxIpConnections > 0) {
        if (_.has(connections, socket.conn.remoteAddress)) {
          const nbIpConnections = _.get(connections, socket.conn.remoteAddress) + 1
          debug('Total number of connections for', socket.id, socket.conn.remoteAddress, nbConnections)
          _.set(connections, socket.conn.remoteAddress, nbIpConnections)
          if (nbIpConnections > maxIpConnections) {
            tooManyRequests(socket, 'Too many concurrent connections (rate limiting)', 'RATE_LIMITING_CONCURRENCY')
            return
          }
        } else {
          _.set(connections, socket.conn.remoteAddress, 1)
        }
      }
      /* For debug purpose: trace all data received
      socket.use((packet, next) => {
        console.log(packet)
        next()
      })
      */
      if (apiLimiter && apiLimiter.websocket) {
        const { tokensPerInterval, interval } = apiLimiter.websocket
        // Function used to filter whitelisted services, defaults to none
        const services = _.get(apiLimiter.websocket, 'services', (service) => false)
        socket.socketLimiter = new SocketLimiter(tokensPerInterval, interval)
        socket.use((packet, next) => {
          if (packet.length > 0) {
            // Packets are formatted according to service interface,
            // e.g. like [service_method, service_path, id or data, params]
            // Bypass rate limiting on whitelist
            if ((packet.length > 1) && (typeof packet[1] === 'string')) {
              const service = app.service(packet[1])
              if (service && services(service)) {
                debugLimiter('By-pass rate limiting on whitelisted service operation', socket.id, socket.conn.remoteAddress, packet[0], packet[1])
                next()
                return
              }
            }
            debugLimiter(socket.socketLimiter.getTokensRemaining() + ' remaining API token for socket', socket.id, socket.conn.remoteAddress)
            if (!socket.socketLimiter.tryRemoveTokens(1)) { // if exceeded
              tooManyRequests(socket, 'Too many requests in a given amount of time (rate limiting)', 'RATE_LIMITING')
              // FIXME: calling this causes a client timeout
              // next(error)
              // Need to normalize the error object as JSON
              // let result = {}
              // Object.getOwnPropertyNames(error).forEach(key => (result[key] = error[key]))
              // Trying to send error like in https://github.com/feathersjs/transport-commons/blob/auk/src/events.js#L103
              // does not work either (also generates a client timeout)
              // socket.emit(`${servicePath} error`, result)
              // socket.emit(result)
              return
            }
          }
          next()
        })
      }
    })
  }
}

export function kalisio () {
  const app = express(feathers())
  // By default EventEmitters will print a warning if more than 10 listeners are added for a particular event.
  // The value can be set to Infinity (or 0) to indicate an unlimited number of listeners.
  app.setMaxListeners(0)
  // Load app configuration first
  app.configure(configuration())
  // Then setup logger
  setupLogger(app)

  // This retrieve corresponding service options from app config if any
  app.getServiceOptions = function (name) {
    const services = app.get('services')
    if (!services) return {}
    return _.get(services, name, {})
  }
  // This avoid managing the API path before each service name
  app.getService = function (path, context) {
    // Context is given as string ID
    if (context && typeof context === 'string') {
      return app.service(app.get('apiPath') + '/' + context + '/' + path)
    } else if (context && typeof context === 'object') {
      // Could be Object ID or raw object
      if (ObjectID.isValid(context)) return app.service(app.get('apiPath') + '/' + context.toString() + '/' + path)
      else return app.service(app.get('apiPath') + '/' + context._id.toString() + '/' + path)
    } else {
      return app.service(app.get('apiPath') + '/' + path)
    }
  }
  // This is used to add hooks/filters to services
  app.configureService = async function (name, service, servicesPath) {
    service = await configureService(name, service, servicesPath)
    return service
  }
  // This is used to create standard services
  app.createService = async function (name, options) {
    const service = await createService(name, app, options)
    return service
  }
  // This is used to create webhooks
  app.createWebhook = function (path, options) {
    return createWebhook(path, app, options)
  }
  // Override Feathers configure that do not manage async operations,
  // here we also simply call the function given as parameter but await for it
  app.configure = async function (fn) {
    await fn.call(this, this)
    return this
  }
  const apiLimiter = app.get('apiLimiter')
  if (apiLimiter && apiLimiter.http) {
    // Function used to filter whitelisted services, defaults to none
    const services = _.get(apiLimiter.http, 'services', (service) => false)
    const handler = (req, res, next) => {
      // Bypass rate limiting on whitelist
      let service
      try {
        const serviceUrl = new url.URL(req.originalUrl)
        service = app.service(serviceUrl.pathname)
      } catch (error) {
        debugLimiter(error)
      }
      if (service && services(service)) {
        debugLimiter('By-pass rate limiting on whitelisted service operation', req.method, path)
        next()
      } else {
        const error = new TooManyRequests('Too many requests in a given amount of time (rate limiting)',
          { translation: { key: 'RATE_LIMITING' } })
        res.status(error.code)
        res.set('Content-Type', 'application/json')
        res.json(Object.assign({}, error.toJSON()))
      }
    }
    app.use(app.get('apiPath'), new HttpLimiter(Object.assign({ handler }, apiLimiter.http)))
  }

  // Enable CORS, security, compression, and body parsing
  app.use(cors(app.get('cors')))
  app.use(helmet(app.get('helmet')))
  app.use(compress(app.get('compression')))
  const bodyParserConfig = app.get('bodyParser')
  app.use(express.json(_.get(bodyParserConfig, 'json')))
  app.use(express.urlencoded(Object.assign({ extended: true }, _.get(bodyParserConfig, 'urlencoded'))))

  // Set up plugins and providers
  app.configure(rest())
  const socketioConfig = app.get('socketio') || {}
  app.configure(socketio(Object.assign({ path: app.get('apiPath') + 'ws' }, socketioConfig), setupSockets(app)))
  app.configure(auth)

  // Initialize DB
  app.db = Database.create(app)

  return app
}
