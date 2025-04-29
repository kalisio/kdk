import _ from 'lodash'
import fetch from 'node-fetch'
import xml2js from 'xml2js'
import { buildUrl } from '../../core/common/index.js'

// https://www.opengeospatial.org/standards/wfs

function fetchAsJson (query, headers = {}) {
  return fetch(query, { redirect: 'follow', headers })
    .then(response => response.text())
    .then(txt => xml2js.parseStringPromise(txt, { tagNameProcessors: [xml2js.processors.stripPrefix] }))
}

export function GetCapabilities (url, searchParams = {}, headers = {}) {
  const query = buildUrl(url, Object.assign({
    SERVICE: 'WFS',
    REQUEST: 'GetCapabilities'
  }, searchParams))
  return fetchAsJson(query, headers)
}

export function DescribeFeatureType (url, version, typeNames, searchParams = {}, headers = {}) {
  const query = buildUrl(url, Object.assign({
    SERVICE: 'WFS',
    VERSION: version,
    REQUEST: 'DescribeFeatureType',
    TYPENAMES: typeof typeNames === 'string' ? typeNames : typeNames.join(' ')
  }, searchParams))
  return fetchAsJson(query, headers)
}

export function GetFeature (url, version, typeNames, searchParams = {}, headers = {}, { xml2json = true } = {}) {
  const query = buildUrl(url, Object.assign({
    SERVICE: 'WFS',
    VERSION: version,
    REQUEST: 'GetFeature',
    TYPENAMES: typeof typeNames === 'string' ? typeNames : typeNames.join(' ')
  }, searchParams))
  return xml2json ? fetchAsJson(query, headers) : fetch(query, { redirect: 'follow', headers }).then(response => response.json())
}

export async function discover (url, searchParams = {}, headers = {}, caps = null) {
  if (!caps) {
    caps = await GetCapabilities(url, searchParams, headers)
  }

  const out = {
    version: _.get(caps, 'WFS_Capabilities.$.version'),
    availableLayers: {}
  }

  // scan layers
  for (const layer of _.get(caps, 'WFS_Capabilities.FeatureTypeList[0].FeatureType', [])) {
    const id = layer.Name[0]
    const display = _.get(layer, 'Title[0]', id)
    const description = _.get(layer, 'Abstract[0]', '')
    out.availableLayers[id] = { id, display, description }

    // extent
    if (layer.WGS84BoundingBox && layer.WGS84BoundingBox[0] !== '') {
      const loco = layer.WGS84BoundingBox[0].LowerCorner[0].split(' ')
      const upco = layer.WGS84BoundingBox[0].UpperCorner[0].split(' ')
      if (loco.length === 2 && upco.length === 2) {
        const west = parseFloat(loco[0])
        const east = parseFloat(upco[0])
        const south = parseFloat(loco[1])
        const north = parseFloat(upco[1])
        out.availableLayers[id].extent = { west, east, south, north }
      }
    }
  }

  // list output formats and check GeoJSON is supported
  for (const operation of _.get(caps, 'WFS_Capabilities.OperationsMetadata[0].Operation', [])) {
    if (operation.$.name !== 'GetFeature') continue
    for (const parameter of _.get(operation, 'Parameter')) {
      if (parameter.$.name !== 'outputFormat') continue
      for (const format of _.get(parameter, 'AllowedValues[0].Value')) {
        const tokens = _.split(format, ';')
        let mimeType = tokens[0]
        if (mimeType === 'application/json') {
          out.geoJsonOutputFormat = 'json'
          // Check for the subtype if any
          if (tokens.length > 0) {
            const subtypeTokens = _.split(_.trim(tokens[1]), '=')
            if (subtypeTokens[0] === 'subtype') out.geoJsonOutputFormat = subtypeTokens[1]
          }
          return out
        }
        mimeType = _.lowerCase(mimeType)
        if (mimeType === 'json' || mimeType === 'geojson') {
          out.geoJsonOutputFormat = mimeType
          return out
        }
      }
    }
  }

  return out
}

export function decodeFeatureType (json) {
  const decoded = {
    properties: []
  }

  const elements = _.get(json, 'schema.complexType[0].complexContent[0].extension[0].sequence[0].element')
  for (const element of elements) {
    if (element.$.name === 'shape') { continue }

    const prop = { name: element.$.name, type: '' }

    if (element.$.type) {
      if (element.$.type === 'xsd:int' || element.$.type === 'int') prop.type = 'number'
      else if (element.$.type === 'xsd:string' || element.$.type === 'string') prop.type = 'string'
      else if (element.$.type === 'gml:MultiSurfacePropertyType' || element.$.type === 'gml:PointPropertyType' || element.$.type === 'gml:MultiCurvePropertyType') continue
      else console.log(`wfs-utils: unkown prop type ${element.$.type}`)
    } else if (element.simpleType) {
      const root = _.get(element, 'simpleType[0].restriction[0]')
      if (root) {
        if (root.$.base === 'xsd:string' || root.$.base === 'string') {
          prop.type = 'string'
          if (root.maxLength) {
            prop.maxLength = _.get(root, 'maxLength[0].$.value')
          }
        }
      }
    }

    if (prop.type === '') {
      console.log(`wfs-utils: couldn't map type for prop ${prop.name}`)
      console.log(element)
    }

    decoded.properties.push(prop)
  }

  return decoded
}

export function generatePropertiesSchema (json, name) {
  const schema = {
    $id: `http://www.kalisio.xyz/schemas/${_.kebabCase(name)}#`,
    title: name,
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    properties: {}
  }

  const decoded = decodeFeatureType(json)
  for (const prop of decoded.properties) {
    schema.properties[prop.name] = {
      type: prop.type,
      field: {
        component: prop.type === 'number' ? 'form/KNumberField' : (prop.type === 'boolean' ? 'form/KToggleField' : 'form/KTextField'),
        helper: prop.name,
        label: prop.name
      }
    }
  }

  return schema
}
