import _ from 'lodash'
import path from 'path'
import makeDebug from 'debug'
import { fileURLToPath } from 'url'
import mongodb from 'mongodb'
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
  if (contextId && ObjectID.isValid(contextId)) {
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

export function createTagService (options = {}) {
  const app = this
  return app.createService('tags', Object.assign({
    servicesPath,
    modelsPath
  }, options))
}

export function removeTagService (options = {}) {
  const app = this
  return app.removeService(app.getService('tags', options.context))
}

export function createStorageService (options = {}) {
  const app = this
  return app.createService('storage', Object.assign({
    servicesPath,
    modelsPath,
    methods: ['create', 'get', 'find', 'remove', 'createMultipartUpload', 'completeMultipartUpload', 'uploadPart', 'putObject'],
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

export async function createOrganisationService (options = {}) {
  const app = this

  // Create services to manage MongoDB databases, organisations, etc.
  await createDatabasesService.call(app)
  const orgsService = await app.createService('organisations', { modelsPath, servicesPath })

  // Replication management
  const usersService = app.getService('users')
  const authorisationsService = app.getService('authorisations')
  // Ensure permissions are correctly distributed when replicated
  usersService.on('patched', user => {
    // Patching profile should not trigger abilities update since
    // it is a perspective and permissions are not available in this case
    // Updating abilities in this case will result in loosing permissions for orgs/groups as none are available
    if (_.has(user, 'organisations') || _.has(user, 'groups')) authorisationsService.updateAbilities(user)
  })
  // Ensure org services are correctly distributed when replicated
  orgsService.on('created', organisation => {
    // Check if already done (initiator)
    const orgMembersService = app.getService('members', organisation)
    if (!orgMembersService) {
      // Jump from infos/stats to real DB object
      const db = app.db.client.db(organisation._id.toString())
      orgsService.createOrganisationServices(organisation, db)
    }
  })
  orgsService.on('removed', organisation => {
    // Check if already done (initiator)
    const orgMembersService = app.getService('members', organisation)
    if (!orgMembersService) return
    orgsService.removeOrganisationServices(organisation)
  })
  return orgsService
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
    await createMessagesService.call(app)
    debug('\'messages\' service created')
  }

  const orgConfig = app.get('organisations')
  if (orgConfig) {
    await createOrganisationService.call(app)
    debug('\'organisations\' service created')
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
}
