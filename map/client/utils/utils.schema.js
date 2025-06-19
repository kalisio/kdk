import _ from 'lodash'
import { utils as kCoreUtils } from '../../../core/client/index.js'
import { getGeoJsonFeatures } from '../utils.map.js'

// Get JSON schema from GeoJson feature' properties
export function generatePropertiesSchema (geoJson, name) {
  const schema = {
    $id: `http://www.kalisio.xyz/schemas/${_.kebabCase(name)}#`,
    title: name,
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    properties: {
    }
  }
  // Enumerate all available properties/values in all features
  const features = getGeoJsonFeatures(geoJson)
  features.forEach(feature => {
    // FIXME: we don't yet support nested objects in schema
    const properties = (feature.properties ? kCoreUtils.dotify(feature.properties) : {})
    _.forOwn(properties, (value, key) => {
      // Property already registered ?
      if (schema.properties['{key}']) {
        const property = schema.properties[`${key}`]
        // Try to find first non void value to select appropriate type
        if (_.isNil(property)) schema.properties[`${key}`] = value
      } else {
        schema.properties[`${key}`] = value
      }
    })
  })
  _.forOwn(schema.properties, (value, key) => {
    let type = (typeof value)
    // For null/undefined value we will assume string by default
    if ((type === 'object') || (type === 'undefined')) type = 'string'
    schema.properties[`${key}`] = {
      type,
      nullable: true,
      field: {
        component: (type === 'number'
          ? 'form/KNumberField'
          : (type === 'boolean' ? 'form/KToggleField' : 'form/KTextField')),
        label: key
      }
    }
  })
  return schema
}
