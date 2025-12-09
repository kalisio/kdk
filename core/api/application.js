import path from 'path'
import url from 'url'
import fs from 'fs-extra'
import makeDebug from 'debug'
import winston from 'winston'
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
import express, { authenticate } from '@feathersjs/express'
import socketio from '@feathersjs/socketio'
import mongodb from 'mongodb'
import { Database, isObjectID, idToString } from './db.js'
import auth from './authentication.js'

const debug = makeDebug('kdk:core:application')
const debugLimiter = makeDebug('kdk:core:application:limiter')
const { TooManyRequests, Forbidden, BadRequest } = errors
const { ObjectID } = mongodb
const { rest } = express
const sift = siftModule.default

// Initialize debugger to be used in feathers
feathers.setDebug(makeDebug)

function tooManyRequests (socket, message, key) {
  debug(message)
  const error = new TooManyRequests(message, { translation: { key } })
  socket.emit('rate-limit', error)
  // Add a timeout so that error message is correctly handled
  setTimeout(() => socket.disconnect(true), 3000)
}

export function declareService (name, app, service, serviceOptions = {}) {
  let servicePath = serviceOptions.path || name
  let contextId
  if (serviceOptions.context) {
    contextId = idToString(serviceOptions.context)
    servicePath = contextId + '/' + servicePath
  }

  let feathersPath = app.get('apiPath') + '/' + servicePath
  if (feathersPath.startsWith('/')) feathersPath = feathersPath.substr(1)

  try {
    const feathersService = app.service(feathersPath)
    // Some internal Feathers service might internally declare the service
    return feathersService
  } catch (error) {
    // Initialize our service by providing any middleware as well
    let args = [feathersPath]
    if (_.has(serviceOptions, 'middlewares.before')) args = args.concat(_.get(serviceOptions, 'middlewares.before'))
    args.push(service)
    const options = _.pick(serviceOptions, ['methods', 'events'])
    if (!_.isEmpty(options)) args = args.concat(options)
    if (_.has(serviceOptions, 'middlewares.after')) args = args.concat(_.get(serviceOptions, 'middlewares.after'))
    app.use.apply(app, args)
    // Get the Feathers service, ie base service + Feathers' internals
    service = app.service(feathersPath)
    debug('Service declared on path ' + feathersPath)
    // Then configuration
    service.name = name
    service.app = app
    if (!service.options) service.options = serviceOptions
    else Object.assign(service.options, serviceOptions)
    service.path = servicePath
    service.context = serviceOptions.context

    // Add some utility functions
    service.getPath = function (withApiPrefix) {
      let path = service.path
      if (withApiPrefix && !path.startsWith(app.get('apiPath'))) {
        path = app.get('apiPath') + '/' + path
      }
      return path
    }
    service.getContextId = function () {
      return contextId // As string
    }
    return service
  }
}

