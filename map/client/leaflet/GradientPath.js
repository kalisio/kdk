import logger from 'loglevel'
import _ from 'lodash'
import L from 'leaflet'
import * as PIXI from 'pixi.js'
import turfbbox from '@turf/bbox'
import 'leaflet-pixi-overlay'
import chroma from 'chroma-js'

// Build a svgOverlay leaflet layer
// geoJson geometry must be a line string, with gradient information
// The svg points (inside the svg element) will be populated with coordinates in spherical mercator scaled between [0,1] on both x and y
// We do this to prevent numerical issues affecting rendering due to spherical mercator coordinates being huge numbers.
// The svg overlay will be placed in the map covering the bbox of the geoJson


class MinHeap {
  constructor (compare) {
    this._data = []
    this._compare = compare
  }
  push (val) {
    this._data.push(val)
    this._bubbleUp(this._data.length - 1)
  }
  pop () {
    const top = this._data[0]
    const last = this._data.pop()
    if (this._data.length > 0) {
      this._data[0] = last
      this._sinkDown(0)
    }
    return top
  }
  peek () { return this._data[0] }
  get size () { return this._data.length }
  _bubbleUp (i) {
    while (i > 0) {
      const parent = (i - 1) >> 1
      if (this._compare(this._data[i], this._data[parent]) < 0) {
        ;[this._data[i], this._data[parent]] = [this._data[parent], this._data[i]]
        i = parent
      } else break
    }
  }
  _sinkDown (i) {
    const n = this._data.length
    while (true) {
      let min = i
      const l = 2 * i + 1, r = 2 * i + 2
      if (l < n && this._compare(this._data[l], this._data[min]) < 0) min = l
      if (r < n && this._compare(this._data[r], this._data[min]) < 0) min = r
      if (min === i) break
      ;[this._data[i], this._data[min]] = [this._data[min], this._data[i]]
      i = min
    }
  }
}

function triangleArea (a, b, c) {
  return Math.abs(
    (a[0] * (b[1] - c[1]) +
     b[0] * (c[1] - a[1]) +
     c[0] * (a[1] - b[1])) / 2
  )
}

function simplifyWeightedPath (coords, { tolerance = 0, getWeight = () => 1 } = {}) {
  if (coords.length <= 2) return coords

  // Doubly linked list for O(1) removal
  const pts = coords.map((coord, i) => ({ coord, i, area: Infinity, removed: false, prev: null, next: null }))
  for (let i = 0; i < pts.length; i++) {
    if (i > 0) pts[i].prev = pts[i - 1]
    if (i < pts.length - 1) pts[i].next = pts[i + 1]
  }

  const computeArea = (node) => {
    if (!node.prev || !node.next) return Infinity
    const area = triangleArea(node.prev.coord, node.coord, node.next.coord)
    return area * getWeight(node.coord, node.i)
  }

  // Initialize heap with interior points
  const heap = new MinHeap((a, b) => a.area - b.area)
  for (let i = 1; i < pts.length - 1; i++) {
    pts[i].area = computeArea(pts[i])
    heap.push(pts[i])
  }

  let maxArea = 0

  while (heap.size > 0) {
    const node = heap.pop()
    // Skip if already removed or stale (area recomputed since push)
    if (node.removed) continue
    if (node.area < maxArea) node.area = maxArea
    else maxArea = node.area

    if (node.area >= tolerance) break  // remaining points are all above threshold

    // Remove node from linked list
    node.removed = true
    if (node.prev) node.prev.next = node.next
    if (node.next) node.next.prev = node.prev

    // Recompute area for neighbors and push updated versions
    if (node.prev && node.prev.prev) {
      node.prev.area = computeArea(node.prev)
      heap.push(node.prev)
    }
    if (node.next && node.next.next) {
      node.next.area = computeArea(node.next)
      heap.push(node.next)
    }
  }

  // Collect remaining points in order
  const result = []
  let cur = pts[0]
  while (cur) {
    if (!cur.removed) result.push(cur.coord)
    cur = cur.next
  }
  return result
}

