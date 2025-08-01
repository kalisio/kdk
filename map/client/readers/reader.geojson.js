import logger from 'loglevel'
import _ from 'lodash'
//import geojsonhint from '@mapbox/geojsonhint'
import { i18n } from '../../../core/client/i18n.js'

export const GEOJSONReader = {
  read (files, options) {
    if (files.length !== 1) {
      logger.debug('invalid \'files\' arguments')
      return
    }
    const file = files[0]
    logger.debug(`reading GeoJSON file ${file.name}`)
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        let content = reader.result
        try {
          content = JSON.parse(content)
        } catch (error) {
          reject(new Error(i18n.t('errors.INVALID_JSON_FILE', { file: file.name }), { errors: error }))
          return
        }
        // check the crs
        // if valid delete it because of https://github.com/kalisio/kdk/issues/518
        if (content.crs) {
          // we support only named crs and expressed in WGS84
          const name = _.get(content.crs, 'properties.name')
          if (name) {
            const crs = name.toLowerCase()
            const allowedCrs = ['epsg:4326', 'urn:ogc:def:crs:OGC:1.3:CRS84', 'urn:ogc:def:crs:EPSG::4326']
            const isCrsValid = _.some(allowedCrs, (allowrdCrs) => { return allowrdCrs.toLowerCase() === crs })
            if (!isCrsValid) {
              reject(new Error(i18n.t('errors.INVALID_GEOJSON_CRS', { file: file.name }), { errors: `Invalid CRS ${name}` }))
              return
            }
            delete content.crs
          }
        }
        // lint the geosjon file
        /*
        const messages = geojsonhint.hint(content, options)
        // filter the message according the level to find the errors
        const errors = _.filter(messages, message => {
          return _.get(message, 'level') !== 'message'
        })
        if (errors.length > 0) {
          logger.debug(errors)
          reject(new Error(i18n.t('errors.INVALID_GEOJSON_FILE', { file: file.name }), { errors }))
          return
        }
        */
        // the geosjon file is correct
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
