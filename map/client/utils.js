import _ from 'lodash'
import chroma from 'chroma-js'
import config from 'config'
import formatcoords from 'formatcoords'
import { uid } from 'quasar'
import { buildUrl } from '../../core/common/index.js'
import { api, Store, utils as kCoreUtils } from '../../core/client/index.js'
export * from './leaflet/utils.js'
export * from './cesium/utils.js'

export const SelectionLayerName = uid()

// Build a color map from a JS object specification
export function buildColorMap (options) {
  let colorMap
  const classes = _.get(options, 'classes')
  const domain = _.get(options, 'domain')
  const scale = _.get(options, 'scale')
  const invert = _.get(options, 'invertScale')
  if (scale) {
    if (classes) {
      colorMap = chroma.scale(scale).classes(invert ? classes.slice().reverse() : classes)
    } else if (domain) {
      colorMap = chroma.scale(scale).domain(invert ? domain.slice().reverse() : domain)
    }
  }
  return colorMap
}

export async function fetchGeoJson (dataSource, processor) {
  const response = await fetch(dataSource)
  if (response.status !== 200) {
    throw new Error(`Impossible to fetch ${dataSource}: ` + response.status)
  }
  const data = await response.json()
  if (typeof processor === 'function') {
    const features = (data.type === 'FeatureCollection' ? data.features : [data])
    features.forEach(feature => processor(feature))
  }
  return data
}

// Find the nearest time of a given one in a given moment time list
export function getNearestTime (time, times) {
  // Look for the nearest time
  let timeIndex = -1
  let minDiff = Infinity
  times.forEach((currentTime, index) => {
    const diff = Math.abs(time.diff(currentTime))
    if (diff < minDiff) {
      minDiff = diff
      timeIndex = index
    }
  })
  return { index: timeIndex, difference: minDiff }
}

// Find the minimum or maximum time interval in a given moment time list
export function getTimeInterval (times, mode = 'minimum') {
  // Look for the nearest time
  let interval = (mode === 'minimum' ? Infinity : 0)
  times.forEach((currentTime, index) => {
    if (index < (times.length - 1)) {
      const diff = Math.abs(currentTime.diff(times[index + 1]))
      if (mode === 'minimum') {
        if (diff < interval) interval = diff
      } else {
        if (diff > interval) interval = diff
      }
    }
  })
  return interval
}

// Format (reverse) geocoding output
export function formatGeocodingResult (element) {
  let label = element.formattedAddress || ''
  if (!label) {
    if (element.streetNumber) label += (element.streetNumber + ', ')
    if (element.streetName) label += (element.streetName + ' ')
    if (element.city) label += (element.city + ' ')
    if (element.zipcode) label += (' (' + element.zipcode + ')')
  }
  return label
}

// Helper to set a JWT as query param in a target URL
export function setUrlJwt (item, path, baseUrl, jwtField, jwt) {
  const url = _.get(item, path)
  if (!url) return
  // Check it conforms to required base URL
  if (!url.startsWith(baseUrl)) return
  // FIXME: specific case of Cesium OpenStreetMap provider
  // Because Cesium generates the final url as base url + tile scheme + extension
  // updating the base url property breaks it, for now we modify the extension
  if ((path === 'cesium.url') && _.get(item, 'cesium.type') === 'OpenStreetMap') {
    const ext = _.get(item, 'cesium.fileExtension', 'png')
    _.set(item, 'cesium.fileExtension', ext + `?${jwtField}=${jwt}`)
  } else {
    _.set(item, path, buildUrl(url, { [jwtField]: jwt }))
  }
}

