import _ from 'lodash'
import fetch from 'node-fetch'
import xml2js from 'xml2js'
import { buildUrl } from '../../core/common'

// https://www.opengeospatial.org/standards/wms

function fetchAsJson (query, {} = {}) {
  return fetch(query)
    .then(response => response.text())
    .then(txt => xml2js.parseStringPromise(txt, { tagNameProcessors: [ xml2js.processors.stripPrefix ] }))
}

export function GetCapabilities (url, searchParams = {}) {
  const query = buildUrl(url, Object.assign({
    SERVICE: 'WMS',
    REQUEST: 'GetCapabilities'
  }, searchParams))
  return fetchAsJson(query)
}

export async function discover (url, searchParams = {}, caps = null) {
  if (!caps) {
    caps = await GetCapabilities(url, searchParams)
  }

  const root = caps.WMS_Capabilities ? caps.WMS_Capabilities : caps.WMT_MS_Capabilities

  const out = {
    version: _.get(root, '$.version'),
    availableLayers: []
  }

  const layerRoot = _.get(root, 'Capability[0].Layer')
  if (layerRoot) {
    const flat = layerRoot.slice()
    for (let i = 0; i < flat.length; ++i) {
      const children = _.get(flat[i], 'Layer')
      if (children) {
        for (const c of children) flat.push(c)
      }
    }

    flat.forEach(layer => {
      const id = _.get(layer, 'Name[0]')
      const display = _.get(layer, 'Title[0]')
      if (id && display) {
        const obj = { id, display }
        if (layer.CRS) obj.crs = layer.CRS
        if (layer.Style) {
          obj.styles = layer.Style.map(s => {
            return {
              id: _.get(s, 'Name[0]'),
              display: _.get(s, 'Title[0]'),
              legend: {
                url: _.get(s, 'LegendURL[0].OnlineResource[0].$.xlink:href'),
                format: _.get(s, 'LegendURL[0].Format[0]')
              }
            }
          })
        }
        out.availableLayers.push(obj)
      }
    })
  }

  return out
}

export function decodeCapabilities (caps, version = '') {
  const root = caps.WMS_Capabilities ? caps.WMS_Capabilities : caps.WMT_MS_Capabilities

  const decoded = {
    version: _.get(root, '$.version'),
    availableLayers: []
  }

  const layerRoot = _.get(root, 'Capability[0].Layer')
  if (layerRoot) {
    const flat = layerRoot.slice()
    for (let i = 0; i < flat.length; ++i) {
      const children = _.get(flat[i], 'Layer')
      if (children) {
        for (const c of children) flat.push(c)
      }
    }

    flat.forEach(layer => {
      const id = _.get(layer, 'Name[0]')
      const display = _.get(layer, 'Title[0]')
      if (id && display) {
        const obj = { id, display }
        if (layer.CRS) obj.crs = layer.CRS
        if (layer.Style) {
          obj.styles = layer.Style.map(s => {
            return {
              id: _.get(s, 'Name[0]'),
              display: _.get(s, 'Title[0]'),
              legend: {
                url: _.get(s, 'LegendURL[0].OnlineResource[0].$.xlink:href'),
                format: _.get(s, 'LegendURL[0].Format[0]')
              }
            }
          })
        }
        decoded.availableLayers.push(obj)
      }
    })
  }

  return decoded
}
