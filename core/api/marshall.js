import moment from 'moment'
import _ from 'lodash'

// Helper function to convert comparison operator values to numbers or dates
export function marshallComparisonFields (queryObject) {
  _.forOwn(queryObject, (value, key) => {
    // Process current attributes or  recurse
    if (typeof value === 'object') {
      marshallComparisonFields(value)
    } else if ((key === '$lt') || (key === '$lte') || (key === '$gt') || (key === '$gte')) {
      const number = _.toNumber(value)
      // Update from query string to number if required
      if (!Number.isNaN(number)) {
        queryObject[key] = number
      } else {
        // try for dates as well
        const date = moment.utc(value)
        if (date.isValid()) {
          queryObject[key] = date.toDate()
        }
      }
    }
  })
}

// Helper function to convert query parameters to numbers
export function marshallNumberFields (queryObject) {
  _.forOwn(queryObject, (value, key) => {
    // Process current attributes or  recurse
    if (typeof value === 'object') {
      marshallNumberFields(value)
    } else {
      const number = _.toNumber(value)
      // Update from query string to number if required
      if (_.isFinite(number)) {
        queryObject[key] = number
      }
    }
  })
}
// Helper function to convert query parameters to boolean
export function marshallBooleanFields (queryObject) {
  _.forOwn(queryObject, (value, key) => {
    // Process current attributes or  recurse
    if (typeof value === 'object') {
      marshallBooleanFields(value)
    } else if (typeof value === 'string') {
      // Update from query string to boolean if required
      if (value.toLowerCase() === 'true') {
        queryObject[key] = true
      } else if (value.toLowerCase() === 'false') {
        queryObject[key] = false
      }
    }
  })
}
// Helper function to convert query parameters to dates
export function marshallDateFields (queryObject) {
  _.forOwn(queryObject, (value, key) => {
    // Process current attributes or  recurse
    if (typeof value === 'object') {
      marshallDateFields(value)
    } else if (typeof value === 'string') {
      // We use moment to validate the date
      const date = moment.utc(value, moment.ISO_8601)
      if (date.isValid()) {
        queryObject[key] = date.toDate()
      }
    }
  })
}

// Helper function to convert time objects or array of time objects
export function marshallTime (item, property) {
  if (!item) return
  const time = _.get(item, property)
  if (!time) return
  if (Array.isArray(time)) {
    _.set(item, property, time.map(t => {
      if (moment.isMoment(t)) return t.toDate()
      else if (typeof t === 'string') return new Date(t)
      else return t
    }))
  } else if (moment.isMoment(time)) {
    _.set(item, property, time.toDate())
  } else if (typeof time === 'string') {
    _.set(item, property, new Date(time))
  } else if (typeof time === 'object') { // Check if complex object such as comparison operator
    // If so this will recurse
    _.keys(time).forEach(key => marshallTime(time, key))
  }
}

// Helper function to convert time objects or array of time objects for a fixed set of properties on a given object
export function marshallTimes (object, properties) {
  properties.forEach(property => marshallTime(object, property))
}

// Helper function to convert time objects or array of time objects
export function unmarshallTime (item, property) {
  if (!item) return
  const time = _.get(item, property)
  if (!time) return
  if (Array.isArray(time)) {
    _.set(item, property, time.map(t => {
      if (typeof t === 'string') return moment.utc(t)
      else if (typeof t.toISOString === 'function') return moment.utc(t)
      else return t
    }))
  } else if (!moment.isMoment(time)) {
    if (typeof time === 'string') _.set(item, property, moment.utc(time))
    else if (typeof time.toISOString === 'function') _.set(item, property, moment.utc(time))
    // Recurse on complex object such as comparison operator
    else if (typeof time === 'object') _.keys(time).forEach(key => unmarshallTime(time, key))
  }
}

// Helper function to convert time objects or array of time objects for a fixed set of properties on a given object
export function unmarshallTimes (object, properties) {
  properties.forEach(property => unmarshallTime(object, property))
}
