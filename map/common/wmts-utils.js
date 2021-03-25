import _ from 'lodash'
import fetch from 'node-fetch'
import xml2js from 'xml2js'
import { buildUrl } from '../../core/common'

// https://www.opengeospatial.org/standards/wmts

function fetchAsJson (query) {
  return fetch(query)
    .then(response => response.text())
    .then(txt => xml2js.parseStringPromise(txt, { tagNameProcessors: [xml2js.processors.stripPrefix] }))
}

export function GetCapabilities (url, searchParams = {}) {
  const query = buildUrl(url, Object.assign({
    SERVICE: 'WMTS',
    REQUEST: 'GetCapabilities'
  }, searchParams))
  return fetchAsJson(query)
}

export async function discover (url, searchParams = {}, caps = null) {
  if (!caps) {
    caps = await GetCapabilities(url, searchParams)
  }

  const out = {
    version: _.get(caps, 'Capabilities.$.version'),
    availableLayers: {}
  }

  // compute matching between tilematrixset and crs
  const tileMatrixSet2CRS = {}
  for (const tms of _.get(caps, 'Capabilities.Contents[0].TileMatrixSet')) {
    const id = _.get(tms, 'Identifier[0]')
    const crs = _.get(tms, 'SupportedCRS[0]')
    // try to normalize crs ...
    tileMatrixSet2CRS[id] = crs.split(':').pop()
  }

  const layerRoot = _.get(caps, 'Capabilities.Contents[0].Layer')
  for (const layer of layerRoot) {
    const obj = {
      id: layer.Identifier[0],
      display: _.get(layer, 'Title[0]'),
      description: _.get(layer, 'Abstract[0]'),
      formats: {},
      styles: {},
      crs: {},
      dimensions: {}
    }

    // if no display value, use id by default
    if (!obj.display) obj.display = obj.id
    // update display when display is same as id
    if (obj.id === obj.display && obj.description) obj.display = obj.description

    // check if server exports resource url for tiles
    const tileUrls = {}
    for (const resurl of _.get(layer, 'ResourceURL', [])) {
      if (resurl.$.resourceType !== 'tile') continue
      tileUrls[resurl.$.format] = resurl.$.template
    }
    // lookup formats
    for (const fmt of _.get(layer, 'Format')) {
      obj.formats[fmt] = {
        id: fmt,
        templateUrl: tileUrls[fmt]
      }
    }
    // lookup styles
    for (const st of _.get(layer, 'Style')) {
      const id = st.Identifier[0]
      const display = _.get(st, 'Title[0]', id || 'default')
      const legend = _.get(st, 'LegendURL.$.xlink:href')
      obj.styles[id] = { id, display, legend }
    }
    // lookup available crs
    for (const link of _.get(layer, 'TileMatrixSetLink')) {
      const tms = _.get(link, 'TileMatrixSet[0]')
      if (tms) obj.crs[tileMatrixSet2CRS[tms]] = tms
    }
    // lookup dimensions
    for (const dim of _.get(layer, 'Dimension', [])) {
      const id = dim.Identifier[0]
      const def = _.get(dim, 'Default[0]')
      obj.dimensions[id] = { id, defaultValue: def }
    }

    out.availableLayers[obj.id] = obj
  }

  return out
}

export function buildLeafletUrl (baseUrl, layer, { style = '', crs = '', format = '', dims = {}, searchParams = {} } = {}) {
  const templateUrl = _.get(layer.formats, `${format}.templateUrl`)
  if (templateUrl) {
    let url = templateUrl.replace(/{Style}/i, style)
    url = url.replace(/{TileMatrixSet}/i, layer.crs[crs])
    url = url.replace(/{TileMatrix}/i, '{z}')
    url = url.replace(/{TileRow}/i, '{y}')
    url = url.replace(/{TileCol}/i, '{x}')

    const defaultDims = {}
    for (const dim in layer.dimensions) {
      if (layer.dimensions[dim].defaultValue) {
        defaultDims[dim] = layer.dimensions[dim].defaultValue
      }
    }
    const allDims = Object.assign(defaultDims, dims)
    for (const dim in allDims) url = url.replace(`{${dim}}`, allDims[dim])
    return buildUrl(url, searchParams)
  }

  // otherwise try to generate a sensible url
  const fmt2ext = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg'
  }
  const ext = _.get(fmt2ext, format.toLowerCase(), 'png')
  return buildUrl(`${baseUrl}/${layer.id}/${style}/${layer.crs[crs]}/{z}/{y}/{x}.${ext}`, searchParams)
}
