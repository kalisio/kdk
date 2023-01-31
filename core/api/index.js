import makeDebug from 'debug'
import services from './services/index.js'
import * as hooks from './hooks/index.js'
import { Schema } from '../common/index.js'

export * from './services/index.js'
export { hooks }
export * from './db.js'
export * from './authentication.js'
export * from './application.js'
export * from './marshall.js'
export * from '../common/index.js'

const debug = makeDebug('kdk:core')

export default async function init (app) {
  debug('Initializing KDK core')

  Schema.initialize(app.get('schema'))
  await app.configure(services)
}
