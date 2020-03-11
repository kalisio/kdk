import emails from 'email-templates'
import path from 'path'
import makeDebug from 'debug'

const debug = makeDebug('kalisio:kNotify:devices:hooks')

export async function sendNewDeviceEmail (hook) {
  if (hook.type !== 'after') {
    throw new Error('The \'sendNewDeviceEmail\' hook should only be used as a \'after\' hook.')
  }

  const app = hook.app
  const user = hook.params.user
  const mailerService = app.getService('mailer')
  const domainPath = app.get('domain') + '/#/'
  const email = {
    subject: 'Security alert - new device signin',
    from: mailerService.options.auth.user,
    // When changing email send to the new one so that it can be verified
    to: user.email,
    link: domainPath + 'home/account/security',
    domainPath
  }
  const device = hook.result
  // Build the subject & link to the app to perform the different actions
  const templateDir = path.join(mailerService.options.templateDir, 'newDevice')
  const template = new emails.EmailTemplate(templateDir)
  // Errors does not seem to be correctly catched by the caller
  // so we catch them here to avoid any problem
  try {
    const emailContent = await template.render({ email, device, user }, user.locale || 'en-us')
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
