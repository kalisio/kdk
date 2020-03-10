import logger from 'loglevel'
import { Store } from './store'
import services from './services'
import * as utils from './utils'
import * as mixins from './mixins'
import * as hooks from './hooks'

// We faced a bug in babel so that transform-runtime with export * from 'x' generates import statements in transpiled code
// Tracked here : https://github.com/babel/babel/issues/2877
// We tested the workaround given here https://github.com/babel/babel/issues/2877#issuecomment-270700000 with success so far

// FIXME: we don't build vue component anymore, they are processed by webpack in the application template
// export * from './components'

export * from './events'
export * from './api'
export * from './store'
export * from './guards'
export * from '../common'
export { utils }
export { mixins }
export { hooks }
export * from './services'

export default function init () {
  const api = this

  logger.debug('Initializing core')
  api.configure(services)

  // Create the models listened by the main layout components
  // You must use the patch method on the store to update those models
  // It is generally done using the registerAction on an Activity based component
  const appBar = { title: '', subtitle: '', toolbar: [], menu: [] }
  Store.set('appBar', appBar)
  const search = { field: '', pattern: '', services: [], items: [] }
  Store.set('searchBar', search)
  const tabBar = { tabs: [] }
  Store.set('tabBar', tabBar)
  const leftDrawer = { component: '', options: {} }
  Store.set('leftDrawer', leftDrawer)
  const rightDrawer = { component: '', options: {} }
  Store.set('rightDrawer', rightDrawer)
  const fab = { actions: [] }
  Store.set('fab', fab)

  // Listen to the 'patched' event on the users
  const users = api.getService('users')
  users.on('patched', user => {
    // Check whether we need to update the current user
    if (user._id === Store.get('user._id')) {
      Store.patch('user', user)
    }
  })
}
