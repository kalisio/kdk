import _ from 'lodash'
import makeDebug from 'debug'
import errors from '@feathersjs/errors'
const debug = makeDebug('kdk:core:organisations:hooks')

const { Forbidden } = errors

export async function createOrganisationServices (hook) {
  if (hook.type !== 'after') {
    throw new Error('The \'createOrganisationServices\' hook should only be used as a \'after\' hook.')
  }

  const app = hook.app
  const organisationService = hook.service
  const databaseService = app.getService('databases')
  const name = hook.result._id.toString()

  // First we create the organisation DB
  await databaseService.create({
    name
  }, {
    user: hook.params.user
  })

  debug('DB created for organisation ' + hook.result.name)

  // Jump from infos/stats to real DB object
  const db = app.db.client.db(name)
  await organisationService.createOrganisationServices(hook.result, db)

  return hook
}

export async function removeOrganisationServices (hook) {
  if (hook.type !== 'after') {
    throw new Error('The \'removeOrganisationServices\' hook should only be used as a \'after\' hook.')
  }

  const app = hook.app
  const organisationService = hook.service
  const databaseService = app.getService('databases')

  // Then we remove the organisation DB
  await databaseService.remove(hook.result._id.toString(), {
    user: hook.params.user
  })

  debug('DB removed for organisation ' + hook.result.name)
  await organisationService.removeOrganisationServices(hook.result)
  return hook
}

export async function createOrganisationAuthorisations (hook) {
  if (hook.type !== 'after') {
    throw new Error('The \'createOrganisationAuthorisations\' hook should only be used as a \'after\' hook.')
  }

  const app = hook.app
  const authorisationService = app.getService('authorisations')
  const userService = app.getService('users')
  // Set membership for the owner
  await authorisationService.create({
    scope: 'organisations',
    permissions: 'owner' // Owner by default
  }, {
    user: hook.params.user,
    // Because we already have subject/resource set it as objects to avoid populating
    subjects: [hook.params.user],
    subjectsService: userService,
    resource: hook.result,
    resourcesService: hook.service
  })

  debug('Organisation ownership set for user ' + hook.result._id)
  return hook
}

export async function removeOrganisationAuthorisations (hook) {
  if (hook.type !== 'after') {
    throw new Error('The \'removeOrganisationAuthorisations\' hook should only be used as a \'after\' hook.')
  }

  const app = hook.app
  const authorisationService = app.getService('authorisations')

  // Unset membership for the all org users
  await authorisationService.remove(hook.result._id.toString(), {
    query: {
      subjectsService: hook.result._id.toString() + '/members',
      scope: 'organisations'
    },
    user: hook.params.user,
    // Because we already have resource set it as objects to avoid populating
    // Moreover used as an after hook the resource might not already exist anymore
    resource: hook.result,
    resourcesService: hook.service
  })
  debug('Authorisations unset for organisation ' + hook.result._id)
  return hook
}

export function updateOrganisationResource (resourceScope) {
  return async function (hook) {
    if (hook.type !== 'after') {
      throw new Error('The \'updateOrganisationResource\' hook should only be used as a \'after\' hook.')
    }
    // Only applicable to update/remove operations
    if ((hook.method === 'get' || hook.method === 'find' || hook.method === 'create')) return hook

    const app = hook.app
    // Retrieve the list of members
    const context = hook.service.getContextId()
    // Use members service if any or global users service
    const orgMembersService = (context ? app.getService('members', context) : app.getService('users'))
    const members = await orgMembersService.find({
      query: { [resourceScope]: { $elemMatch: { _id: hook.result._id } } },
      paginate: false
    })
    // Update each members
    await Promise.all(members.map(member => {
      const resources = _.get(member, resourceScope, [])
      const resource = _.find(resources, item => item._id.toString() === hook.result._id.toString())
      if (!resource) return Promise.resolve()
      // Check for removal or update
      if (hook.method === 'remove') {
        _.remove(resources, item => resource._id.toString() === item._id.toString())
      } else {
        Object.assign(resource, hook.result)
      }
      return orgMembersService.patch(member._id, { [resourceScope]: resources })
    }))

    debug(`Updated resource ${hook.result._id} on scope ${resourceScope} for members of organisation ` + hook.result._id)
    return hook
  }
}

export function removeOrganisationResources (resourceScope) {
  return async function (hook) {
    if (hook.type !== 'after') {
      throw new Error('The \'removeOrganisationResources\' hook should only be used as a \'after\' hook.')
    }

    const app = hook.app
    const orgResourceService = app.getService(resourceScope, hook.result)
    const resources = await orgResourceService.find({ paginate: false })
    await Promise.all(resources.map(resource => {
      return orgResourceService.remove(resource._id.toString(), {
        user: hook.params.user
      })
    }))
    debug(`Removed ${resourceScope} for organisation ` + hook.result._id)
    return hook
  }
}

