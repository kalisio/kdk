import _ from 'lodash'
import { Dialog } from 'quasar'
import { api } from '../api.js'
import { i18n } from '../i18n.js'

async function callService (options) {
  let response = await api.getService('import-export').create({ 
    method: 'export',
    servicePath: api.getServicePath(options.service, options.context).substr(1),
    query: options.query,
    format: options.format,
    gzip: options.gzip
  })
  // open the returned signed url
  window.open(response.SignedUrl, options.format === 'json' ? '_blank' : '_self')
}
  
export async function create (options) {
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
