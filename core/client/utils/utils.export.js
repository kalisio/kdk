import _ from 'lodash'
import logger from 'loglevel'
import { Dialog, Notify } from 'quasar'
import { Events } from '../events.js'
import { api } from '../api.js'
import { i18n } from '../i18n.js'

async function callService (options) {
  logger.debug(`[KDK] creating export with options ${JSON.stringify(options, null, 2)}`)
  const dismiss = Notify.create({
    group: 'export',
    icon: 'las la-hourglass-half',
    message: i18n.t('utils.export.EXPORTING'),
    color: 'primary',
    timeout: 0,
    spinner: true
  })
  try {
    const servicePath = api.getServicePath(options.service, options.context).substring(1)
    const transform = _.get(options, 'transform.' + options.format)
    const response = await api.getService('import-export').create( Object.assign(options, { method: 'export', servicePath, transform }))
    dismiss()
    // Because of the Content-Disposition, it force the browser to download the file
    // So just open the link with the _selft target. 
    // Do not use Quasar openURL as it opens a new window (target is _blank)
    if (response.SignedUrl) window.open(response.SignedUrl, '_self') 
    else Events.emit('error', { message: i18n.t('errors.' + response.status) })
  } catch (error) {
    dismiss()
    Events.emit('error', { message: i18n.t('errors.NETWORK_ERROR') })
  }
}
  
export async function createExport (options) {
  if (!options.service) {
    logger.error(`[KDK] invalid options: missing 'service' property`)
    return
  }
  const params = _.cloneDeep(options)
  if (options.formats.length > 1) {
    const dialog = {
      title: i18n.t(options.title ? options.title : 'utils.export.TITLE'),
      message: i18n.t('utils.export.MESSAGE'),
      options: {
        type: 'radio',
        model: options.formats[0].value,
        items: options.formats
      },
      cancel: {
        id: 'cancel-button',
        label: i18n.t('CANCEL'),
        color: 'primary',
        outline: true
      },
      ok: {
        id: 'export-button',
        label: i18n.t('utils.export.EXPORT'),
        color: 'primary'
      },
      persistent: true
    }
    Dialog.create(dialog)
    .onOk(async (format) => {
      await callService(Object.assign(params, { format }))
    })
  } else {
    await callService(Object.assign(params, { format: options.formats[0] }))
  }
}
