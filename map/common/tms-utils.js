import _ from 'lodash'
import fetch from 'node-fetch'
import xml2js from 'xml2js'
import { buildUrl } from '../../core/common'

function fetchAsJson (query, {} = {}) {
  return fetch(query)
    .then(response => response.text())
    .then(txt => xml2js.parseStringPromise(txt, { tagNameProcessors: [ xml2js.processors.stripPrefix ] }))
}

export function TileMapService (tmsUrl, searchParams = {}) {
  const query = buildUrl(tmsUrl, searchParams)
  return fetchAsJson(query)
}

export function TileMap (tmsUrl, layer, searchParams = {}) {
  const query = buildUrl(`${tmsUrl}/${layer}`, searchParams)
  return fetchAsJson(query)
}

export async function discover (tmsUrl, searchParams = {}, caps = null) {
  // fetch root caps if not provided
  if (!caps) {
    caps = await TileMapService(tmsUrl, searchParams)
  }

  // decode from caps
  const probe = {
    version: _.get(caps, 'TileMapService.$.version'),
    availableLayers: []
  }

  const layerRoot = _.get(caps, 'TileMapService.TileMaps[0].TileMap')
  const allPromises = []
  for (const layer of layerRoot) {
    const id = _.get(layer, '$.title')
    // fetch detailed layer informations
    const p = TileMap(tmsUrl, id, searchParams).then(json => {
      const obj = {
        id: id,
        display: _.get(json, 'TileMap.Abstract[0]'),
        srs: _.get(layer, '$.srs'),
        format: _.get(json, 'TileMap.TileFormat[0].$.extension'),
        url: _.get(layer, '$.href')
      }
      probe.availableLayers.push(obj)
    })
    allPromises.push(p)
  }

  await Promise.all(allPromises)

  return probe
}
