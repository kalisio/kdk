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
    availableLayers: []
  }

  const tileMatrix2CRS = {}
  for (const tms of _.get(caps, 'Capabilities.Contents[0].TileMatrixSet')) {
    const id = _.get(tms, 'Identifier[0]')
    const crs = _.get(tms, 'SupportedCRS[0]')
    // try to normalize crs ...
    tileMatrix2CRS[id] = crs.split(':').pop()
  }

  const layerRoot = _.get(caps, 'Capabilities.Contents[0].Layer')
  for (const layer of layerRoot) {
    const obj = {
      id: _.get(layer, 'Identifier[0]'),
      display: _.get(layer, 'Title[0]'),
      description: _.get(layer, 'Abstract[0]'),
      format: _.get(layer, 'Format[0]'),
      styles: [],
      crs: {}
    }

    // update display when display is same as id
    if (obj.id === obj.display) obj.display = obj.description

    for (const st of _.get(layer, 'Style')) {
      const id = st.Identifier
      const display = st.Title
      obj.styles.push({ id, display })
    }
    for (const tm of _.get(layer, 'TileMatrixSetLink[0].TileMatrixSet')) {
      obj.crs[tileMatrix2CRS[tm]] = tm
    }

    out.availableLayers.push(obj)
  }

  return out
}
