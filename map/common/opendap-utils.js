import _ from 'lodash'
import parser from 'jsdap/src/parser.js'
import xdr from 'jsdap/src/xdr.js'
import { BaseGrid } from './grid.js'

export const opendapTypes = new Set(['Float32', 'Float64'])

export async function fetchDescriptor (url) {
  const question = url.indexOf('?')
  const ddsUrl = question === -1 ? `${url}.dds` : `${url.substring(0, question)}.dds${url.substring(question)}`
  const dasUrl = question === -1 ? `${url}.das` : `${url.substring(0, question)}.das${url.substring(question)}`

  // request dds & das concurrently
  const ddsReq = fetch(ddsUrl).then(response => response.text())
  const dasReq = fetch(dasUrl).then(response => response.text())
  const [ddsTxt, dasTxt] = await Promise.all([ddsReq, dasReq])

  /* eslint new-cap: ["error", { "newIsCap": false }] */
  const dds = new parser.ddsParser(ddsTxt).parse()
  const das = new parser.dasParser(dasTxt, dds).parse()

  return das
}

export async function fetchData (query, abort = null) {
  // rewritten to use fetch and support aborting request
  const init = abort ? { signal: abort } : { }

  // it sometimes happens that the opendap response is somehow truncated
  // jsdap lib can't parse the buffer because some data is missing ..
  // in this case, let the code make a few attempts before failing for good
  let dds = null
  let dap = null
  let attempt = 0

  while (!dap) {
    ++attempt

    try {
      const data = await fetch(query, init).then(response => response.arrayBuffer())
      const view = new DataView(data)

      // accumulate string till '\nData:\n' marker
      let ddsTxt = ''
      let byteIndex = 0
      while (byteIndex < view.byteLength) {
        const u8 = view.getUint8(byteIndex)
        if (u8 === '\n' || u8 === 10) {
          const str = String.fromCodePoint(
            view.getUint8(byteIndex + 1),
            view.getUint8(byteIndex + 2),
            view.getUint8(byteIndex + 3),
            view.getUint8(byteIndex + 4),
            view.getUint8(byteIndex + 5),
            view.getUint8(byteIndex + 6))
          if (str === 'Data:\n') { break }
        }

        ddsTxt += String.fromCodePoint(u8)
        ++byteIndex
      }

      /* eslint new-cap: ["error", { "newIsCap": false }] */
      dds = new parser.ddsParser(ddsTxt).parse()
      dap = new xdr.dapUnpacker(data.slice(byteIndex + 7), dds).getValue()
    } catch (err) {
      // on second attempt, rethrow error ...
      if (attempt >= 2) throw err
    }
  }

  // build an object where each key will be the name of a queried variable
  // and the value will be the queried variable values
  const data = {}
  if (dds && dap) {
    let offset = 0
    for (const field in dds) {
      if (dds[field].type) {
        data[field] = dap[offset]
        offset += 1
      }
    }
  }

  return data
}

export function variableIsGrid (descriptor, variable) {
  const varDesc = descriptor[variable]
  if (varDesc === undefined) { return false }
  return varDesc.type === 'Grid'
}

export function variableIsArray (descriptor, variable) {
  const varDesc = descriptor[variable]
  if (varDesc === undefined) { return false }
  if (varDesc.shape === undefined) { return false }
  return varDesc.shape.length === 1 && opendapTypes.has(varDesc.type)
}

export function getArrayVariableLength (descriptor, variable) {
  const varDesc = descriptor[variable]
  return varDesc.shape[0]
}

export function getGridDimensionLength (descriptor, variable, dimension) {
  const varDesc = descriptor[variable]
  return varDesc.array.shape[dimension]
}

export function makeGridIndices (descriptor, variable, dimensions) {
  const varDesc = descriptor[variable]
  const indices = []
  for (let i = 0; i < varDesc.array.dimensions.length; ++i) {
    const value = dimensions[varDesc.array.dimensions[i]]
    if (value === undefined) { return [] }
    indices.push(value)
  }

  return indices
}

