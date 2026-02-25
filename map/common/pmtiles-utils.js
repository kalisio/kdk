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
      bounds: metadata.bounds || [header.minLon, header.minLat, header.maxLon, header.maxLat],
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

export function detectStyleType (style) {
  // `style` field on pmtiles layer definition can be one of:
  // - string => in this case we assume this is the URL to a mapbox json style
  // - kdk style object
  // - protomaps style object

  if (typeof style === 'string') return 'mapbox'
  // Look for 'symbolizer' keys in the object, if we find one, this is a protomaps style
  if (_.some(style, (rule) => rule.symbolizer !== undefined)) return 'protomaps'
  // Otherwise we assume this is a kdk style object
  return style ? 'kdk' : 'empty'
}

// Apply layer filters function to paint rules
export function applyLayerFilters(filterFn, paintRules) {
  paintRules.forEach(rule => {
    // kdkFilter member may not be present, this is added by kdk_style when translating kdk style
    // to leaflet-protomaps rules
    if (rule.kdkFilter) {
      rule.filter = (zoom, feature) => {
        const kdkFilter = rule.kdkFilter(zoom, feature)
        const filter = filterFn({ zoom, feature, properties: feature.props })
        // Final filter = kdk style filter + updated filter
        return kdkFilter && filter
      }
    } else {
      rule.filter = (zoom, feature) => {
        const filter = filterFn({ zoom, feature, properties: feature.props })
        return filter
      }
    }
  })
}