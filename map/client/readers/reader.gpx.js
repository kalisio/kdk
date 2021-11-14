import logger from 'loglevel'
import i18next from 'i18next'
import { gpx } from '@tmcw/togeojson'

export function readGPX (file, options) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onloadend = () => {
      let content = reader.result
      try {
        content = gpx(new DOMParser().parseFromString(content, "text/xml"))
      } catch (error) {
        logger.debug(error)
        reject({ message: i18next.t('errors.INVALID_GPX_FILE', { file: file.name }), errors: error })
      }
      resolve(content)
    }
    reader.onerror = (error) => {
      logger.debug(error)
      reject({ message: i18next.t('errors.CANNOT_READ_FILE', { file: file.name }), errors: error })
    }
    reader.readAsText(file)
  })
}