export function makeQuery (base, config) {
  // config is expected to be an object with variables to query as keys
  // and indices to fetch as associated values
  // it can also be a simple list of variables to query with no interval
  let variables
  if (Array.isArray(config)) {
    variables = config
  } else {
    variables = _.keys(config).map(variable => `${variable}[${config[variable]}]`)
  }
  const question = base.indexOf('?')
  const url = (question === -1 ? `${base}.dods?` : `${base.substring(0, question)}.dods${base.substring(question)}&`) + variables.join(',')
  return encodeURI(url)
}

export function getGridDimensionIndex (descriptor, variable, dimension) {
  const varDesc = descriptor[variable]
  if (varDesc === undefined) { return -1 }
  return varDesc.array.dimensions.indexOf(dimension)
}

export function getMinMaxArray (vec) {
  const bounds = vec.reduce((accu, value) => {
    accu[0] = Math.min(accu[0], value)
    accu[1] = Math.max(accu[1], value)
    return accu
  }, [vec[0], vec[0]])
  return bounds
}

export function getGridValue (grid, indices) {
  let dim = 0
  let array = grid
  for (; dim < indices.length - 1; ++dim) { array = array[indices[dim]] }
  return array[indices[dim]]
}

function getFirstGridValue (grid, dimension) {
  let dim = 0
  let array = grid
  for (; dim < dimension - 1; ++dim) { array = array[0] }
  return array[0]
}

export function getMinMaxGrid (grid, dimension) {
  if (dimension > 1) {
    const init = getFirstGridValue(grid, dimension)
    return grid.reduce((accu, value) => {
      const local = getMinMaxGrid(value, dimension - 1)
      return [Math.min(accu[0], local[0]), Math.max(accu[1], local[1])]
    }, [init, init])
  } else {
    return getMinMaxArray(grid)
  }
}

const makeIndicesFunctions = [
  // latSortOrder = SortOrder.ASCENDING, lonSortOrder = SortOrder.ASCENDING
  function (indices, latIndex, lonIndex, ilat, ilon, latCount, lonCount) {
    const local = [...indices]
    local.fill(0)
    local[latIndex] = ilat
    local[lonIndex] = ilon
    return local
  },
  // latSortOrder = SortOrder.ASCENDING, lonSortOrder = SortOrder.DESCENDING
  function (indices, latIndex, lonIndex, ilat, ilon, latCount, lonCount) {
    const local = [...indices]
    local.fill(0)
    local[latIndex] = ilat
    local[lonIndex] = lonCount - (ilon + 1)
    return local
  },
  // latSortOrder = SortOrder.DESCENDING, lonSortOrder = SortOrder.ASCENDING
  function (indices, latIndex, lonIndex, ilat, ilon, latCount, lonCount) {
    const local = [...indices]
    local.fill(0)
    local[latIndex] = latCount - (ilat + 1)
    local[lonIndex] = ilon
    return local
  },
  // latSortOrder = SortOrder.DESCENDING, lonSortOrder = SortOrder.DESCENDING
  function (indices, latIndex, lonIndex, ilat, ilon, latCount, lonCount) {
    const local = [...indices]
    local.fill(0)
    local[latIndex] = latCount - (ilat + 1)
    local[lonIndex] = lonCount - (ilon + 1)
    return local
  }
]

export class OpenDAPGrid extends BaseGrid {
  constructor (sourceKey, bbox, dimensions, data, indices, latIndex, lonIndex, latSortOrder, lonSortOrder, nodata = undefined, converter = null) {
    super(sourceKey, bbox, dimensions, nodata)

    this.data = data
    this.indices = indices
    this.latIndex = latIndex
    this.lonIndex = lonIndex

    const index = lonSortOrder + (latSortOrder * 2)
    this.makeIndices = makeIndicesFunctions[index]

    if (converter) {
      const idx = [...indices]
      idx.fill(0)
      for (let la = 0; la < dimensions[0]; ++la) {
        idx[latIndex] = la
        for (let lo = 0; lo < dimensions[1]; ++lo) {
          idx[lonIndex] = lo
          // get last dimension array
          const array = getGridValue(data, idx.slice(0, idx.length - 1))
          // update value there
          array[idx[idx.length - 1]] = converter(array[idx[idx.length - 1]])
        }
      }
    }
  }

  getValue (ilat, ilon) {
    const indices = this.makeIndices(this.indices, this.latIndex, this.lonIndex, ilat, ilon, this.dimensions[0], this.dimensions[1])
    return getGridValue(this.data, indices)
  }
}
