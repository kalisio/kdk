import _ from 'lodash'
import logger from 'loglevel'
import { Dialog, Notify } from 'quasar'
import { Events } from '../events.js'
import { api } from '../api.js'
import { i18n } from '../i18n.js'

function callService (options) {
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
    const exportService = api.getService('import-export')
    exportService.on('exported', response => {
      
      dismiss()
      if (response.SignedUrl) {
        // Use an iframe to download the file
        // see https://github.com/socketio/socket.io/issues/4436
        // solutions based on window.open cause socket.io to close the connection. 
        let iframe = document.getElementById('export-hidden-frame')
        if (!iframe) {
          iframe = document.createElement('iframe')
          iframe.id = 'export-hidden-frame'
          iframe.style.display = "none"
        }
        iframe.src = response.SignedUrl
      }
      else Events.emit('error', { message: i18n.t('errors.' + response.status) })
    })
    const servicePath = api.getServicePath(options.service, options.context).substring(1)
    const transform = _.get(options, 'transform.' + options.format)
    exportService.create( Object.assign(options, { method: 'export', servicePath, transform }))
  } catch (error) {
    dismiss()
    Events.emit('error', { message: i18n.t('errors.NETWORK_ERROR') })
  }
}
  
export function createExport (options) {
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
      callService(Object.assign(params, { format }))
    })
  } else {
    callService(Object.assign(params, { format: options.formats[0] }))
  }
}
