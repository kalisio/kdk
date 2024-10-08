import _ from 'lodash'
import moment from 'moment'
import logger from 'loglevel'
import { Dialog, Notify } from 'quasar'
import { Events } from './events.js'
import { api } from './api.js'
import { i18n } from './i18n.js'

const ExporterQueue = {
  initialize (maxConcurrentRequests) {
    this.maxConcurrentRequests = maxConcurrentRequests
    logger.debug(`[KDK] Configuring exporter with '${maxConcurrentRequests}' maxConcurrentRequests`)
    this.pendingRequests = []
    this.runningRequests = []
    this.exportService = api.getService('import-export')
    this.exportService.on('export-created', params => this.onRequestCreated(params))
    this.exportService.on('export-completed', params => this.onRequestCompleted(params))
  },
  push (request) {
    this.pendingRequests.push(request)
    return this.triggerRequest()
  },
  triggerRequest () {
    if (this.runningRequests.length >= this.maxConcurrentRequests) return false
    if (this.pendingRequests.length === 0) return true
    const request = this.pendingRequests.shift()
    try {
      // compute a filename
      let filename = request.filename
      if (!filename) {
        const timestamp = moment().toISOString().replace(/:/g, '-')
        filename = `${_.get(request, 'basename', request.service)}_${timestamp}.${request.format}`
        if (_.get(request, 'gzip', true)) filename += '.gz'
      }
      // retrienve the target service path
      const servicePath = api.getServicePath(request.service).substring(1)
      // retrieve the transform assigned to the format
      const transform = _.get(request, 'transform.' + request.format)
      // create the export request
      const options = Object.assign(
        _.omit(request, ['title', 'service', 'context', 'formats']),
        { method: 'export', filename, servicePath, transform }
      )
      logger.debug(`[KDK] request export with options ${JSON.stringify(options, null, 2)}`)
      this.exportService.create(options)
    } catch (error) {
      Events.emit('error', { message: i18n.t('errors.NETWORK_ERROR') })
    }
    return true
  },
  onRequestCreated (params) {
    logger.debug(`[KDK] export request ${params.uuid} created`)
    const request = {
      uuid: params.uuid,
      notification: Notify.create({
        icon: 'las la-hourglass-half',
        message: i18n.t('exporter.EXPORTING'),
        color: 'primary',
        timeout: 0,
        spinner: true
      })
    }
    this.runningRequests.push(request)
  },
  onRequestCompleted (params) {
    logger.debug(`[KDK] export request ${params.uuid} completed`)
    // retrieve the request
    const request = _.head(_.remove(this.runningRequests, { uuid: params.uuid }))
    if (!request) {
      logger.warn(`[KDK] export request ${params.uuid} not found`)
      return
    }
    // close the notification
    request.notification()
    // donwload the file
    if (params.SignedUrl) {
      // Use an iframe to download the file
      // see https://github.com/socketio/socket.io/issues/4436
      // solutions based on window.open cause socket.io to close the connection.
      let iframe = document.getElementById('export-hidden-frame')
      if (!iframe) {
        iframe = document.createElement('iframe')
        iframe.id = 'export-hidden-frame'
        iframe.style.display = 'none'
        document.body.appendChild(iframe)
      }
      iframe.src = params.SignedUrl
    } else Events.emit('error', { message: i18n.t('errors.' + params.status) })
    // trigger a new request
    this.triggerRequest()
  }
}

export const Exporter = {
  initialize (options) {
    ExporterQueue.initialize(_.get(options, 'maxConcurrentRequests', 3))
  },
  export (options) {
    if (!options.service) {
      logger.error('[KDK] invalid options: missing \'service\' property')
      return
    }
    const params = _.cloneDeep(options)
    if (options.formats.length > 1) {
      const dialog = {
        title: i18n.t(options.title ? options.title : 'exporter.TITLE'),
        message: i18n.t('exporter.MESSAGE'),
        options: {
          type: 'radio',
          model: options.formats[0].label,
          items: options.formats.map(format => {
            return { label: format.label, value: format.label }
          })
        },
        cancel: {
          id: 'cancel-button',
          label: i18n.t('CANCEL'),
          color: 'primary',
          outline: true
        },
        ok: {
          id: 'export-button',
          label: i18n.t('exporter.EXPORT'),
          color: 'primary'
        },
        persistent: true
      }
      Dialog.create(dialog)
        .onOk((formatLabel) => {
          const format = _.find(options.formats, { label: formatLabel })
          if (!ExporterQueue.push(Object.assign(params, format))) {
            Notify.create({
              type: 'negative',
              message: i18n.t('exporter.EXPORTS_LIMIT_REACHED')
            })
          }
        })
    } else {
      if (!ExporterQueue.push(Object.assign(params, options.formats[0]))) {
        Notify.create({
          type: 'negative',
          message: i18n.t('exporter.EXPORTS_LIMIT_REACHED')
        })
      }
    }
  }
}
