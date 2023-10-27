import _ from 'lodash'
import logger from 'loglevel'
import { Dialog, Notify, openURL } from 'quasar'
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
    const response = await api.getService('import-export').create({ 
      method: 'export',
      servicePath: api.getServicePath(options.service, options.context).substring(1),
      query: options.query,
      format: options.format,
      gzip: options.gzip
    })
    dismiss()
    if (response.SignedUrl) openURL(response.SignedUrl)
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
      await callService(Object.assign({ format }, options))
    })
  } else {
    await callService(Object.assign({ format: options.formats[0] }, options))
  }
}
