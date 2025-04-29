import _ from 'lodash'
import fetch from 'node-fetch'
import xml2js from 'xml2js'
import { buildUrl } from '../../core/common/index.js'

function fetchAsJson (query, headers = {}) {
  return fetch(query, { redirect: 'follow', headers })
    .then(response => response.text())
    .then(txt => xml2js.parseStringPromise(txt, { tagNameProcessors: [xml2js.processors.stripPrefix] }))
}

export async function discover (tmsUrl, searchParams = {}, headers = {}, caps = null) {
  // fetch root caps if not provided
  if (!caps) {
    caps = await fetchAsJson(buildUrl(tmsUrl, searchParams), headers)
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
    const p = fetchAsJson(buildUrl(layer.$.href, searchParams), headers).then(json => {
      const obj = {
        id: _.get(json, 'TileMap.Title[0]'),
        display: _.get(json, 'TileMap.Title[0]'),
        description: _.get(json, 'TileMap.Abstract[0]'),
        srs: _.get(json, 'TileMap.SRS[0]'),
        extension: _.get(json, 'TileMap.TileFormat[0].$.extension'),
        url: layer.$.href
      }
      // extent
      const boundingBox = _.get(json, 'TileMap.BoundingBox[0]')
      if (boundingBox) {
        let west = parseFloat(boundingBox.$.minx)
        let east = parseFloat(boundingBox.$.maxx)
        let south = parseFloat(boundingBox.$.miny)
        let north = parseFloat(boundingBox.$.maxy)
        if (obj.srs === 'EPSG:3857') {
          // approximate 3857 to 4326 projection
          west = (west * 180) / 20037508.34
          east = (east * 180) / 20037508.34
          north = (Math.atan(Math.exp(north * Math.PI / 20037508.34)) * 360 / Math.PI) - 90
          south = (Math.atan(Math.exp(south * Math.PI / 20037508.34)) * 360 / Math.PI) - 90
        }
        obj.extent = { west, east, south, north }
      }
      probe.availableLayers[obj.id] = obj
    }).catch(error => {
      console.error(`Failed to fetch ${layer.$.href}`, error)
    })
    allPromises.push(p)
  }

  await Promise.all(allPromises)

  return probe
}
