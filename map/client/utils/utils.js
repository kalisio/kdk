import _ from 'lodash'
import rhumbBearing from '@turf/rhumb-bearing'
import rhumbDistance from '@turf/rhumb-distance'
import rotate from '@turf/transform-rotate'
import scale from '@turf/transform-scale'
import translate from '@turf/transform-translate'
import chroma from 'chroma-js'
import config from 'config'
import formatcoords from 'formatcoords'
import { buildUrl } from '../../../core/common/index.js'
import { api, Store } from '../../../core/client/index.js'

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

export function transformFeatures (features, transform) {
  features.forEach(feature => {
    const scaling = _.get(transform, 'scale')
    const rotation = _.get(transform, 'rotate')
    const translation = _.get(transform, 'translate')
    if (scaling) {
      scale(feature, scaling.factor,
        Object.assign(_.omit(scaling, ['factor']), { mutate: true }))
    }
    if (rotation) {
      rotate(feature, rotation.angle,
        Object.assign(_.omit(rotation, ['angle']), { mutate: true }))
    }
    if (translation) {
      // Could be expressed as direction/distance or target point
      // Take care that turfjs uses a rhumb line
      if (translation.point) {
        translation.distance = rhumbDistance(translation.pivot || [0, 0], translation.point)
        translation.direction = rhumbBearing(translation.pivot || [0, 0], translation.point)
        delete translation.pivot
        delete translation.point
      }
      translate(feature, translation.distance, translation.direction,
        Object.assign(_.omit(translation, ['direction', 'distance']), { mutate: true }))
    }
  })
}

export async function fetchGeoJson (dataSource, options = {}) {
  const response = await fetch(dataSource)
  if (response.status !== 200) {
    throw new Error(`Impossible to fetch ${dataSource}: ` + response.status)
  }
  const data = await response.json()
  const features = (data.type === 'FeatureCollection' ? data.features : [data])
  if (typeof options.processor === 'function') {
    features.forEach(feature => options.processor(feature))
  } else if (typeof options.processor === 'string') {
    const compiler = _.template(options.processor)
    features.forEach(feature => compiler({ feature, properties: feature.properties }))
  }
  if (options.transform) {
    transformFeatures(features, options.transform)
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

export function getFeatureId (feature, layer) {
  let featureId = _.get(layer, 'featureId')
  // We need at least an internal ID to uniquely identify features for updates
  if (!featureId) featureId = '_id'
  // Support compound index
  featureId = (Array.isArray(featureId) ? featureId : [featureId])
  return featureId.map(id => _.get(feature, 'properties.' + id, _.get(feature, id))).join('-')
}

export function formatUserCoordinates (lat, lon, format, options) {
  if (format === 'aeronautical') {
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
  return formatcoords(lat, lon).format(format, options)
}

export function coordinatesToGeoJSON (lat, lon, format, options) {
  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [lon, lat]
    },
    properties: {
      name: formatcoords(lat, lon).format(format, options)
    }
  }
}


