import logger from 'loglevel'
import i18next from 'i18next'
import { kml } from '@tmcw/togeojson'

export const KMLReader = {
  read (files, options) {
    if (files.length !== 1) {
      logger.debug('invlaid \'fields\' arguments')
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
          reject(new Error(i18next.t('errors.INVALID_KML_FILE', { file: file.name }), { errors: error }))
          return
        }
        resolve(content)
      }
      reader.onerror = (error) => {
        logger.debug(error)
        reject(new Error(i18next.t('errors.CANNOT_READ_FILE', { file: file.name }), { errors: error }))
      }
      reader.readAsText(file)
    })
  },
  getAdditionalFiles () {
    return []
  }
}
