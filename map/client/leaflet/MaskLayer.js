import logger from 'loglevel'
import _ from 'lodash'
import L from 'leaflet'

const MaskLayer = L.Polygon.extend({

  initialize: function (geoJson, options) {
    // Merge the options
    L.setOptions(this, Object.assign({ 
      interactive: false,
      fitBounds: true,
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
    let mask = []
    const type = _.get(geoJson, 'type')
    if (type === 'Feature') {
      const geometryType = _.get(geoJson, 'geometry.type')
      const coordinates = _.get(geoJson, 'geometry.coordinates')
      if (geometryType === 'Polygon' && coordinates) {
        this.addPolygon(coordinates, mask)
      } else if (geometryType === 'MultiPolygon' && coordinates) {
        _.forEach(coordinates, polygon => this.addPolygon(polygon, mask))
      }
    } else {
      logger.warn('Invalid/Unsupported GeoJson object for MaskLayer')
    }
    L.Polygon.prototype.initialize.call(this, [outerBoundsLatLngs, mask], this.options)
  },

  addPolygon (coordinates, mask) {
    let hole = []
    _.forEach(coordinates, ring => {
      let ringHole = []
      for (let i = 0; i < ring.length; i++) {
        ringHole.push(new L.LatLng(ring[i][1], ring[i][0]))
      }
      hole.push(ringHole)  
    })
    mask.push(hole)
  }
})

export { MaskLayer }

