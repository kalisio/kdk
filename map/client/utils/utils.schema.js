import _ from 'lodash'
import { utils as kCoreUtils } from '../../../core/client/index.js'

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
  const features = (geoJson.type === 'FeatureCollection' ? geoJson.features : [geoJson])
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
        helper: key,
        label: key
      }
    }
  })
  return schema
}

export function updatePropertiesSchema (schema) {
  const props = schema.properties
  if (!props) return

  const bestGuesses = {
    undefined: 'form/KTextField',
    object: 'form/KTextField',
    string: 'form/KTextField',
    number: 'form/KNumberField',
    boolean: 'form/KToggleField'
  }

  // Loop over declared props and add best guesses to field components based on property type
  for (const prop in props) {
    const propEntry = props[prop]
    // Field already here, skip entry
    if (propEntry.field && propEntry.field.component) continue

    propEntry.field = {
      component: bestGuesses[propEntry.type],
      label: prop,
      helper: propEntry.description
    }
  }

  return schema
}
