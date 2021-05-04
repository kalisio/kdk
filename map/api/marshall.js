import _ from 'lodash'

function coordinatesToNumbers (value) {
  if (typeof value === 'string') {
    return _.toNumber(value)
  } else if (Array.isArray(value)) {
    return value.map(item => coordinatesToNumbers(item))
  } else {
    return value
  }
}

export function marshallGeometry (geometry) {
  if (typeof geometry === 'object') {
    // Geospatial operators begin with $
    let geoOperator = _.keys(geometry).find(key => key.startsWith('$'))
    geoOperator = geometry[geoOperator]
    _.forOwn(geoOperator, (value, key) => {
      // Geospatial parameters begin with $
      if (key.startsWith('$')) {
        // Some target coordinates
        if (!_.isNil(value.coordinates)) {
          value.coordinates = coordinatesToNumbers(value.coordinates)
        } else {
          // Other simple values or array of values
          geoOperator[key] = coordinatesToNumbers(value)
        }
      }
    })
  }
}
