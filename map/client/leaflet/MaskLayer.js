import logger from 'loglevel'
import _ from 'lodash'
import L from 'leaflet'

const MaskLayer = L.Polygon.extend({

  initialize: function (geoJson, options) {
    // Merge the options
    L.setOptions(this, Object.assign({ 
      color: "#AAAAAA",
      weight: 1,
      fillColor: "#AAAAAA",
      fillOpacity: 0.8,
      interactive: false,
      fitBounds: true,
      restrictBounds: true,
      bounds: new L.LatLngBounds([-90, -360], [90, 360])
      }), options)
    // Define the outBounds latlngs array of the mask
    const outerBoundsLatLngs = [
       this.options.bounds.getSouthWest(),
       this.options.bounds.getNorthWest(),
       this.options.bounds.getNorthEast(),
       this.options.bounds.getSouthEast()
    ]
    // Construct the mask
    const type = _.get(geoJson, 'type')
    const geometryType = _.get(geoJson, 'geometry.type')
    const coordinates = _.get(geoJson, 'geometry.coordinates')
    let holeCoordinates = []
    if ((type === 'Feature') && (geometryType === 'Polygon') && Array.isArray(coordinates)) {
      for (let i=0; i < coordinates[0].length; i++) {
        holeCoordinates.push(new L.LatLng(coordinates[0][i][1], coordinates[0][i][0]))
      }
    } else {
      logger.warn('Invalid/Unsupported GeoJson object for MaskLayer')
    }
    L.Polygon.prototype.initialize.call(this, [outerBoundsLatLngs, holeCoordinates], this.options)
  }
})

export { MaskLayer }

