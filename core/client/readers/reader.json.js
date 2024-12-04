import logger from 'loglevel'
import { i18n } from '../i18n.js'

export const JSONReader = {
  read (files, options) {
    if (files.length !== 1) {
      logger.debug('[KDK] invalid \'files\' arguments')
      return
    }
    const file = files[0]
    logger.debug(`[KDK] reading JSON file ${file.name}`)
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        let content = reader.result
        try {
          content = JSON.parse(content)
        } catch (error) {
          logger.debug(error)
          reject(new Error(i18n.t('errors.INVALID_JSON_FILE', { file }), { errors: error }))
        }
        resolve(content)
      }
      reader.onerror = (error) => {
        logger.debug(error)
        reject(new Error(i18n.t('errors.CANNOT_READ_FILE', { file }), { errors: error }))
      }
      reader.readAsText(file)
    })
  },
  getAdditionalFiles () {
    return []
  }
}
