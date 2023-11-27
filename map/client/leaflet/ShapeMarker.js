import _ from 'lodash'
import L from 'leaflet'
import { utils as coreUtils } from '../../../core/client/index.js'

// Defaults marker properties
const defaults = {
  shape: 'marker-pin',
  size: [28, 36],
  icon: {
    classes: 'fa fa-circle'
  }
}

export const ShapeMarker = L.Marker.extend({
  initialize (latlng, options) {
    const mappedOptions = _.cloneDeep(options)
    // map options from simplespec to SVG shape
    if (mappedOptions.fillColor) _.set(mappedOptions, 'color', options.fillColor)
    if (mappedOptions.fillOpacity) _.set(mappedOptions, 'opacity', options.fillOpacity)
    if (mappedOptions.color) _.set(mappedOptions, 'stroke.color', options.color)
    if (mappedOptions.weight) _.set(mappedOptions, 'stroke.Width', options.weight)
    // create the marker with the corredt divIcon
    const size = mappedOptions.size || defaults.size
    L.Marker.prototype.initialize.call(this, latlng, {
      icon: L.divIcon({
        iconSize: size,
        iconAnchor: [size[0] / 2, size[1]],
        html: coreUtils.createShape(_.defaultsDeep(mappedOptions, defaults)),
        className: ''
      })
    })
  }
})
