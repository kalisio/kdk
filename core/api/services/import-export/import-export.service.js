import { Service } from '@kalisio/feathers-import-export'

const debug = makeDebug('kdk:import-export:service')

export default function (name, app, options) {
  const config = app.get('import-export')
  debug('Creating import-export service with config ', config)
  return new Service(Object.assign({ app }, config))
}