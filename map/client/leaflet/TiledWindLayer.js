import _ from 'lodash'
import L from 'leaflet'
import chroma from 'chroma-js'
import AbortController from 'abort-controller'

import { tile2key } from './utils'
import { makeGridSource, extractGridSourceConfig } from '../../common/grid'

const TiledWindLayer = L.GridLayer.extend({
  initialize (options) {
    L.Util.setOptions(this, options)

    let domain = null
    const classes = _.get(options, 'chromajs.classes', null)
    if (!classes) {
      domain = _.get(options, 'chromajs.domain', null)
    }

    const invert = _.get(options, 'chromajs.invertScale', false)
    const colors = _.get(options, 'chromajs.scale', null)
    const scale = chroma.scale(colors)

    if (domain) {
      this.colorMap = scale.domain(invert ? domain.slice().reverse() : domain)
    } else if (classes) {
      this.colorMap = scale.classes(invert ? classes.slice().reverse() : classes)
    }

    // register event callbacks
    this.on('tileload', (event) => { this.onTileLoad(event) })
    this.on('tileunload', (event) => { this.onTileUnload(event) })
    // this.on('load', (event) => { this.velocityLayer.setData([this.uFlow, this.vFlow]) })

    this.loadedTiles = new Set()

    this.resolutionScale = _.get(options, 'resolutionScale', [1.0, 1.0])

    // instanciate grid source
    const [uKey, uConf] = extractGridSourceConfig(options.u)
    const [vKey, vConf] = extractGridSourceConfig(options.v)
    // instanciate grid source
    this.uSource = makeGridSource(uKey, { weacastApi: options.weacastApi })
    this.vSource = makeGridSource(vKey, { weacastApi: options.weacastApi })
    this.onDataChangedCallback = this.onDataChanged.bind(this)
    this.uSource.on('data-changed', this.onDataChangedCallback)
    this.vSource.on('data-changed', this.onDataChangedCallback)
    this.uSource.setup(uConf)
    this.vSource.setup(vConf)

    // build the underlying velocity layer
    const velocityOptions = Object.assign({
      displayValues: true,
      displayOptions: {
        velocityType: 'Wind',
        position: 'bottomright',
        emptyString: 'No wind data',
        angleConvention: 'bearingCW',
        speedUnit: 'kt'
      },
      minVelocity: this.colorMap.domain()[0],
      maxVelocity: this.colorMap.domain()[1],
      velocityScale: 0.01,      // modifier for particle animations, arbitrarily defaults to 0.005
      colorScale: (this.options.invertScale ? this.colorMap.colors().reverse() : this.colorMap.colors()),
      data: null                // data will be requested on-demand
    }, options)
    this.velocityLayer = L.velocityLayer(velocityOptions)

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

    /*
    this.uFlow.origin = [model.bounds[1], model.bounds[3]]
    this.vFlow.origin = [model.bounds[1], model.bounds[3]]
    */

    const remapLon = model.bounds[2] > 180.0
    // const invertedLat = model.origin[1] - ((model.size[1] - 1) * model.resolution[1])
    // this.windOrigin = [invertedLat, remapLon ? model.origin[0] - 180.0 : model.origin[0]]
    this.windOrigin = [model.origin[1], remapLon ? model.origin[0] - 180.0 : model.origin[0]]

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
  },

  /*
    getEvents () {
    const events = L.GridLayer.prototype.getEvents.call(this)

    // add our custom needs here
    return events
    },
  */

  onAdd (map) {
    L.GridLayer.prototype.onAdd.call(this, map)
    map.addLayer(this.velocityLayer)
  },

  onRemove (map) {
    map.removeLayer(this.velocityLayer)
    L.GridLayer.prototype.onRemove.call(this, map)
  },

  updateWindArray (grid, element, reqBBox) {
    const [iminlat, iminlon, imaxlat, imaxlon] = grid.getBestFit(reqBBox)
    // const startlat = grid.getLat(imaxlat)
    /*
    const startlat = grid.getLat(iminlat)
    const startlon = grid.getLon(iminlon)
    */
    
    /*
    const istartlat = Math.floor((startlat - element.origin[0]) / element.header.dy)
    const istartlon = Math.floor((startlon - element.origin[1]) / element.header.dx)
    */
    // find out where this lat/lon should end up in the wind array
    // wind array assumes descending lat with ascending indices
    // const istartlat = Math.floor((this.windOrigin[0] - startlat) / element.header.dy)
    /*
    const istartlat = Math.floor((startlat - this.windOrigin[0]) / element.header.dy)
    const istartlon = Math.floor((startlon - this.windOrigin[1]) / element.header.dy)
    */

    /*
    let mini = element.header.nx * element.header.ny
    let maxi = 0
    */
    
    for (let ilon = iminlon; ilon <= imaxlon; ++ilon) {
      for (let ilat = iminlat; ilat <= imaxlat; ++ilat) {
        const lat = grid.getLat(ilat)
        const lon = grid.getLon(ilon)
        // compute where this ends up in wind array
        const ix = (lon - this.windOrigin[1]) / element.header.dx
        const iy = (this.windOrigin[0] - lat) / element.header.dy
        const idx = ix + iy * element.header.nx
        
        if (idx < 0 || idx >= element.data.length)  {
          console.log("shit!")
        }
        if (idx === 0) {
          console.log(`lat/lon@0=${grid.getLat(ilat)},${grid.getLon(ilon)} expected ${element.la1},${element.lo1}`)
        }
        element.data[idx] = grid.getValue(ilat, ilon)
        
        /*
        const val = grid.getValue(ilat, ilon)
        const ix = istartlon + (ilon - iminlon)
        const iy = istartlat + (ilat - iminlat)
        // wind array is stored 1d, lon major (ascending), lat (descending)
        const idx = ix + (element.header.ny - (iy + 1)) * element.header.nx
        mini = Math.min(mini, idx)
        maxi = Math.max(maxi, idx)
        if (idx < 0 || idx >= element.data.length)  {
          console.log("shit!")
        }
        if (idx === 0) {
          console.log(`lat/lon@0=${grid.getLat(ilat)},${grid.getLon(ilon)} expected ${element.la1},${element.lo1}`)
        }
        if (idx < 100) {
          console.log(`idx=${idx}, lat/lon@0=${grid.getLat(ilat)},${grid.getLon(ilon)} expected ${element.la1},${element.lo1}`)
        }
        element.data[idx] = val
        */
      }
    }

    // console.log(`mini=${mini} maxi=${maxi}`)
  },

  createTile (coords, done) {
    // bbox we'll request to the grid source
    const bounds = this._tileCoordsToBounds(coords)
    const reqBBox = [bounds.getSouth(), bounds.getWest(), bounds.getNorth(), bounds.getEast()]

    // compute an ideal resolution for grid sources that care
    const tileSize = this.getTileSize()
    const resolution = [
      this.resolutionScale[0] * ((reqBBox[2] - reqBBox[0]) / (tileSize.y - 1)),
      this.resolutionScale[1] * ((reqBBox[3] - reqBBox[1]) / (tileSize.x - 1))
    ]

    const tile = document.createElement('div')
    tile.fetchController = new AbortController()

    // request data
    const uPromise = this.uSource.fetch(tile.fetchController.signal, reqBBox, resolution)
    const vPromise = this.vSource.fetch(tile.fetchController.signal, reqBBox, resolution)

    Promise.all([uPromise, vPromise]).then(grids => {
      // fetch ended, can't abort anymore
      tile.fetchController = null

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

    return tile
  },

  onTileLoad (event) {
    // add tile to loaded tiles set
    const tilekey = tile2key(event.coords)
    this.loadedTiles.add(tilekey)

    // this.velocityLayer.setData([this.uFlow, this.vFlow])
  },

  onTileUnload (event) {
    const tilekey = tile2key(event.coords)
    this.loadedTiles.delete(tilekey)
  }
})

export { TiledWindLayer }
