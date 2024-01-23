import _ from 'lodash'
import L from 'leaflet'
import { buildColorMap } from '../utils.js'

import { tile2key, tileSetContainsParent } from './utils.js'

const TiledWindLayer = L.GridLayer.extend({
  initialize (options, uSource, vSource) {
    this.conf = {}

    this.conf.enableDebug = _.get(options, 'enabledDebug', false)
    this.conf.resolutionScale = _.get(options, 'resolutionScale', [1.0, 1.0])
    this.conf.meteoModelOverride = _.get(options, 'meteoModelOverride')

    L.GridLayer.prototype.initialize.call(this, options)

    // is user currently dragging the map ?
    this.userIsDragging = false
    // number of pending wind fetches
    this.pendingFetchs = 0
    // set of loaded leaflet tiles
    this.loadedTiles = new Set()

    // Setup the colormap
    const chromajs = _.get(options, 'chromajs')
    this.colorMap = buildColorMap(chromajs)
    const invert = chromajs.invertScale

    this.uSource = uSource
    this.vSource = vSource
    this.onDataChangedCallback = this.onDataChanged.bind(this)
    this.uSource.on('data-changed', this.onDataChangedCallback)
    this.vSource.on('data-changed', this.onDataChangedCallback)
    this.numDataChanged = 0

    // build the underlying velocity layer
    const velocityOptions = Object.assign({
      displayValues: false,
      minVelocity: this.colorMap.domain()[0],
      maxVelocity: this.colorMap.domain()[1],
      velocityScale: 0.01,
      colorScale: (invert ? this.colorMap.colors().reverse() : this.colorMap.colors()),
      data: null
    }, options)
    this.velocityLayer = L.velocityLayer(velocityOptions)

    // hack into velocity layer internals ...
    // override velocity layer's onDrawLayer to support our tiled management
    this.velocityLayer.onDrawLayer = (overlay, params) => {
      if (!this._map) return

      if (this.velocityLayer._windy) {
        // we delay the restart of the wind computation as much as we can
        // for a restart to happen, we want to make sure that
        //  - no wind tiles are currently being loaded
        //  - user is not dragging the map
        //  - we're in allowed zoom level range
        // this way we reduce the number of restarts
        let allowedZoom = true
        const zoom = this._map.getZoom()
        if (this.options.maxZoom && zoom > this.options.maxZoom) allowedZoom = false
        if (this.options.minZoom && zoom < this.options.minZoom) allowedZoom = false
        if (this.pendingFetchs === 0 && !this.userIsDragging && allowedZoom) {
          this.velocityLayer._clearAndRestart()
        } else {
          // just clear, last pending fetch will restart the wind (see createTile promise.finally() block)
          this.velocityLayer._clearWind()
        }
      }
    }

    // structs for the veocity layer
    this.uFlow = {
      header: {
        parameterCategory: 2,
        parameterNumber: 2
      },
      data: []
    }
    this.vFlow = {
      header: {
        parameterCategory: 2,
        parameterNumber: 3
      },
      data: []
    }
  },

  getEvents () {
    const events = L.GridLayer.prototype.getEvents.call(this)

    // listen to 'dragstart' and 'dragend' to know when user is dragging the map
    // this is used to decide when wind simulation can be restarted

    const onDragStart = events.dragstart
    events.dragstart = (event) => {
      this.userIsDragging = true
      if (onDragStart) onDragStart.call(this, event)
    }

    const onDragEnd = events.dragend
    events.dragend = (event) => {
      this.userIsDragging = false
      if (onDragEnd) onDragEnd.call(this, event)
    }

    return events
  },

  setTime (time) {
    const applyU = typeof this.uSource.setTime === 'function'
    const applyV = typeof this.vSource.setTime === 'function'
    if (applyU || applyV) {
      if (!this.pendingAdd) { this._resetView() }
      if (applyU) { this.uSource.setTime(time) }
      if (applyV) { this.vSource.setTime(time) }
    }
  },

  setLevel (level) {
    const applyU = typeof this.uSource.setLevel === 'function'
    const applyV = typeof this.vSource.setLevel === 'function'
    if (applyU || applyV) {
      if (!this.pendingAdd) { this._resetView() }
      if (applyU) { this.uSource.setLevel(level) }
      if (applyV) { this.vSource.setLevel(level) }
    }
  },

  setModel (model) {
    const modelHeader = {
      nx: model.size[0],
      ny: model.size[1],
      lo1: model.origin[0],
      la1: model.origin[1],
      dx: model.resolution[0],
      dy: model.resolution[1]
    }

    // it is possible to override model parameters through the layer conf
    // check that here
    if (this.conf.meteoModelOverride) {
      const override = this.conf.meteoModelOverride[model.name]
      if (override) Object.assign(modelHeader, override)
    }

    Object.assign(this.uFlow.header, modelHeader)
    Object.assign(this.vFlow.header, modelHeader)

    // generate corresponding _empty_ array
    const size = modelHeader.nx * modelHeader.ny
    this.uFlow.data = new Array(size)
    this.vFlow.data = new Array(size)
    for (let i = 0; i < size; ++i) this.uFlow.data[i] = this.vFlow.data[i] = 0

    // compute a good enough maxNativeZoom value to ensure
    // the smallest leaflet tile will approximately match a weacast tile
    // robin: this is not needed anymore since weacast grid source
    // now request weacasts tiles directly and use a cache by default to reuse
    // already requested weacast tiles.
    // const modelBounds = L.latLngBounds(L.latLng(model.bounds[1], model.bounds[0]), L.latLng(model.bounds[3], model.bounds[2]))
    // const modelTileSize = L.latLng(model.tileResolution[1], model.tileResolution[0])
    // this.options.maxNativeZoom = computeIdealMaxNativeZoom(this, modelBounds, modelTileSize)

    const applyU = typeof this.uSource.setModel === 'function'
    const applyV = typeof this.vSource.setModel === 'function'
    if (applyU || applyV) {
      if (!this.pendingAdd) { this._resetView() }
      if (applyU) { this.uSource.setModel(model) }
      if (applyV) { this.vSource.setModel(model) }
    }
  },

  onDataChanged () {
    // we're listening to 2 sources: u and v
    // so wait every 2 fired events to process anything
    ++this.numDataChanged
    if (this.numDataChanged !== 2) return
    this.numDataChanged = 0

    this.loadedTiles.clear()

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
    // otherwise, leaflet will start loading meaningless tiles
    this.pendingAdd = map
  },

  onPendingAdd () {
    const map = this.pendingAdd
    this.loadedTiles.clear()

    L.GridLayer.prototype.onAdd.call(this, map)
    map.addLayer(this.velocityLayer)
    this.velocityLayer.setData([this.uFlow, this.vFlow])
    this.velocityLayer._initWindy(this.velocityLayer)
    // disable some velocity layer event handling since we override some of it
    // no need to stop animation when panning
    this._map.off('dragstart', this.velocityLayer._windy.stop)
    this._map.off('dragend', this.velocityLayer._clearAndRestart)

    this.pendingAdd = null
  },

  onRemove (map) {
    if (this.pendingAdd) {
      this.pendingAdd = null
    } else {
      map.removeLayer(this.velocityLayer)
      L.GridLayer.prototype.onRemove.call(this, map)
    }

    this.uSource.invalidate()
    this.vSource.invalidate()
    this.loadedTiles.clear()
  },

  updateWindArray (grid, element, reqBBox, debug) {
    const [iminlat, iminlon, imaxlat, imaxlon] = grid.getBestFit(reqBBox)
    const startlat = grid.getLat(iminlat)
    const startlon = grid.getLon(iminlon)
    const istartx = Math.round((startlon - element.header.lo1) / element.header.dy)
    const istarty = Math.round((element.header.la1 - startlat) / element.header.dx)

    for (let ilon = iminlon; ilon <= imaxlon; ++ilon) {
      for (let ilat = iminlat; ilat <= imaxlat; ++ilat) {
        const val = grid.getValue(ilat, ilon)
        let ix = istartx + (ilon - iminlon)
        let iy = istarty - (ilat - iminlat)
        if (ix < 0) ix += element.header.nx
        if (iy < 0) iy += element.header.ny
        const idx = ix + iy * element.header.nx
        element.data[idx] = val
      }
    }
  },

  createTile (coords) {
    const tile = document.createElement('div')

    // check we need to load the tile
    // we don't have to load it when a tile at an upper zoom level encompassing the tile is already loaded
    // TODO: we may also check if we have all the sub tiles loaded too ...
    const skipTile = tileSetContainsParent(this.loadedTiles, coords)

    if (this.conf.enableDebug) {
      tile.style.outline = '1px solid blue'
      tile.innerHTML = `${coords.x} ${coords.y} ${coords.z} :`
    }

    if (!skipTile) {
      if (this.conf.enableDebug) {
        tile.innerHTML += ' requested'
      }

      // bbox we'll request to the grid source
      const bounds = this._tileCoordsToBounds(coords)
      const reqBBox = [bounds.getSouth(), bounds.getWest(), bounds.getNorth(), bounds.getEast()]

      // compute an ideal resolution for grid sources that care
      const tileSize = this.getTileSize()
      const resolution = [
        this.conf.resolutionScale[0] * ((reqBBox[2] - reqBBox[0]) / (tileSize.y - 1)),
        this.conf.resolutionScale[1] * ((reqBBox[3] - reqBBox[1]) / (tileSize.x - 1))
      ]

      // request data
      const uPromise = this.uSource.fetch(null, reqBBox, resolution)
      const vPromise = this.vSource.fetch(null, reqBBox, resolution)

      ++this.pendingFetchs

      // robin: i don't use a finally() call since it fails on firefox for obscure reasons
      // even if it's supported since v58
      // see : https://github.com/vuejs/vue-cli/issues/2012#issuecomment-410369818
      // As an alternative i call this from .then() and .catch() ...
      const doFinally = () => {
        // in any case
        --this.pendingFetchs
        if (this.pendingFetchs === 0 && !this.userIsDragging) {
          // last pending fetch triggers a wind restart
          this.velocityLayer._clearAndRestart()
          if (this.conf.enableDebug) {
            tile.innerHTML += ', triggered wind restart'
          }
        }
      }

      Promise.all([uPromise, vPromise]).then(grids => {
        // data fetched
        const uGrid = grids[0]
        const vGrid = grids[1]

        if (uGrid && vGrid) {
          if (uGrid.sourceKey === this.uSource.sourceKey && vGrid.sourceKey === this.vSource.sourceKey) {
            // fill in big arrays
            this.updateWindArray(uGrid, this.uFlow, reqBBox)
            this.updateWindArray(vGrid, this.vFlow, reqBBox)
            // remember we have data for this leaflet tile
            this.loadedTiles.add(tile2key(coords))

            if (this.conf.enableDebug) {
              tile.style.outline = '1px solid green'
              tile.innerHTML += ', added to loadedTiles'
            }
          } else {
            if (this.conf.enableDebug) {
              tile.style.outline = '1px solid red'
              tile.innerHTML += ', discarded (out of date)'
            }
          }
        } else {
          if (this.conf.enableDebug) {
            tile.style.outline = '1px solid green'
            tile.innerHTML += ', empty'
          }
        }

        doFinally()
      }).catch(err => {
        // fetch failed
        if (this.conf.enableDebug) {
          tile.style.outline = '1px solid red'
          tile.innerHTML += `, failed (${err})`
        }

        doFinally()

        throw err
      })
    } else {
      if (this.conf.enableDebug) {
        tile.style.outline = '1px solid green'
        tile.innerHTML += ' skipped'
      }
    }

    return tile
  },

  redraw () {
    this.loadedTiles.clear()
    this.velocityLayer._clearWind()
    this.uFlow.data.fill(0)
    this.vFlow.data.fill(0)

    L.GridLayer.prototype.redraw.call(this)
  },

  getBounds () {
    const bounds = this.options.bounds ? this.options.bounds : L.latLngBounds(L.latLng(-90, -180), L.latLng(90, 180))
    return this._map ? this._map.wrapLatLngBounds(bounds) : bounds
  }
})

export { TiledWindLayer }
