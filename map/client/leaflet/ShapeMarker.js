import _ from 'lodash'
import L from 'leaflet'
import { utils as coreUtils } from '../../../core/client/index.js'

export const ShapeMarker = L.Marker.extend({
	initialize (latlng, options) {
		// set default values
		const shape = _.get(options, 'shape', 'marker-pin')
		const width = _.get(options, 'width', 28)
		const height = _.get(options, 'height', 36)
		// create divicon 
		var icon = L.divIcon({
			iconSize: [width, height],
			iconAnchor: [width/2, height],
			html: coreUtils.createShape(Object.assign({ shape, width, height }, options)),
			className: 'dummy'
		})
    // this.enableDebug = true
    L.Marker.prototype.initialize.call(this, latlng, { icon })
	}
})

L.shapeMarker = function (latlng, options) {
  return new ShapeMarker(latlng, options)
}
