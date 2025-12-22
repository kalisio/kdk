import { unitConverters, GridSource, Grid1D, SortOrder, toHalf } from './grid.js'

// grid: {
//   bounds : { min, max }
//   resolution_factor: {},
//   vertices: [],
//   indices: []
//   values: []
// }

function genCoordsBuffer(grid) {
    const coords = new Uint16Array(2 * grid.numPoints)

    const deltaLat = grid.maxLat - grid.minLat
    const deltaLon = grid.maxLon - grid.minLon

    let idx = 0
    for (let i = 0; i < grid.data.vertices.length; i += 3) {
        const lon = grid.data.vertices[i]
        const lat = grid.data.vertices[i+1]

        coords[idx * 2] = toHalf((lat - grid.minLat) / deltaLat)
        coords[idx * 2 + 1] = toHalf((lon - grid.minLon) / deltaLon)

        ++idx
    }
    
    return { coords, minLat: grid.minLat, maxLat: grid.maxLat, minLon: grid.minLon, maxLon: grid.maxLon, deltaLat, deltaLon }
}


function genValuesBuffer (grid) {
  const value = new Float32Array(grid.numPoints)

  for (let i = 0; i < grid.data.values.length; ++i) {
      value[i] = grid.converter(grid.data.values[i])
  }
    
  return value
}

function genMeshIndexBuffer (grid) {
    const maxIndex = grid.data.vertices.length - 1
    const numIndex = grid.data.indices.length
    const index = maxIndex > 65534 ? new Uint32Array(grid.data.indices) : new Uint16Array(grid.data.indices)
    // const index = maxIndex > 65534 ? new Uint32Array(numIndex) : new Uint16Array(numIndex)
    // for (let i = 0; i < numIndex; ++i)
    //     index[i] = grid.data.indices[i]
    return index
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
    this.converter = unitConverters[this.config.converter]
    
    const question = this.config.url.indexOf('?')
    const datasetUrl = question === -1
      ? `${this.config.url}/datasets/${this.config.dataset}`
      : `${this.config.url.substring(0, question)}/datasets/${this.config.dataset}${this.config.url.substring(question)}`
    
    try {
      const resp = await fetch(datasetUrl)
      const json = await resp.json()
      if (json.bounding_box) {
        this.minMaxLat = [ json.bounding_box.lat.min, json.bounding_box.lat.max ]
        this.minMaxLon = [ json.bounding_box.lon.min, json.bounding_box.lon.max ]
      }
    } catch (error) {
      console.error(`Failed requesting ${this.config.dataset} metadata from ${this.config.url}`)
    }

    this.usable = this.minMaxLat !== null && this.minMaxLat !== null

    this.dataChanged()
  }

  async fetch (abort, bbox, resolution) {
    if (!this.usable) { return null }

    const sourceKey = this.sourceKey

    const reqMinLat = bbox[0]
    const reqMinLon = bbox[1]
    const reqMaxLat = bbox[2]
    const reqMaxLon = bbox[3]

      /*
    let queryParams = `variable=${this.config.variable}&lon_min=${reqMinLon}&lon_max=${reqMaxLon}&lat_min=${reqMinLat}&lat_max=${reqMaxLat}`
    if (this.config.additional) {
      for (const [key, value] of Object.entries(this.config.additional))
        queryParams += `&${key}=${value}`
    }
    
    const question = this.config.url.indexOf('?')
    const tileUrl = question === -1
      ? `${this.config.url}/datasets/${this.config.dataset}/extract?${queryParams}`
      : `${this.config.url.substring(0, question)}/datasets/${this.config.dataset}/extract?${queryParams}&${this.config.url.substring(question+1)}`
    
    const resp = await fetch(tileUrl)
    const json = await resp.json()

    const databbox = [json.data.latitudes[json.data.latitudes.length - 1],
      json.data.longitudes[0],
      json.data.latitudes[0],
      json.data.longitudes[json.data.longitudes.length-1]
    ]
    
    return new Grid1D(
      sourceKey,
      databbox, json.shape,
      json.data.values, true, SortOrder.DESCENDING, SortOrder.ASCENDING,
      this.nodata, this.converter
    )
       */
      
    let queryParams = `as_mesh=true&variable=${this.config.variable}&lon_min=${reqMinLon}&lon_max=${reqMaxLon}&lat_min=${reqMinLat}&lat_max=${reqMaxLat}`
      queryParams += `&interpolation_grid_size=16`
    if (this.config.additional) {
      for (const [key, value] of Object.entries(this.config.additional))
        queryParams += `&${key}=${value}`
    }
    
    const question = this.config.url.indexOf('?')
    const tileUrl = question === -1
      ? `${this.config.url}/datasets/${this.config.dataset}/extract?${queryParams}`
      : `${this.config.url.substring(0, question)}/datasets/${this.config.dataset}/extract?${queryParams}&${this.config.url.substring(question+1)}`
    
    const resp = await fetch(tileUrl)
    const json = await resp.json()

    let dataMinLon = json.vertices[0]
    let dataMaxLon = json.vertices[0]
    let dataMinLat = json.vertices[1]
    let dataMaxLat = json.vertices[1]

    for (let i = 3; i < json.vertices.length; i+=3) {
        dataMinLon = Math.min(dataMinLon, json.vertices[i])
        dataMaxLon = Math.max(dataMaxLon, json.vertices[i])
        dataMinLat = Math.min(dataMinLat, json.vertices[i+1])
        dataMaxLat = Math.max(dataMaxLat, json.vertices[i+1])
    }
      
    const grid = {
      hasData: () => { return true },
      data: json,
      converter: this.converter,
      numPoints: json.values.length,
      minLat: dataMinLat,
      maxLat: dataMaxLat,
      minLon: dataMinLon,
      maxLon: dataMaxLon
   }

    grid.genCoordsBuffer = () => genCoordsBuffer(grid)
    grid.genValuesBuffer = () => genValuesBuffer(grid)
    grid.genMeshIndexBuffer = () => genMeshIndexBuffer(grid)
    grid.genWireframeIndexBuffer = () => genWireframeIndexBuffer(grid)

    return grid
  }
}
