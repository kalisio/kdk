import logger from 'loglevel'
import _ from 'lodash'
import L from 'leaflet'
import * as PIXI from 'pixi.js'
import turfbbox from '@turf/bbox'
import 'leaflet-pixi-overlay'

// Build a svgOverlay leaflet layer
// geojson geometry must be a line string, with gradient information
// The svg points (inside the svg element) will be populated with coordinates in spherical mercator scaled between [0,1] on both x and y
// We do this to prevent numerical issues affecting rendering due to spherical mercator coordinates being huge numbers.
// The svg overlay will be placed in the map covering the bbox of the geojson
function buildSVGFromGradientPath (geojson)
{
  const defs = []  // We'll push every linearGradient we need here
  const lines = [] // and every line segment we need here
  const gradient = geojson.properties.gradient
  const bbox = turfbbox(geojson)
  // Grow the bbox a bit because we use it to position the svgOverlay. If it matches exaclty
  // it'll crop the svg lines when using a big stroke-width, they'll exceed the geojson bbox ...
  // TODO: we should use stroke width * extent it represent at zoom level 2 or 3 ...
  let width = bbox[2] - bbox[0]
  let height = bbox[3] - bbox[1]
  // This is to handle single points
  if (width === 0) width = 0.1
  if (height === 0) height = 0.1
  bbox[0] -= width * 0.1
  bbox[1] -= height * 0.1
  bbox[2] += width * 0.1
  bbox[3] += height * 0.1

  // Compute WGS84 bbox in spherical mercator coordinates
  const b0 = L.Projection.SphericalMercator.project(L.GeoJSON.coordsToLatLng(bbox.slice(0, 2)))
  const b1 = L.Projection.SphericalMercator.project(L.GeoJSON.coordsToLatLng(bbox.slice(2, 4)))

  // Rescale sperical mercator points to [0,1] on biggest axis, where bbox.min is 0 and bbox.max is 1
  // Other axis is rescaled to maintain aspect ratio, otherwise final display using svg element is not correct
  const min = { x: Math.min(b0.x, b1.x), y: Math.min(b0.y, b1.y) }
  const max = { x: Math.max(b0.x, b1.x), y: Math.max(b0.y, b1.y) }
  const delta = { x: max.x - min.x, y: max.y - min.y }
  // This scale factor is used to maintain original aspect ratio in svg coordinates
  const scale = { x: delta.x > delta.y ? 1.0 : delta.x / delta.y, y: delta.y > delta.x ? 1.0 : delta.y / delta.x }
  // This is how we map from spherical mercator point to svg element coordinates.
  // Y is reversed to match svg canvas origin
  const rescalePoint = (point) => [scale.x * ((point.x - min.x) / delta.x), scale.y * (1.0 - ((point.y - min.y) / delta.y))]

  // Create an id suffix to make linearGradient ids unique
  const idSuffix = `${bbox.join('_')}_${gradient.length}`
  // Project geojson coordinates to spherical mercator
  const latlngs = L.GeoJSON.coordsToLatLngs(geojson.geometry.coordinates)
  const coordinates = latlngs.map((latlng) => rescalePoint(L.Projection.SphericalMercator.project(latlng)))
  for (let i = 0; i < gradient.length - 1; ++i) {
    const p0 = coordinates[i]
    const p1 = coordinates[i+1]
    // The linear gradient to apply on the current segment
    defs.push(`<linearGradient gradientUnits="userSpaceOnUse" x1="${p0[0]}" y1="${p0[1]}" x2="${p1[0]}" y2="${p1[1]}" id="gradient${i}_${idSuffix}"><stop offset="0" stop-color="${gradient[i]}"/><stop offset="1" stop-color="${gradient[i+1]}"/></linearGradient>`)
    // The associated line segment, vector-effect="non-sclaing-stroke" make it so stroke-width is a final pixel value, independent of zoom level
    // Use 'path' elements instead of 'line' because leaflet CSS defines 'pointer' cursor only on 'path' elements, not lines
    lines.push(`<path d="M ${p0[0]} ${p0[1]} L ${p1[0]} ${p1[1]}" stroke="url(#gradient${i}_${idSuffix})" vector-effect="non-scaling-stroke" class="leaflet-interactive"/>`)
  }

  // Create svg HTML element
  var svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg")
  svgElement.setAttribute('xmlns', "http://www.w3.org/2000/svg")
  // Viewbox is used to define which part of the svg must be displayed in it's html element, and is in svg coordinates.
  // For us it's 0 0 scale.x scale.y since we rescaled everything
  svgElement.setAttribute('viewBox', `0 0 ${scale.x} ${scale.y}`)
  // svg html content, round linecap + stroke-width
  svgElement.innerHTML = `<g stroke-linecap="round" stroke-width="${geojson.properties.weight}"><defs>${defs.join('')}</defs>${lines.join('')}</g>`

  return { svg: svgElement, bounds: L.latLngBounds(L.latLng(bbox[1], bbox[0]), L.latLng(bbox[3], bbox[2])) }
}

