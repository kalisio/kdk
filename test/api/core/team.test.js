import _ from 'lodash'
import dauria from 'dauria'
import chai from 'chai'
import chailint from 'chai-lint'
import common from 'feathers-hooks-common'
import core, { kalisio, hooks } from '../../../core/api/index.js'
import { permissions } from '../../../core/common/index.js'

const { iffElse, when } = common
const { getBase64DataURI } = dauria
const { util, expect, assert } = chai

/* Scenario story board

  User 2 invites User 3 in its org
  User 1 creates an org
  User 1 adds User 3 as member
  User 1 adds User 2 as manager
  User 2 creates a group
  User 2 adds himself as group member
  User 2 adds User 3 as group member
  User 2 adds User 3 as group manager
  User 3 removes User 2 from group
  User 2 removes group
  User 1 creates a group and adds User 2 as group member
  User 1 removes User 2 from org (=> and from his group)
  User 1 removes org (=> and his group)
  User 2/3 is removed (=> and his org)
*/
describe('core:team', () => {
  let app, adminDb, server, port, // baseUrl,
    userService, orgService, authorisationService, orgGroupService, orgUserService, orgStorageService,
    joinedOrgUserService, user1Object, user2Object, user3Object, orgObject, groupObject

  before(async () => {
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
            // Groups can now be created as empty because org managers can manage all groups
            // create: [hooks.createGroupAuthorisations],
            remove: [hooks.setAsDeleted, hooks.removeGroupAuthorisations]
          }
        })
      }
    })
    const db = await app.db.connect()
    adminDb = db.admin()
    await app.db.instance.dropDatabase()
  })

  it('is ES6 compatible', () => {
    expect(typeof core).to.equal('function')
  })

  it('registers the global services', async () => {
    await app.configure(core)
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
          hooks.preventRemovingLastOwner('organisations'))
          // Groups can now be left as empty because org managers can manage all groups
          // hooks.preventRemovingLastOwner('groups'))
        ],
        remove: [when(hook => hook.params.resource && !hook.params.resource.deleted,
          hooks.preventRemovingLastOwner('organisations'))
          // Groups can now be left as empty because org managers can manage all groups
          // hooks.preventRemovingLastOwner('groups'))
        ]
      },
      after: {
        remove: [when(hook => _.get(hook.params, 'query.scope') === 'organisations',
          hooks.removeOrganisationGroupsAuthorisations)
        ]
      }
    })
    server = app.listen(port)
    await new Promise(resolve => server.once('listening', () => resolve()))
  })
  // Let enough time to process
    .timeout(5000)

  it('unregistered users cannot create organisations', async () => {
    try {
      await orgService.create({ name: 'test-org' }, { checkAuthorisation: true })
      assert.fail()
    } catch (error) {
      expect(error).toExist()
      expect(error.name).to.equal('Forbidden')
    }
    /*
    request
    .post(`${baseUrl}/organisations`)
    .send({ name: 'test-org' })
    .then(response => {
      console.log(response)
      expect(response).toExist()
    })
    */
  })

  it('creates a test user', async () => {
    user1Object = await userService.create({ email: 'test-1@test.org', name: 'test-user-1' }, { checkAuthorisation: true })
    const users = await userService.find({ query: { 'profile.name': 'test-user-1' }, checkAuthorisation: true, user: user1Object })
    expect(users.data.length > 0).beTrue()
  })
  // Let enough time to process
    .timeout(5000)

  it('creates a private organisation on user registration', async () => {
    user2Object = await userService.create({ email: 'test-2@test.org', name: 'test-user-2' }, { checkAuthorisation: true })
    expect(user2Object.organisations).toExist()
    // By default the user manage its own organisation
    expect(user2Object.organisations[0].permissions).to.deep.equal('owner')
    const orgs = await orgService.find({ query: { name: 'test-user-2' }, user: user2Object, checkAuthorisation: true })
    expect(orgs.data.length > 0).beTrue()
  })
  // Let enough time to process
    .timeout(5000)

  it('invites a user to join an organisation', async () => {
    const sponsor = { id: user2Object._id, organisationId: user2Object.organisations[0]._id, roleGranted: 'member' }
    user3Object = await userService.create({ email: 'test-3@test.org', name: 'test-user-3', sponsor }, { checkAuthorisation: true })
    expect(user3Object.organisations).toExist()
    // By default the user manage its own organisation
    expect(user3Object.organisations[0].permissions).to.deep.equal('member')
  })
  // Let enough time to process
    .timeout(5000)

  it('creates an organisation', async () => {
    await orgService.create({ name: 'test-org' }, { user: user1Object, checkAuthorisation: true })
    const orgs = await orgService.find({ query: { name: 'test-org' }, user: user1Object, checkAuthorisation: true })
    expect(orgs.data.length > 0).beTrue()
    orgObject = orgs.data[0]
    expect(orgObject.name).to.equal('test-org')
    // This should create a service for organisation groups
    orgGroupService = app.getService('groups', orgObject)
    expect(orgGroupService).toExist()
    // This should create a service for organisation users
    orgUserService = app.getService('members', orgObject)
    expect(orgUserService).toExist()
    // This should create a service for organisation storage
    orgStorageService = app.getService('storage', orgObject)
    expect(orgStorageService).toExist()
    // We do not test creation of the DB here since MongoDB does not actually
    // creates it until the first document has been inserted (see next tests)
  })
  // Let enough time to process
    .timeout(5000)

  it('checks the subjects as owner on this organisation', async () => {
    const members = await permissions.findMembersOfOrganisation(userService, orgObject._id, permissions.Roles.owner)
    expect(members.data.length === 1).beTrue()
    expect(members.data[0]._id.toString()).to.deep.equal(user1Object._id.toString())
  })

  it('non-members cannot access organisation users', async () => {
    let users = await userService.find({ query: { 'profile.name': user2Object.name }, user: user1Object, checkAuthorisation: true })
    // User is found on the global service
    expect(users.data.length > 0).beTrue()
    users = await orgUserService.find({ query: { name: user2Object.name }, user: user1Object, checkAuthorisation: true })
    // User is not found on the org service while no membership
    expect(users.data.length === 0).beTrue()
  })

  it('non-members cannot manage organisation permissions', async () => {
    try {
      await authorisationService.create({
        scope: 'organisations',
        permissions: 'member',
        subjects: user2Object._id.toString(),
        subjectsService: 'users',
        resource: orgObject._id.toString(),
        resourcesService: 'organisations'
      }, {
        user: user2Object,
        checkAuthorisation: true
      })
      assert.fail()
    } catch (error) {
      expect(error).toExist()
      expect(error.name).to.equal('Forbidden')
    }
  })

  it('non-members cannot access organisation storage', async () => {
    try {
      await orgStorageService.get('file.txt', { user: user2Object, checkAuthorisation: true })
      assert.fail()
    } catch (error) {
      expect(error).toExist()
      expect(error.name).to.equal('Forbidden')
    }
  })

  it('owner can add organisation members', async () => {
    const authorisation = await authorisationService.create({
      scope: 'organisations',
      permissions: 'member',
      subjects: user3Object._id.toString(),
      subjectsService: 'users',
      resource: orgObject._id.toString(),
      resourcesService: 'organisations'
    }, {
      user: user1Object,
      checkAuthorisation: true
    })
    expect(authorisation).toExist()
    const users = await userService.find({ query: { 'profile.name': user3Object.name }, checkAuthorisation: true, user: user1Object })
    expect(users.data.length > 0).beTrue()
    user3Object = users.data[0]
    expect(user3Object.organisations[1].permissions).to.deep.equal('member')
  })
  // Let enough time to process
    .timeout(5000)

  it('members can access organisation users', async () => {
    const users = await orgUserService.find({ query: { 'profile.name': user1Object.name }, user: user3Object, checkAuthorisation: true })
    // Found now on the org with membership
    expect(users.data.length > 0).beTrue()
  })

  it('members cannot create an organisation group', async () => {
    try {
      await orgGroupService.create({ name: 'test-group' }, { user: user3Object, checkAuthorisation: true })
      assert.fail()
    } catch (error) {
      expect(error).toExist()
      expect(error.name).to.equal('Forbidden')
    }
  })
  // Let enough time to process
    .timeout(5000)

  it('members can access organisation storage', async () => {
    await orgStorageService.create({
      id: 'file.txt', uri: getBase64DataURI(Buffer.from('some buffered data'), 'text/plain')
    }, {
      user: user3Object, checkAuthorisation: true
    })
    await orgStorageService.get('file.txt', { user: user3Object, checkAuthorisation: true })
    await orgStorageService.remove('file.txt', { user: user3Object, checkAuthorisation: true })
  })
  // Let enough time to process
    .timeout(10000)

  it('owner can add organisation managers', async () => {
    const authorisation = await authorisationService.create({
      scope: 'organisations',
      permissions: 'manager',
      subjects: user2Object._id.toString(),
      subjectsService: 'users',
      resource: orgObject._id.toString(),
      resourcesService: 'organisations'
    }, {
      user: user1Object, checkAuthorisation: true
    })
    expect(authorisation).toExist()
    const users = await userService.find({ query: { 'profile.name': user2Object.name }, checkAuthorisation: true, user: user1Object })
    expect(users.data.length > 0).beTrue()
    user2Object = users.data[0]
    expect(user2Object.organisations[1].permissions).to.deep.equal('manager')
  })
  // Let enough time to process
    .timeout(5000)

  it('manager can create an organisation group', async () => {
    await orgGroupService.create({ name: 'test-group' }, { user: user2Object, checkAuthorisation: true })
    const groups = await orgGroupService.find({ query: { name: 'test-group' }, user: user2Object, checkAuthorisation: true })
    expect(groups.data.length > 0).beTrue()
    groupObject = groups.data[0]
    expect(groupObject.name).to.equal('test-group')
    // Now we have added some documents this should have created DB for organisation
    const dbs = await adminDb.listDatabases()
    expect(dbs.databases.find(db => db.name === orgObject._id.toString())).toExist()
    /* Now managers are not default owners of group anymore as they can manage all groups by default
    const members = await permissions.findMembersOfGroup(userService, groupObject._id, permissions.Roles.owner)
    expect(members.data.length === 1).beTrue()
    expect(members.data[0]._id.toString()).to.deep.equal(user2Object._id.toString())
    */
  })
  // Let enough time to process
    .timeout(10000)

  it('manager can add himself to an organisation group', async () => {
    const authorisation = await authorisationService.create({
      scope: 'groups',
      permissions: 'member',
      subjects: user2Object._id.toString(),
      subjectsService: 'users',
      resource: groupObject._id.toString(),
      resourcesService: orgObject._id.toString() + '/groups'
    }, {
      user: user2Object,
      checkAuthorisation: true
    })
    expect(authorisation).toExist()
    const users = await userService.find({ query: { 'profile.name': user2Object.name }, checkAuthorisation: true, user: user2Object })
    expect(users.data.length > 0).beTrue()
    user2Object = users.data[0]
    expect(user2Object.groups[0]._id.toString()).to.equal(groupObject._id.toString())
    expect(user2Object.groups[0].permissions).to.equal('member')
  })
  // Let enough time to process
    .timeout(5000)

  it('manager can add members to an organisation group', async () => {
    const authorisation = await authorisationService.create({
      scope: 'groups',
      permissions: 'member',
      subjects: user3Object._id.toString(),
      subjectsService: 'users',
      resource: groupObject._id.toString(),
      resourcesService: orgObject._id.toString() + '/groups'
    }, {
      user: user2Object,
      checkAuthorisation: true
    })
    expect(authorisation).toExist()
    const users = await userService.find({ query: { 'profile.name': user3Object.name }, checkAuthorisation: true, user: user2Object })
    expect(users.data.length > 0).beTrue()
    user3Object = users.data[0]
    expect(user3Object.groups[0]._id.toString()).to.equal(groupObject._id.toString())
    expect(user3Object.groups[0].permissions).to.equal('member')
  })
  // Let enough time to process
    .timeout(5000)

  it('non-group manager cannot update his group', async () => {
    try {
      await orgGroupService.patch(groupObject._id.toString(), { description: 'test-description' },
        { user: user3Object, checkAuthorisation: true })
      assert.fail()
    } catch (error) {
      expect(error).toExist()
      expect(error.name).to.equal('Forbidden')
    }
  })

  it('non-group manager cannot add members to his group', async () => {
    try {
      await authorisationService.create({
        scope: 'groups',
        permissions: 'member',
        subjects: user1Object._id.toString(),
        subjectsService: 'users',
        resource: groupObject._id.toString(),
        resourcesService: orgObject._id.toString() + '/groups'
      }, {
        user: user3Object,
        checkAuthorisation: true
      })
      assert.fail()
    } catch (error) {
      expect(error).toExist()
      expect(error.name).to.equal('Forbidden')
    }
  })

  it('manager can update an organisation group', async () => {
    return orgGroupService.patch(groupObject._id.toString(), { description: 'test-description' },
      { user: user2Object, checkAuthorisation: true })
  /* const groups = await orgGroupService.find({ query: { name: 'test-group' }, user: user2Object, checkAuthorisation: true })
    expect(groups.data.length > 0).beTrue()
    groupObject = groups.data[0]
    expect(groupObject.description).to.equal('test-description')
    const users = await userService.find({ query: { 'profile.name': user2Object.name }, checkAuthorisation: true, user: user1Object })
    // Should also update group in members authorisations
    expect(users.data.length > 0).beTrue()
    user2Object = users.data[0]
    expect(user2Object.groups[0].description).to.equal('test-description')
    await userService.find({ query: { 'profile.name': user1Object.name }, checkAuthorisation: true, user: user1Object })
    user1Object = users.data[0]
    expect(user1Object.groups[0].description).to.equal('test-description') */
  })
  // Let enough time to process
    .timeout(10000)

  // Groups can now be left as empty because org managers can manage all groups
  /*
  it('group owner cannot be removed when alone', async () => {
    try {
      await authorisationService.remove(groupObject._id, {
        query: {
          scope: 'groups',
          subjects: user2Object._id.toString(),
          subjectsService: 'users',
          resourcesService: orgObject._id.toString() + '/groups'
        },
        user: user2Object,
        checkAuthorisation: true
      })
      assert.fail()
    } catch (error) {
      expect(error).toExist()
      expect(error.name).to.equal('Forbidden')
    }
  })
  // Let enough time to process
    .timeout(5000)
  */

  it('manager can add managers to an organisation group', async () => {
    const authorisation = await authorisationService.create({
      scope: 'groups',
      permissions: 'manager',
      subjects: user3Object._id.toString(),
      subjectsService: 'users',
      resource: groupObject._id.toString(),
      resourcesService: orgObject._id.toString() + '/groups'
    }, {
      user: user2Object,
      checkAuthorisation: true
    })
    expect(authorisation).toExist()
    const users = await userService.find({ query: { 'profile.name': user3Object.name }, checkAuthorisation: true, user: user2Object })
    expect(users.data.length > 0).beTrue()
    user3Object = users.data[0]
    expect(user3Object.groups[0]._id.toString()).to.equal(groupObject._id.toString())
    expect(user3Object.groups[0].permissions).to.equal('manager')
  })
  // Let enough time to process
    .timeout(5000)

  it('group manager can remove group members', async () => {
    const authorisation = await authorisationService.remove(groupObject._id, {
      query: {
        scope: 'groups',
        subjects: user2Object._id.toString(),
        subjectsService: 'users',
        resourcesService: orgObject._id.toString() + '/groups'
      },
      user: user3Object,
      checkAuthorisation: true
    })
    expect(authorisation).toExist()
    const users = await userService.find({ query: { 'profile.name': user2Object.name }, checkAuthorisation: true, user: user1Object })
    expect(users.data.length === 1).beTrue()
    user2Object = users.data[0]
    // No more permission set for org groups
    expect(_.find(user2Object.groups, group => group._id.toString() === groupObject._id.toString())).beUndefined()
  })
  // Let enough time to process
    .timeout(5000)

  it('group manager cannot add group managers', async () => {
    try {
      await authorisationService.create({
        scope: 'groups',
        permissions: 'manager',
        subjects: user2Object._id.toString(),
        subjectsService: 'users',
        resource: groupObject._id.toString(),
        resourcesService: orgObject._id.toString() + '/groups'
      }, {
        user: user3Object,
        checkAuthorisation: true
      })
      assert.fail()
    } catch (error) {
      expect(error).toExist()
      expect(error.name).to.equal('Forbidden')
    }
  })
  // Let enough time to process
    .timeout(5000)

  it('manager can remove an organisation group', async () => {
    // Ensure we only patch relevent users when updating authorisations
    const updatedUsersCheck = (user) => {
      expect(user.name).equal(user3Object.name)
    }
    userService.on('patched', updatedUsersCheck)
    await orgGroupService.remove(groupObject._id, { user: user2Object, checkAuthorisation: true })
    userService.removeListener('patched', updatedUsersCheck)
    const groups = await orgGroupService.find({ query: { name: groupObject.name }, user: user2Object, checkAuthorisation: true })
    expect(groups.data.length === 0).beTrue()
    /* Now managers are not default owners of group anymore as they can manage all groups by default
    const users = await userService.find({ query: { 'profile.name': user1Object.name }, checkAuthorisation: true, user: user1Object })
    expect(users.data.length > 0).beTrue()
    user1Object = users.data[0]
    // No more permission set for org groups
    expect(_.find(user1Object.groups, group => group._id.toString() === groupObject._id.toString())).beUndefined()
    */
  })
  // Let enough time to process
    .timeout(5000)

  it('restore organisation group to prepare testing org cleanup', async () => {
    await orgGroupService.create({ name: 'test-group' }, { user: user1Object, checkAuthorisation: true })
    const groups = await orgGroupService.find({ query: { name: 'test-group' }, user: user1Object, checkAuthorisation: true })
    expect(groups.data.length > 0).beTrue()
    groupObject = groups.data[0]
    const authorisation = await authorisationService.create({
      scope: 'groups',
      permissions: 'member',
      subjects: user2Object._id.toString(),
      subjectsService: 'users',
      resource: groupObject._id.toString(),
      resourcesService: orgObject._id.toString() + '/groups'
    }, {
      user: user1Object,
      checkAuthorisation: true
    })
    expect(authorisation).toExist()
    const users = await userService.find({ query: { 'profile.name': user2Object.name }, checkAuthorisation: true, user: user1Object })
    user2Object = users.data[0]
    expect(user2Object.groups[0]._id.toString()).to.equal(groupObject._id.toString())
    expect(user2Object.groups[0].permissions).to.equal('member')
  })
  // Let enough time to process
    .timeout(10000)

  it('owner can remove organisation members', async () => {
    const authorisation = await authorisationService.remove(orgObject._id, {
      query: {
        scope: 'organisations',
        subjects: user2Object._id.toString(),
        subjectsService: 'users',
        resourcesService: 'organisations'
      },
      user: user1Object,
      checkAuthorisation: true
    })
    expect(authorisation).toExist()
    const users = await userService.find({ query: { 'profile.name': user2Object.name }, checkAuthorisation: true, user: user1Object })
    user2Object = users.data[0]
    // No more permission set for org groups
    expect(_.find(user2Object.groups, group => group._id.toString() === groupObject._id.toString())).beUndefined()
    // No more permission set for org
    expect(_.find(user2Object.organisations, org => org._id.toString() === orgObject._id.toString())).beUndefined()
    // Only private org remains
    expect(_.find(user2Object.organisations, org => org._id.toString() === user2Object._id.toString())).toExist()
  })
  // Let enough time to process
    .timeout(5000)

  it('owner can remove organisation', async () => {
    await orgGroupService.remove(groupObject._id, { user: user1Object, checkAuthorisation: true })
    const user = await userService.get(user1Object._id)
    user1Object = user
    await orgService.remove(orgObject._id, { user: user1Object, checkAuthorisation: true })
    const orgs = await orgService.find({ query: { name: 'test-org' }, user: user1Object, checkAuthorisation: true })
    expect(orgs.data.length === 0).beTrue()
    const users = await userService.find({ query: {}, checkAuthorisation: true, user: user1Object })
    expect(users.data.length === 3).beTrue()
    user1Object = users.data[0]
    // No more permission set for org groups
    expect(_.find(user1Object.groups, group => group._id.toString() === groupObject._id.toString())).beUndefined()
    // No more permission set for org
    expect(_.find(user1Object.organisations, org => org._id.toString() === orgObject._id.toString())).beUndefined()
    // Should remove associated DB
    const dbs = await adminDb.listDatabases()
    expect(dbs.databases.find(db => db.name === orgObject._id.toString())).beUndefined()
  })
  // Let enough time to process
    .timeout(5000)

  it('removes joined user', async () => {
    const orgs = await orgService.find({ query: { name: user2Object.name }, user: user2Object, checkAuthorisation: true })
    expect(orgs.data.length > 0).beTrue()
    joinedOrgUserService = app.getService('members', orgs.data[0])
    await userService.remove(user3Object._id, { user: user3Object, checkAuthorisation: true })
    let users = await userService.find({ query: { name: user3Object.name }, user: user3Object, checkAuthorisation: true })
    expect(users.data.length === 0).beTrue()
    users = await joinedOrgUserService.find({ query: { name: user3Object.name }, user: user2Object, checkAuthorisation: true })
    // User is not found on the joined org service
    expect(users.data.length === 0).beTrue()
  })
  // Let enough time to process
    .timeout(5000)

  it('prevent remove user while owning organisation', async () => {
    try {
      await userService.remove(user2Object._id, { user: user2Object, checkAuthorisation: true })
      assert.fail()
    } catch (error) {
      expect(error).toExist()
      expect(error.name).to.equal('Forbidden')
    }
  })
  // Let enough time to process
    .timeout(5000)

  it('remove private users private organisations before deletion', async () => {
    await orgService.remove(user1Object._id, { user: user1Object, checkAuthorisation: true })
    user1Object = await userService.get(user1Object._id)
    await orgService.remove(user2Object._id, { user: user2Object, checkAuthorisation: true })
    user2Object = await userService.get(user2Object._id)
  })
  // Let enough time to process
    .timeout(5000)

  it('remove users', async () => {
    await userService.remove(user1Object._id, { user: user1Object, checkAuthorisation: true })
    let users = await userService.find({ query: { name: user1Object.name }, user: user1Object, checkAuthorisation: true })
    expect(users.data.length === 0).beTrue()
    await userService.remove(user2Object._id, { user: user2Object, checkAuthorisation: true })
    users = await userService.find({ query: { name: user2Object.name }, user: user2Object, checkAuthorisation: true })
    expect(users.data.length === 0).beTrue()
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
