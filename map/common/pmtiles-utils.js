import _ from 'lodash'
import { PMTiles } from 'pmtiles'

export async function getPMTilesMetadata(url) {
  try {
    const pmtiles = new PMTiles(url)
    const header = await pmtiles.getHeader() // fetches and validates the magic number
    const metadata = await pmtiles.getMetadata()
    return { header, metadata }
  } catch (_) {
    return { header: null, metadata: null }
  }
}

export function getPMTilesLayers(header, metadata) {
  return metadata.vector_layers.map(layer => {
    return {
      id: layer.id,
      display: layer.id,
      description: layer.description,
      bounds: metadata.bounds || [header.minLon, header.maxLon, header.minLat, header.maxLat],
      fields: layer.fields,
      minZoom: layer.minzoom || header.minZoom,
      maxZoom: layer.maxzoom || header.maxZoom
    }
  })
}

export function generatePropertiesSchema (layer) {
  const schema = {
    $id: `http://www.kalisio.xyz/schemas/${_.kebabCase(layer.id)}#`,
    title: layer.id,
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    properties: {}
  }

  _.forOwn(layer.fields, (value, key) => {
    const type = value.toLowerCase()
    schema.properties[key] = {
      type,
      field: {
        component: type === 'number' ? 'form/KNumberField' : (type === 'boolean' ? 'form/KToggleField' : 'form/KTextField'),
        helper: key,
        label: key
      }
    }
  })

  return schema
}