import logger from 'loglevel'
import _ from 'lodash';
import { kml } from '@tmcw/togeojson'
import { i18n } from '../../../core/client/i18n.js'
import { convertSimpleStyleToPointStyle, convertSimpleStyleToLineStyle, convertSimpleStyleToPolygonStyle } from '../utils/utils.style.js'
import { convertToCesiumFromStyle } from '../cesium/utils/utils.style.js'

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
          content = convertKMLStyleToKDKStyle(new DOMParser().parseFromString(content, 'text/xml'));
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

function getExtraPropertiesFromKMLByName(document){
  const properties = {};
  const propertiesToAdd = ['extrude', 'altitudeMode'];
  const placemarks = document.getElementsByTagName('Placemark');
  _.forEach(placemarks, placemark => {
    const nameElements = placemark.getElementsByTagName('name');
    if(!nameElements.length) return;
    const name = nameElements[0].textContent;
    _.forEach(propertiesToAdd, property => {
      const propertyElements = placemark.getElementsByTagName(property);
      if(!propertyElements.length) return;

      let value = propertyElements[0].textContent;
      if(['0', '1'].includes(value)){
        value = value === '1' ? true : false;
      }
      _.set(properties, [name, property].join('.'), value);
    });
  });
  return properties;
}

function convertKMLStyleToKDKStyle(document) {
  const extraProperties = getExtraPropertiesFromKMLByName(document);

  const geoJson = kml(document);

  _.forEach(_.get(geoJson, 'features', []), feature => {
    const name = _.get(feature, 'properties.name', false);
    if(!name || !feature.geometry) return;
    let style = {};
    switch(feature.geometry.type){
      case 'Point':
        style = convertSimpleStyleToPointStyle(feature.properties);
        break;
      case 'LineString':
        style = convertSimpleStyleToLineStyle(feature.properties);
        break;
      case 'Polygon':
        style = convertSimpleStyleToPolygonStyle(feature.properties);
        break;
      default:
        logger.debug(`Unsupported geometry type ${feature.geometry.type}`)
        break;
    }

    if(_.has(extraProperties, name)){
      _.merge(style, extraProperties[name]);
    }

    _.set(feature, 'style', style);

    const cesiumStyle = convertToCesiumFromStyle(feature);
    _.mergeWith(feature, _.get(cesiumStyle, 'convertedStyle', {}), (objValue, srcValue) => {
      if (_.isArray(objValue)) return srcValue;
    });

    for(const feature of _.get(cesiumStyle, 'additionalFeatures', [])){
      geoJson.features.push(feature);
    }
  });

  return geoJson;
}