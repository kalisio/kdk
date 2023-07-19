import { Service } from '@kalisio/feathers-webpush'
import makeDebug from 'debug'

const debug = makeDebug('kdk:push:service')

export default function (name, app, options) {
  const config = Object.assign({ app }, app.get('push'))
  debug('Creating push service with config ', config)
  const service = new Service(config)

  return service
}
