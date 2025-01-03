import _ from 'lodash'
import logger from 'loglevel'
import { i18n } from '../i18n.js'

export const BLOBReader = {
  read (files, options) {
    if (files.length !== 1) {
      logger.debug('[KDK] invalid \'files\' arguments')
      return
    }
    const file = files[0]
    logger.debug(`[KDK] reading Blob file ${file.name}`)
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const content = reader.result
        if (!content) {
          reject(new Error(i18n.t('errors.INVALID_BLOB_FILE', { file: file.name })))
          return
        }
        resolve(content)
      }
      reader.onerror = (error) => {
        logger.debug(error)
        reject(new Error(i18n.t('errors.CANNOT_READ_FILE', { file: file.name }), { errors: error }))
      }
      const expectedType = _.get(options, 'type', 'arrayBuffer')
      if (expectedType === 'dataUrl') {
        reader.readAsDataURL(file)
      } else {
        if (expectedType !== 'arrayBuffer') logger.error(`[KDK] Undefined expected type ${expectedType}. Read as Array buffer.`)
        reader.readAsArrayBuffer(file)
      }
    })
  },
  getAdditionalFiles () {
    return []
  }
}
