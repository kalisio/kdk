/* eslint-disable no-unused-expressions */
import path, { dirname } from 'path'
import assert from 'assert'
import fs from 'fs-extra'
import request from 'superagent'
import chai from 'chai'
import chailint from 'chai-lint'
import spies from 'chai-spies'
import core, { kdk, hooks, permissions, createMessagesService } from '../../../core/api/index.js'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const { util, expect } = chai

describe('core:services', () => {
  let app, server, port, baseUrl, accessToken,
    userService, userObject, authorisationService, messagesService, messageObject,
    spyUpdateAbilities

  before(async () => {
    chailint(chai, util)
    chai.use(spies)

    // Register default rules for all users
    permissions.defineAbilities.registerHook(permissions.defineUserAbilities)

    app = kdk()
    // Register hooks
    app.hooks({
      before: { all: hooks.authorise },
      error: { all: hooks.log }
    })
    port = app.get('port')
    baseUrl = `http://localhost:${port}${app.get('apiPath')}`
    await app.db.connect()
    await app.db.instance.dropDatabase()
  })

  it('is ES module compatible', () => {
    expect(typeof core).to.equal('function')
  })

  it('registers the services', async () => {
    await app.configure(core)

    userService = app.getService('users')
    expect(userService).toExist()
    // Create a global messages service for tests
    await createMessagesService.call(app)
    messagesService = app.getService('messages')
    expect(messagesService).toExist()
    authorisationService = app.getService('authorisations')
    expect(authorisationService).toExist()
    // Register escalation hooks
    authorisationService.hooks({
      before: { create: hooks.preventEscalation, remove: hooks.preventEscalation }
    })
    spyUpdateAbilities = chai.spy.on(authorisationService, 'updateAbilities')
    // Now app is configured launch the server
    server = await app.listen(port)
    await new Promise(resolve => server.once('listening', () => resolve()))
  })
  // Let enough time to process
    .timeout(10000)

  it('application healthcheck', async () => {
    const response = await request.get(`http://localhost:${port}/healthcheck`)
    expect(response.body).to.deep.equal({ isRunning: true, isDatabaseRunning: true })
  })
  // Let enough time to process
    .timeout(5000)

  it('register webhooks', () => {
    app.createWebhook('webhook', { filter: { service: { $in: ['users'] }, operation: 'get' } })
  })

  it('unauthorized user cannot access webhooks', (done) => {
    request
      .post(`${baseUrl}/webhooks/webhook`)
      .set('Content-Type', 'application/json')
      .send({ service: 'authorisations' })
      .catch(data => {
        /* FIXME: Not sure why but in this case the raised error is in text format
        const error = data.response.body
        expect(error).toExist()
        expect(error.name).to.equal('NotAuthenticated')
        */
        expect(data.status).to.equal(500)
        done()
      })
  })
  // Let enough time to process
    .timeout(5000)

  it('unauthenticated user cannot access services', (done) => {
    messagesService.create({}, { checkAuthorisation: true })
      .catch(error => {
        expect(error).toExist()
        expect(error.name).to.equal('Forbidden')
        done()
      })
  })
  // Let enough time to process
    .timeout(5000)

  it('cannot create a user with a weak password', async () => {
    const [localStrategy] = app.service('api/authentication').getStrategies('local')
    const previousPassword = await localStrategy.hashPassword('weak;')

    await assert.rejects(() => userService.create({
      email: 'test@test.org',
      password: 'weak;',
      previousPasswords: [previousPassword],
      name: 'test-user'
    }), error => {
      expect(error).toExist()
      expect(error.name).to.equal('BadRequest')
      expect(error.data.translation.params.failedRules).to.deep.equal(['min', 'uppercase', 'digits', 'previous'])
      return true
    })

    await assert.rejects(() => userService.create({
      email: 'test@test.org',
      password: '12345678',
      name: 'test-user'
    }), error => {
      expect(error).toExist()
      expect(error.name).to.equal('BadRequest')
      expect(error.data.translation.params.failedRules).to.deep.equal(['uppercase', 'lowercase', 'symbols', 'oneOf'])
      return true
    })
  })
  // Let enough time to process
    .timeout(20000)

  it('creates a user', async () => {
    // Test password generation
    const hook = hooks.generatePassword()({ type: 'before', data: {}, params: {}, app })
    userObject = await userService.create({
      email: 'test@test.org',
      password: hook.data.password,
      name: 'test-user',
      profile: { phone: '0623256968' }
    }, { checkAuthorisation: true })
    expect(spyUpdateAbilities).to.have.been.called.once
    spyUpdateAbilities.reset()
    // Keep track of clear password
    userObject.clearPassword = hook.data.password
    const users = await userService.find({ query: { 'profile.name': 'test-user' } })
    expect(users.data.length > 0).beTrue()
    expect(users.data[0].email).toExist()
    expect(users.data[0].clearPassword).beUndefined()
    expect(users.data[0].profile).toExist()
    expect(users.data[0].profile.name).toExist()
    expect(users.data[0].profile.description).toExist()
  })
  // Let enough time to process
    .timeout(10000)

  it('changing user password keeps password history', async () => {
    await userService.patch(userObject._id.toString(), { password: userObject.password })
    expect(spyUpdateAbilities).to.have.been.called.once
    spyUpdateAbilities.reset()
    const user = await userService.get(userObject._id.toString())
    expect(user.previousPasswords).toExist()
    expect(user.previousPasswords).to.deep.equal([userObject.password])
  })

  it('authenticates a user', () => {
    return request
      .post(`${baseUrl}/authentication`)
      .send({ email: 'test@test.org', password: userObject.clearPassword, strategy: 'local' })
      .then(response => {
        accessToken = response.body.accessToken
        expect(accessToken).toExist()
      })
  })
  // Let enough time to process
    .timeout(10000)

  it('unauthorized service cannot be accessed through webhooks', (done) => {
    request
      .post(`${baseUrl}/webhooks/webhook`)
      .set('Content-Type', 'application/json')
      .send({ service: 'authorisations' })
      .set('Authorization', 'Bearer ' + accessToken)
      .catch(data => {
        const error = data.response.body
        expect(error).toExist()
        expect(error.name).to.equal('Forbidden')
        done()
      })
  })
  // Let enough time to process
    .timeout(5000)

  it('unauthorized service operation cannot be accessed through webhooks', (done) => {
    request
      .post(`${baseUrl}/webhooks/webhook`)
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({ service: 'users', operation: 'create' })
      .catch(data => {
        const error = data.response.body
        expect(error).toExist()
        expect(error.name).to.equal('Forbidden')
        done()
      })
  })
  // Let enough time to process
    .timeout(5000)

  it('authenticated user can access service operation through webhooks', () => {
    return request
      .post(`${baseUrl}/webhooks/webhook`)
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + accessToken)
      .send({ service: 'users', id: userObject._id, operation: 'get' })
      .then(response => {
        const user = response.body
        expect(user._id.toString() === userObject._id.toString()).beTrue()
      })
  })
  // Let enough time to process
    .timeout(5000)

  it('authenticated user can access services', () => {
    return userService.find({ query: {}, params: { user: userObject, checkAuthorisation: true } })
      .then(users => {
        expect(users.data.length === 1).beTrue()
      })
  })

  it('get user profile', () => {
    return userService.find({ query: { $select: ['profile'] } })
      .then(users => {
        expect(users.data[0].name).beUndefined()
        expect(users.data[0].profile.name).toExist()
        expect(users.data[0].profile.description).toExist()
        expect(users.data[0].profile.phone).toExist()
      })
  })

  it('creates a user message', async () => {
    const message = await messagesService.create({
      title: 'Title',
      body: 'Body',
      author: 'manager'
    })
    messageObject = message
    expect(messageObject).toExist()
    const messages = await messagesService.find({ query: { title: 'Title' } })
    expect(messages.data.length > 0).beTrue()
    expect(messages.data[0].title).to.equal('Title')
  })
  // Let enough time to process
    .timeout(5000)

  it('creates an authorisation', async () => {
    const authorisation = await authorisationService.create({
      scope: 'authorisations',
      permissions: 'manager',
      subjects: userObject._id.toString(),
      subjectsService: 'users',
      resource: messageObject._id.toString(),
      resourcesService: 'messages'
    }, {
      user: userObject
    })
    expect(authorisation).toExist()
    expect(spyUpdateAbilities).to.have.been.called.once
    spyUpdateAbilities.reset()
    userObject = await userService.get(userObject._id.toString())
    expect(userObject.authorisations).toExist()
    expect(userObject.authorisations.length > 0).beTrue()
    expect(userObject.authorisations[0].permissions).to.deep.equal('manager')
  })
  // Let enough time to process
    .timeout(5000)

  it('cannot escalate an authorisation when creating', (done) => {
    authorisationService.create({
      scope: 'authorisations',
      permissions: 'owner',
      subjects: userObject._id.toString(),
      subjectsService: 'users',
      resource: messageObject._id.toString(),
      resourcesService: 'messages'
    }, {
      user: userObject,
      checkEscalation: true
    })
      .catch(error => {
        expect(error).toExist()
        expect(error.name).to.equal('Forbidden')
        done()
      })
  })

  it('cannot escalate an authorisation when removing', (done) => {
    // Fake lower permission level
    userObject.authorisations[0].permissions = 'member'
    authorisationService.remove(messageObject._id, {
      query: {
        scope: 'authorisations',
        subjects: userObject._id.toString(),
        subjectsService: 'users',
        resourcesService: 'messages'
      },
      user: userObject,
      checkEscalation: true
    })
      .catch(error => {
        expect(error).toExist()
        expect(error.name).to.equal('Forbidden')
        // Restore permission level
        userObject.authorisations[0].permissions = 'manager'
        done()
      })
  })

  it('removes an authorisation', async () => {
    const authorisation = await authorisationService.remove(messageObject._id, {
      query: {
        scope: 'authorisations',
        subjects: userObject._id.toString(),
        subjectsService: 'users',
        resourcesService: 'messages'
      },
      user: userObject,
      checkEscalation: true
    })
    expect(authorisation).toExist()
    expect(spyUpdateAbilities).to.have.been.called.once
    spyUpdateAbilities.reset()
    const user = await userService.get(userObject._id.toString())
    expect(user.authorisations).toExist()
    expect(user.authorisations.length === 0).beTrue()
  })
  // Let enough time to process
    .timeout(5000)

  it('removes a user message', async () => {
    const message = await messagesService.remove(messageObject._id.toString())
    expect(message).toExist()
    const messages = await messagesService.find({})
    expect(messages.data.length === 0).beTrue()
  })
  // Let enough time to process
    .timeout(5000)

  it('unauthenticates a user', () => {
    return request
      .del(`${baseUrl}/authentication`)
      .set('Content-Type', 'application/json')
      .set('Authorization', accessToken)
      .then(response => {
        expect(response.status).to.equal(200)
      })
  })

  it('removes a user', async () => {
    await userService.remove(userObject._id, {
      user: userObject,
      checkAuthorisation: true
    })
    const users = await userService.find({ query: { name: 'test-user' } })
    expect(users.data.length === 0).beTrue()
    const messages = await messagesService.find({ query: { title: 'Title' } })
    expect(messages.data.length === 0).beTrue()
  })
  // Let enough time to process
    .timeout(5000)

  it('registers the log options', (done) => {
    // Inserted manually
    const log = 'This is a log test'
    // Raised by Forbidden error in hooks
    const hookLog = 'You are not allowed to access service'
    const now = new Date()
    app.logger.info(log)
    // FIXME: need to let some time to proceed with log file
    // Didn't find a better way since fs.watch() does not seem to work...
    setTimeout(() => {
      const logFilePath = path.join(__dirname, 'test-log-' + now.toISOString().slice(0, 10) + '.log')
      fs.readFile(logFilePath, 'utf8', (err, content) => {
        expect(err).beNull()
        expect(content.includes(log)).to.equal(true)
        expect(content.includes(hookLog)).to.equal(true)
        done()
      })
    }, 2500)
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
