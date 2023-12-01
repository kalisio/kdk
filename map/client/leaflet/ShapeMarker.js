import _ from 'lodash'
import L from 'leaflet'
import { getCssVar } from 'quasar'
import { utils as coreUtils } from '../../../core/client/index.js'

export const ShapeMarker = L.Marker.extend({

  // Constructor
  initialize (latlng, options) {
    L.setOptions(this, {
      shape: 'circle',
      color: getCssVar('primary'),
      opacity: 1,
    })
    if (options) {
      if (options.shape) this.options.shape = options.shape
      if (options.size) this.options.size = options.size
      if (options.radius) this.options.radius = options.radius
      if (options.anchor) this.options.anchor = options.anchor
      if (options.fillColor) this.options.color = options.fillColor
      if (options.fillOpacity) this.options.opacity = options.fillOpacity
      if (options.color) _.set(this.options, 'stroke.color', options.color)
      if (options.weight) _.set(this.options, 'stroke.width', options.weight)
      if (options.icon) this.options.icon = options.icon
    }
    const shape = coreUtils.createShape(this.options)
    if (shape) {
      L.Marker.prototype.initialize.call(this, latlng, {
        icon: L.divIcon({
          iconSize: [shape.width, shape.height],
          iconAnchor: getAnchor(options.anchor, shape.width, shape.height),
          popupAnchor: [0, -shape.height / 2],
          html: shape.html,
          className: ''
        })
      })
    }
    
    function getAnchor (position, width, height) {
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
  }
})