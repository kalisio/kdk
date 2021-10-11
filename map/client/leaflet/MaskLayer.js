import logger from 'loglevel'
import _ from 'lodash'
import L from 'leaflet'

const MaskLayer = L.Polygon.extend({

  initialize: function (geoJson, options) {
    L.setOptions(this, Object.assign({ 
      style: {
        color: "#AAAAAA",
        weight: 1,
        'fill-color': "#AAAAAA",
        'fill-opcatity': 0.8
      },
      interactive: false,
      fitBounds: true,
      restrictBounds: true,
      bounds: new L.LatLngBounds([-90, -360], [90, 360])
      }, options))
    let outerBoundsLatLngs = [
       this.options.bounds.getSouthWest(),
       this.options.bounds.getNorthWest(),
       this.options.bounds.getNorthEast(),
       this.options.bounds.getSouthEast()
    ]

    const type = _.get(geoJson, 'type')
    const geometryType = _.get(geoJson, 'geometry.type')
    const coordinates = _.get(geoJson, 'geometry.coordinates')
    if ((type !== 'Feature') || (geometryType !== 'Polygon') || !Array.isArray(coordinates)) {
      logger.warn('Invalid/Unsupported GeoJson object for MaskLayer')
      L.Polygon.prototype.initialize.call(this, [outerBoundsLatLngs], options)
    }

    let latlngs = []
    for (let i=0; i < coordinates[0].length; i++) {
      latlngs.push(new L.LatLng(coordinates[0][i][1], coordinates[0][i][0]))
    }

    L.Polygon.prototype.initialize.call(this, [outerBoundsLatLngs, latlngs], options)
  }
})

export { MaskLayer }

