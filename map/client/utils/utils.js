import _ from 'lodash'
import chroma from 'chroma-js'
import formatcoords from 'formatcoords'

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

export function getFeatureId (feature, layer) {
  let featureId = _.get(layer, 'featureId')
  // We need at least an internal ID to uniquely identify features for updates
  if (!featureId) featureId = '_id'
  // Support compound index
  featureId = (Array.isArray(featureId) ? featureId : [featureId])
  return featureId.map(id => _.get(feature, 'properties.' + id, _.get(feature, id))).join('-')
}

export function getFeatureLabel (feature, layer) {
  // Support compound labels
  let featureLabel = layer.featureLabel || 'name'
  featureLabel = (Array.isArray(featureLabel) ? featureLabel : [featureLabel])
  return featureLabel.reduce((result, label) => {
    label = _.get(feature, `properties.${label}`)
    return (result ? result + ` - ${label}` : label)
  }, '')
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
