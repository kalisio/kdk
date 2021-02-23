import _ from 'lodash'
import fetch from 'node-fetch'
import xml2js from 'xml2js'
import { buildUrl } from '../../core/common'

// https://www.opengeospatial.org/standards/wfs

export function GetCapabilities (url) {
  const query = buildUrl(url, {
    SERVICE: 'WFS',
    REQUEST: 'GetCapabilities'
  })
  return fetch(query)
    .then(response => response.text())
    .then(txt => xml2js.parseStringPromise(txt))
}

export function DescribeFeatureType (url, typeNames, more = {}) {
  const query = buildUrl(url, Object.assign({
    SERVICE: 'WFS',
    VERSION: '2.0.0',
    REQUEST: 'DescribeFeatureType',
    TYPENAMES: typeof typeNames === 'string' ? typeNames : typeNames.join(' ')
  }, more))
  return fetch(query)
    .then(response => response.text())
    .then(txt => xml2js.parseStringPromise(txt))
}

export function GetFeature (url, typeNames, more = {}, { xml2json = true } = {}) {
  const query = buildUrl(url, Object.assign({
    SERVICE: 'WFS',
    VERSION: '2.0.0',
    REQUEST: 'GetFeature',
    TYPENAMES: typeof typeNames === 'string' ? typeNames : typeNames.join(' ')
  }, more))
  return xml2json ? fetch(query)
    .then(response => response.text())
    .then(txt => xml2js.parseStringPromise(txt))
    : fetch(query).then(response => response.json())
}

export function decodeCapabilities (caps) {
  const decoded = {
    availableLayers: []
  }

  const layers = _.get(caps, 'wfs:WFS_Capabilities.wfs:FeatureTypeList[0].wfs:FeatureType')
  decoded.availableLayers = layers.map(l => { return { id: l['wfs:Name'][0], display: l['wfs:Title'][0] } })

  return decoded
}

export function decodeFeatureType (json) {
  const decoded = {
    properties: []
  }

  const elements = _.get(json, 'xsd:schema.xsd:complexType[0].xsd:complexContent[0].xsd:extension[0].xsd:sequence[0].xsd:element')
  for (const element of elements) {
    if (element.$.name === 'shape')
      continue

    const prop = { name: element.$.name, type: '' }

    if (element.$.type) {
      if (element.$.type === 'xsd:int') prop.type = 'number'
      // else if (element.$.type === '')
      else console.log(`wfs-utils: unkown prop type ${element.$.type}`)
    } else if (element['xsd:simpleType']) {
      const root = _.get(element, 'xsd:simpleType[0].xsd:restriction[0]')
      if (root) {
        if (root.$.base === 'xsd:string') {
          prop.type = 'string'
          if (root['xsd:maxLength']) {
            prop.maxLength = _.get(root, 'xsd:maxLength[0].$.value')
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
