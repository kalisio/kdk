import _ from 'lodash'
import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import { iffElse, when } from 'feathers-hooks-common'
import core, { kalisio, hooks } from '../../core/api'
import { permissions } from '../../core/common'

/* Scenario story board

*/
describe('subscriptions', () => {
  let app, adminDb, server, port, // baseUrl,
    userService, orgService, authorisationService, orgGroupService, orgUserService,
    userObject, orgObject, groupObject

  before(() => {
    chailint(chai, util)

    // Register all default hooks for authorisation
    // Default rules for all users
    permissions.defineAbilities.registerHook(permissions.defineUserAbilities)
    // Then rules for organisations
    permissions.defineAbilities.registerHook(permissions.defineOrganisationAbilities)
    // Then rules for groups
    permissions.defineAbilities.registerHook(permissions.defineGroupAbilities)

    app = kalisio()
    port = app.get('port')
    // baseUrl = `http://localhost:${port}${app.get('apiPath')}`
    // Register authorisation hook
    app.hooks({
      before: { all: [hooks.processObjectIDs, hooks.authorise] },
      error: { all: hooks.log }
    })
    // Add hooks for contextual services
    app.on('service', service => {
      if (service.name === 'groups') {
        service.hooks({
          after: {
            create: [hooks.createGroupAuthorisations],
            remove: [hooks.setAsDeleted, hooks.removeGroupAuthorisations]
          }
        })
      }
    })
    return app.db.connect()
      .then(db => {
        adminDb = app.db.instance.admin()
      })
  })

  it('is CommonJS compatible', () => {
    expect(typeof core).to.equal('function')
  })

  it('registers the global services', (done) => {
    app.configure(core)
    userService = app.getService('users')
    userService.hooks({
      before: {
        remove: [hooks.preventRemoveUser]
      },
      after: {
        create: [
          iffElse(hook => hook.result.sponsor, hooks.joinOrganisation, hooks.createPrivateOrganisation)
        ],
        remove: [hooks.setAsDeleted, hooks.leaveOrganisations()]
      }
    })
    expect(userService).toExist()
    orgService = app.getService('organisations')
    expect(orgService).toExist()
    orgService.hooks({
      before: {
        remove: [hooks.preventRemoveOrganisation]
      },
      after: {
        create: [hooks.createOrganisationServices, hooks.createOrganisationAuthorisations],
        remove: [hooks.setAsDeleted, hooks.removeOrganisationGroups, hooks.removeOrganisationAuthorisations, hooks.removeOrganisationServices]
      }
    })
    authorisationService = app.getService('authorisations')
    expect(authorisationService).toExist()
    authorisationService.hooks({
      before: {
        create: [when(hook => hook.params.resource,
          hooks.preventRemovingLastOwner('organisations'),
          hooks.preventRemovingLastOwner('groups'))
        ],
        remove: [when(hook => hook.params.resource && !hook.params.resource.deleted,
          hooks.preventRemovingLastOwner('organisations'),
          hooks.preventRemovingLastOwner('groups'))
        ]
      },
      after: {
        remove: [when(hook => _.get(hook.params, 'query.scope') === 'organisations',
          hooks.removeOrganisationGroupsAuthorisations)
        ]
      }
    })
    server = app.listen(port)
    server.once('listening', _ => done())
  })
  // Let enough time to process
    .timeout(5000)

  it('creates a test user', () => {
    return userService.create({ email: 'test@test.org', name: 'test-user' }, { checkAuthorisation: true })
      .then(user => {
        userObject = user
        // Check the organisation
        expect(userObject.organisations).toExist()
        // Check the ownership
        expect(userObject.organisations[0].permissions).to.deep.equal('owner')
        return userService.find({ query: { 'profile.name': 'test-user' }, checkAuthorisation: true, user: userObject })
      })
      .then(users => {
        expect(users.data.length > 0).beTrue()
      })
  })
  // Let enough time to process
    .timeout(5000)

  it('remove test user', () => {
    return orgService.remove(userObject._id, { user: userObject, checkAuthorisation: true })
      .then(() => {
        return userService.get(userObject._id)
      })
      .then(user => {
        userObject = user
      })
      .then(() => {
        return userService.remove(userObject._id, { user: userObject, checkAuthorisation: true })
      })
  })
  // Let enough time to process
    .timeout(5000)

  // Cleanup
  after(async () => {
    if (server) await server.close()
    await app.db.instance.dropDatabase()
    await app.db.disconnect()
  })
})