const SVGGradientPath = L.SVGOverlay.extend({
  initialize (geojson, options) {
    const path = buildSVGFromGradientPath(geojson)

    // We don't simply use the options.interactive constructor option since it also add 'leaflet-interactive' class
    // on the svg html element and this requests 'pointer' cursor on the whole svg, even if there's nothing drawn.
    // Instead we just declare the layer interactive for leaflet (see onAdd()), without adding the 'leaflet-interactive' class.
    // 'leaflet-interactive' is set in 'path' elements of the svg element, which are actually rendered.
    L.SVGOverlay.prototype.initialize.call(this, path.svg, path.bounds, Object.assign({ interactive: false }, options))

    const opacity = _.get(geojson.properties, 'opacity')
    if (opacity !== undefined)
      this.setOpacity(opacity)
  },

  getCenter () {
    return this._bounds.getCenter()
  },

  // This method is called when source data changes
  setData (geojson) {
    // Remove old svg
    this.onRemove()

    // Build new one
    const path = buildSVGFromGradientPath(geojson)
    // Mess with ImageOverlay and SVGOverlay internals to update element
    this._url = path.svg
    this._initImage()
    this.setBounds(path.bounds)
    const opacity = _.get(geojson.properties, 'opacity')
    if (opacity !== undefined)
      this.setOpacity(opacity)

    // Add new svg
    this.onAdd()
  },

  onAdd () {
    L.SVGOverlay.prototype.onAdd.call(this)
    // See constructor explanation
    this.addInteractiveTarget(this._image)
  }
})

