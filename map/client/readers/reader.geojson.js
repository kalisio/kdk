import logger from 'loglevel'
import _ from 'lodash'
import i18next from 'i18next'
import geojsonhint from '@mapbox/geojsonhint'

export function readGEOJSON (file, options) {
  logger.debug(`reading GeoJSON file ${file.name}`)
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      let content = reader.result
      try {
        content = JSON.parse(content)
      } catch (error) {
        reject(new Error(i18next.t('errors.INVALID_JSON_FILE', { file: file.name }), { errors: error }))
        return
      }
      // lint the geosjon file
      const messages = geojsonhint.hint(content, options)
      // filter the message according the level to find the errors
      const errors = _.filter(messages, message => {
        return _.get(message, 'level') !== 'message'
      })
      if (errors.length > 0) {
        logger.debug(errors)
        reject(new Error(i18next.t('errors.INVALID_GEOJSON_FILE', { file: file.name }), { errors }))
        return
      }
      // the geosjon file is correct
      resolve(content)
    }
    reader.onerror = (error) => {
      logger.debug(error)
      reject(new Error(i18next.t('errors.CANNOT_READ_FILE', { file: file.name }), { errors: error }))
    }
    reader.readAsText(file)
  })
}