export async function configureService (name, service, servicesPath) {
  let filepath = path.join(servicesPath, name, `${name}.hooks.js`)
  try {
    const fileExists = await fs.pathExists(filepath)
    if (fileExists) {
      const hooks = (await import(url.pathToFileURL(filepath))).default
      service.hooks(hooks)
      debug(name + ' service hooks configured on path ' + servicesPath)
    }
  } catch (error) {
    debug('No ' + name + ' service hooks configured on path ' + servicesPath)
    // if (error.code !== 'ERR_MODULE_NOT_FOUND') {
    // Log error in this case as this might be linked to a syntax error in required file
    debug(filepath, error)
    // }
    // As this is optionnal this require has to fail silently
  }

  filepath = path.join(servicesPath, name, `${name}.channels.js`)
  try {
    const fileExists = await fs.pathExists(filepath)
    if (fileExists) {
      const channels = (await import(url.pathToFileURL(filepath))).default
      _.forOwn(channels, (publisher, event) => {
        if (event === 'all') service.publish(publisher)
        else service.publish(event, publisher)
      })
      debug(name + ' service channels configured on path ' + servicesPath)
    }
  } catch (error) {
    debug('No ' + name + ' service channels configured on path ' + servicesPath)
    // if (error.code !== 'ERR_MODULE_NOT_FOUND') {
    // Log error in this case as this might be linked to a syntax error in required file
    debug(filepath, error)
    // }
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
  debug(`Creating service ${name}`)
  const createFeathersService = (await import('feathers-' + app.db.adapter)).default

  const paginate = app.get('paginate')
  const serviceOptions = Object.assign({
    name,
    paginate,
    multi: true,
    whitelist: [
      '$exists', '$and', '$or', '$not', '$eq', '$elemMatch', '$distinct', '$groupBy', '$group', '$regex',
      '$text', '$search', '$caseSensitive', '$language', '$diacriticSensitive',
      '$aggregate', '$near', '$nearSphere', '$geoIntersects', '$geoWithin',
      '$maxDistance', '$minDistance', '$geometry', '$box', '$polygon', '$center', '$centerSphere'
    ]
  }, options)
  if (serviceOptions.disabled) return undefined
  // For DB services a model has to be provided
  const fileName = serviceOptions.modelName || name

  let dbService = false
  try {
    if (serviceOptions.modelsPath) {
      const filepath = path.join(serviceOptions.modelsPath, `${fileName}.model.${app.db.adapter}.js`)
      const fileExists = await fs.pathExists(filepath)
      if (fileExists) {
        const configureModel = (await import(url.pathToFileURL(filepath))).default
        configureModel(app, serviceOptions)
        debug(name + ' service model configured on path ' + serviceOptions.modelsPath)
        dbService = true
      }
    }
  } catch (error) {
    debug('No ' + fileName + ' service model configured on path ' + serviceOptions.modelsPath)
    // if (error.code !== 'ERR_MODULE_NOT_FOUND') {
    // Log error in this case as this might be linked to a syntax error in required file
    debug(fileName, error)
    // }
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
    const filepath = path.join(serviceOptions.servicesPath, fileName, `${fileName}.service.js`)
    // Otherwise we expect the service to be provided as a Feathers service interface
    service = (await import(url.pathToFileURL(filepath))).default
    // If we get a function try to call it assuming it will return the service object
    if (typeof service === 'function') {
      service = service(name, app, serviceOptions)
    }
    // Need to set this manually for services not using class inheritance or default adapters
    if (serviceOptions.events) service.events = serviceOptions.events
  }
  // Optionnally a specific service mixin can be provided, apply it
  if (dbService && serviceOptions.servicesPath) {
    const filepath = path.join(serviceOptions.servicesPath, fileName, `${fileName}.service.js`)
    try {
      const fileExists = await fs.pathExists(filepath)
      if (fileExists) {
        let serviceMixin = (await import(url.pathToFileURL(filepath))).default
        // If we get a function try to call it assuming it will return the mixin object
        if (typeof serviceMixin === 'function') {
          serviceMixin = await serviceMixin.bind(dbService)(fileName, app, serviceOptions)
        }
        Object.assign(service, serviceMixin)
        debug(name + ' service mixin configured on path ' + serviceOptions.servicesPath)
      }
    } catch (error) {
      debug('No ' + fileName + ' service mixin configured on path ' + serviceOptions.servicesPath)
      // if (error.code !== 'ERR_MODULE_NOT_FOUND') {
      // Log error in this case as this might be linked to a syntax error in required file
      debug(filepath, error)
      // }
      // As this is optionnal this require has to fail silently
    }
  }

  service = declareService(name, app, service, serviceOptions)
  // Register hooks and event filters
  service = await configureService(fileName, service, serviceOptions.servicesPath)

  debug(service.name + ' service registration completed')
  app.emit('service', service)

  return service
}

async function removeService (service, app) {
  // Often called like removeService(getService('xxx'))
  // so that we don't want to crash if the service does not exist or has already been unregistered
  if (!service) return
  let feathersPath = app.get('apiPath') + '/' + service.path
  if (feathersPath.startsWith('/')) feathersPath = feathersPath.substr(1)

  app.unuse(feathersPath)
  debug(service.name + ' service unregistration completed')
  app.emit('service-removed', service)

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

  app.post(app.get('apiPath') + '/webhooks/' + webhookPath, authenticate('jwt'), async (req, res, next) => {
    const payload = req.body
    const config = app.get('authentication')
    res.set('content-type', 'application/json')
    const params = _.get(req, 'feathers', {})
    try {
      if (options.preprocessor) {
        await options.preprocessor(req, res, payload)
      }
      // Authenticate when required
      if (config) {
        params.checkAuthorisation = true
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
        debug(`Performing ${payload.service} service ${payload.operation} operation through webhook ${webhookPath} with args:`, args)
        const result = await service[payload.operation].apply(service, args)
        // Send back result
        res.json(result)
      } catch (error) {
        throw new BadRequest('Service operation could not be performed')
      }
    } catch (error) {
      debug(`Webhook ${webhookPath} error:`, error)
      // Send back error
      res.status(error.code || 500).json(error.toJSON())
    }
  })

  debug(`Webhook ${webhookPath} registration completed`)
}

function setupLogger (app) {
  debug('Setup application loggers')
  const logsConfig = Object.assign({ // Default logger erased by provided one if any
    Console: {
      format: winston.format.combine(winston.format.colorize(), winston.format.simple())
    }
  }, _.omit(app.get('logs'), ['level', 'format']))
  // Remove winston defaults
  try {
    winston.clear()
  } catch (error) {
    // Logger might be down, use console
    console.error('Could not remove default logger transport(s)', error)
  }
  // We have one entry per log type
  const logsTypes = Object.getOwnPropertyNames(logsConfig)
  // Create corresponding winston transports with options
  const transports = []
  logsTypes.forEach(logType => {
    const logOptions = logsConfig[logType]
    debug(`Setup ${logType} transport with options`, logOptions)
    try {
      transports.push(new winston.transports[logType](logOptions))
    } catch (error) {
      // Logger might be down, use console
      console.error(`Could not setup logger ${logType}`, error)
    }
  })
  app.logger = winston.createLogger(Object.assign({
    level: (process.env.NODE_ENV === 'development' ? 'debug' : 'info'), transports
  }, _.pick(logsConfig, ['level', 'format'])))
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
              // Service path includes API prefix (but without trailing /)
              // Get name from service path without api prefix
              const serviceName = packet[1].replace(app.get('apiPath').substring(1) + '/', '')
              const service = app.getService(serviceName)
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

function setupHealthcheck (app) {
  app.get('/healthcheck', async (req, res) => {
    res.set('Content-Type', 'application/json')
    const result = await app.db.healthcheck()
    const status = (result ? 200 : 500)
    return res.status(status).json({ isRunning: true, isDatabaseRunning: result })
  })
}

export function kdk (config = {}) {
  const app = express(feathers())
  // By default EventEmitters will print a warning if more than 10 listeners are added for a particular event.
  // The value can be set to Infinity (or 0) to indicate an unlimited number of listeners.
  app.setMaxListeners(0)
  // Load app configuration first
  app.configure(configuration())
  // Then setup logger, healthcheck, etc.
  setupLogger(app)
  setupHealthcheck(app)

  // Override config
  Object.keys(config).forEach((name) => {
    const value = config[name]
    debug(`Setting ${name} configuration value to`, value)
    app.set(name, value)
  })

  // This retrieve corresponding service options from app config if any
  app.getServiceOptions = function (name) {
    const services = app.get('services')
    if (!services) return {}
    return _.get(services, name, {})
  }
  // This avoid managing the API path before each service name
  app.getService = function (path, context) {
    try {
      // Context is given as string ID
      if (context && typeof context === 'string') {
        return app.service(app.get('apiPath') + '/' + context + '/' + path)
      } else if (context && typeof context === 'object') {
        // Could be Object ID or raw object
        if (isObjectID(context)) return app.service(app.get('apiPath') + '/' + context.toString() + '/' + path)
        else return app.service(app.get('apiPath') + '/' + context._id.toString() + '/' + path)
      } else {
        return app.service(app.get('apiPath') + '/' + path)
      }
    } catch {
      // We return a false-y value in case the service wasn't found
      return null
    }
  }
  // This is used to add hooks/filters to services
  app.configureService = async function (name, service, servicesPath) {
    service = await configureService(name, service, servicesPath)
    return service
  }
  // This is used to declare existing service
  app.declareService = function (name, service, serviceOptions) {
    service = declareService(name, app, service, serviceOptions)
    return service
  }
  // This is used to create standard services
  app.createService = async function (name, options) {
    const service = await createService(name, app, options)
    return service
  }
  // This is used to remove standard services
  app.removeService = async function (service) {
    service = await removeService(service, app)
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
    app.use(app.get('apiPath') || '/', new HttpLimiter(Object.assign({ handler }, apiLimiter.http)))
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
  app.configure(socketio(Object.assign({ path: (app.get('apiPath') || '/') + 'ws' }, socketioConfig), setupSockets(app)))
  app.configure(auth)

  // Initialize DB
  app.db = Database.create(app)

  return app
}