const GradientPath = L.PixiOverlay.extend({

  initialize (geoJson, options) {
    L.setOptions(this, Object.assign({ stroke: '#FFFFFF', weight: 8 }, options))
    this.path = {
      geometry: null,
      bounds: null
    }
    this.rope = null
    this.container = new PIXI.Container()
    Object.assign(this.container, {
      interactive: true,
      buttonMode: true
    })
    L.PixiOverlay.prototype.initialize.call(this,
      utils => this.render(utils),
      this.container, {
        autoPreventDefault: false,
        // see: https://github.com/kalisio/kdk/issues/424
        projectionZoom: () => { return 12 }
      })
    this.currentZoom = -1
    if (geoJson) this.setData(geoJson)
  },

  setData (geoJson) {
    const type = _.get(geoJson, 'type')
    const geometryType = _.get(geoJson, 'geometry.type')
    const coords = _.get(geoJson, 'geometry.coordinates')
    if ((type !== 'Feature') || (geometryType !== 'LineString') || !Array.isArray(coords)) {
      logger.warn('Invalid/Unsupported GeoJson object for Gradient Path')
      return
    }
    // Updated the bounds
    this.path.bounds = new L.LatLngBounds()
    coords.forEach(coord => this.path.bounds.extend([coord[1], coord[0]]))
    // Then the path
    const gradient = _.get(geoJson, 'properties.gradient', _.get(geoJson, 'properties.stroke', _.get(this.options, 'stroke')))
    const weight = _.get(geoJson, 'properties.weight', _.get(this.options, 'weight'))
    this.path.geometry = { coords, gradient, weight }
    // Force a refresh
    this.currentZoom = -1
    this.redraw()
  },

  onAdd (map) {
    this.clickEventHandler = this.handleClickEvent.bind(this)
    map.on('click', this.clickEventHandler)
    this.moveEventHandler = this.handleMoveEvent.bind(this)
    map.on('mousemove', this.moveEventHandler)
    L.PixiOverlay.prototype.onAdd.call(this, map)
  },

  onRemove (map) {
    map.off('click', this.clickEventHandler)
    map.off('mousemove', this.moveEventHandler)
    if (this.rope) {
      this.container.removeChild(this.rope)
      this.rope.texture.destroy(true)
      this.rope.destroy(true)
      this.rope = null
    }
    this.container.destroy(true)
    L.PixiOverlay.prototype.onRemove.call(this, map)
  },

  getBounds () {
    return this.path.bounds
  },

  getCenter () {
    const mid = Math.floor(this.path.geometry.coords.length / 2)
    const center = this.path.geometry.coords[mid]
    return [center[1], center[0]]
  },

  getObjectUnderPointer (event) {
    const point = new PIXI.Point()
    // get global click position
    this.renderer.events.mapPositionToPoint(point, event.originalEvent.clientX, event.originalEvent.clientY)
    const boundary = new PIXI.EventBoundary(this.container)
    // get what is below the click if any
    return boundary.hitTest(point.x, point.y)
  },

  handleClickEvent (event) {
    if (!this.getPopup()) return
    // Get what is below the click if any
    const target = this.getObjectUnderPointer(event)
    if (target) {
      if (this.isPopupOpen()) this.closePopup()
      else this.openPopup(event.latlng)
    } else {
      if (this.isPopupOpen()) this.closePopup()
    }
  },

  handleMoveEvent (event) {
    if (!this.getTooltip()) return
    // Get what is below the move if any
    const target = this.getObjectUnderPointer(event)
    if (target) {
      if (!this.isTooltipOpen()) this.openTooltip()
      this._moveTooltip(event)
    } else {
      if (this.isTooltipOpen()) this.closeTooltip()
    }
  },

  createSolidTexture (color, weight) {
    const canvas = document.createElement('canvas')
    canvas.width = 8
    canvas.height = weight
    // use canvas2d API to create the solid texture
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = color
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    return PIXI.Texture.from(canvas)
  },

  createGradientTexture (gradient, weight) {
    const canvas = document.createElement('canvas')
    canvas.width = gradient.length
    canvas.height = weight
    // use canvas2d API to create the gradient texture
    const ctx = canvas.getContext('2d')
    const grd = ctx.createLinearGradient(0, 0, canvas.width, 1)
    for (let i = 0; i < gradient.length; i++) {
      grd.addColorStop(i / (gradient.length - 1), gradient[i])
    }
    ctx.fillStyle = grd
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    return PIXI.Texture.from(canvas)
  },

  render (utils) {
    const zoom = utils.getMap().getZoom()

    // Need to update rope weight according to zoom level so that we get a constant thickness on screen
    if (zoom !== this.currentZoom) {
      this.renderer = utils.getRenderer()
      // Compute the texture
      // FIXME: how to ensure a pixel constant size when zooming ?
      let texture = null
      // weight must be greater than 1 (https://github.com/kalisio/kdk/issues/747)
      const weight = Math.max(1, 2048 * this.path.geometry.weight / Math.pow(2, zoom))
      if (Array.isArray(this.path.geometry.gradient)) {
        texture = this.createGradientTexture(this.path.geometry.gradient, weight)
      } else {
        texture = this.createSolidTexture(this.path.geometry.gradient, weight)
      }
      // Compute the geometry
      const points = this.path.geometry.coords.map(coord => utils.latLngToLayerPoint([coord[1], coord[0]]))
      // Release the rope
      if (this.rope) {
        this.container.removeChild(this.rope)
        this.rope.texture.destroy(true)
        this.rope.destroy(true)
      }
      // Create the new rope
      this.rope = new PIXI.SimpleRope(texture, points)
      this.container.addChild(this.rope)
      // Update the current zoom
      this.currentZoom = zoom
    }
    this.renderer.render(this.container)
  }
})

L.GradientPath = GradientPath
L.SVGGradientPath = SVGGradientPath
L.gradientPath = function (options) {
  return new L.GradientPath(options)
}
L.svgGradientPath = function (options) {
  return new L.SVGGradientPath(options)
}

export { GradientPath, SVGGradientPath }
