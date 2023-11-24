import _ from 'lodash'
import L from 'leaflet'
import { utils as coreUtils } from '../../../core/client/index.js'

// Defaults marker properties
const defaults = {
	shape: 'marker-pin',
	width: 28,
	height: 36,
	icon: {
		classes: 'fa fa-circle'
	}
}

export const ShapeMarker = L.Marker.extend({
	initialize (latlng, options) {
		let _options = _.cloneDeep(options)
		// map options from simplespec to SVG shape
		if (_options.fillColor) _.set(_options, 'color', options.fillColor)
		if (_options.fillOpacity) _.set(_options, 'opacity', options.fillOpacity)
		if (_options.color) _.set(_options, 'stroke.color', options.color)
		if (_options.weight) _.set(_options, 'stroke.Width', options.weight)
    // create the marker with the corredt divIcon
		const width = _options.width || defaults.width
		const height = _options.height || defaults.height
    L.Marker.prototype.initialize.call(this, latlng, { 
			icon: L.divIcon({
				iconSize: [width, height],
				iconAnchor: [width/2, height],
				html: coreUtils.createShape(_.defaultsDeep(_options, defaults)),
				className: ''
			}) 
		})
	}
})
