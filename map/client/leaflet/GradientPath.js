import logger from 'loglevel'
import _ from 'lodash'
import L from 'leaflet'
import * as PIXI from 'pixi.js'
import 'leaflet-pixi-overlay'

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
L.gradientPath = function (options) {
  return new L.GradientPath(options)
}
export { GradientPath }
