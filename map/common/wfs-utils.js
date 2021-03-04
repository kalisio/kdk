import _ from 'lodash'
import fetch from 'node-fetch'
import xml2js from 'xml2js'
import { buildUrl } from '../../core/common'

// https://www.opengeospatial.org/standards/wfs

function fetchAsJson (query) {
  return fetch(query)
    .then(response => response.text())
    .then(txt => xml2js.parseStringPromise(txt, { tagNameProcessors: [xml2js.processors.stripPrefix] }))
}

export function GetCapabilities (url, searchParams = {}) {
  const query = buildUrl(url, Object.assign({
    SERVICE: 'WFS',
    REQUEST: 'GetCapabilities'
  }, searchParams))
  return fetchAsJson(query)
}

export function DescribeFeatureType (url, version, typeNames, searchParams = {}) {
  const query = buildUrl(url, Object.assign({
    SERVICE: 'WFS',
    VERSION: version,
    REQUEST: 'DescribeFeatureType',
    TYPENAMES: typeof typeNames === 'string' ? typeNames : typeNames.join(' ')
  }, searchParams))
  return fetchAsJson(query)
}

export function GetFeature (url, version, typeNames, searchParams = {}, { xml2json = true } = {}) {
  const query = buildUrl(url, Object.assign({
    SERVICE: 'WFS',
    VERSION: version,
    REQUEST: 'GetFeature',
    TYPENAMES: typeof typeNames === 'string' ? typeNames : typeNames.join(' ')
  }, searchParams))
  return xml2json ? fetchAsJson(query) : fetch(query).then(response => response.json())
}

export async function discover (url, searchParams = {}, caps = null) {
  if (!caps) {
    caps = await GetCapabilities(url, searchParams)
  }

  const out = {
    version: _.get(caps, 'WFS_Capabilities.$.version'),
    availableLayers: []
  }

  const layers = _.get(caps, 'WFS_Capabilities.FeatureTypeList[0].FeatureType')
  out.availableLayers = layers.map(l => { return { id: l.Name[0], display: l.Title[0] } })

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
    $schema: 'http://json-schema.org/draft-06/schema#',
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
