import emails from 'email-templates'
import path from 'path'
import makeDebug from 'debug'
import _ from 'lodash'

const debug = makeDebug('kdk:core:push:hooks')

// Helper functions to be used in iff hooks
export function disallowExternalPush (hook) {
  return _.get(hook.app.get('push'), 'disallowExternalPush', true)
}

export async function sendNewSubscriptionEmail (hook) {
  if (hook.type !== 'after') {
    throw new Error('The \'sendNewSubscriptionEmail\' hook should only be used as a \'after\' hook.')
  }

  // Check for a new subscription if any
  const updatedUser = hook.result
  const previousUser = hook.params.user
  // If we can't compare abort, eg f-a-m might patch user to update tokens
  if (!updatedUser || !previousUser) return hook
  const newSubscription = _.differenceBy(_.get(updatedUser, 'subscriptions', []), _.get(previousUser, 'subscriptions', []), 'endpoint')
  if (_.size(newSubscription) !== 1) return

  // Data
  const app = hook.app
  const mailerService = app.getService('mailer')
  const domainPath = app.get('domain') + '/#/'
  const email = {
    subject: 'Security alert - new browser detected',
    from: mailerService.options.from || mailerService.options.auth.user,
    // When changing email send to the new one so that it can be verified
    to: updatedUser.email,
    link: domainPath,
    domainPath
  }

  // Build the subject & link to the app to perform the different actions
  const templateDir = path.join(mailerService.options.templateDir, 'newSubscription')
  const template = new emails.EmailTemplate(templateDir)
  // Errors does not seem to be correctly catched by the caller
  // so we catch them here to avoid any problem
  try {
    const emailContent = await template.render({ email, user: updatedUser, subscription: _.first(newSubscription) }, updatedUser.locale || 'en-us')
    // Update compiled content
    email.html = emailContent.html
    debug('Sending email ', email)
    await mailerService.create(email)
  } catch (error) {
    debug('Sending email failed', error)
    app.logger.error(error)
  }

  return hook
}
