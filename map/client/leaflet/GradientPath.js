import logger from 'loglevel'
import _ from 'lodash'
import L from 'leaflet'
import * as PIXI from 'pixi.js'
import 'leaflet-pixi-overlay'

const GradientPath = L.PixiOverlay.extend({

  initialize (geoJson, options) {
    L.setOptions(this, Object.assign({ stroke: '#FFFFFF', weight: 8 }, options))
    this.paths = []
    this.currentZoom = -1
    this.container = new PIXI.Container()
    Object.assign(this.container, {
      interactive: true,
      buttonMode: true
    })
    L.PixiOverlay.prototype.initialize.call(this,
      utils => this.render(utils),
      this.container, {
        autoPreventDefault: false
      })
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
    this.pathBounds = new L.LatLngBounds()
    coords.forEach(coord => this.pathBounds.extend([coord[1], coord[0]]))
    // Then the path
    const gradient = _.get(geoJson, 'properties.gradient', _.get(geoJson, 'properties.stroke', _.get(this.options, 'stroke')))
    const weight = _.get(geoJson, 'properties.weight', _.get(this.options, 'weight'))
    this.path = { coords, gradient, weight }
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
    L.PixiOverlay.prototype.onRemove.call(this, map)
  },

  getBounds () {
    return this.pathBounds
  },

  getCenter () {
    const mid = Math.floor(this.path.coords.length / 2)
    const center = this.path.coords[mid]
    return [center[1], center[0]]
  },

  getObjectUnderPointer (event) {
    const interaction = this.renderer.plugins.interaction
    const point = new PIXI.Point()
    // get global click position
    interaction.mapPositionToPoint(point, event.originalEvent.clientX, event.originalEvent.clientY)
    // get what is below the click if any
    return interaction.hitTest(point, this.container)
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
    canvas.width = 4096
    canvas.height = weight
    // use canvas2d API to create the gradient texture
    const ctx = canvas.getContext('2d')
    const grd = ctx.createLinearGradient(0, 0, canvas.width, 1)
    for (let i = 0; i < gradient.length; i++) {
      grd.addColorStop(i / gradient.length, gradient[i])
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
      this.container.removeChildren()
      // Converts the geo coordinates into layer coordinates
      const points = this.path.coords.map(coord => utils.latLngToLayerPoint([coord[1], coord[0]]))
      let texture
      // FIXME: how to ensure a pixel constant size when zooming ?
      const weight = 2048 * this.path.weight / Math.pow(2, zoom)
      if (Array.isArray(this.path.gradient)) {
        texture = this.createGradientTexture(this.path.gradient, weight)
      } else {
        texture = this.createSolidTexture(this.path.gradient, weight)
      }
      this.container.addChild(new PIXI.SimpleRope(texture, points))
    }
    this.renderer.render(this.container)
  }
})

L.GradientPath = GradientPath
L.gradientPath = function (options) {
  return new L.GradientPath(options)
}
export { GradientPath }
