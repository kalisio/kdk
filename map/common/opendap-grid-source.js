import _ from 'lodash'
import { unitConverters, SortOrder, GridSource, Grid2D } from './grid.js'
import * as dap from './opendap-utils.js'

// https://opendap.github.io/documentation/UserGuideComprehensive.html#Constraint_Expressions

// only assumes grid variable is a regular grid w.r.t lat/lon
export class OpenDapGridSource extends GridSource {
  static getKey () {
    return 'opendap'
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

    this.descriptor = null
    this.indices = null
    this.latCount = 0
    this.latIndex = 0
    this.lonCount = 0
    this.lonIndex = 0

    this.minMaxLat = null
    this.minMaxLon = null
    this.minMaxVal = null
    this.latStep = 0
    this.lonStep = 0
    this.latSortOrder = SortOrder.ASCENDING
    this.lonSortOrder = SortOrder.ASCENDING

    this.canUseGrid2D = false

    this.config = config
    this.converter = unitConverters[this.config.converter]

    try {
      this.descriptor = await dap.fetchDescriptor(this.config.url)
    } catch (error) {
      // fetching may fail, in this case the source
      // will remain in unusable state
      this.descriptor = null
      console.log(`Failed fetching opendap descriptor from ${this.config.url}`)
    }

    if (this.descriptor) {
      const varIsGrid = dap.variableIsGrid(this.descriptor, this.config.variable)
      const latIsArray = dap.variableIsArray(this.descriptor, this.config.latitude)
      const lonIsArray = dap.variableIsArray(this.descriptor, this.config.longitude)
      if (varIsGrid && latIsArray && lonIsArray) {
        this.latIndex = dap.getGridDimensionIndex(this.descriptor, this.config.variable, this.config.latitude)
        this.latCount = dap.getGridDimensionLength(this.descriptor, this.config.variable, this.latIndex)
        this.lonIndex = dap.getGridDimensionIndex(this.descriptor, this.config.variable, this.config.longitude)
        this.lonCount = dap.getGridDimensionLength(this.descriptor, this.config.variable, this.lonIndex)

        // build grid indexing array
        const dimensions = await this.getDimensionsAsIndices()
        dimensions[this.config.latitude] = `0:${this.latCount - 1}`
        dimensions[this.config.longitude] = `0:${this.lonCount - 1}`
        this.indices = dap.makeGridIndices(this.descriptor, this.config.variable, dimensions)
        if (this.indices.length !== 0) {
          // if lat and lon dimensions are the last in the query, we can
          // use a Grid2D directly (cheaper on cpu)
          const last = this.indices.length - 1
          if ((this.latIndex === last && this.lonIndex === (last - 1)) ||
              (this.latIndex === (last - 1) && this.lonIndex === last)) {
            this.canUseGrid2D = true
          }

          // TODO: store metadata somewhere instead of requesting the whole variable
          await this.computeMetaDataFromData()

          // flag source as usable
          this.usable = true
        } else {
          console.log("Couldn't create index array for grid")
        }
      } else {
        if (!varIsGrid) console.log(`${this.config.variable} is not a grid variable!`)
        if (!latIsArray) console.log(`${this.config.latitude} is expected to be an array variable!`)
        if (!lonIsArray) console.log(`${this.config.longitude} is expected to be an array variable!`)
      }
    }

    this.dataChanged()
  }

  async fetch (abort, bbox, resolution) {
    if (!this.usable) { return null }

    const query = this.makeQuery(bbox, resolution)
    if (!query) { return null }

    const sourceKey = this.sourceKey

    const data = await dap.fetchData(query, abort)
    const req = data[this.config.variable]
    const valData = req[0]
    const latData = req[this.latIndex + 1]
    const lonData = req[this.lonIndex + 1]

    const lat0 = latData[0]
    const lat1 = latData[latData.length - 1]
    let lon0 = lonData[0]
    let lon1 = lonData[lonData.length - 1]

    // normalize bounds
    if (lon0 > 180.0) lon0 -= 360.0
    if (lon1 > 180.0) lon1 -= 360.0
    const databbox = [Math.min(lat0, lat1), Math.min(lon0, lon1), Math.max(lat0, lat1), Math.max(lon0, lon1)]

    if (this.canUseGrid2D) {
      const indices = this.indices.slice(0, this.indices.length - 2)
      indices.fill(0)
      const subgrid = dap.getGridValue(valData, indices)
      return new Grid2D(
        sourceKey,
        databbox, [latData.length, lonData.length],
        subgrid, this.latIndex < this.lonIndex, this.latSortOrder, this.lonSortOrder,
        this.nodata, this.converter)
    }

    return new dap.OpenDAPGrid(
      sourceKey,
      databbox, [latData.length, lonData.length],
      valData, this.indices, this.latIndex, this.lonIndex,
      this.latSortOrder, this.lonSortOrder,
      this.nodata, this.converter)
  }

