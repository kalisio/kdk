import path, { dirname } from 'path'
import logger from 'winston'
import fs from 'fs-extra'
import request from 'superagent'
import chai from 'chai'
import chailint from 'chai-lint'
import local from '@feathersjs/authentication-local'
import core, { kalisio, hooks, permissions, createTagService } from '../../../core/api/index.js'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const { hashPassword } = local.hooks
const { util, expect } = chai

describe('core:services', () => {
  let app, server, port, baseUrl, accessToken,
    userService, userObject, authorisationService, tagService, tagObject

  before(async () => {
    chailint(chai, util)

    // Register default rules for all users
    permissions.defineAbilities.registerHook(permissions.defineUserAbilities)

    app = kalisio()
    // Register perspective hook
    app.hooks({
      before: { all: hooks.authorise },
      after: { all: hooks.processPerspectives },
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
    // Register tag hooks
    userService.hooks({
      after: { create: hooks.updateTags, remove: hooks.updateTags }
    })
    // Create a global tag service for tests
    await createTagService.call(app)
    tagService = app.getService('tags')
    expect(tagService).toExist()
    authorisationService = app.getService('authorisations')
    expect(authorisationService).toExist()
    // Register escalation hooks
    authorisationService.hooks({
      before: { create: hooks.preventEscalation, remove: hooks.preventEscalation }
    })
    // Now app is configured launch the server
    server = app.listen(port)
    await new Promise(resolve => server.once('listening', () => resolve()))
  })
  // Let enough time to process
    .timeout(10000)

  it('register webhooks', () => {
    app.createWebhook('webhook', { filter: { service: { $in: ['users'] }, operation: 'get' } })
  })

  it('unauthorized user cannot access webhooks', (done) => {
    request
      .post(`${baseUrl}/webhooks/webhook`)
      .set('Content-Type', 'application/json')
      .send({ accessToken: 'xxx', service: 'authorisations' })
      .catch(data => {
        const error = data.response.body
        expect(error).toExist()
        expect(error.name).to.equal('Forbidden')
        done()
      })
  })
  // Let enough time to process
    .timeout(5000)

  it('unauthenticated user cannot access services', (done) => {
    tagService.create({}, { checkAuthorisation: true })
      .catch(error => {
        expect(error).toExist()
        expect(error.name).to.equal('Forbidden')
        done()
      })
  })
  // Let enough time to process
    .timeout(5000)

  it('cannot create a user with a weak password', (done) => {
    // Fake password hashing on a user to get a hashed password
    hashPassword()({ type: 'before', data: { password: 'weak;' }, params: {}, app })
      .then(hook => {
        userService.create({
          email: 'test@test.org',
          password: 'weak;',
          previousPasswords: [hook.data.password],
          name: 'test-user'
        })
          .catch(error => {
            expect(error).toExist()
            expect(error.name).to.equal('BadRequest')
            expect(error.data.translation.params.failedRules).to.deep.equal(['min', 'uppercase', 'digits', 'previous'])
            userService.create({
              email: 'test@test.org',
              password: '12345678',
              name: 'test-user'
            })
              .catch(error => {
                expect(error).toExist()
                expect(error.name).to.equal('BadRequest')
                expect(error.data.translation.params.failedRules).to.deep.equal(['uppercase', 'lowercase', 'symbols', 'oneOf'])
                done()
              })
          })
      })
  })
  // Let enough time to process
    .timeout(20000)

  it('creates a user', () => {
    // Test password generation
    const hook = hooks.generatePassword()({ type: 'before', data: {}, params: {}, app })
    return userService.create({
      email: 'test@test.org',
      password: hook.data.password,
      name: 'test-user',
      tags: [{
        scope: 'skills',
        value: 'developer'
      }],
      profile: { phone: '0623256968' }
    }, { checkAuthorisation: true })
      .then(user => {
        userObject = user
        // Keep track of clear password
        userObject.clearPassword = hook.data.password
        return userService.find({ query: { 'profile.name': 'test-user' } })
      })
      .then(users => {
        expect(users.data.length > 0).beTrue()
        // By default no perspective
        expect(users.data[0].name).toExist()
        expect(users.data[0].description).toExist()
        expect(users.data[0].email).toExist()
        expect(users.data[0].clearPassword).beUndefined()
        expect(users.data[0].profile).beUndefined()
        return tagService.find({ query: { value: 'developer' } })
      })
      .then(tags => {
        expect(tags.data.length > 0).beTrue()
        expect(tags.data[0].value).to.equal('developer')
        expect(tags.data[0].scope).to.equal('skills')
      })
  })
  // Let enough time to process
    .timeout(10000)

  it('changing user password keeps password history', () => {
    return userService.patch(userObject._id.toString(), { password: userObject.password })
      .then(() => {
        return userService.get(userObject._id.toString())
      })
      .then(user => {
        expect(user.previousPasswords).toExist()
        expect(user.previousPasswords).to.deep.equal([userObject.password])
      })
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
      .send({ accessToken, service: 'authorisations' })
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
      .send({ accessToken, service: 'users', operation: 'create' })
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
      .send({ accessToken, service: 'users', id: userObject._id, operation: 'get' })
      .then(response => {
        const user = response.body
        expect(user._id.toString() === userObject._id.toString()).beTrue()
      })
  })
  // Let enough time to process
    .timeout(5000)

  it('authenticated user can access service operation through webhooks and headers', () => {
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

  it('get a user perspective', () => {
    return userService.find({ query: { $select: ['profile'] } })
      .then(users => {
        expect(users.data[0].profile.name).toExist()
        expect(users.data[0].profile.description).toExist()
        expect(users.data[0].profile.phone).toExist()
      })
  })

  it('creates a user tag', () => {
    return tagService.create({
      name: 'Manager',
      scope: 'skills',
      value: 'manager'
    }, {
      query: {
        resource: userObject._id.toString(),
        resourcesService: 'users'
      }
    })
      .then(tag => {
        tagObject = tag
        expect(tag).toExist()
        expect(tag.count).to.equal(1)
        return tagService.find({ query: { value: 'manager' } })
      })
      .then(tags => {
        expect(tags.data.length > 0).beTrue()
        expect(tags.data[0].scope).to.equal('skills')
        return userService.find({ query: { 'profile.name': 'test-user' } })
      })
      .then(users => {
        expect(users.data.length > 0).beTrue()
        userObject = users.data[0]
        expect(userObject.tags).toExist()
        expect(userObject.tags.length === 2).beTrue()
        expect(userObject.tags[1]._id).toExist()
      })
  })
  // Let enough time to process
    .timeout(5000)

  it('creates an authorisation', () => {
    return authorisationService.create({
      scope: 'authorisations',
      permissions: 'manager',
      subjects: userObject._id.toString(),
      subjectsService: 'users',
      resource: tagObject._id.toString(),
      resourcesService: 'tags'
    }, {
      user: userObject
    })
      .then(authorisation => {
        expect(authorisation).toExist()
        return userService.get(userObject._id.toString())
      })
      .then(user => {
        userObject = user
        expect(user.authorisations).toExist()
        expect(user.authorisations.length > 0).beTrue()
        expect(user.authorisations[0].permissions).to.deep.equal('manager')
      })
  })
  // Let enough time to process
    .timeout(5000)

  it('cannot escalate an authorisation when creating', (done) => {
    authorisationService.create({
      scope: 'authorisations',
      permissions: 'owner',
      subjects: userObject._id.toString(),
      subjectsService: 'users',
      resource: tagObject._id.toString(),
      resourcesService: 'tags'
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
    authorisationService.remove(tagObject._id, {
      query: {
        scope: 'authorisations',
        subjects: userObject._id.toString(),
        subjectsService: 'users',
        resourcesService: 'tags'
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

  it('removes an authorisation', () => {
    return authorisationService.remove(tagObject._id, {
      query: {
        scope: 'authorisations',
        subjects: userObject._id.toString(),
        subjectsService: 'users',
        resourcesService: 'tags'
      },
      user: userObject,
      checkEscalation: true
    })
      .then(authorisation => {
        expect(authorisation).toExist()
        return userService.get(userObject._id.toString())
      })
      .then(user => {
        expect(user.authorisations).toExist()
        expect(user.authorisations.length === 0).beTrue()
      })
  })
  // Let enough time to process
    .timeout(5000)

  it('creates an authorisation by name', () => {
    return authorisationService.create({
      scope: 'authorisations',
      permissions: 'manager',
      subjects: userObject._id.toString(),
      subjectsService: 'users',
      resource: tagObject.name.toString(),
      resourcesService: 'tags'
    }, {
      user: userObject
    })
      .then(authorisation => {
        expect(authorisation).toExist()
        return userService.get(userObject._id.toString())
      })
      .then(user => {
        userObject = user
        expect(user.authorisations).toExist()
        expect(user.authorisations.length > 0).beTrue()
        expect(user.authorisations[0].permissions).to.deep.equal('manager')
      })
  })
  // Let enough time to process
    .timeout(5000)

  it('removes an authorisation by name', () => {
    return authorisationService.remove(tagObject.name, {
      query: {
        scope: 'authorisations',
        subjects: userObject._id.toString(),
        subjectsService: 'users',
        resourcesService: 'tags'
      },
      user: userObject,
      checkEscalation: true
    })
      .then(authorisation => {
        expect(authorisation).toExist()
        return userService.get(userObject._id.toString())
      })
      .then(user => {
        expect(user.authorisations).toExist()
        expect(user.authorisations.length === 0).beTrue()
      })
  })
  // Let enough time to process
    .timeout(5000)

  it('removes a user tag', () => {
    return tagService.remove(userObject._id, {
      query: {
        scope: 'skills',
        value: 'manager',
        resourcesService: 'users'
      }
    })
      .then(tag => {
        expect(tag).toExist()
        return tagService.find({ query: { value: 'manager' } })
      })
      .then(tags => {
        expect(tags.data.length === 0).beTrue()
        return tagService.find({ query: { value: 'developer' } })
      })
      .then(tags => {
        expect(tags.data.length === 1).beTrue()
        return userService.find({ query: { 'profile.name': 'test-user' } })
      })
      .then(users => {
        expect(users.data.length > 0).beTrue()
        expect(users.data[0].tags.length === 1).beTrue()
      })
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

  it('removes a user', () => {
    return userService.remove(userObject._id, {
      user: userObject,
      checkAuthorisation: true
    })
      .then(user => {
        return userService.find({ query: { name: 'test-user' } })
      })
      .then(users => {
        expect(users.data.length === 0).beTrue()
        return tagService.find({ query: { value: 'developer' } })
      })
      .then(tags => {
        expect(tags.data.length === 0).beTrue()
      })
  })
  // Let enough time to process
    .timeout(5000)

  it('registers the log options', (done) => {
    // Inserted manually
    const log = 'This is a log test'
    // Raised by Forbidden error in hooks
    const hookLog = 'You are not allowed to access service'
    const now = new Date()
    logger.info(log)
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
