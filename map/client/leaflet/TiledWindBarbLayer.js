import _ from 'lodash'
import L from 'leaflet'
import 'abort-controller/polyfill.js'
import { utils as kdkCoreUtils } from '../../../core.client.js'
import { WindBarbIcon } from './WindBarb.js'

// Same convention as everywhere else in the app: u/v are eastward/northward components (m/s).
// Returns the meteorological direction the wind blows FROM, clockwise from north, in degrees.
function vectorToDirection (u, v) {
  const towards = Math.atan2(u, v) * 180 / Math.PI
  return (towards + 180 + 360) % 360
}

function vectorToSpeed (u, v) {
  return Math.sqrt(u * u + v * v)
}

// Draws a wind barb icon at each sample of a fixed lattice of points we control ourselves, in global
// pixel space, queried via kazarr's dedicated point-probing endpoint. This deliberately avoids
// extracting/resampling a mesh over each tile's bounding box (the same operation the particle
// (tiledWindLayer) layer uses): reconstructing a regular grid out of a per-tile mesh response has to
// assume things about that mesh (its exact extent, its native resolution) that only hold when nothing
// resamples/interpolates it, and that otherwise make independently-fetched neighbouring tiles line up
// cleanly only by accident.
const TiledWindBarbLayer = L.GridLayer.extend({
  options: {
    // Unlike a plain raster tile, a tile here means a real network round-trip (a probe request), so
    // don't fire one for every tile the view passes through while a drag/zoom gesture is still in
    // progress - only once it settles. Leaflet's own default for this is `mobile` (false on desktop).
    updateWhenIdle: true
  },

  initialize (options, uSource, vSource) {
    this.conf = {}
    // wind barbs need to stay legible and spaced apart, so this is expected to be fairly coarse
    // (eg. 40 to 60, meaning one sample every 40 to 60 screen pixels)
    this.conf.resolutionScale = _.get(options, 'resolutionScale', [40.0, 40.0])
    // options forwarded as-is to each L.WindBarb.icon(), fillColor/strokeColor are overridden
    // per sample from the color map when available
    this.conf.barb = _.get(options, 'barb', {})

    L.GridLayer.prototype.initialize.call(this, options)

    // Setup the colormap, exactly as the tiled mesh layer does: color each sample according to
    // the underlying variable's chromajs config (here, wind speed)
    const chromajs = _.get(options, 'chromajs')
    this.colorMap = chromajs ? kdkCoreUtils.buildColorScale(chromajs) : null

    // the underlying sources don't need to know about the level at all: we query them via probe(),
    // passing the level on each point ourselves (see setLevel/createTile)
    this.level = undefined
    // u and v share the same dataset/url/additional config (they're just two components of the same
    // model), so we probe both in a single request through uSource instead of issuing one request per
    // component - see createTile
    this.uVariable = _.get(options, 'meteoElements[0]')
    this.vVariable = _.get(options, 'meteoElements[1]')

    this.uSource = uSource
    this.vSource = vSource
    this.onDataChangedCallback = this.onDataChanged.bind(this)
    this.uSource.on('data-changed', this.onDataChangedCallback)
    this.vSource.on('data-changed', this.onDataChangedCallback)
    // we're listening to 2 sources: u and v, wait for both to have fired before reacting
    this.numDataChanged = 0

    // abort in-flight requests for tiles that get unloaded before they resolve (eg. scrolled past
    // during a pan), instead of letting them complete for nothing
    this.on('tileunload', (event) => { this.onTileUnload(event) })
  },

  setTime (time) {
    const applyU = typeof this.uSource.setTime === 'function'
    const applyV = typeof this.vSource.setTime === 'function'
    // no need to force a tile refresh here as the real invalidation happens later,
    // once the grid source actually changes its data
    if (applyU) { this.uSource.setTime(time) }
    if (applyV) { this.vSource.setTime(time) }
  },

  setLevel (level) {
    // we query the sources ourselves, passing the level on each point (see createTile), so all we
    // need is to refresh currently visible tiles so they get probed again with it
    this.level = level
    this.redraw()
  },

  setModel (model) {
    const applyU = typeof this.uSource.setModel === 'function'
    const applyV = typeof this.vSource.setModel === 'function'
    if (applyU) { this.uSource.setModel(model) }
    if (applyV) { this.vSource.setModel(model) }
  },

  onDataChanged () {
    // we're listening to 2 sources: u and v, so wait every 2 fired events to process anything
    ++this.numDataChanged
    if (this.numDataChanged !== 2) return
    this.numDataChanged = 0

    // allow grid layer to only request tiles located in those bounds
    const points = []
    const vbbox = this.vSource.getBBox()
    if (vbbox) {
      points.push(L.latLng(vbbox[0], vbbox[1]))
      points.push(L.latLng(vbbox[2], vbbox[3]))
    }
    const ubbox = this.uSource.getBBox()
    if (ubbox) {
      points.push(L.latLng(ubbox[0], ubbox[1]))
      points.push(L.latLng(ubbox[2], ubbox[3]))
    }
    this.options.bounds = points.length ? L.latLngBounds(points) : null

    // we now have data to display, it may be time to add the layer to the map
    if (this.pendingAdd) {
      this.onPendingAdd()
    } else {
      this.redraw()
    }

    // notify others we have data (for example color legend component)
    this.fire('data')
    this.hasData = true
  },

  onAdd (map) {
    // defer actual addLayer call to the point where we have data ready to be displayed
    // otherwise, leaflet will start loading meaningless tiles against a grid source that hasn't been configured yet
    this.pendingAdd = map
  },

  onPendingAdd () {
    const map = this.pendingAdd
    L.GridLayer.prototype.onAdd.call(this, map)
    this.pendingAdd = null
  },

  onRemove (map) {
    if (this.pendingAdd) {
      this.pendingAdd = null
    } else {
      L.GridLayer.prototype.onRemove.call(this, map)
    }

    this.uSource.invalidate()
    this.vSource.invalidate()
  },

  onTileUnload (event) {
    const tile = event.tile
    if (tile.fetchController) {
      tile.fetchController.abort()
      tile.fetchController = null
    }
  },

  // Renders one barb, colored by speed, centered at the given tile-local pixel point
  renderBarb (tile, point, u, v) {
    const speed = vectorToSpeed(u, v)
    const deg = vectorToDirection(u, v)

    const color = this.colorMap ? this.colorMap(speed).hex() : undefined
    const barbOptions = Object.assign({}, this.conf.barb, { deg, speed })
    // TODO: we could add an option to use configured color map for barbs
    //if (color) Object.assign(barbOptions, { fillColor: color, strokeColor: color, pointStroke: color })
    const barb = new WindBarbIcon(barbOptions)

    // Icon is actually the point and shadow the barbs
    const icon = barb.createIcon()
    const shadow = barb.createShadow()
    L.DomUtil.setPosition(icon, point)
    L.DomUtil.setPosition(shadow, point)
    tile.appendChild(shadow)
    tile.appendChild(icon)
  },

  createTile (coords, done) {
    const tile = document.createElement('div')

    // Build a lattice of points to probe, spaced by resolutionScale screen pixels, in GLOBAL pixel
    // space at this zoom level (tile origin + a fixed step, not "N points across this tile"). Since
    // every tile derives its lattice from the exact same global origin and step, two independently
    // fetched neighbouring tiles necessarily share the same lattice lines - there's no reconstruction
    // of a mesh into a regular grid involved (and so no way for that reconstruction to disagree at a
    // shared edge).
    const tileSize = this.getTileSize()
    const tileOrigin = coords.scaleBy(tileSize)
    const spacing = this.conf.resolutionScale
    const startX = Math.ceil(tileOrigin.x / spacing[0]) * spacing[0]
    const startY = Math.ceil(tileOrigin.y / spacing[1]) * spacing[1]

    // Build the lattice as a GeoJSON FeatureCollection of Point features, the shape kazarr's probe
    // endpoint expects directly - each geometry's optional 3rd coordinate is the level, and we stash
    // this tile's own screen coordinates in 'properties' (passed through untouched by kazarr) to read
    // back once the response comes in, instead of re-deriving them from the (possibly re-projected)
    // response coordinates.
    const features = []
    for (let px = startX; px < tileOrigin.x + tileSize.x; px += spacing[0]) {
      for (let py = startY; py < tileOrigin.y + tileSize.y; py += spacing[1]) {
        const latlng = this._map.unproject(L.point(px, py), coords.z)
        const coordinates = (this.level !== undefined && this.level !== null)
          ? [latlng.lng, latlng.lat, this.level]
          : [latlng.lng, latlng.lat]
        features.push({
          type: 'Feature',
          geometry: { type: 'Point', coordinates },
          properties: { x: px - tileOrigin.x, y: py - tileOrigin.y }
        })
      }
    }

    if (features.length === 0) {
      // Nothing to do for this tile (can happen for a sliver tile at the very edge of the map)
      Promise.resolve().then(() => done(null, tile))
      return tile
    }

    tile.fetchController = new AbortController()

    const pointsCollection = { type: 'FeatureCollection', features }

    // u and v share the same dataset/url/additional config, so probe both variables in a single
    // request through uSource instead of issuing one request per component
    this.uSource.probe(tile.fetchController.signal, pointsCollection, { variables: [this.uVariable, this.vVariable] }).then((result) => {
      // fetch ended, can't abort anymore
      tile.fetchController = null

      if (result && result.sourceKey === this.uSource.sourceKey) {
        this.populateTile(tile, features, result.values[this.uVariable], result.values[this.vVariable])
      }

      done(null, tile)
    }).catch(err => {
      tile.fetchController = null
      done(err, tile)
    })

    return tile
  },

  populateTile (tile, features, uValues, vValues) {
    for (let i = 0; i < features.length; ++i) {
      const u = uValues[i]
      const v = vValues[i]
      if (!Number.isFinite(u) || !Number.isFinite(v)) continue

      // position relative to the tile itself: leaflet CSS-transforms the whole tile as one block
      // when panning, so a plain absolutely positioned child stays put for free, no per-frame update
      // needed - this is exactly the pixel position the point was generated from in createTile()
      const { x, y } = features[i].properties
      const point = L.point(x, y)
      this.renderBarb(tile, point, u, v)
    }
  },

  getBounds () {
    const bounds = this.options.bounds ? this.options.bounds : L.latLngBounds(L.latLng(-90, -180), L.latLng(90, 180))
    return this._map ? this._map.wrapLatLngBounds(bounds) : bounds
  }
})

export { TiledWindBarbLayer }
