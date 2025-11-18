import _ from 'lodash'
import path from 'path'
import makeDebug from 'debug'
import { fileURLToPath } from 'url'
import mongodb from 'mongodb'
import { isValidObjectID } from '../db.js'
const { ObjectID } = mongodb

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const modelsPath = path.join(__dirname, '..', 'models')
const servicesPath = path.join(__dirname, '..', 'services')

const debug = makeDebug('kdk:core:services')

export function getServiceNameAndContext (servicePath) {
  const app = this
  // Get name from service path without api prefix
  let name = servicePath.replace(app.get('apiPath').substring(1) + '/', '')
  // Then without context if any
  const lastSlash = name.lastIndexOf('/')
  const contextId = (lastSlash >= 0 ? name.substring(0, lastSlash) : '')
  // Check if it is a valid MongoDB Object ID otherwise it is not a context string
  if (isValidObjectID(contextId)) {
    name = name.replace(contextId + '/', '')
    return { name, contextId }
  } else {
    return { name }
  }
}

export function decorateDistributedService (service) {
  const app = this
  // Remote service are registered according to their path, ie with API prefix (but without trailing /)
  const remoteService = app.service(service.path)
  const { name, contextId } = getServiceNameAndContext.call(app, service.path)
  remoteService.name = name
  remoteService.context = contextId
  // As remote services have no context, from the internal point of view path = name
  // Unfortunately this property is already set and used by feathers-distributed and should not be altered
  // remoteService.path = name
  remoteService.app = app
  remoteService.getPath = function (withApiPrefix) {
    const path = (contextId ? contextId + '/' + name : name)
    return (withApiPrefix ? app.get('apiPath') + '/' + path : path)
  }
  remoteService.getContextId = function () {
    return contextId
  }
  return remoteService
}

export function createStorageService (options = {}) {
  const app = this
  return app.createService('storage', Object.assign({
    servicesPath,
    modelsPath,
    methods: ['create', 'get', 'find', 'remove', 'createMultipartUpload', 'completeMultipartUpload', 'uploadPart', 'putObject', 'uploadFile', 'downloadFile'],
    events: ['multipart-upload-created', 'multipart-upload-completed', 'part-uploaded', 'object-put'],
    id: '_id'
  }, options))
}

export function removeStorageService (options = {}) {
  const app = this
  return app.removeService(app.getService('storage', options.context))
}

export function createMessagesService (options = {}) {
  const app = this
  return app.createService('messages', Object.assign({
    servicesPath,
    modelsPath
  }, options))
}

export function removeMessagesService (options = {}) {
  const app = this
  return app.removeService(app.getService('messages', options.context))
}

export function createConfigurationsService (options = {}) {
  const app = this
  return app.createService('configurations', Object.assign({
    servicesPath,
    modelsPath
  }, options))
}

export async function createDefaultConfigurations () {
  const app = this
  const defaultConfigurations = app.get('defaultConfigurations')
  if (!defaultConfigurations) return
  const configurationsService = app.getService('configurations')
  // Create default configurations if not already done
  const configurations = await configurationsService.find({ paginate: false })
  for (let i = 0; i < defaultConfigurations.length; i++) {
    const defaultConfiguration = defaultConfigurations[i]
    const createdConfiguration = _.find(configurations, { name: defaultConfiguration.name })
    if (!createdConfiguration) {
      app.logger.info('Initializing default configuration (name = ' + defaultConfiguration.name + ')')
      await configurationsService.create(defaultConfiguration)
    }
  }
}

export function removeConfigurationsService (options = {}) {
  const app = this
  return app.removeService(app.getService('configurations', options.context))
}

export function createDatabasesService (options = {}) {
  const app = this

  return app.createService('databases', Object.assign({
    servicesPath
  }, options))
}

export function removeDatabasesService (options = {}) {
  const app = this
  return app.removeService(app.getService('databases', options.context))
}

export function createTagsService (options = {}) {
  const app = this
  return app.createService('tags', Object.assign({
    servicesPath,
    modelsPath
  }, options))
}

export async function createDefaultTags () {
  const app = this
  const defaultTags = app.get('tags').defaultTags
  if (!defaultTags) return
  const tagsService = app.getService('tags')
  // Create default tags if not already done
  const tags = await tagsService.find({ paginate: false })
  for (let i = 0; i < defaultTags.length; i++) {
    const defaultTag = defaultTags[i]
    const createdTag = _.find(tags, { name: defaultTag.name })
    if (!createdTag) {
      app.logger.info('Initializing default tag (name = ' + defaultTag.name + ')')
      await tagsService.create(defaultTag)
    }
  }
}

export default async function () {
  const app = this

  const authConfig = app.get('authentication')
  if (authConfig) {
    await app.createService('users', {
      modelsPath,
      servicesPath,
      methods: ['create', 'get', 'find', 'update', 'patch', 'remove', 'logout'],
      events: ['logout']
    })
    debug('\'users\' service created')
    await app.createService('account', {
      servicesPath,
      methods: ['create', 'verifyEmail']
    })
    debug('\'account\' service created')
    await app.createService('authorisations', { servicesPath })
    debug('\'authorisations\' service created')
  }

  const storageConfig = app.get('storage')
  if (storageConfig) {
    await createStorageService.call(app)
    debug('\'storage\' service created')
  }

  const importExportConfig = app.get('import-export')
  if (importExportConfig) {
    await app.createService('import-export', {
      servicesPath,
      events: ['import-created', 'import-completed', 'export-created', 'export-completed']
    }, app)
    debug('\'import-export\' service created')
  }

  const messagesConfig = app.get('messages')
  if (messagesConfig) {
    await createMessagesService.call(app, messagesConfig)
    debug('\'messages\' service created')
  }

  const mailerConfig = app.get('mailer')
  if (mailerConfig) {
    await app.createService('mailer', { servicesPath })
    debug('\'mailer\' service created')
  }

  const pushConfig = app.get('push')
  if (pushConfig) {
    await app.createService('push', { servicesPath })
    debug('\'push\' service created')
  }

  const tagsConfig = app.get('tags')
  if (tagsConfig) {
    await createTagsService.call(app, tagsConfig)
    debug('\'tags\' service created')
  }

  const configurationsConfig = app.get('configurations')
  if (configurationsConfig) {
    await createConfigurationsService.call(app, configurationsConfig)
    debug('\'configurations\' service created')
  }
}
