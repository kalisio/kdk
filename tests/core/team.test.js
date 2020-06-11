import _ from 'lodash'
import { getBase64DataURI } from 'dauria'
import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import { iffElse, when } from 'feathers-hooks-common'
import core, { kalisio, hooks } from '../../core/api'
import { permissions } from '../../core/common'

/* Scenario story board

  User 2 invites User 3 in its org
  User 1 creates an org
  User 1 adds User 2 as member
  User 1 adds User 2 as manager
  User 2 creates a group
  User 2 adds User 1 as group member
  User 2 adds User 1 as group owner
  User 1 removes User 2 from group
  User 1 removes group
  User 1 creates a group and adds User 2 as group member
  User 1 removes User 2 from org (=> and his group)
  User 1 removes org (=> and his group)
  User 2 is removed (=> and his org)
*/
describe('team', () => {
  let app, adminDb, server, port, // baseUrl,
    userService, orgService, authorisationService, orgGroupService, orgUserService, orgStorageService,
    joinedOrgUserService, user1Object, user2Object, user3Object, orgObject, groupObject

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

  it('is ES6 compatible', () => {
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

  it('unregistered users cannot create organisations', (done) => {
    orgService.create({ name: 'test-org' }, { checkAuthorisation: true })
      .catch(error => {
        expect(error).toExist()
        expect(error.name).to.equal('Forbidden')
        done()
      })
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

  it('creates a test user', () => {
    return userService.create({ email: 'test-1@test.org', name: 'test-user-1' }, { checkAuthorisation: true })
      .then(user => {
        user1Object = user
        return userService.find({ query: { 'profile.name': 'test-user-1' }, checkAuthorisation: true, user: user1Object })
      })
      .then(users => {
        expect(users.data.length > 0).beTrue()
      })
  })
  // Let enough time to process
    .timeout(5000)

  it('creates a private organisation on user registration', () => {
    return userService.create({ email: 'test-2@test.org', name: 'test-user-2' }, { checkAuthorisation: true })
      .then(user => {
        user2Object = user
        expect(user2Object.organisations).toExist()
        // By default the user manage its own organisation
        expect(user2Object.organisations[0].permissions).to.deep.equal('owner')
        return orgService.find({ query: { name: 'test-user-2' }, user: user2Object, checkAuthorisation: true })
      })
      .then(orgs => {
        expect(orgs.data.length > 0).beTrue()
      })
  })
  // Let enough time to process
    .timeout(5000)

  it('invites a user to join an organisation', () => {
    const sponsor = { id: user2Object._id, organisationId: user2Object.organisations[0]._id, roleGranted: 'member' }
    return userService.create({ email: 'test-3@test.org', name: 'test-user-3', sponsor: sponsor }, { checkAuthorisation: true })
      .then(user => {
        user3Object = user
        expect(user3Object.organisations).toExist()
        // By default the user manage its own organisation
        expect(user3Object.organisations[0].permissions).to.deep.equal('member')
      })
  })
  // Let enough time to process
    .timeout(5000)

  it('creates an organisation', () => {
    return orgService.create({ name: 'test-org' }, { user: user1Object, checkAuthorisation: true })
      .then(org => {
        return orgService.find({ query: { name: 'test-org' }, user: user1Object, checkAuthorisation: true })
      })
      .then(orgs => {
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
  })
  // Let enough time to process
    .timeout(5000)

  it('checks the subjects as owner on this organisation', () => {
    return permissions.findMembersOfOrganisation(userService, orgObject._id, permissions.Roles.owner)
      .then(members => {
        expect(members.data.length === 1).beTrue()
        expect(members.data[0]._id.toString()).to.deep.equal(user1Object._id.toString())
      })
  })

  it('non-members cannot access organisation users', () => {
    return userService.find({ query: { 'profile.name': user2Object.name }, user: user1Object, checkAuthorisation: true })
      .then(users => {
      // User is found on the global service
        expect(users.data.length > 0).beTrue()
        return orgUserService.find({ query: { name: user2Object.name }, user: user1Object, checkAuthorisation: true })
      })
      .then(users => {
      // User is not found on the org service while no membership
        expect(users.data.length === 0).beTrue()
      })
  })

  it('non-members cannot manage organisation permissions', (done) => {
    authorisationService.create({
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
      .catch(error => {
        expect(error).toExist()
        expect(error.name).to.equal('Forbidden')
        done()
      })
  })

  it('non-members cannot access organisation storage', (done) => {
    orgStorageService.get('file.txt', { user: user2Object, checkAuthorisation: true })
      .catch(error => {
        expect(error).toExist()
        expect(error.name).to.equal('Forbidden')
        done()
      })
  })

  it('owner can add organisation members', () => {
    return authorisationService.create({
      scope: 'organisations',
      permissions: 'member',
      subjects: user2Object._id.toString(),
      subjectsService: 'users',
      resource: orgObject._id.toString(),
      resourcesService: 'organisations'
    }, {
      user: user1Object,
      checkAuthorisation: true
    })
      .then(authorisation => {
        expect(authorisation).toExist()
        return userService.find({ query: { 'profile.name': user2Object.name }, checkAuthorisation: true, user: user1Object })
      })
      .then(users => {
        expect(users.data.length > 0).beTrue()
        user2Object = users.data[0]
        expect(user2Object.organisations[1].permissions).to.deep.equal('member')
      })
  })
  // Let enough time to process
    .timeout(5000)

  it('members can access organisation users', () => {
    return orgUserService.find({ query: { 'profile.name': user1Object.name }, user: user2Object, checkAuthorisation: true })
      .then(users => {
      // Found now on the org with membership
        expect(users.data.length > 0).beTrue()
      })
  })

  it('members cannot create an organisation group', (done) => {
    orgGroupService.create({ name: 'test-group' }, { user: user2Object, checkAuthorisation: true })
      .catch(error => {
        expect(error).toExist()
        expect(error.name).to.equal('Forbidden')
        done()
      })
  })
  // Let enough time to process
    .timeout(5000)

  it('members can access organisation storage', () => {
    return orgStorageService.create({
      id: 'file.txt', uri: getBase64DataURI(Buffer.from('some buffered data'), 'text/plain')
    }, {
      user: user2Object, checkAuthorisation: true
    })
      .then(_ => orgStorageService.get('file.txt', { user: user2Object, checkAuthorisation: true }))
      .then(_ => orgStorageService.remove('file.txt', { user: user2Object, checkAuthorisation: true }))
  })
  // Let enough time to process
    .timeout(10000)

  it('owner can add organisation managers', () => {
    return authorisationService.create({
      scope: 'organisations',
      permissions: 'manager',
      subjects: user2Object._id.toString(),
      subjectsService: 'users',
      resource: orgObject._id.toString(),
      resourcesService: 'organisations'
    }, {
      user: user1Object, checkAuthorisation: true
    })
      .then(authorisation => {
        expect(authorisation).toExist()
        return userService.find({ query: { 'profile.name': user2Object.name }, checkAuthorisation: true, user: user1Object })
      })
      .then(users => {
        expect(users.data.length > 0).beTrue()
        user2Object = users.data[0]
        expect(user2Object.organisations[1].permissions).to.deep.equal('manager')
      })
  })
  // Let enough time to process
    .timeout(5000)

  it('manager can create an organisation group', () => {
    return orgGroupService.create({ name: 'test-group' }, { user: user2Object, checkAuthorisation: true })
      .then(() => {
        return orgGroupService.find({ query: { name: 'test-group' }, user: user2Object, checkAuthorisation: true })
      })
      .then(groups => {
        expect(groups.data.length > 0).beTrue()
        groupObject = groups.data[0]
        expect(groupObject.name).to.equal('test-group')
        // Now we have added some documents this should have created DB for organisation
        return adminDb.listDatabases()
      })
      .then(dbs => {
        expect(dbs.databases.find(db => db.name === orgObject._id.toString())).toExist()
        return permissions.findMembersOfGroup(userService, groupObject._id, permissions.Roles.owner)
      })
      .then(members => {
        expect(members.data.length === 1).beTrue()
        expect(members.data[0]._id.toString()).to.deep.equal(user2Object._id.toString())
      })
  })
  // Let enough time to process
    .timeout(10000)

  it('group owner can update an organisation group', () => {
    return orgGroupService.patch(groupObject._id.toString(), { description: 'test-description' },
      { user: user2Object, checkAuthorisation: true })
      .then(() => {
        return orgGroupService.find({ query: { name: 'test-group' }, user: user2Object, checkAuthorisation: true })
      })
      .then(groups => {
        expect(groups.data.length > 0).beTrue()
        groupObject = groups.data[0]
        expect(groupObject.description).to.equal('test-description')
        return userService.find({ query: { 'profile.name': user2Object.name }, checkAuthorisation: true, user: user1Object })
      })
      .then(users => {
        // Should also update group in members authorisations
        expect(users.data.length > 0).beTrue()
        user2Object = users.data[0]
        expect(user2Object.groups[0].description).to.equal('test-description')
      })
  })
  // Let enough time to process
    .timeout(10000)

  it('non-group owner cannot update the group', (done) => {
    orgGroupService.patch(groupObject._id.toString(), { description: 'test-description' },
      { user: user1Object, checkAuthorisation: true })
      .catch(error => {
        expect(error).toExist()
        expect(error.name).to.equal('Forbidden')
        done()
      })
  })

  it('non-group owner cannot add members to the group', (done) => {
    authorisationService.create({
      scope: 'groups',
      permissions: 'member',
      subjects: user1Object._id.toString(),
      subjectsService: 'users',
      resource: groupObject._id.toString(),
      resourcesService: orgObject._id.toString() + '/groups'
    }, {
      user: user1Object,
      checkAuthorisation: true
    })
      .catch(error => {
        expect(error).toExist()
        expect(error.name).to.equal('Forbidden')
        done()
      })
  })

  it('group owner can add members to his group', () => {
    return authorisationService.create({
      scope: 'groups',
      permissions: 'member',
      subjects: user1Object._id.toString(),
      subjectsService: 'users',
      resource: groupObject._id.toString(),
      resourcesService: orgObject._id.toString() + '/groups'
    }, {
      user: user2Object,
      checkAuthorisation: true
    })
      .then(authorisation => {
        expect(authorisation).toExist()
        return userService.find({ query: { 'profile.name': user1Object.name }, checkAuthorisation: true, user: user2Object })
      })
      .then(users => {
        expect(users.data.length > 0).beTrue()
        user1Object = users.data[0]
        expect(user1Object.groups[0]._id.toString()).to.equal(groupObject._id.toString())
        expect(user1Object.groups[0].permissions).to.equal('member')
      })
  })
  // Let enough time to process
    .timeout(5000)

  it('group owner cannot be changed to manager when alone', (done) => {
    authorisationService.create({
      scope: 'groups',
      permissions: 'manager',
      subjects: user2Object._id.toString(),
      subjectsService: 'users',
      resource: groupObject._id.toString(),
      resourcesService: orgObject._id.toString() + '/groups'
    }, {
      user: user2Object,
      checkAuthorisation: true
    })
      .catch(error => {
        expect(error).toExist()
        expect(error.name).to.equal('Forbidden')
        done()
      })
  })
  // Let enough time to process
    .timeout(5000)

  it('group owner cannot be removed when alone', (done) => {
    authorisationService.remove(groupObject._id, {
      query: {
        scope: 'groups',
        subjects: user2Object._id.toString(),
        subjectsService: 'users',
        resourcesService: orgObject._id.toString() + '/groups'
      },
      user: user2Object,
      checkAuthorisation: true
    })
      .catch(error => {
        expect(error).toExist()
        expect(error.name).to.equal('Forbidden')
        done()
      })
  })
  // Let enough time to process
    .timeout(5000)

  it('group owner can add owners to his group', () => {
    return authorisationService.create({
      scope: 'groups',
      permissions: 'owner',
      subjects: user1Object._id.toString(),
      subjectsService: 'users',
      resource: groupObject._id.toString(),
      resourcesService: orgObject._id.toString() + '/groups'
    }, {
      user: user2Object,
      checkAuthorisation: true
    })
      .then(authorisation => {
        expect(authorisation).toExist()
        return userService.find({ query: { 'profile.name': user1Object.name }, checkAuthorisation: true, user: user2Object })
      })
      .then(users => {
        expect(users.data.length > 0).beTrue()
        user1Object = users.data[0]
        expect(user1Object.groups[0]._id.toString()).to.equal(groupObject._id.toString())
        expect(user1Object.groups[0].permissions).to.equal('owner')
      })
  })
  // Let enough time to process
    .timeout(5000)

  it('group owner can remove group members', () => {
    return authorisationService.remove(groupObject._id, {
      query: {
        scope: 'groups',
        subjects: user2Object._id.toString(),
        subjectsService: 'users',
        resourcesService: orgObject._id.toString() + '/groups'
      },
      user: user1Object,
      checkAuthorisation: true
    })
      .then(authorisation => {
        expect(authorisation).toExist()
        return userService.find({ query: { 'profile.name': user2Object.name }, checkAuthorisation: true, user: user1Object })
      })
      .then(users => {
        expect(users.data.length === 1).beTrue()
        user2Object = users.data[0]
        // No more permission set for org groups
        expect(_.find(user2Object.groups, group => group._id.toString() === groupObject._id.toString())).beUndefined()
      })
  })
  // Let enough time to process
    .timeout(5000)

  it('group owner can remove his organisation group', () => {
    return orgGroupService.remove(groupObject._id, { user: user1Object, checkAuthorisation: true })
      .then(() => {
        return orgGroupService.find({ query: { name: groupObject.name }, user: user1Object, checkAuthorisation: true })
      })
      .then(groups => {
        expect(groups.data.length === 0).beTrue()
        return userService.find({ query: { 'profile.name': user1Object.name }, checkAuthorisation: true, user: user1Object })
      })
      .then(users => {
        expect(users.data.length > 0).beTrue()
        user1Object = users.data[0]
        // No more permission set for org groups
        expect(_.find(user1Object.groups, group => group._id.toString() === groupObject._id.toString())).beUndefined()
      })
  })
  // Let enough time to process
    .timeout(5000)

  it('restore organisation group to prepare testing org cleanup', () => {
    return orgGroupService.create({ name: 'test-group' }, { user: user1Object, checkAuthorisation: true })
      .then(() => {
        return orgGroupService.find({ query: { name: 'test-group' }, user: user1Object, checkAuthorisation: true })
      })
      .then(groups => {
        expect(groups.data.length > 0).beTrue()
        groupObject = groups.data[0]
        return authorisationService.create({
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
      })
      .then(authorisation => {
        expect(authorisation).toExist()
        return userService.find({ query: { 'profile.name': user2Object.name }, checkAuthorisation: true, user: user1Object })
      })
      .then(users => {
        user2Object = users.data[0]
        expect(user2Object.groups[0]._id.toString()).to.equal(groupObject._id.toString())
        expect(user2Object.groups[0].permissions).to.equal('member')
      })
  })
  // Let enough time to process
    .timeout(10000)

  it('owner can remove organisation members', () => {
    return authorisationService.remove(orgObject._id, {
      query: {
        scope: 'organisations',
        subjects: user2Object._id.toString(),
        subjectsService: 'users',
        resourcesService: 'organisations'
      },
      user: user1Object,
      checkAuthorisation: true
    })
      .then(authorisation => {
        expect(authorisation).toExist()
        return userService.find({ query: { 'profile.name': user2Object.name }, checkAuthorisation: true, user: user1Object })
      })
      .then(users => {
        user2Object = users.data[0]
        // No more permission set for org groups
        expect(_.find(user2Object.groups, group => group._id.toString() === groupObject._id.toString())).beUndefined()
        // No more permission set for org
        expect(_.find(user2Object.organisations, org => org._id.toString() === orgObject._id.toString())).beUndefined()
        // Only private org remains
        expect(_.find(user2Object.organisations, org => org._id.toString() === user2Object._id.toString())).toExist()
      })
  })
  // Let enough time to process
    .timeout(5000)

  it('owner can remove organisation', () => {
    return orgGroupService.remove(groupObject._id, { user: user1Object, checkAuthorisation: true })
      .then(() => {
        return userService.get(user1Object._id)
      })
      .then(user => {
        user1Object = user
        return orgService.remove(orgObject._id, { user: user1Object, checkAuthorisation: true })
      })
      .then(() => {
        return orgService.find({ query: { name: 'test-org' }, user: user1Object, checkAuthorisation: true })
      })
      .then(orgs => {
        expect(orgs.data.length === 0).beTrue()
        return userService.find({ query: {}, checkAuthorisation: true, user: user1Object })
      })
      .then(users => {
        expect(users.data.length === 3).beTrue()
        user1Object = users.data[0]
        // No more permission set for org groups
        expect(_.find(user1Object.groups, group => group._id.toString() === groupObject._id.toString())).beUndefined()
        // No more permission set for org
        expect(_.find(user1Object.organisations, org => org._id.toString() === orgObject._id.toString())).beUndefined()
        // Should remove associated DB
        return adminDb.listDatabases()
      })
      .then(dbs => {
        expect(dbs.databases.find(db => db.name === orgObject._id.toString())).beUndefined()
      })
  })
  // Let enough time to process
    .timeout(5000)

  it('removes joined user', () => {
    return orgService.find({ query: { name: user2Object.name }, user: user2Object, checkAuthorisation: true })
      .then(orgs => {
        expect(orgs.data.length > 0).beTrue()
        joinedOrgUserService = app.getService('members', orgs.data[0])
        return userService.remove(user3Object._id, { user: user3Object, checkAuthorisation: true })
      })
      .then(user => {
        return userService.find({ query: { name: user3Object.name }, user: user3Object, checkAuthorisation: true })
      })
      .then(users => {
        expect(users.data.length === 0).beTrue()
        return joinedOrgUserService.find({ query: { name: user3Object.name }, user: user2Object, checkAuthorisation: true })
      })
      .then(users => {
      // User is not found on the joined org service
        expect(users.data.length === 0).beTrue()
      })
  })
  // Let enough time to process
    .timeout(5000)

  it('prevent remove user while owning organisation', (done) => {
    userService.remove(user2Object._id, { user: user2Object, checkAuthorisation: true })
      .catch(error => {
        expect(error).toExist()
        expect(error.name).to.equal('Forbidden')
        done()
      })
  })
  // Let enough time to process
    .timeout(5000)

  it('remove private users private organisations before deletion', () => {
    return orgService.remove(user1Object._id, { user: user1Object, checkAuthorisation: true })
      .then(() => {
        return userService.get(user1Object._id)
      })
      .then(user => {
        user1Object = user
      })
      .then(() => {
        return orgService.remove(user2Object._id, { user: user2Object, checkAuthorisation: true })
      })
      .then(() => {
        return userService.get(user2Object._id)
      })
      .then(user => {
        user2Object = user
      })
  })
  // Let enough time to process
    .timeout(5000)

  it('remove users', () => {
    return userService.remove(user1Object._id, { user: user1Object, checkAuthorisation: true })
      .then(() => {
        return userService.find({ query: { name: user1Object.name }, user: user1Object, checkAuthorisation: true })
      })
      .then(users => {
        expect(users.data.length === 0).beTrue()
      })
      .then(() => {
        return userService.remove(user2Object._id, { user: user2Object, checkAuthorisation: true })
      })
      .then(() => {
        return userService.find({ query: { name: user2Object.name }, user: user2Object, checkAuthorisation: true })
      })
      .then(users => {
        expect(users.data.length === 0).beTrue()
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
