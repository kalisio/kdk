import _ from 'lodash'
import { unitConverters, GridSource, toHalf } from './grid.js'

// grid: {
//   bounds : { min, max }
//   resolution_factor: {},
//   vertices: [],
//   indices: []
//   values: []
// }

function genCoordsBuffer (grid) {
  const coords = new Uint16Array(2 * grid.numPoints)

  const deltaLat = grid.maxLat - grid.minLat
  const deltaLon = grid.maxLon - grid.minLon

  let idx = 0
  for (let i = 0; i < grid.data.vertices.length; i += 3) {
    const lon = grid.data.vertices[i]
    const lat = grid.data.vertices[i + 1]

    coords[idx * 2] = toHalf((lat - grid.minLat) / deltaLat)
    coords[idx * 2 + 1] = toHalf((lon - grid.minLon) / deltaLon)

    ++idx
  }

  return { coords,
           minLat: grid.minLat,
           maxLat: grid.maxLat,
           // minLon: grid.minLon,
           // maxLon: grid.maxLon,
           minLon: grid.minLon >= 180.0 ? grid.minLon - 360.0 : grid.minLon,
           maxLon: grid.maxLon >= 180.0 ? grid.maxLon - 360.0 : grid.maxLon,
           deltaLat,
           deltaLon }
}

function genValuesBuffer (grid) {
  const value = new Float32Array(grid.numPoints)

  if (grid.converter) {
    for (let i = 0; i < grid.data.values.length; ++i) { value[i] = grid.converter(grid.data.values[i]) }
  } else {
    for (let i = 0; i < grid.data.values.length; ++i) { value[i] = grid.data.values[i] }
  }

  return value
}

function genMeshIndexBuffer (grid) {
  const maxIndex = grid.data.vertices.length - 1
  return maxIndex > 65534 ? new Uint32Array(grid.data.indices) : new Uint16Array(grid.data.indices)
}

function genWireframeIndexBuffer (grid) {
  return genMeshIndexBuffer(grid)
}

export class KazarrGridSource extends GridSource {
  static getKey () {
    return 'kazarr'
  }

  constructor (options) {
    super(options)

    this.usable = false
  }

  getBBox () {
    return this.usable ? [this.minMaxLat[0], this.minMaxLon[0], this.minMaxLat[1], this.minMaxLon[1]] : null
  }

  getDataBounds () {
    return this.usable ? this.minMaxVal : null
  }

  async setup (config) {
    this.usable = false
    ++this.sourceKey

    this.minMaxLat = null
    this.minMaxLon = null
    this.minMaxVal = null

    this.config = config
    this.converter = this.config.converter ? unitConverters[this.config.converter] : null

    const question = this.config.url.indexOf('?')
    const datasetUrl = question === -1
      ? `${this.config.url}/datasets/${this.config.dataset}/metadata`
      : `${this.config.url.substring(0, question)}/datasets/${this.config.dataset}/metadata${this.config.url.substring(question)}`

    try {
      const resp = await fetch(datasetUrl)
      const json = await resp.json()
      if (json.bounding_box) {
        this.minMaxLat = [json.bounding_box.lat.min, json.bounding_box.lat.max]
        this.minMaxLon = [json.bounding_box.lon.min, json.bounding_box.lon.max]
      }
    } catch (error) {
      console.error(`Failed requesting ${this.config.dataset} metadata from ${this.config.url}`)
    }

    // Internal tile management requires longitude in [-180, 180]
    const wrapLongitude = (this.minMaxLon[1] >= 359)
    this.minMaxLon = [wrapLongitude ? -180 : this.minMaxLon[0], wrapLongitude ? 180 : this.minMaxLon[1]]
    this.wrapLon = wrapLongitude

    this.usable = this.minMaxLat !== null && this.minMaxLat !== null

    this.dataChanged()
  }

