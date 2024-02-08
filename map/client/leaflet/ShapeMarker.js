import _ from 'lodash'
import logger from 'loglevel'
import L from 'leaflet'
import { utils as coreUtils } from '../../../core/client/index.js'

const DefaultOptions = {
  anchor: 'top-center' 
}

export const ShapeMarker = L.Marker.extend({

  // Constructor
  initialize (latlng, options) {
    const shapeOptions = Object.assign({}, DefaultOptions, options)
    const shape = coreUtils.createShape(shapeOptions)
    if (shape) {
      L.Marker.prototype.initialize.call(this, latlng, {
        icon: L.divIcon({
          iconSize: [shape.width, shape.height],
          iconAnchor: this.getAnchor(shapeOptions, shape.width, shape.height),
          popupAnchor: [0, -shape.height / 2],
          html: shape.html,
          className: ''
        }),
        ...options
      })
    } else {
      logger.warn(`[KDK] unable to create the shape with the options: ${options}` )
    }
  },

  getAnchor (position, width, height) {
    if (position === 'top-left') return [0, 0]
    if (position === 'top-center') return [width / 2, 0]
    if (position === 'top-right') return [width, 0]
    if (position === 'middle-left') return [0, height / 2]
    if (position === 'middle-right') return [width, height / 2]
    if (position === 'middle-left') return [0, height / 2]
    if (position === 'bottom-left') return [0, height]
    if (position === 'bottom-center') return [width / 2, height]
    if (position === 'bottom-right') return [width, height]
    return [width / 2, height / 2]
  }
})