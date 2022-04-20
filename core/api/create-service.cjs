const path = require('path')
const debug = require('debug')('kdk:core:application')

exports.createService = function createService (name, app, options = {}) {
  const createFeathersService = require('feathers-' + app.db.adapter)

  const paginate = app.get('paginate')
  const serviceOptions = Object.assign({
    name: name,
    paginate
  }, options)
  if (serviceOptions.disabled) return undefined
  // For DB services a model has to be provided
  const fileName = serviceOptions.fileName || name

  let dbService = false
  try {
    if (serviceOptions.modelsPath) {
      const configureModel = require(path.join(serviceOptions.modelsPath, fileName + '.model.' + app.db.adapter))
      configureModel(app, serviceOptions)
      dbService = true
    }
  } catch (error) {
    debug('No ' + fileName + ' service model configured on path ' + serviceOptions.modelsPath)
    if (error.code !== 'MODULE_NOT_FOUND') {
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
    service = require(path.join(serviceOptions.servicesPath, fileName, fileName + '.service'))
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
  service = configureService(fileName, service, serviceOptions.servicesPath)
  // Optionnally a specific service mixin can be provided, apply it
  if (dbService && serviceOptions.servicesPath) {
    try {
      let serviceMixin = require(path.join(serviceOptions.servicesPath, fileName, fileName + '.service'))
      // If we get a function try to call it assuming it will return the mixin object
      if (typeof serviceMixin === 'function') {
        serviceMixin = serviceMixin.bind(dbService)(fileName, app, serviceOptions)
      }
      service.mixin(serviceMixin)
    } catch (error) {
      debug('No ' + fileName + ' service mixin configured on path ' + serviceOptions.servicesPath)
      if (error.code !== 'MODULE_NOT_FOUND') {
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
