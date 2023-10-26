import _ from 'lodash'
import logger from 'loglevel'
import { Dialog, Notify } from 'quasar'
import { Events } from '../events.js'
import { api } from '../api.js'
import { i18n } from '../i18n.js'

async function callService (options) {
  let dismiss 
  try {
    dismiss = Notify.create({
      group: 'export',
      icon: 'las la-hourglass-half',
      message: i18n.t('utils.export.EXPORTING'),
      color: 'primary',
      timeout: 0,
      spinner: true
    })
    const response = await api.getService('import-export').create({ 
      method: 'export',
      servicePath: api.getServicePath(options.service, options.context),
      query: options.query,
      format: options.format,
      gzip: options.gzip
    })
    dismiss()
    if (response.SignedUrl) {
      // open the returned signed url
      window.open(response.SignedUrl, options.format === 'json' ? '_blank' : '_self')
    } else {
      Events.emit('error', { message: i18n.t('errors.' + response.status) })
    }
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
  logger.debug(`[KDK] creating export with options ${JSON.stringify(options, null, 2)}`)
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
      await callService(Object.assign(options, { format }))
    })
  } else {
    await callService(Object.assign(options, { format: options.formats[0] }))
  }
}
