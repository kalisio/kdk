import _ from 'lodash'
import fetch from 'node-fetch'
import xml2js from 'xml2js'
import { buildUrl } from '../../core/common'

function fetchAsJson (query) {
  return fetch(query, { redirect: 'follow' })
    .then(response => response.text())
    .then(txt => xml2js.parseStringPromise(txt, { tagNameProcessors: [xml2js.processors.stripPrefix] }))
}

export async function discover (tmsUrl, searchParams = {}, caps = null) {
  // fetch root caps if not provided
  if (!caps) {
    caps = await fetchAsJson(buildUrl(tmsUrl, searchParams))
  }

  // decode from caps
  const probe = {
    version: _.get(caps, 'TileMapService.$.version'),
    availableLayers: {}
  }

  const layerRoot = _.get(caps, 'TileMapService.TileMaps[0].TileMap')
  const allPromises = []
  for (const layer of layerRoot) {
    // fetch detailed layer informations
    const p = fetchAsJson(buildUrl(layer.$.href, searchParams)).then(json => {
      const obj = {
        id: _.get(json, 'TileMap.Title[0]'),
        display: _.get(json, 'TileMap.Title[0]'),
        description: _.get(json, 'TileMap.Abstract[0]'),
        srs: _.get(json, 'TileMap.SRS[0]'),
        extension: _.get(json, 'TileMap.TileFormat[0].$.extension'),
        url: layer.$.href
      }
      probe.availableLayers[obj.id] = obj
    })
    allPromises.push(p)
  }

  await Promise.all(allPromises)

  return probe
}
