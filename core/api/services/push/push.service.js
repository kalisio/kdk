import { Service } from '@kalisio/feathers-webpush'
import makeDebug from 'debug'

const debug = makeDebug('kdk:push:service')

export default function (name, app, options) {
  const config = app.get('push')
  debug('Creating push service with config ', config)
  const service = new Service(Object.assign({ app }, config))

  return service
}
