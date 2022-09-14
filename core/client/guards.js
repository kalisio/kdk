import _ from 'lodash'
import logger from 'loglevel'
import { Store } from './store.js'
import { api } from './api.js'

// Guards that can be added to customize route guards
let guards = []

// A gard should return true to authorize navigation,
// false to reset navigation to previous route,
// a name to jump to a given route

// Guard unauthenticated users
export function authenticationGuard (user, to, from) {
  // Specific case of OAuth provider routes
  if (to.path.startsWith('/oauth/')) return true
  // Routes accessible whatever the authentication state, eg public
  if (_.get(to, 'meta.authenticated') && _.get(to, 'meta.unauthenticated')) {
    return true
  }
  // Only when authenticated, eg private
  if (_.get(to, 'meta.authenticated')) {
    // If the user is here then he is authenticated so let it go
    if (user) return true
    // Otherwise redirect to login
    else return 'login'
  } else if (_.get(to, 'meta.unauthenticated')) {
    // Only when not authenticated, eg reset password
    // If the user is here then he is authenticated so redirect to home
    if (user) return 'home'
    // Otherwise let it go handling the specific case of domain root
    else return (to.path === '/' ? 'login' : true)
  }
}

// Guard pages based on user permissions
export function permissionsGuard (user, to, from) {
  // Only when permissions are here
  if (_.has(to, 'meta.can')) {
    if (!user) return 'login'
    let args = _.get(to, 'meta.can')
    // We allow arguments to refer to route params using the convention :param,
    // it could be either a query or a path parameter e.g. :eventId ~ route.params.eventId
    args = args.map(arg => {
      if (typeof arg === 'string' && arg.startsWith(':')) {
        const param = arg.substring(1)
        return _.get(to, `query.${param}`, _.get(to, `params.${param}`))
      } else {
        return arg
      }
    })
    return api.can(...args, user) || _.get(to, 'meta.redirect', 'home')
  } else return true
}

// Guard routes for a given user, can be used as router navigation guard
// or as standard function. In this case next will not be used and you get the
// final result after running all registered guards: true, false or redirect route name
export function beforeGuard (to, from, next) {
  const user = Store.get('user')
  // Run registered guards
  for (const guard of guards) {
    const result = guard(user, to, from)
    if (typeof result === 'string') {
      logger.debug('Navigation guard would redirect to route ' + result)
      if (typeof next === 'function') {
        // Guard are used to check if a route is reachable when the user navigate
        // but redirection should be handled at the app level to avoid concurrence
        // between both mechanisms. For this you can call the function without passing from/next arguments.
        // next({ name: result })
        return next(false)
      } else {
        return result
      }
    } else if (!result) {
      logger.debug('Navigation aborted by guard')
      if (typeof next === 'function') {
        return next(false)
      } else {
        return false
      }
    }
  }

  logger.debug('Navigation guards passed')
  if (typeof next === 'function') {
    return next()
  } else {
    return true
  }
}

beforeGuard.registerGuard = function (guard) {
  if (!guards.includes(guard)) {
    guards.push(guard)
  }
}

beforeGuard.unregisterGuard = function (guard) {
  guards = guards.filter(registeredGuard => registeredGuard !== guard)
}
