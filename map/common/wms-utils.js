import _ from 'lodash'
import fetch from 'node-fetch'
import xml2js from 'xml2js'
import { buildUrl } from '../../core/common/index.js'

// https://www.opengeospatial.org/standards/wms

function fetchAsJson (query, headers = {}) {
  return fetch(query, { redirect: 'follow', headers })
    .then(response => response.text())
    .then(txt => xml2js.parseStringPromise(txt, { tagNameProcessors: [xml2js.processors.stripPrefix] }))
}

function parseVersion (version) {
  const parts = version.split('.')
  return parseInt(parts[0]) * 1000000 + parseInt(parts[1]) * 1000 + (parts.length > 2 ? parseInt(parts[2]) : 0)
}

export function GetCapabilities (url, searchParams = {}, headers = {}) {
  const query = buildUrl(url, Object.assign({
    SERVICE: 'WMS',
    REQUEST: 'GetCapabilities'
  }, searchParams))
  return fetchAsJson(query, headers)
}

export function makeGetLegendGraphic (url, version, layer, style, searchParams = {}, headers = {}) {
  const additionalParams = {}
  if (style) additionalParams.STYLE = style
  if (!version) version = '1.0.0'
  if (parseVersion(version) >= parseVersion('1.3.0')) additionalParams.SLD_VERSION = '1.1.0'
  return buildUrl(url, Object.assign({
    SERVICE: 'WMS',
    REQUEST: 'GetLegendGraphic',
    VERSION: version,
    FORMAT: 'image/png',
    LAYER: layer
  }, additionalParams, searchParams))
}

export async function discover (url, searchParams = {}, headers = {}, caps = null) {
  if (!caps) {
    caps = await GetCapabilities(url, searchParams, headers)
  }

  const root = caps.WMS_Capabilities ? caps.WMS_Capabilities : caps.WMT_MS_Capabilities

  const out = {
    version: _.get(root, '$.version'),
    availableLayers: {}
  }

  const layerRoot = _.get(root, 'Capability[0].Layer')
  if (layerRoot) {
    const flat = layerRoot.slice()
    // collect all 'Layer' nodes in a flat array
    for (let i = 0; i < flat.length; ++i) {
      const children = _.get(flat[i], 'Layer')
      if (children) {
        for (const c of children) flat.push(c)
      }
    }

    flat.forEach(layer => {
      const id = _.get(layer, 'Name[0]')
      const display = _.get(layer, 'Title[0]', id)
      if (id && display) {
        const description = _.get(layer, 'Abstract[0]', '')
        const obj = { id, display, description, styles: {} }
        if (layer.CRS) obj.crs = layer.CRS
        // lookup styles
        for (const st of _.get(layer, 'Style', [])) {
          const id = st.Name[0]
          const display = _.get(st, 'Title[0]', id || 'default')
          const legend = _.get(st, 'LegendURL[0].OnlineResource[0].$.xlink:href')
          obj.styles[id] = { id, display, legend: legend ? buildUrl(legend, searchParams) : undefined }
        }
        // extract extent
        if (layer.EX_GeographicBoundingBox) {
          const node = layer.EX_GeographicBoundingBox[0]
          const west = parseFloat(node.westBoundLongitude)
          const east = parseFloat(node.eastBoundLongitude)
          const south = parseFloat(node.southBoundLatitude)
          const north = parseFloat(node.northBoundLatitude)
          obj.extent = { west, east, south, north }
        } else if (layer.BoundingBox) {
          const node = layer.BoundingBox[0]
          if (node.$.CRS === 'EPSG:4326') {
            const west = parseFloat(node.$.miny)
            const east = parseFloat(node.$.maxy)
            const south = parseFloat(node.$.minx)
            const north = parseFloat(node.$.maxx)
            obj.extent = { west, east, south, north }
          }
        }
        // check for time dimension
        for (const dimension of _.get(layer, 'Dimension', [])) {
          if (_.get(dimension, '$.name', '').toLowerCase() === 'time') {
            const timeRange = _.get(dimension, '_')
            // If time range is not given in dimension it should be in extent
            if (timeRange) _.set(obj, 'timeDimension.times', timeRange.trim())
            else if (!_.has(obj, 'timeDimension')) _.set(obj, 'timeDimension', {})
          }
        }
        // check for time range
        if (obj.timeDimension) {
          for (const extent of _.get(layer, 'Extent', [])) {
            if (_.get(extent, '$.name', '').toLowerCase() === 'time') {
              const timeRange = _.get(extent, '_')
              // If time range is not given in extent it should be in dimension
              if (timeRange) _.set(obj, 'timeDimension.times', timeRange.trim())
              else if (!_.has(obj, 'timeDimension')) _.set(obj, 'timeDimension', {})
            }
          }
        }
        out.availableLayers[obj.id] = obj
      }
    })
  }

  return out
}
