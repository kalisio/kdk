import logger from 'loglevel'
import { kml } from '@tmcw/togeojson'
import { i18n } from '../../../core/client/i18n.js'

export const KMLReader = {
  read (files, options) {
    if (files.length !== 1) {
      logger.debug('invalid \'files\' arguments')
      return
    }
    const file = files[0]
    logger.debug(`reading KML file ${file.name}`)
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        let content = reader.result
        try {
          content = kml(new DOMParser().parseFromString(content, 'text/xml'))
        } catch (error) {
          logger.debug(error)
          reject(new Error(i18n.t('errors.INVALID_KML_FILE', { file: file.name }), { errors: error }))
          return
        }
        resolve(content)
      }
      reader.onerror = (error) => {
        logger.debug(error)
        reject(new Error(i18n.t('errors.CANNOT_READ_FILE', { file: file.name }), { errors: error }))
      }
      reader.readAsText(file)
    })
  },
  getAdditionalFiles () {
    return []
  }
}
