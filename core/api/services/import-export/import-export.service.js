import { Service } from '@kalisio/feathers-import-export'
import makeDebug from 'debug'

const debug = makeDebug('kdk:import-export:service')

export default function (name, app, options) {
  const config = app.get('import-export')
  debug('Creating import-export service with config ', config)
  const s3ServicePath = app.get('apiPath') + '/' + (config.s3Service)
  return new Service(Object.assign({ app }, config, { s3ServicePath }))
}
