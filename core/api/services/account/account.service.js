import { AuthenticationManagementService } from 'feathers-authentication-management'
import errors from '@feathersjs/errors'
import emails from 'email-templates'
import path from 'path'
import makeDebug from 'debug'
import _ from 'lodash'

const { BadRequest } = errors
const debug = makeDebug('kdk:core:account:service')

class AccountService extends AuthenticationManagementService {
  // add a method to verify whether en email exist or not
  async verifyEmail (params) {
    const usersService = this.app.getService('users')
    const response = await usersService.find({ query: { email: params.email } })
    return { status: response.total === 1 ? 200 : 404 }
  }
}

export default function (name, app, options) {
  // Keep track of notifier in service options
  options.notifier = async function (type, user, notifierOptions) {
    const userService = app.getService('users')
    // Using OAuth2 providers disallow some operations
    let identityProvider
    for (const provider of app.authenticationProviders) {
      if (user[provider + 'Id']) identityProvider = _.startCase(provider)
    }
    // Password/Identity change is already filtered by the fact the user does not have an old password to be provided
    if (identityProvider && (type === 'resendVerifySignup')) {
      const userWithPassword = await userService.get(user._id.toString())
      if (!userWithPassword.password) {
        return Promise.reject(new BadRequest(`You cannot update your account because it is managed by ${identityProvider}`, {
          translation: {
            key: 'OAUTH2_PROVIDER',
            params: { provider: identityProvider }
          }
        }))
      }
    }

    const mailerService = app.getService('mailer')
    const domainPath = app.get('domain') + '/#/'
    const email = {
      from: mailerService.options.from || mailerService.options.auth.user,
      // When changing email send to the new one so that it can be verified
      to: (type === 'identityChange' ? user.verifyChanges.email : user.email),
      domainPath
    }
    // Build the subject & link to the app to perform the different actions
    let emailTemplateDir = type
    switch (type) {
      case 'resendVerifySignup': // send another email with token for verifying user's email addr
        email.subject = 'Confirm your signup'
        break
      case 'verifySignup': // inform that user's email is now confirmed
        email.subject = 'Thank you, your email has been verified'
        break
      case 'sendResetPwd': // send email with token to reset password
        email.subject = 'Reset your password'
        email.link = domainPath + 'reset-password/' + user.email
        break
      case 'resetPwd': // inform that user's password is now reset
        email.subject = 'Your password was reset'
        break
      case 'passwordChange': // inform that user's password is now changed
        email.subject = 'Your password was changed'
        break
      case 'identityChange': // inform that user's email has now changed
        email.subject = 'Your account information was changed'
        break
      case 'sendInvitation':
        if (_.has(user, 'sponsor.name')) {
          email.sponsor = _.get(user, 'sponsor.name')
        } else if (_.has(user, 'sponsor.id')) {
          try {
            const sponsor = await userService.get(user.sponsor.id)
            email.sponsor = _.get(sponsor, 'profile.name')
          } catch (error) {
            // We will not send the sponsor name in this case
          }
        }
        email.subject = 'Welcome'
        email.link = domainPath + 'login'
        emailTemplateDir = 'confirmInvitation'
        break
    }
    const templateDir = path.join(mailerService.options.templateDir, emailTemplateDir)
    const template = new emails.EmailTemplate(templateDir)
    // Errors does not seem to be correctly catched by the caller
    // so we catch them here to avoid any problem
    try {
      const emailContent = await template.render({ email, user }, user.locale || 'en-us')
      // Update compiled content
      email.html = emailContent.html
      debug('Sending email ', email)
      return mailerService.create(email)
    } catch (error) {
      debug('Sending email failed', error)
      app.logger.error(error)
    }
  }

  const servicePath = app.get('apiPath') + '/account'
  const userService = app.getService('users')

  return new AccountService(app, {
    // By default it is impossible to reset password if email is not verified
    // The problem is that if you loose your password before validating your email you are blocked,
    // as a consequence we release this constraint
    skipIsVerifiedCheck: true,
    service: userService.getPath(true),
    path: servicePath,
    notifier: options.notifier,
    reuseResetToken: true
  })
}
