import _ from 'lodash'
import formatcoords from 'formatcoords'

// Find the nearest time of a given one in a given moment time list
// if the time list is already sorted in ascending order use the last argument to speed up search
export function getNearestTime (time, times, sorted = false) {
  // Look for the nearest time
  if (sorted) {
    let timeIndex = 0
    for (; timeIndex < times.length; timeIndex++) {
      if (time.valueOf() < times[timeIndex].valueOf()) break
    }
    // We've found the first index greater than the time so return the previous
    if (timeIndex > 0) timeIndex--
    return { index: timeIndex, difference: Math.abs(time.diff(times[timeIndex])) }
  } else {
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

export function getGeoJsonFeatures (geoJson) {
  return (Array.isArray(geoJson) ? geoJson : (geoJson.type === 'FeatureCollection' ? geoJson.features : [geoJson]))
}
