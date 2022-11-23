import path from 'path'
import makeDebug from 'debug'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const modelsPath = path.join(__dirname, '..', 'models')
const servicesPath = path.join(__dirname, '..', 'services')

const debug = makeDebug('kdk:core:services')

export function createTagService (options = {}) {
  const app = this

  return app.createService('tags', Object.assign({
    servicesPath,
    modelsPath
  }, options))
}

export function removeTagService (options) {
  // TODO
}

export function createStorageService (options = {}) {
  const app = this
  return app.createService('storage', Object.assign({
    servicesPath,
    modelsPath,
    methods: ['create', 'get', 'find', 'remove', 'createMultipartUpload', 'completeMultipartUpload', 'uploadPart', 'putObject'],
    id: '_id'
  }, options))
}

export function removeStorageService (options) {
  // TODO
}

export function createDatabasesService (options = {}) {
  const app = this

  return app.createService('databases', Object.assign({
    servicesPath, events: ['created', 'updated', 'removed', 'patched'] // Internal use only, no events
  }, options))
}

export function removeDatabasesService (options) {
  // TODO
}

export async function createOrganisationService (options = {}) {
  const app = this

  // Create services to manage MongoDB databases, organisations, etc.
  await createDatabasesService.call(app)
  const orgsService = await app.createService('organisations', { modelsPath, servicesPath, perspectives: ['billing'] })

  // Replication management
  const usersService = app.getService('users')
  const authorisationsService = app.getService('authorisations')
  // Ensure permissions are correctly distributed when replicated
  usersService.on('patched', user => {
    // Patching profile should not trigger abilities update since
    // it is a perspective and permissions are not available in this case
    if (user.organisations || user.groups) authorisationsService.updateAbilities(user)
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
    if (orgMembersService) return
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
      // Add required OAuth2 provider perspectives
      perspectives: ['profile'].concat(app.authenticationProviders)
    })
    debug('\'users\' service created')
    await app.createService('authorisations', { servicesPath })
    debug('\'authorisations\' service created')
  }

  const storageConfig = app.get('storage')
  if (storageConfig) {
    await createStorageService.call(app)
    debug('\'storage\' service created')
  }

  const orgConfig = app.get('organisations')
  if (orgConfig) {
    await createOrganisationService.call(app)
    debug('\'organisations\' service created')
  }

  const mailerConfig = app.get('mailer')
  if (mailerConfig) {
    await app.createService('mailer', { servicesPath, events: ['created', 'updated', 'removed', 'patched'] }) // Internal use only, no events
    debug('\'mailer\' service created')
    await app.createService('account', { servicesPath })
    debug('\'account\' service created')
  }

  const pusherConfig = app.get('pusher')
  if (pusherConfig) {
    await app.createService('pusher', { servicesPath, events: ['created', 'updated', 'removed', 'patched'] }) // Internal use only, no events
    debug('\'pusher\' service created')
    await app.createService('devices', { servicesPath })
    debug('\'devices\' service created')
  }
}
