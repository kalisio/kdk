import _ from 'lodash'
import { iff, when } from 'feathers-hooks-common'
import request from 'superagent'
import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import core, { kalisio, hooks } from '../../core/api'
import { permissions } from '../../core/common'
import { createGmailClient } from './utils'

describe('core:account', () => {
  let app, server, port, baseUrl, token,
    userService, authenticationService, mailerService, accountService, gmailClient, gmailUser, userObject

  before(() => {
    chailint(chai, util)

    // Register all default hooks for authorisation
    // Default rules for all users
    permissions.defineAbilities.registerHook(permissions.defineUserAbilities)
    // Then rules for notifications
    permissions.defineAbilities.registerHook(permissions.defineUserAbilities)

    app = kalisio()
    // Register authorisation/log hook
    app.hooks({
      before: { all: [hooks.authorise] },
      error: { all: hooks.log }
    })
    port = app.get('port')
    baseUrl = `http://localhost:${port}${app.get('apiPath')}`
    return app.db.connect()
  })

  it('is ES6 compatible', () => {
    expect(typeof core).to.equal('function')
  })

  it('registers the services', (done) => {
    app.configure(core)
    userService = app.getService('users')
    expect(userService).toExist()
    userService.hooks({
      before: {
        create: [
          // Used for invitation
          when(hook => hook.data.sponsor,
            hooks.setExpireAfter(60), // A couple of seconds
            hooks.generatePassword,
            // Keep track of clear password before hashing for testing purpose
            hooks.serialize([{ source: 'password', target: 'clearPassword' }]),
            hooks.sendInvitationEmail,
            hooks.hashPassword()),
          hooks.addVerification
        ],
        remove: [hooks.unregisterDevices]
      },
      after: {
        create: [
          // Invited users will be automatically verified upon first login
          iff(hook => !hook.result.sponsor, hooks.sendVerificationEmail),
          hooks.removeVerification
        ]
      }
    })
    authenticationService = app.getService('authentication')
    expect(authenticationService).toExist()
    authenticationService.hooks({
      before: {
        create: [],
        remove: []
      },
      after: {
        // Used for invitation to automatically verify invited users on first login
        create: [hooks.verifyGuest, hooks.consentGuest]
      }
    })
    mailerService = app.getService('mailer')
    expect(mailerService).toExist()
    accountService = app.getService('account')
    expect(accountService).toExist()
    // Now app is configured launch the server
    server = app.listen(port)
    server.once('listening', _ => done())
  })
  // Let enough time to process
    .timeout(5000)

  it('setup access to gmail', async () => {
    const gmailApiConfig = app.get('gmailApi')
    gmailUser = gmailApiConfig.user
    gmailClient = await createGmailClient(gmailApiConfig)
  })
  // Let enough time to process
    .timeout(5000)

  it('invites a user', () => {
    return userService.create({
      email: gmailUser,
      name: 'test-user',
      sponsor: { name: 'sponsor' }
    })
      .then(user => {
        userObject = user
        expect(userObject.password).toExist()
        expect(userObject.expireAt).toExist()
        expect(userObject.expireAt instanceof Date).beTrue()
        expect(userObject.isVerified).toExist()
        expect(userObject.isVerified).beFalse()
        expect(userObject.verifyToken).toExist()
        expect(userObject.consentTerms).beUndefined()
      })
  })
  // Let enough time to process
    .timeout(10000)

  it('check invitation email', (done) => {
    // Add some delay to wait for email reception
    setTimeout(() => {
      gmailClient.checkEmail(userObject, mailerService.options.auth.user, 'Welcome', done)
    }, 10000)
  })
  // Let enough time to process
    .timeout(15000)

  it('authenticates an invited user', async () => {
    const response = await request
      .post(`${baseUrl}/authentication`)
      .send({ email: userObject.email, password: userObject.clearPassword, strategy: 'local' })
    expect(response.body.accessToken).toExist()
    userObject = await userService.get(userObject._id.toString())
    expect(userObject.consentTerms).toExist()
    expect(userObject.consentTerms).beTrue()
    expect(userObject.isVerified).beTrue()
    expect(userObject.expireAt).to.equal(null)
  })

  it('removes invited user', () => {
    return userService.remove(userObject._id.toString(), { user: userObject })
  })
  // Let enough time to process
    .timeout(5000)

  it('creates a user', () => {
    return userService.create({
      email: gmailUser,
      password: 'Pass;word1',
      name: 'test-user'
    })
      .then(user => {
        userObject = user
        expect(userObject.isVerified).toExist()
        expect(userObject.isVerified).beFalse()
        expect(userObject.verifyToken).toExist()
        expect(userObject.consentTerms).beUndefined()
      })
  })
  // Let enough time to process
    .timeout(10000)

  it('check signup verification email', (done) => {
    // Add some delay to wait for email reception
    setTimeout(() => {
      gmailClient.checkEmail(userObject, mailerService.options.auth.user, 'Confirm your signup', done)
    }, 10000)
  })
  // Let enough time to process
    .timeout(15000)

  it('verify user signup', () => {
    return accountService.create({
      action: 'verifySignupLong',
      value: userObject.verifyToken
    })
      .then(user => {
        userObject = user
        expect(userObject.isVerified).beTrue()
      })
  })
  // Let enough time to process
    .timeout(5000)

  it('check signup verified email', (done) => {
    // Add some delay to wait for email reception
    setTimeout(() => {
      gmailClient.checkEmail(userObject, mailerService.options.auth.user, 'Thank you, your email has been verified', done)
    }, 10000)
  })
  // Let enough time to process
    .timeout(15000)

  it('ask password reset for a user', () => {
    return accountService.create({
      action: 'sendResetPwd',
      value: { email: userObject.email }
    })
      .then(user => {
      // Because the account service filters for client hidden security attributes we need to fetch the user manually
        return userService.find({ query: { email: gmailUser } })
      })
      .then(users => {
        expect(users.data.length > 0).beTrue()
        userObject = users.data[0]
        expect(userObject.resetToken).toExist()
      })
  })
  // Let enough time to process
    .timeout(5000)

  it('check reset password request email', (done) => {
    // Add some delay to wait for email reception
    setTimeout(() => {
      gmailClient.checkEmail(userObject, mailerService.options.auth.user, 'Reset your password', (err, message) => {
        if (_.isNil(err)) {
          // Extract token from email
          message = Buffer.from(message.body.data, 'base64').toString()
          const tokenEntry = 'reset-password/' // Then come the token in the link
          const firstTokenIndex = message.indexOf(tokenEntry) + tokenEntry.length
          const lastTokenIndex = message.indexOf('"', firstTokenIndex)
          // Token is the last part of the URL in the <a href="xxx/reset-password/token"> tag
          token = message.substring(firstTokenIndex, lastTokenIndex)
          done()
        } else {
          done(err)
        }
      })
    }, 20000)
  })
  // Let enough time to process
    .timeout(25000)

  it('check password policy on user password reset', (done) => {
    accountService.create({
      action: 'resetPwdLong',
      value: {
        token,
        password: '1234'
      }
    })
      .catch(error => {
        expect(error).toExist()
        expect(error.name).to.equal('BadRequest')
        expect(error.data.translation.params.failedRules.length > 0).beTrue()
        done()
      })
  })

  it('reset user password', () => {
    return accountService.create({
      action: 'resetPwdLong',
      value: {
        token,
        password: 'Pass;word2'
      }
    })
      .then(user => {
      // Because the account service filters for client hidden security attributes we need to fetch the user manually
        return userService.find({ query: { email: gmailUser } })
      })
      .then(users => {
        expect(users.data.length > 0).beTrue()
        userObject = users.data[0]
        expect(userObject.resetToken).beNull()
      })
  })
  // Let enough time to process
    .timeout(5000)

  it('check reset password email', (done) => {
    // Add some delay to wait for email reception
    setTimeout(() => {
      gmailClient.checkEmail(userObject, mailerService.options.auth.user, 'Your password was reset', done)
    }, 10000)
  })
  // Let enough time to process
    .timeout(15000)

  it('authenticates a user with reset password', () => {
    return request
      .post(`${baseUrl}/authentication`)
      .send({ email: userObject.email, password: 'Pass;word2', strategy: 'local' })
      .then(response => {
        expect(response.body.accessToken).toExist()
      })
  })

  it('check password policy on user password change', (done) => {
    accountService.create({
      action: 'passwordChange',
      value: {
        user: { email: userObject.email },
        oldPassword: 'Pass;word2',
        password: '1234'
      }
    })
      .catch(error => {
        expect(error).toExist()
        expect(error.name).to.equal('BadRequest')
        expect(error.data.translation.params.failedRules.length > 0).beTrue()
        done()
      })
  })

  it('change user password', () => {
    return accountService.create({
      action: 'passwordChange',
      value: {
        user: { email: userObject.email },
        oldPassword: 'Pass;word2',
        password: 'Pass;word1'
      }
    })
      .then(user => {
      // Because the account service filters for client hidden security attributes we need to fetch the user manually
        return userService.find({ query: { email: gmailUser } })
      })
      .then(users => {
        expect(users.data.length > 0).beTrue()
        userObject = users.data[0]
        expect(userObject.resetToken).beNull()
      })
  })
  // Let enough time to process
    .timeout(5000)

  it('check changed password email', (done) => {
    // Add some delay to wait for email reception
    setTimeout(() => {
      gmailClient.checkEmail(userObject, mailerService.options.auth.user, 'Your password was changed', done)
    }, 10000)
  })
  // Let enough time to process
    .timeout(15000)

  it('authenticates a user with changed password', () => {
    return request
      .post(`${baseUrl}/authentication`)
      .send({ email: userObject.email, password: 'Pass;word1', strategy: 'local' })
      .then(response => {
        expect(response.body.accessToken).toExist()
      })
  })

  it('ask user identity change', () => {
    return accountService.create({
      action: 'identityChange',
      value: {
        user: { email: userObject.email },
        password: 'Pass;word1',
        changes: { email: gmailUser.replace('com', 'xyz') }
      }
    })
      .then(user => {
      // Because the account service filters for client hidden security attributes we need to fetch the user manually
        return userService.find({ query: { email: gmailUser } })
      })
      .then(users => {
        expect(users.data.length > 0).beTrue()
        userObject = users.data[0]
        expect(userObject.verifyToken).toExist()
        expect(userObject.verifyChanges).toExist()
        expect(userObject.verifyChanges.email).toExist()
      })
  })
  // Let enough time to process
    .timeout(5000)

  it('check identity change email', (done) => {
    // Add some delay to wait for email reception
    setTimeout(() => {
      gmailClient.checkEmail(userObject, mailerService.options.auth.user, 'Your account information was changed', done)
    }, 15000)
  })
  // Let enough time to process
    .timeout(20000)

  it('verify user changes', () => {
    return accountService.create({
      action: 'verifySignupLong',
      value: userObject.verifyToken
    })
      .then(user => {
      // Because the account service filters for client hidden security attributes we need to fetch the user manually
        return userService.find({ query: { email: gmailUser.replace('com', 'xyz') } })
      })
      .then(users => {
        expect(users.data.length > 0).beTrue()
        userObject = users.data[0]
        expect(userObject.email).to.equal(gmailUser.replace('com', 'xyz'))
      })
  })
  // Let enough time to process
    .timeout(5000)

  it('authenticates a user with changed identity', () => {
    return request
      .post(`${baseUrl}/authentication`)
      .send({ email: userObject.email, password: 'Pass;word1', strategy: 'local' })
      .then(response => {
        expect(response.body.accessToken).toExist()
      })
  })

  it('removes user', () => {
    return userService.remove(userObject._id, { user: userObject })
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
