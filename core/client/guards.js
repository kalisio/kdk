import logger from 'loglevel'
import { Store } from './store.js'

// Guards that can be added to customize route guards
let guards = []

// A gard should return true to authorize navigation,
// false to reset navigation to previous route,
// a name to jump to a given route

// Guard unauthenticated users
export function authenticationGuard (user, to, from) {
  // Routes accessible whatever the authentication state, eg public
  if (to.meta.authenticated && to.meta.unauthenticated) {
    return true
  }
  // Only when authenticated, eg private
  if (to.meta.authenticated) {
    // If the user is here then he is authenticated so let it go
    if (user) return true
    // Otherwise redirect to login
    else return 'login'
  } else if (to.meta.unauthenticated) {
    // Only when not authenticated, eg reset password
    // If the user is here then he is authenticated so redirect to home
    if (user) return 'home'
    // Otherwise let it go handling the specific case of domain root
    else return (to.path === '/' ? 'login' : true)
  }
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