function buildSVGGradientPath (geojson, coordinates) {
  const defs = []
  const lines = []
  const gradient = geojson.properties.gradient
  const idSuffix = `${geojson.properties.id || Date.now()}_${gradient.length}`
  // Build a wider path if a border needs to be drawn
  const stroke = _.get(geojson, 'properties.stroke')
  if (stroke) {
    const color = _.get(stroke, 'color', 'black')
    const width = _.get(stroke, 'width', 1)
    if (color !== 'transparent' && width > 0) {
      const border = coordinates.map((p, i) => i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`).join(' ')
      lines.push(`<path d="${border}" stroke="${color}" stroke-width="${geojson.properties.weight + 2 * width}" stroke-linecap="round" stroke-linejoin="bevel" fill="none" vector-effect="non-scaling-stroke"/>`)
    }
  }
  // Build the gradient path segment by segment
  for (let i = 0; i < coordinates.length - 1; ++i) {
    const p0 = coordinates[i]
    const p1 = coordinates[i + 1]
    const color0 = gradient[p0._idx ?? i]
    const color1 = gradient[p1._idx ?? i + 1]
    defs.push(`<linearGradient gradientUnits="userSpaceOnUse" x1="${p0.x}" y1="${p0.y}" x2="${p1.x}" y2="${p1.y}" id="gradient${i}_${idSuffix}"><stop offset="0" stop-color="${color0}"/><stop offset="1" stop-color="${color1}"/></linearGradient>`)
    lines.push(`<path d="M ${p0.x} ${p0.y} L ${p1.x} ${p1.y}" stroke="url(#gradient${i}_${idSuffix})" vector-effect="non-scaling-stroke" class="leaflet-interactive"/>`)
  }
  return `<g stroke-linecap="round" stroke-width="${geojson.properties.weight}"><defs>${defs.join('')}</defs>${lines.join('')}</g>`
}

const SVGGradientPath = L.SVGOverlay.extend({

  initialize (geojson, options) {
    this._geojson = geojson
    this._setup()
    // Create SVG element
    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    svgElement.setAttribute('viewBox', `0 0 ${this._scale.x} ${this._scale.y}`)
    // We don't use the interactive constructor option to avoid adding 'leaflet-interactive'
    // on the svg element itself (which would show a pointer cursor over the whole bbox).
    // Instead we mark individual path elements as interactive (see onAdd).
    L.SVGOverlay.prototype.initialize.call(this, svgElement, this.getBounds(), Object.assign({ interactive: false }, options))
  },

  getCenter () {
    return this._bounds.getCenter()
  },

  setData (geojson) {
    this._geojson = geojson
    this._setup()
    // Update SVG element
    this._image.setAttribute('viewBox', `0 0 ${this._scale.x} ${this._scale.y}`)
    // Rebuild path
    if (this._map) this._rebuild()
  },

  onAdd (map) {
    L.SVGOverlay.prototype.onAdd.call(this, map)
    // Mark the svg element as interactive target (see constructor explanation)
    this.addInteractiveTarget(this._image)
    map.on('zoomend', this._onZoom, this)
    // Trigger initial rebuild now that map is available
    this._rebuild()
  },

  onRemove (map) {
    map.off('zoomend', this._onZoom, this)
    L.SVGOverlay.prototype.onRemove.call(this, map)
  },

  _onZoom () {
    this._rebuild()
  },

  _setup () {
    const bbox = turfbbox(this._geojson)
    let width = bbox[2] - bbox[0]
    let height = bbox[3] - bbox[1]
    // Handle single point edge case
    if (width === 0) width = 0.1
    if (height === 0) height = 0.1
    // Grow bbox slightly to avoid clipping thick strokes at the edges
    bbox[0] -= width * 0.1
    bbox[1] -= height * 0.1
    bbox[2] += width * 0.1
    bbox[3] += height * 0.1
    // Reproject the bbox in SphericalMercator
    const b0 = L.Projection.SphericalMercator.project(L.GeoJSON.coordsToLatLng(bbox.slice(0, 2)))
    const b1 = L.Projection.SphericalMercator.project(L.GeoJSON.coordsToLatLng(bbox.slice(2, 4)))
    // Extract min/max
    const min = { x: Math.min(b0.x, b1.x), y: Math.min(b0.y, b1.y) }
    const max = { x: Math.max(b0.x, b1.x), y: Math.max(b0.y, b1.y) }
    const delta = { x: max.x - min.x, y: max.y - min.y }
    // Scale factor to maintain original aspect ratio in SVG coordinates
    this._scale = { x: delta.x > delta.y ? 1.0 : delta.x / delta.y, y: delta.y > delta.x ? 1.0 : delta.y / delta.x }
    // Maps a spherical mercator point to normalized SVG coordinates, Y axis is flipped
    this._rescalePoint = (point) => ({ x: this._scale.x * ((point.x - min.x) / delta.x), y: this._scale.y * (1.0 - ((point.y - min.y) / delta.y)) })
    // Stores mercator path
    this._mercatorPath = this._geojson.geometry.coordinates.map((coord, i) => {
      const ll = L.GeoJSON.coordsToLatLng(coord)
      const p = L.Projection.SphericalMercator.project(ll)
      return [p.x, p.y, i] // keep original index
    })
    // Update bounds
    const bounds = L.latLngBounds(L.latLng(bbox[1], bbox[0]), L.latLng(bbox[3], bbox[2]))
    this.setBounds(bounds)
    // Updated opacity
    const opacity = _.get(this._geojson.properties, 'opacity')
    if (opacity !== undefined) this.setOpacity(opacity)
  },

  _rebuild () {
    const smoothFactor = _.toNumber(_.get(this._geojson, 'properties.smoothFactor', 1))
    const zoom = this._map.getZoom()
    const maxZoom = this._map.getMaxZoom() ?? 20
    const tolerance = smoothFactor * 3 * Math.pow(2, maxZoom - zoom) // multiply by 3 because of the weight
    logger.debug(`[KDK] Building SVGGradientPath (length:${this._mercatorPath.length} | smoothFactor:${smoothFactor} | zoom:${zoom} | tolerance:${tolerance})`)
    // Simplify the path
    let simplifiedPath = this._mercatorPath
    if (smoothFactor > 0) {
      simplifiedPath = simplifyWeightedPath(this._mercatorPath, {
        tolerance: tolerance,
        getWeight: (p) => {
          const idx = p[2]
          const gradient = this._geojson.properties.gradient
          if (idx === 0 || idx === gradient.length - 1) return 1
          // Measure color break: how different is this point from both its neighbors
          const deltaPrev = chroma.deltaE(gradient[idx - 1], gradient[idx]) / 100
          const deltaNext = chroma.deltaE(gradient[idx], gradient[idx + 1]) / 100
          return 1 + deltaPrev + deltaNext
        }
      })
      logger.debug(`[KDK] SVGGradientPath simplified to ${simplifiedPath.length} points`)
    }
    // Reproject to SVG space
    const svgPath = simplifiedPath.map(([x, y, idx]) => {
      const { x: sx, y: sy } = this._rescalePoint({ x, y })
      return { x: sx, y: sy, _idx: idx }
    })
    // Update SVG element
    this._image.innerHTML = buildSVGGradientPath(this._geojson, svgPath)
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
