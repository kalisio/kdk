import makeDebug from 'debug'
import services from './services/index.js'
import * as hooks from './hooks/index.js'
export * from './services/index.js'
export { hooks }
export * from './marshall.js'
export * from '../common/index.js'

const debug = makeDebug('kdk:map')

export default async function init () {
  const app = this

  debug('Initializing KDK map')

  await app.configure(services)
}
