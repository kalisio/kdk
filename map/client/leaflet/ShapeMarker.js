import _ from 'lodash'
import logger from 'loglevel'
import L from 'leaflet'
import { utils as coreUtils } from '../../../core/client/index.js'

export const ShapeMarker = L.Marker.extend({

  // Constructor
  initialize (latlng, options) {
    const shape = coreUtils.createShape(options)
    if (shape) {
      L.Marker.prototype.initialize.call(this, latlng, {
        icon: L.divIcon({
          iconSize: [shape.size.width, shape.size.height],
          iconAnchor: this.getAnchor(shape.anchor, shape.size),
          popupAnchor: [0, -shape.size.height / 2],
          html: shape.html,
          className: ''
        }),
        // forward extra options for different purposes, i.e. clustering
        ..._.get(options, 'options', {})  
      })
    } else {
      logger.warn(`[KDK] unable to create the shape with the options: ${options}` )
    }
  },

  getAnchor (position, size) {
    if (position === 'top-left') return [0, 0]
    if (position === 'top-center') return [size.width / 2, 0]
    if (position === 'top-right') return [size.width, 0]
    if (position === 'middle-left') return [0, size.height / 2]
    if (position === 'middle-right') return [size.width, size.height / 2]
    if (position === 'middle-left') return [0, size.height / 2]
    if (position === 'bottom-left') return [0, size.height]
    if (position === 'bottom-center') return [size.width / 2, size.height]
    if (position === 'bottom-right') return [size.width, size.height]
    return [size.width / 2, size.height / 2]
  }
})