// Helper to set required JWT as query param in a given set of layers for underlying engine
export async function setEngineJwt (layers) {
  // If we need to use API gateway forward token as query parameter
  // (Leaflet does not support anything else by default as it mainly uses raw <img> tags)
  let jwt = (config.gatewayJwt ? await api.get('storage').getItem(config.gatewayJwt) : null)
  let jwtField = config.gatewayJwtField
  // Check both the default built-in config or the server provided one if any (eg mobile apps)
  const gatewayUrl = Store.get('capabilities.api.gateway', config.gateway)
  if (jwt) {
    layers.forEach(layer => {
      setUrlJwt(layer, 'iconUrl', gatewayUrl, jwtField, jwt)
      setUrlJwt(layer, 'leaflet.source', gatewayUrl, jwtField, jwt)
      setUrlJwt(layer, 'opendap.url', gatewayUrl, jwtField, jwt)
      setUrlJwt(layer, 'geotiff.url', gatewayUrl, jwtField, jwt)
      setUrlJwt(layer, 'wfs.url', gatewayUrl, jwtField, jwt)
      setUrlJwt(layer, 'wcs.url', gatewayUrl, jwtField, jwt)
      setUrlJwt(layer, 'cesium.url', gatewayUrl, jwtField, jwt)
      setUrlJwt(layer, 'cesium.source', gatewayUrl, jwtField, jwt)
    })
  }
  // We might also proxy some data directly from the app when using object storage
  // This is only for raw raster data not OGC protocols
  jwt = (config.apiJwt ? await api.get('storage').getItem(config.apiJwt) : null)
  jwtField = 'jwt'
  const apiUrl = api.getBaseUrl()
  if (jwt) {
    layers.forEach(layer => {
      setUrlJwt(layer, 'geotiff.url', apiUrl, jwtField, jwt)
    })
    // We also allow absolute URLs for app like /api/storage/xxx
    layers.forEach(layer => {
      setUrlJwt(layer, 'geotiff.url', '/', jwtField, jwt)
    })
  }
  return layers
}

// Get JSON schema from GeoJson feature' properties
export function generatePropertiesSchema (geoJson, name) {
  const schema = {
    $id: `http://www.kalisio.xyz/schemas/${_.kebabCase(name)}#`,
    title: name,
    $schema: 'http://json-schema.org/draft-06/schema#',
    type: 'object',
    properties: {
    }
  }
  // Enumerate all available properties/values in all features
  const features = (geoJson.type === 'FeatureCollection' ? geoJson.features : [geoJson])
  features.forEach(feature => {
    // FIXME: we don't yet support nested objects in schema
    const properties = (feature.properties ? kCoreUtils.dotify(feature.properties) : {})
    _.forOwn(properties, (value, key) => {
      // Property already registered ?
      if (schema.properties['{key}']) {
        const property = schema.properties[`${key}`]
        // Try to find first non void value to select appropriate type
        if (_.isNil(property)) schema.properties[`${key}`] = value
      } else {
        schema.properties[`${key}`] = value
      }
    })
  })
  _.forOwn(schema.properties, (value, key) => {
    let type = (typeof value)
    // For null/undefined value we will assume string by default
    if ((type === 'object') || (type === 'undefined')) type = 'string'
    schema.properties[`${key}`] = {
      type,
      field: {
        component: (type === 'number'
          ? 'form/KNumberField'
          : (type === 'boolean' ? 'form/KToggleField' : 'form/KTextField')),
        helper: key,
        label: key
      }
    }
  })
  return schema
}

export function updatePropertiesSchema (schema) {
  const props = schema.properties
  if (!props) return

  const bestGuesses = {
    undefined: 'form/KTextField',
    object: 'form/KTextField',
    string: 'form/KTextField',
    number: 'form/KNumberField',
    boolean: 'form/KToggleField'
  }

  // Loop over declared props and add best guesses to field components based on property type
  for (const prop in props) {
    const propEntry = props[prop]
    // Field already here, skip entry
    if (propEntry.field && propEntry.field.component) continue

    propEntry.field = {
      component: bestGuesses[propEntry.type],
      label: prop,
      helper: propEntry.description
    }
  }

  return schema
}

export function formatUserCoordinates (lat, lon, formatStr) {
  if (formatStr === 'aeronautical') {
    const coords = formatcoords(lat, lon)
    // longitude group: DDMMML where DD is degree (2 digits mandatory)
    // MMM unit is in 0.1 minutes (trailing 0 optional)
    // L is N/S
    const latDeg = coords.latValues.degreesInt.toString().padStart(2, '0')
    const latMin = Math.floor(coords.latValues.secondsTotal / 6).toString().padStart(3, '0')
    const latDir = coords.north ? 'N' : 'S'
    // longitude group: DDDMMML where DDD is degree (3 digits mandatory)
    // MMM unit is in 0.1 minutes (trailing 0 optional)
    // L is W/E
    const lonDeg = coords.lonValues.degreesInt.toString().padStart(3, '0')
    const lonMin = Math.floor(coords.lonValues.secondsTotal / 6).toString().padStart(3, '0')
    const lonDir = coords.east ? 'E' : 'W'
    return `${latDeg}${latMin}${latDir} ${lonDeg}${lonMin}${lonDir}`
  }

  return formatcoords(lat, lon).format(formatStr)
}
