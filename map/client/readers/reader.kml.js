import logger from 'loglevel'
import _ from 'lodash'
import { kml } from '@tmcw/togeojson'
import { i18n } from '../../../core/client/i18n.js'
import { convertSimpleStyleToPointStyle, convertSimpleStyleToLineStyle, convertSimpleStyleToPolygonStyle, kmlStyleSpecialProperties } from '../utils/utils.style.js'

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
          content = convertToGeoJsonWithStyle(new DOMParser().parseFromString(content, 'text/xml'))
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

function getExtraPropertiesFromKMLByName (document) {
  const properties = {}
  const placemarks = document.getElementsByTagName('Placemark')
  _.forEach(placemarks, placemark => {
    const nameElements = placemark.getElementsByTagName('name')
    if (!nameElements.length) return
    const name = nameElements[0].textContent
    _.forEach(kmlStyleSpecialProperties, property => {
      const propertyElements = placemark.getElementsByTagName(property)
      if (!propertyElements.length) return

      let value = propertyElements[0].textContent
      if (['0', '1'].includes(value)) {
        value = value === '1'
      }
      _.set(properties, [name, property].join('.'), value)
    })
  })
  return properties
}

export function convertToGeoJsonWithStyle (document) {
  const extraProperties = getExtraPropertiesFromKMLByName(document)

  const geoJson = kml(document)

  _.forEach(_.get(geoJson, 'features', []), feature => {
    const name = _.get(feature, 'properties.name', false)
    // Apply all styles to prevent them for being overridden by the default ones
    const style = _.merge(convertSimpleStyleToPointStyle(feature.properties), convertSimpleStyleToLineStyle(feature.properties), convertSimpleStyleToPolygonStyle(feature.properties))
    if (name && _.has(extraProperties, name)) {
      _.merge(style, extraProperties[name])
    }
    _.set(feature, 'style', style)

    // Trim all string properties
    const trimmedProperties = _.mapValues(_.get(feature, 'properties', {}), value => {
      return typeof value === 'string' ? value.trim() : value
    })
    _.set(feature, 'properties', trimmedProperties)

    // Add label for points if they have a name
    if (_.get(feature, 'geometry.type') === 'Point' && _.has(feature, 'properties.name')) {
      _.set(feature, 'properties.icon-text', feature.properties.name)
      _.set(feature, 'properties.entityStyle.label', {
        heightReference: 'Cesium.HeightReference.RELATIVE_TO_GROUND'
      })
    }
  })

  return geoJson
}
