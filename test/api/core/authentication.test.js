import authentication from '@feathersjs/authentication'
import request from 'superagent'
import chai from 'chai'
import chailint from 'chai-lint'
import core, { kdk } from '../../../core/api/index.js'

const { authenticate } = authentication.hooks
const { util, expect } = chai

describe('core:authentication', () => {
  let app, server, port, baseUrl, userIdAccessToken, emailAccessToken, phoneAccessToken, statelessAccessToken,
    userService, userObject, authenticationService

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
    // Register hooks
    userService.hooks({
      before: { all: authenticate('jwt') }
    })
    // Now app is configured launch the server
    server = await app.listen(port)
    await new Promise(resolve => server.once('listening', resolve))
  })
  // Let enough time to process
    .timeout(10000)

  it('unauthenticated user cannot access services', async () => {
    try {
      await request.get(`${baseUrl}/users`)
    } catch (error) {
      // Not sure why but in this case the raised error is in text/html format
      expect(error.status).to.equal(500)
      expect(error.response.text.includes('NotAuthenticated')).beTrue()
    }
  })

  it('creates user tokens with different subject identifiers', async () => {
    userObject = await userService.create({
      email: 'test@test.org',
      name: 'test user',
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
  })

  it('checks all user tokens can be used to access services in header', async () => {
    let response = await request
      .get(`${baseUrl}/users`)
      .set('Authorization', 'Bearer ' + userIdAccessToken)
    let users = response.body.data
    expect(users).toExist()
    expect(users[0]._id).to.equal(userObject._id.toString())
    response = await request
      .get(`${baseUrl}/users`)
      .set('Authorization', 'Bearer ' + emailAccessToken)
    users = response.body.data
    expect(users).toExist()
    expect(users[0]._id).to.equal(userObject._id.toString())
    response = await request
      .get(`${baseUrl}/users`)
      .set('Authorization', 'Bearer ' + phoneAccessToken)
    users = response.body.data
    expect(users).toExist()
    expect(users[0]._id).to.equal(userObject._id.toString())
  })

  it('checks all user tokens can be used to access services in query', async () => {
    let response = await request
      .get(`${baseUrl}/users`)
      .query({ jwt: userIdAccessToken })
    let users = response.body.data
    expect(users).toExist()
    expect(users[0]._id).to.equal(userObject._id.toString())
    response = await request
      .get(`${baseUrl}/users`)
      .query({ jwt: emailAccessToken })
    users = response.body.data
    expect(users).toExist()
    expect(users[0]._id).to.equal(userObject._id.toString())
    response = await request
      .get(`${baseUrl}/users`)
      .query({ jwt: phoneAccessToken })
    users = response.body.data
    expect(users).toExist()
    expect(users[0]._id).to.equal(userObject._id.toString())
  })

  it('creates a stateless token with a custom payload', async () => {
    statelessAccessToken = await authenticationService.createAccessToken({
      property: 'mycustomproperty'
    }, {
      subject: 'mycustomapp'
    })
  })

  it('checks stateless token is recognized', async () => {
    const response = await request
      .post(`${baseUrl}/authentication`)
      .send({ accessToken: statelessAccessToken, strategy: 'jwt' })
    const accessToken = response.body.accessToken
    const user = response.body.user
    expect(accessToken).toExist()
    expect(accessToken).not.to.equal(statelessAccessToken)
    expect(user).beUndefined()
    const payload = await authenticationService.verifyAccessToken(accessToken, app.get('authentication').jwtOptions)
    expect(payload.property).to.equal('mycustomproperty')
  })

  it('checks stateless token can be used to access services in header', async () => {
    const response = await request
      .get(`${baseUrl}/users`)
      .set('Authorization', 'Bearer ' + statelessAccessToken)
    const users = response.body.data
    expect(users).toExist()
    expect(users[0]._id).to.equal(userObject._id.toString())
  })

  it('checks stateless token can be used to access services in query', async () => {
    const response = await request
      .get(`${baseUrl}/users`)
      .query({ jwt: statelessAccessToken })
    const users = response.body.data
    expect(users).toExist()
    expect(users[0]._id).to.equal(userObject._id.toString())
  })

  // Cleanup
  after(async () => {
    if (server) await server.close()
    await app.db.instance.dropDatabase()
    await app.db.disconnect()
  })
})
