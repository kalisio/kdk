import _ from 'lodash'
import authentication from '@feathersjs/authentication'
import commonHooks from 'feathers-hooks-common'
import request from 'superagent'
import chai from 'chai'
import chailint from 'chai-lint'
import core, { kdk, hooks } from '../../../core/api/index.js'

const { authenticate } = authentication.hooks
const { util, expect } = chai
const { iff, disallow, isProvider, keep, discard } = commonHooks
const { isNotMe, onlyMe, preventChanges } = hooks

describe('core:users', () => {
  let app, server, port, baseUrl, userIdAccessToken, emailAccessToken, phoneAccessToken, statelessAccessToken, adminAccessToken,
    userService, userObject, anotherUserObject, authenticationService

  before(async () => {
    chailint(chai, util)

    app = kdk()
    port = app.get('port')
    baseUrl = `http://localhost:${port}${app.get('apiPath')}`
    await app.db.connect()
    await app.db.instance.dropDatabase()
  })

  it('registers the services', async () => {
    await app.configure(core)
    authenticationService = app.getService('authentication')
    expect(authenticationService).toExist()
    userService = app.getService('users')
    expect(userService).toExist()
    // Register hooks, what we'd like is a configuration so that:
    // - information disclosure about internal user secrets like password is not permitted
    // - information disclosure about others users is not permitted for a given user unless it has 'administrator' permissions
    // - privilege escalation is not permitted for a given user
    // - user with 'administrator' permissions can change others user permissions
    // - changing others users information is not permitted for a given user unless it has 'administrator' permissions
    // - external calls can only target myself except if I have administrator permissions
    const isNotAdministrator = (context) => {
      const userPermissions = _.get(context.params, 'user.permissions')
      return userPermissions !== 'administrator'
    }
    userService.hooks({
      before: {
        all: authenticate('jwt'),
        get: [iff(isNotMe(), disallow('external'))],
        find: [iff(isProvider('external'), iff(isNotAdministrator, onlyMe()))],
        create: [iff(isProvider('external'), keep('name', 'email', 'profile', 'password'))],
        update: [disallow('external')],
        patch: [iff(isProvider('external'), iff(isNotAdministrator, onlyMe(), preventChanges(true, ['permissions'])))],
        remove: [iff(isProvider('external'), iff(isNotAdministrator, onlyMe()))]
      },
      after: {
        all: [iff(isProvider('external'), iff(isNotMe(), iff(isNotAdministrator, discard('permissions'))))]
      }
    })
    // Now app is configured launch the server
    server = await app.listen(port)
    await new Promise(resolve => server.once('listening', resolve))
  })
  // Let enough time to process
    .timeout(10000)

  it('creates users and tokens with different subject identifiers', async () => {
    userObject = await userService.create({
      email: 'test@test.org',
      name: 'test user',
      permissions: 'user',
      profile: { phone: '0623256968' }
    })
    userIdAccessToken = await authenticationService.createAccessToken({
      sub: userObject._id
    })
    emailAccessToken = await authenticationService.createAccessToken({
      sub: userObject.email
    })
    phoneAccessToken = await authenticationService.createAccessToken({
      sub: userObject.profile.phone
    })
    statelessAccessToken = await authenticationService.createAccessToken({
      property: 'mycustomproperty'
    }, {
      subject: 'mycustomapp'
    })
    anotherUserObject = await userService.create({
      email: 'another_test@test.org',
      name: 'another test user',
      permissions: 'administrator',
      profile: { phone: '0623256969' }
    })
    adminAccessToken = await authenticationService.createAccessToken({
      sub: anotherUserObject._id
    })
  })

  it('checks all user tokens are recognized', async () => {
    let response = await request
      .post(`${baseUrl}/authentication`)
      .send({ accessToken: userIdAccessToken, strategy: 'jwt' })
    let accessToken = response.body.accessToken
    let user = response.body.user
    expect(accessToken).toExist()
    expect(accessToken).not.to.equal(userIdAccessToken)
    expect(user).toExist()
    response = await request
      .post(`${baseUrl}/authentication`)
      .send({ accessToken: emailAccessToken, strategy: 'jwt' })
    accessToken = response.body.accessToken
    user = response.body.user
    expect(accessToken).toExist()
    expect(accessToken).not.to.equal(emailAccessToken)
    expect(user).toExist()
    response = await request
      .post(`${baseUrl}/authentication`)
      .send({ accessToken: phoneAccessToken, strategy: 'jwt' })
    accessToken = response.body.accessToken
    user = response.body.user
    expect(accessToken).toExist()
    expect(accessToken).not.to.equal(phoneAccessToken)
    expect(user).toExist()
    response = await request
      .post(`${baseUrl}/authentication`)
      .send({ accessToken: statelessAccessToken, strategy: 'jwt' })
    accessToken = response.body.accessToken
    user = response.body.user
    expect(accessToken).toExist()
    expect(accessToken).not.to.equal(statelessAccessToken)
    expect(user).beUndefined()
  })

  it('checks for user information disclosure', async () => {
    // Should not retrieve internal user secret information like password in any case
    // Should not list others users in case of requests with identified user
    let response = await request
      .get(`${baseUrl}/users`)
      .set('Authorization', 'Bearer ' + userIdAccessToken)
    let users = response.body.data
    expect(users.length).to.equal(1)
    let user = users[0]
    expect(user._id).to.equal(userObject._id.toString())
    expect(user.password).beUndefined()
    expect(user.previousPasswords).beUndefined()
    expect(user.permissions).toExist()
    response = await request
      .get(`${baseUrl}/users`)
      .set('Authorization', 'Bearer ' + emailAccessToken)
    users = response.body.data
    expect(users.length).to.equal(1)
    user = users[0]
    expect(user._id).to.equal(userObject._id.toString())
    expect(user.password).beUndefined()
    expect(user.previousPasswords).beUndefined()
    expect(user.permissions).toExist()
    response = await request
      .get(`${baseUrl}/users`)
      .set('Authorization', 'Bearer ' + phoneAccessToken)
    users = response.body.data
    expect(users.length).to.equal(1)
    user = users[0]
    expect(user._id).to.equal(userObject._id.toString())
    expect(user.password).beUndefined()
    expect(user.previousPasswords).beUndefined()
    expect(user.permissions).toExist()
    // Should not list users in case of request without identified user
    try {
      response = await request
        .get(`${baseUrl}/users/${anotherUserObject._id}`)
        .set('Authorization', 'Bearer ' + statelessAccessToken)
    } catch (error) {
      // Not sure why but in this case the raised error is in text/html format
      expect(error.status).to.equal(500)
      expect(error.response.text.includes('MethodNotAllowed')).beTrue()
    }
    /*
    response = await request
      .get(`${baseUrl}/users`)
      .set('Authorization', 'Bearer ' + statelessAccessToken)
    users = response.body.data
    expect(users.length).to.equal(2)
    user = users[0]
    expect(user._id).to.equal(userObject._id.toString())
    expect(user.password).beUndefined()
    expect(user.previousPasswords).beUndefined()
    expect(user.permissions).beUndefined()
    user = users[1]
    expect(user._id).to.equal(anotherUserObject._id.toString())
    expect(user.password).beUndefined()
    expect(user.previousPasswords).beUndefined()
    expect(user.permissions).beUndefined()
    */
    // Should not get others users in case of requests with identified user
    try {
      response = await request
        .get(`${baseUrl}/users/${anotherUserObject._id}`)
        .set('Authorization', 'Bearer ' + userIdAccessToken)
    } catch (error) {
      // Not sure why but in this case the raised error is in text/html format
      expect(error.status).to.equal(500)
      expect(error.response.text.includes('MethodNotAllowed')).beTrue()
    }
    try {
      response = await request
        .get(`${baseUrl}/users/${anotherUserObject._id}`)
        .set('Authorization', 'Bearer ' + emailAccessToken)
    } catch (error) {
      // Not sure why but in this case the raised error is in text/html format
      expect(error.status).to.equal(500)
      expect(error.response.text.includes('MethodNotAllowed')).beTrue()
    }
    try {
      response = await request
        .get(`${baseUrl}/users/${anotherUserObject._id}`)
        .set('Authorization', 'Bearer ' + phoneAccessToken)
    } catch (error) {
      // Not sure why but in this case the raised error is in text/html format
      expect(error.status).to.equal(500)
      expect(error.response.text.includes('MethodNotAllowed')).beTrue()
    }
    try {
      response = await request
        .get(`${baseUrl}/users/${anotherUserObject._id}`)
        .set('Authorization', 'Bearer ' + statelessAccessToken)
    } catch (error) {
      // Not sure why but in this case the raised error is in text/html format
      expect(error.status).to.equal(500)
      expect(error.response.text.includes('MethodNotAllowed')).beTrue()
    }
  })

  it('checks for user information integrity', async () => {
    // Should not be able to update information of others users if not administrator
    try {
      await request
        .patch(`${baseUrl}/users/${anotherUserObject._id}`)
        .set('Authorization', 'Bearer ' + userIdAccessToken)
        .send({ name: 'new name' })
    } catch (error) {
      // Not sure why but in this case the raised error is in text/html format
      expect(error.status).to.equal(500)
      expect(error.response.text.includes('NotFound')).beTrue()
    }
    try {
      await request
        .patch(`${baseUrl}/users/${anotherUserObject._id}`)
        .set('Authorization', 'Bearer ' + emailAccessToken)
        .send({ name: 'new name' })
    } catch (error) {
      // Not sure why but in this case the raised error is in text/html format
      expect(error.status).to.equal(500)
      expect(error.response.text.includes('NotFound')).beTrue()
    }
    try {
      await request
        .patch(`${baseUrl}/users/${anotherUserObject._id}`)
        .set('Authorization', 'Bearer ' + phoneAccessToken)
        .send({ name: 'new name' })
    } catch (error) {
      // Not sure why but in this case the raised error is in text/html format
      expect(error.status).to.equal(500)
      expect(error.response.text.includes('NotFound')).beTrue()
    }
    try {
      await request
        .patch(`${baseUrl}/users/${anotherUserObject._id}`)
        .set('Authorization', 'Bearer ' + statelessAccessToken)
        .send({ name: 'new name' })
    } catch (error) {
      // Not sure why but in this case the raised error is in text/html format
      expect(error.status).to.equal(500)
      expect(error.response.text.includes('Forbidden')).beTrue()
    }
    // Should be possible otherwise
    const response = await request
      .patch(`${baseUrl}/users/${userObject._id}`)
      .set('Authorization', 'Bearer ' + adminAccessToken)
      .send({ name: 'new name' })
    const user = response.body
    expect(user.name).to.equal('new name')
  })

  it('checks for user privilege escalation', async () => {
    // Should not be able to upgrade user permissions when not administrator
    try {
      await request
        .patch(`${baseUrl}/users/${userObject._id}`)
        .set('Authorization', 'Bearer ' + userIdAccessToken)
        .send({ permissions: 'administrator' })
    } catch (error) {
      // Not sure why but in this case the raised error is in text/html format
      expect(error.status).to.equal(500)
      expect(error.response.text.includes('BadRequest')).beTrue()
    }
    try {
      await request
        .patch(`${baseUrl}/users/${userObject._id}`)
        .set('Authorization', 'Bearer ' + emailAccessToken)
        .send({ permissions: 'administrator' })
    } catch (error) {
      // Not sure why but in this case the raised error is in text/html format
      expect(error.status).to.equal(500)
      expect(error.response.text.includes('BadRequest')).beTrue()
    }
    try {
      await request
        .patch(`${baseUrl}/users/${userObject._id}`)
        .set('Authorization', 'Bearer ' + phoneAccessToken)
        .send({ permissions: 'administrator' })
    } catch (error) {
      // Not sure why but in this case the raised error is in text/html format
      expect(error.status).to.equal(500)
      expect(error.response.text.includes('BadRequest')).beTrue()
    }
    try {
      await request
        .patch(`${baseUrl}/users/${userObject._id}`)
        .set('Authorization', 'Bearer ' + statelessAccessToken)
        .send({ permissions: 'administrator' })
    } catch (error) {
      // Not sure why but in this case the raised error is in text/html format
      expect(error.status).to.equal(500)
      expect(error.response.text.includes('Forbidden')).beTrue()
    }
    // Should be possible otherwise
    const response = await request
      .patch(`${baseUrl}/users/${userObject._id}`)
      .set('Authorization', 'Bearer ' + adminAccessToken)
      .send({ permissions: 'manager' })
    const user = response.body
    expect(user.permissions).to.equal('manager')
  })

  it('checks users removal', async () => {
    // Should not be able to remove others users if not administrator
    try {
      await request
        .delete(`${baseUrl}/users/${anotherUserObject._id}`)
        .set('Authorization', 'Bearer ' + userIdAccessToken)
    } catch (error) {
      // Not sure why but in this case the raised error is in text/html format
      expect(error.status).to.equal(500)
      expect(error.response.text.includes('NotFound')).beTrue()
    }
    try {
      await request
        .delete(`${baseUrl}/users/${anotherUserObject._id}`)
        .set('Authorization', 'Bearer ' + emailAccessToken)
    } catch (error) {
      // Not sure why but in this case the raised error is in text/html format
      expect(error.status).to.equal(500)
      expect(error.response.text.includes('NotFound')).beTrue()
    }
    try {
      await request
        .delete(`${baseUrl}/users/${anotherUserObject._id}`)
        .set('Authorization', 'Bearer ' + phoneAccessToken)
    } catch (error) {
      // Not sure why but in this case the raised error is in text/html format
      expect(error.status).to.equal(500)
      expect(error.response.text.includes('NotFound')).beTrue()
    }
    try {
      await request
        .delete(`${baseUrl}/users/${anotherUserObject._id}`)
        .set('Authorization', 'Bearer ' + statelessAccessToken)
    } catch (error) {
      // Not sure why but in this case the raised error is in text/html format
      expect(error.status).to.equal(500)
      expect(error.response.text.includes('Forbidden')).beTrue()
    }
    await userService.remove(userObject._id)
    await userService.remove(anotherUserObject._id)
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
