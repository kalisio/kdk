import makeDebug from 'debug'
const debug = makeDebug('kdk:core:groups:hooks')

export function createGroupAuthorisations (hook) {
  const app = hook.app
  const authorisationService = app.getService('authorisations')
  const userService = app.getService('users')

  // Set membership for the owner
  return authorisationService.create({
    scope: 'groups',
    permissions: 'owner'
  }, {
    user: hook.params.user,
    // Because we already have subject/resource set it as objects to avoid populating
    subjects: [hook.params.user],
    subjectsService: userService,
    resource: hook.result,
    resourcesService: hook.service
  })
    .then(authorisation => {
      debug('Group ownership set for user ' + hook.result._id)
      return hook
    })
}

export function removeGroupAuthorisations (hook) {
  const app = hook.app
  const authorisationService = app.getService('authorisations')

  // Unset membership for the all org users
  return authorisationService.remove(hook.result._id.toString(), {
    query: {
      // Use the organisation user service to only target org users
      subjectsService: hook.service.getContextId() + '/members',
      scope: 'groups'
    },
    user: hook.params.user,
    // Because we already have resource set it as objects to avoid populating
    // Moreover used as an after hook the resource might not already exist anymore
    resource: hook.result,
    resourcesService: hook.service
  })
    .then(authorisation => {
      debug('Authorisations unset for group ' + hook.result._id)
      return hook
    })
}
