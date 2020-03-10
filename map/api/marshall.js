import _ from 'lodash'

export function marshallGeometry (geometry) {
  if (typeof geometry === 'object') {
    // Geospatial operators begin with $
    let geoOperator = _.keys(geometry).find(key => key.startsWith('$'))
    geoOperator = geometry[geoOperator]
    _.forOwn(geoOperator, (value, key) => {
      // Geospatial parameters begin with $
      if (key.startsWith('$')) {
        // Some target coordinates
        if (!_.isNil(value.coordinates) && (value.coordinates.length > 0) && (typeof value.coordinates[0] === 'string')) {
          value.coordinates = value.coordinates.map(coordinate => _.toNumber(coordinate))
        } else if (typeof value === 'string') {
          // Other simple values
          geoOperator[key] = _.toNumber(value)
        }
      }
    })
  }
}
