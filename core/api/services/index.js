import path from 'path'
import makeDebug from 'debug'
import multer from 'multer'
import aws from 'aws-sdk'
import store from 's3-blob-store'
import BlobService from 'feathers-blob'
const multipart = multer().single('file')
const modelsPath = path.join(__dirname, '..', 'models')
const servicesPath = path.join(__dirname, '..', 'services')

const debug = makeDebug('kdk:core:services')

export function createTagService (options = {}) {
  const app = this

  app.createService('tags', Object.assign({
    servicesPath,
    modelsPath
  }, options))
}

export function removeTagService (options) {
  // TODO
}

function proxyStorageId (context) {
  return (id) => {
    if (!context) return id
    const prefix = (typeof context === 'object' ? context._id.toString() : context.toString()) + '/'
    // Check if context is already in ID, in this case we have to remove it on output
    if (id.startsWith(prefix)) return id.replace(prefix, '')
    // Otherwise we have to add it on input
    else return (prefix + id)
  }
}

export function createStorageService (blobService, options = {}) {
  const app = this
  // Closure to keep track of context
  const proxyId = proxyStorageId(options.context)
  app.createService('storage', Object.assign({
    servicesPath,
    modelsPath,
    // Create a proxy on top of a Feathers blob service,
    // adding context as prefix on all keys on input
    // removing context as prefix on all keys as result
    proxy: {
      service: blobService,
      id: proxyId,
      data: (data) => (data.id ? Object.assign(data, { id: proxyId(data.id) }) : data),
      result: (data) => (data._id ? Object.assign(data, { _id: proxyId(data._id) }) : data)
    },
    // Add required middlewares to handle multipart form data
    middlewares: {
      before: [
        multipart,
        (req, res, next) => {
          req.feathers.file = req.file
          next()
        }
      ]
    }
  }, options))
}

export function removeStorageService (options) {
  // TODO
}

export function createOrganisationService (options = {}) {
  const app = this

  // Create services to manage MongoDB databases, organisations, etc.
  app.createService('databases', { servicesPath, events: ['created', 'updated', 'removed', 'patched'] }) // Internal use only, no events
  const orgsService = app.createService('organisations', { modelsPath, servicesPath, perspectives: ['billing'] })

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
}

export default async function () {
  const app = this

  const authConfig = app.get('authentication')
  if (authConfig) {
    app.createService('users', {
      modelsPath,
      servicesPath,
      // Add required OAuth2 provider perspectives
      perspectives: ['profile'].concat(app.authenticationProviders)
    })
    app.createService('authorisations', { servicesPath })
  }

  const storeConfig = app.get('storage')
  if (storeConfig) {
    const client = new aws.S3({
      accessKeyId: storeConfig.accessKeyId,
      secretAccessKey: storeConfig.secretAccessKey
    })
    const bucket = storeConfig.bucket
    debug('S3 core storage client created with config ', storeConfig)
    const blobStore = store({ client, bucket })
    const blobService = BlobService({ Model: blobStore, id: '_id' })
    createStorageService.call(app, blobService)
  }

  const orgConfig = app.get('organisations')
  if (orgConfig) {
    createOrganisationService.call(app)
  }

  const mailerConfig = app.get('mailer')
  if (mailerConfig) {
    app.createService('mailer', { servicesPath, events: ['created', 'updated', 'removed', 'patched'] }) // Internal use only, no events
    app.createService('account', { servicesPath })
  }

  const pusherConfig = app.get('pusher')
  if (pusherConfig) {
    app.createService('pusher', { servicesPath, events: ['created', 'updated', 'removed', 'patched'] }) // Internal use only, no events
    app.createService('devices', { servicesPath })
  }
}
