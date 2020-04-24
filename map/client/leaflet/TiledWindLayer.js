import _ from 'lodash'
import L from 'leaflet'
import chroma from 'chroma-js'

import { makeGridSource, extractGridSourceConfig } from '../../common/grid'
// import { tile2key, tileSetContainsParent } from './utils'

const TiledWindLayer = L.GridLayer.extend({
  initialize (options) {
    L.GridLayer.prototype.initialize.call(this, options)

    // is user currently dragging the map ?
    this.userIsDragging = false
    // number of pending wind fetches
    this.pendingFetchs = 0
    // set of loaded tiles
    // this.loadedTiles = new Set()

    this.resolutionScale = _.get(options, 'resolutionScale', [1.0, 1.0])

    // build colormap
    const domain = _.get(options, 'chromajs.domain', null)
    const colors = _.get(options, 'chromajs.scale', null)
    const invert = _.get(options, 'chromajs.invertScale', false)
    const scale = chroma.scale(colors)
    this.colorMap = scale.domain(invert ? domain.slice().reverse() : domain)

    // instanciate grid sources (one for each component)
    const [uKey, uConf] = extractGridSourceConfig(options.u)
    const [vKey, vConf] = extractGridSourceConfig(options.v)
    this.uSource = makeGridSource(uKey, { weacastApi: options.weacastApi })
    this.vSource = makeGridSource(vKey, { weacastApi: options.weacastApi })
    this.onDataChangedCallback = this.onDataChanged.bind(this)
    this.uSource.on('data-changed', this.onDataChangedCallback)
    this.vSource.on('data-changed', this.onDataChangedCallback)
    this.uSource.setup(uConf)
    this.vSource.setup(vConf)
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
        //  - no wind tile are currently being loaded
        //  - user is not dragging the map
        // this way we reduce the number of restarts
        if (this.pendingFetchs === 0 && !this.userIsDragging) {
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
    if (typeof this.uSource.setTime === 'function') this.uSource.setTime(time)
    if (typeof this.vSource.setTime === 'function') this.vSource.setTime(time)
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

    Object.assign(this.uFlow.header, modelHeader)
    Object.assign(this.vFlow.header, modelHeader)

    // generate corresponding _empty_ array
    const size = modelHeader.nx * modelHeader.ny
    this.uFlow.data = new Array(size)
    this.vFlow.data = new Array(size)
    for (let i = 0; i < size; ++i) this.uFlow.data[i] = this.vFlow.data[i] = 0

    if (typeof this.uSource.setModel === 'function') this.uSource.setModel(model)
    if (typeof this.vSource.setModel === 'function') this.vSource.setModel(model)
  },

  onDataChanged () {
    // we're listening to 2 sources: u and v
    // so wait every 2 fired events to process anything
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

    this.fire('data', [this.uSource, this.vSource])
  },

  onAdd (map) {
    // this.loadedTiles.clear()

    // defer actual addLayer call to the point where we have data ready to be displayed
    // otherwise, leaflet will start loading meaningless tiles
    this.pendingAdd = map
  },

  onPendingAdd () {
    const map = this.pendingAdd

    L.GridLayer.prototype.onAdd.call(this, map)
    map.addLayer(this.velocityLayer)
    this.velocityLayer.setData([this.uFlow, this.vFlow])
    this.velocityLayer._initWindy(this.velocityLayer)
    // disable some velocity layer event handling since we override some of it
    // no need to stop animation when panning
    this._map.off('dragstart', this.velocityLayer._windy.stop)
    this._map.off('dragend', this.velocityLayer._clearAndRestart)
    // this._map.off('zoomstart', this.velocityLayer._windy.stop)
    // this._map.off('zoomend', this.velocityLayer._clearAndRestart)
    // this._map.off('resize', this.velocityLayer._clearWind)

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
  },

  updateWindArray (grid, element, reqBBox, debug) {
    const gridres = grid.getResolution()
    const windres = [element.header.dy, element.header.dx]
    // make sure resolution match
    if (gridres[0] !== windres[0] || gridres[1] !== windres[1]) return

    const [iminlat, iminlon, imaxlat, imaxlon] = grid.getBestFit(reqBBox)
    const startlat = grid.getLat(iminlat)
    const startlon = grid.getLon(iminlon)
    let istartx = Math.round((startlon - element.header.lo1) / element.header.dy)
    const istarty = Math.round((element.header.la1 - startlat) / element.header.dx)

    if (istartx < 0) istartx += element.header.nx

    for (let ilon = iminlon; ilon <= imaxlon; ++ilon) {
      for (let ilat = iminlat; ilat <= imaxlat; ++ilat) {
        const val = grid.getValue(ilat, ilon)
        const ix = (istartx + (ilon - iminlon)) % element.header.nx
        const iy = (istarty - (ilat - iminlat)) % element.header.ny
        const idx = ix + iy * element.header.nx
        element.data[idx] = val
      }
    }
  },

  createTile (coords, done) {
    const tile = document.createElement('div')

    // check we need to load the tile
    // we don't have to load it when a tile at an upper zoom level encompassing the tile is already loaded
    // TODO: we may also check if we have all the sub tiles loaded too ...
    // const skipTile = tileSetContainsParent(this.loadedTiles, coords)
    const skipTile = false

    // Check for zoom level range first
    // if (this.options.minZoom && (this._map.getZoom() < this.options.minZoom)) skipTile = true
    // if (this.options.maxZoom && (this._map.getZoom() > this.options.maxZoom)) skipTile = true

    if (!skipTile) {
      // bbox we'll request to the grid source
      const bounds = this._tileCoordsToBounds(coords)
      const reqBBox = [bounds.getSouth(), bounds.getWest(), bounds.getNorth(), bounds.getEast()]

      // compute an ideal resolution for grid sources that care
      const tileSize = this.getTileSize()
      const resolution = [
        this.resolutionScale[0] * ((reqBBox[2] - reqBBox[0]) / (tileSize.y - 1)),
        this.resolutionScale[1] * ((reqBBox[3] - reqBBox[1]) / (tileSize.x - 1))
      ]

      // request data
      const uPromise = this.uSource.fetch(null, reqBBox, resolution)
      const vPromise = this.vSource.fetch(null, reqBBox, resolution)

      ++this.pendingFetchs

      Promise.all([uPromise, vPromise]).then(grids => {
        // data fetched
        const uGrid = grids[0]
        const vGrid = grids[1]

        ++this.numTiles
        
        if (uGrid && vGrid) {
          // fill in big arrays
          this.updateWindArray(uGrid, this.uFlow, reqBBox)
          this.updateWindArray(vGrid, this.vFlow, reqBBox)
        }
        done(null, tile)
      }).catch(err => {
        // fetch failed
        done(err, tile)
        throw err
      }).finally(() => {
        // in any case
        --this.pendingFetchs
        if (this.pendingFetchs === 0 && !this.userIsDragging) {
          // last pending fetch triggers a wind restart
          this.velocityLayer._clearAndRestart()
        }
      })
    } else {
      setTimeout(() => { done(null, tile) }, 100)
    }

    return tile
  },

  redraw () {
    // this.loadedTiles.clear()

    L.GridLayer.prototype.redraw.call(this)
  }
})

export { TiledWindLayer }
