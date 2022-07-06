import makeDebug from 'debug'
import services from './services/index.js'
import * as hooks from './hooks/index.js'
// We faced a bug in babel so that transform-runtime with export * from 'x' generates import statements in transpiled code
// Tracked here : https://github.com/babel/babel/issues/2877
// We tested the workaround given here https://github.com/babel/babel/issues/2877#issuecomment-270700000 with success so far
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

  await app.configure(services)
}