  makeQuery (bbox, resolution) {
    const reqMinLat = bbox[0]
    const reqMinLon = bbox[1]
    const reqMaxLat = bbox[2]
    const reqMaxLon = bbox[3]

    // compute coordinates indices (assume lat/lon both ascending)
    let iMinLat = Math.floor((reqMinLat - this.minMaxLat[0]) / this.latStep)
    let iMinLon = Math.floor((reqMinLon - this.minMaxLon[0]) / this.lonStep)
    let iMaxLat = Math.ceil((reqMaxLat - this.minMaxLat[0]) / this.latStep)
    let iMaxLon = Math.ceil((reqMaxLon - this.minMaxLon[0]) / this.lonStep)

    // clamp indices
    iMinLat = Math.min(Math.max(iMinLat, 0), this.latCount - 1)
    iMinLon = Math.min(Math.max(iMinLon, 0), this.lonCount - 1)
    iMaxLat = Math.min(Math.max(iMaxLat, 0), this.latCount - 1)
    iMaxLon = Math.min(Math.max(iMaxLon, 0), this.lonCount - 1)

    if (this.latSortOrder === SortOrder.DESCENDING) {
      const tmp = iMinLat
      iMinLat = this.latCount - 1 - iMaxLat
      iMaxLat = this.latCount - 1 - tmp
    }
    if (this.lonSortOrder === SortOrder.DESCENDING) {
      const tmp = iMinLon
      iMinLon = this.lonCount - 1 - iMaxLon
      iMaxLon = this.lonCount - 1 - tmp
    }

    // compute ideal stride according to requested resolution
    const strideLat = Math.max(1, Math.floor(resolution[0] / this.latStep))
    const strideLon = Math.max(1, Math.floor(resolution[1] / this.lonStep))

    // eventually adjust iMLax{Lat,Lon} when using a stride != 1
    // this ensure we'll get our initial iMin/iMax range no matter
    // what the stride is
    if (strideLat > 1) {
      iMaxLat = Math.min(this.latCount - 1, iMaxLat + strideLat)
    }
    if (strideLon > 1) {
      iMaxLon = Math.min(this.lonCount - 1, iMaxLon + strideLon)
    }

    // These are indices to index in the opendap variable grid, we're filling the
    // latitude/longitude indices with correct values to cover the requested
    // bounding box with the requested resolution
    const indices = [...this.indices]
    indices[this.latIndex] = `${iMinLat}:${strideLat}:${iMaxLat}`
    indices[this.lonIndex] = `${iMinLon}:${strideLon}:${iMaxLon}`

    const conf = {}
    conf[this.config.variable] = indices.join('][')
    return dap.makeQuery(this.config.url, conf)
  }

  async computeMetaDataFromData () {
    // Query first and last latitude and longitude
    const query = {}
    query[this.config.latitude] = `0:${this.latCount - 1}:${this.latCount - 1}`
    query[this.config.longitude] = `0:${this.lonCount - 1}:${this.lonCount - 1}`
    const url = dap.makeQuery(this.config.url, query)
    const res = await dap.fetchData(url)

    const latData = res[this.config.latitude]
    const lonData = res[this.config.longitude]

    const lat0 = latData[0]
    const lat1 = latData[latData.length - 1]
    this.minMaxLat = [Math.min(lat0, lat1), Math.max(lat0, lat1)]
    const lon0 = lonData[0] > 180.0 ? lonData[0] - 360.0 : lonData[0]
    const lon1 = lonData[lonData.length - 1] > 180.0 ? lonData[lonData.length - 1] - 360.0 : lonData[lonData.length - 1]
    this.minMaxLon = [Math.min(lon0, lon1), Math.max(lon0, lon1)]

    // grid resolution
    this.latStep = (this.minMaxLat[1] - this.minMaxLat[0]) / (this.latCount - 1)
    this.lonStep = (this.minMaxLon[1] - this.minMaxLon[0]) / (this.lonCount - 1)

    // deduce whether lat/lon dimensions are store in ascending or descending order
    this.latSortOrder = lat0 < lat1 ? SortOrder.ASCENDING : SortOrder.DESCENDING
    this.lonSortOrder = lon0 < lon1 ? SortOrder.ASCENDING : SortOrder.DESCENDING
  }

  async getDimensionsAsIndices () {
    // config.dimensionsAsIndices contains indices
    // config.dimensionsAsValues contains dimension values for which we
    // need to lookup actual index

    const dimensions = {}
    if (this.config.dimensionsAsIndices) {
      Object.assign(dimensions, this.config.dimensionsAsIndices)
    }
    if (this.config.dimensionsAsValues) {
      // build a request to query the values for each dimension for which we have a value
      // const requested = _.keys(this.config.dimensionsAsValues)
      const variables = _.keys(this.config.dimensionsAsValues)
      const query = dap.makeQuery(this.config.url, variables)
      const data = await dap.fetchData(query, null)
      // lookup corresponding indices
      for (let i = 0; i < variables.length; ++i) {
        const varValues = data[variables[i]]
        const varValue = this.config.dimensionsAsValues[variables[i]]
        let valueIndex = -1
        for (let j = 0; j < varValues.length && valueIndex === -1; ++j) {
          if (varValues[j] === varValue) { valueIndex = j }
        }
        if (valueIndex === -1) {
          // value not found :(
          throw new Error(`Failed looking up value '${varValue}' for dimension named '${variables[i]}'`)
        }

        dimensions[variables[i]] = valueIndex
      }
    }

    return dimensions
  }
}
