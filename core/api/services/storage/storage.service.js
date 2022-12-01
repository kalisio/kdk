import { Service, getObject } from '@kalisio/feathers-s3'
import { authenticate } from '@feathersjs/express'
import makeDebug from 'debug'
import { extractJwtFromQuery } from '../../authentication.js'

const debug = makeDebug('kdk:storage:service')

export default function (name, app, options) {
  // Keep track of config
  const config = Object.assign({}, app.get('storage'), options)
  // for context we don't need the actual object, just the ID
  if (typeof config.context === 'object') config.context = config.context._id
  // Check for context as prefix
  if (config.context) config.prefix = config.prefix ? config.prefix + `/${config.context}` : `${config.context}`

  debug('Creating storage service with config ', config)
  const service = new Service(config)

  // Get object route, which is actually a proxy to object storage
  let getObjectPath = app.get('apiPath')
  if (config.context) getObjectPath += `/${config.context}`
  getObjectPath += config.getObjectPath || '/storage-objects'
  debug('Installing storage object route at ' + getObjectPath)
  // We'd like this route to be authenticated and to works as well with jwt as a query param
  // Ueeful for some clients when it is not easy to customize headers
  app.get(getObjectPath + '/*', extractJwtFromQuery, authenticate('jwt'), getObject(service))

  return service
}
