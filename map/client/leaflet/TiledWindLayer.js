import _ from 'lodash'
import L from 'leaflet'
import chroma from 'chroma-js'

import { makeGridSource, extractGridSourceConfig } from '../../common/grid'
import { tile2key, tileSetContainsParent } from './utils'

const TiledWindLayer = L.GridLayer.extend({
  initialize (options) {
    L.Util.setOptions(this, options)

    // number of tiles currently being loaded
    this.pendingTiles = 0
    // set of loaded tiles
    this.loadedTiles = new Set()

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
      if (!this.velocityLayer._windy) {
        this.velocityLayer._initWindy(this.velocityLayer)

        // disable some velocity layer event handling since we override some of it
        // no need to stop animation when panning
        this._map.off('dragstart', this.velocityLayer._windy.stop)
        this._map.off('dragend', this.velocityLayer._clearAndRestart)
        // this._map.off('zoomstart', this.velocityLayer._windy.stop)
        // this._map.off('zoomend', this.velocityLayer._clearAndRestart)
        // this._map.off('resize', this.velocityLayer._clearWind)

        // use a timeout here because _startWindy is heavy and would block a lot
        setTimeout(() => { this.velocityLayer._startWindy() }, 400)
      } else {
        if (this.pendingTiles === 0) {
          // clear and restart animation will do just fine
          this.velocityLayer._clearAndRestart()
        } else {
          // otherwise just clear, last pending tile will restart the wind
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

    // register event callbacks
    this.on('tileloadstart', (event) => {
      ++this.pendingTiles
    })
    this.on('tileload', (event) => {
      this.onTileLoad(event)
      this.decrementPendingTiles()
    })
    this.on('tileerror', (event) => {
      this.decrementPendingTiles()
    })
  },

  setTime (time) {
    if (typeof this.uSource.setTime === 'function') {
      this.uSource.setTime(time)
    }
    if (typeof this.vSource.setTime === 'function') {
      this.vSource.setTime(time)
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
    Object.assign(this.uFlow.header, modelHeader)
    Object.assign(this.vFlow.header, modelHeader)

    const invertedLat = model.origin[1] - ((model.size[1] - 1) * model.resolution[1]) // velocity layer expects latitude to decrease with increasing array index
    this.windOrigin = [invertedLat, model.origin[0]]

    // generate corresponding _empty_ array
    this.uFlow.data = Array.from({ length: modelHeader.nx * modelHeader.ny }, (v, i) => undefined)
    this.vFlow.data = Array.from({ length: modelHeader.nx * modelHeader.ny }, (v, i) => undefined)
    this.velocityLayer.setData([this.uFlow, this.vFlow])

    if (typeof this.uSource.setModel === 'function') {
      this.uSource.setModel(model)
    }
    if (typeof this.vSource.setModel === 'function') {
      this.vSource.setModel(model)
    }
  },

  onDataChanged () {
    this.redraw()

    this.fire('data', [this.uSource, this.vSource])
  },

  onAdd (map) {
    this.loadedTiles.clear()
    this.pendingTiles = 0

    L.GridLayer.prototype.onAdd.call(this, map)
    map.addLayer(this.velocityLayer)
  },

  onRemove (map) {
    map.removeLayer(this.velocityLayer)
    L.GridLayer.prototype.onRemove.call(this, map)
  },

  updateWindArray (grid, element, reqBBox) {
    const [iminlat, iminlon, imaxlat, imaxlon] = grid.getBestFit(reqBBox)
    const startlat = grid.getLat(iminlat)
    const startlon = grid.getLon(iminlon)

    // find out where this lat/lon should end up in the wind array
    const istartlat = Math.floor((startlat - this.windOrigin[0]) / element.header.dy)
    const istartlon = Math.floor((startlon - this.windOrigin[1]) / element.header.dx)

    for (let ilon = iminlon; ilon <= imaxlon; ++ilon) {
      for (let ilat = iminlat; ilat <= imaxlat; ++ilat) {
        const val = grid.getValue(ilat, ilon)
        const ix = istartlon + (ilon - iminlon)
        const iy = istartlat + (ilat - iminlat)
        // wind array assumes descending lat with ascending indices (flipped y)
        const idx = ix + (element.header.ny - 1 - iy) * element.header.nx
        element.data[idx] = val
      }
    }

    /*
    for (let ilon = iminlon; ilon <= imaxlon; ++ilon) {
      for (let ilat = iminlat; ilat <= imaxlat; ++ilat) {
        const val = grid.getValue(ilat, ilon)
        const lat = grid.getLat(ilat)
        const lon = grid.getLon(ilon)
        const ix = Math.floor((lon - this.windOrigin[1]) / element.header.dx)
        const iy = Math.floor((lat - this.windOrigin[0]) / element.header.dy)
        // wind array assumes descending lat with ascending indices (flipped y)
        const idx = ix + (element.header.ny - 1 - iy) * element.header.nx
        element.data[idx] = val
      }
    }
    */
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

      Promise.all([uPromise, vPromise]).then(grids => {
        const uGrid = grids[0]
        const vGrid = grids[1]

        if (uGrid && vGrid) {
          // fill in big arrays
          this.updateWindArray(uGrid, this.uFlow, reqBBox)
          this.updateWindArray(vGrid, this.vFlow, reqBBox)
        }

        done(null, tile)
      }).catch(err => {
        done(err, tile)
        throw err
      })
    } else {
      setTimeout(() => { done(null, tile) }, 100)
    }

    return tile
  },

  onTileLoad (event) {
    // add tile to loaded tiles set
    const tilekey = tile2key(event.coords)
    this.loadedTiles.add(tilekey)
  },

  decrementPendingTiles () {
    --this.pendingTiles
    if (this.pendingTiles === 0) {
      // last pending tile triggers a wind restart
      this.velocityLayer._clearAndRestart()
    }
  },

  redraw () {
    this.loadedTiles.clear()

    L.GridLayer.prototype.redraw.call(this)
  }
})

export { TiledWindLayer }
