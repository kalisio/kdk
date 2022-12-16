import _ from 'lodash'
import moment from 'moment'
import { Time } from '../../../core/client/time.js'
import { getNearestTime } from '../utils.js'

export function useMeasure () {
  // data
  
  // functions
  function getMeasureValueAtCurrentTime (times, values) {
    // Check for the right value at time
    if (Array.isArray(times) && Array.isArray(values)) {
      /// Look for the nearest time
      const nearestTime = getNearestTime(Time.getCurrentTime(), times.map(time => moment.utc(time)))
      return (nearestTime.index >= 0 ? values[nearestTime.index] : null)
    } else {
      // Constant value
      return values
    }
  }
  function getProbedLocationMeasureAtCurrentTime (probedLocation) {
    // Create new geojson from raw response containing all times
    const feature = _.cloneDeep(probedLocation)
    // Then check for the right value at time
    _.forOwn(feature.properties, (value, key) => {
      if (Array.isArray(value)) {
        const times = _.get(feature, 'time.' + key)
        if (times) {
          _.set(feature, 'properties.' + key, getMeasureValueAtCurrentTime(times, value))
          _.set(feature, 'time.' + key, getMeasureValueAtCurrentTime(times, times))
        }
      }
    })
    return feature
  }

  // expose
  return {
    getMeasureValueAtCurrentTime,
    getProbedLocationMeasureAtCurrentTime
  }
}