  async fetch (abort, bbox, resolution) {
    if (!this.usable) { return null }

    // compute which tile(s) we're going to hit
    const minLon = this.wrapLon ? (bbox[1] < 0 ? bbox[1] + 360.0 : bbox[1]) : bbox[1]
    const maxLon = this.wrapLon ? (bbox[3] <= 0 ? bbox[3] + 360.0 : bbox[3]) : bbox[3]

    const reqMinLat = bbox[0]
    const reqMinLon = minLon
    const reqMaxLat = bbox[2]
    const reqMaxLon = maxLon
    const interpolation = this.config?.noInterpolation
      ? {}
      // Default interpolation setup
      : { mesh_tile_size: 16, interp_spatial_method: 'linear' }
    const parameters = Object.assign({
      variable: this.config.variable,
      lon_min: reqMinLon,
      lon_max: reqMaxLon,
      lat_min: reqMinLat,
      lat_max: reqMaxLat,
      format: 'mesh',
    }, interpolation, this.config.additional)
    let queryParams = ''
    for (const [key, value] of Object.entries(parameters)) { queryParams += _.isEmpty(queryParams) ? `${key}=${value}` : `&${key}=${value}` }

    const question = this.config.url.indexOf('?')
    const tileUrl = question === -1
      ? `${this.config.url}/datasets/${this.config.dataset}/extract?${queryParams}`
      : `${this.config.url.substring(0, question)}/datasets/${this.config.dataset}/extract?${queryParams}&${this.config.url.substring(question + 1)}`

    const resp = await fetch(tileUrl, { signal: abort })
    const json = await resp.json()

    let dataMinLon = json.vertices[0]
    let dataMaxLon = json.vertices[0]
    let dataMinLat = json.vertices[1]
    let dataMaxLat = json.vertices[1]

    for (let i = 3; i < json.vertices.length; i += 3) {
      dataMinLon = Math.min(dataMinLon, json.vertices[i])
      dataMaxLon = Math.max(dataMaxLon, json.vertices[i])
      dataMinLat = Math.min(dataMinLat, json.vertices[i + 1])
      dataMaxLat = Math.max(dataMaxLat, json.vertices[i + 1])
    }

    const grid = {
      sourceKey: this.sourceKey,
      hasData: () => { return json !== undefined },
      // HACK: can't import pixi here, return constant value for now
      // cf. https://github.com/pixijs/pixijs/blob/v7.4.3/packages/constants/src/index.ts#L282
      drawMode: () => { return 4 /* DRAW_MODES.TRIANGLES */ },
      wireframeDrawMode: () => { return 1 /* DRAW_MODES.LINES */ },
      data: json,
      converter: this.converter,
      numPoints: json.values.length,
      minLat: dataMinLat,
      maxLat: dataMaxLat,
      minLon: dataMinLon,
      maxLon: dataMaxLon
    }

    /* support for TiledWindLayer */
    /* determine grid parameter */
    {
      // collect and sort lon, lat coordinates
      const lonCoords = grid.data.vertices.filter((value, index) => (index % 3) === 0).sort((a, b) => a < b ? -1 : a > b ? 1 : 0)
      const latCoords = grid.data.vertices.filter((value, index) => (index % 3) === 1).sort((a, b) => a < b ? -1 : a > b ? 1 : 0)
      // compute differences
      const lonDiffs = lonCoords.slice(1).map((value, i) => value - lonCoords[i])
      const latDiffs = latCoords.slice(1).map((value, i) => value - latCoords[i])

      const deltaLon = Math.max(...lonDiffs)
      const deltaLat = Math.max(...latDiffs)

      const numLons = 1 + Math.round((grid.maxLon - grid.minLon) / deltaLon)
      const numLats = 1 + Math.round((grid.maxLat - grid.minLat) / deltaLat)

      grid.getBestFit = (bbox) => { return [0, 0, numLats-1, numLons-1] }
      grid.getLat = (index) => { return grid.data.vertices[((numLats - (index + 1)) * 3) + 1] }
      grid.getLon = (index) => { return grid.data.vertices[((index * numLats) * 3)] }
      grid.getValue = (ilat, ilon) => { return grid.data.values[(numLats - (ilat + 1)) + (ilon * numLats)] }
    }

    grid.genCoordsBuffer = () => genCoordsBuffer(grid)
    grid.genValuesBuffer = () => genValuesBuffer(grid)
    grid.genMeshIndexBuffer = () => genMeshIndexBuffer(grid)
    grid.genWireframeIndexBuffer = () => genWireframeIndexBuffer(grid)

    return grid
  }
}
