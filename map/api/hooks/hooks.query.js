import _ from 'lodash'
import errors from '@feathersjs/errors'
import { marshallGeometry } from '../marshall.js'
import makeDebug from 'debug'

const debug = makeDebug('kdk:map:query:hooks')
const { Forbidden } = errors

export function marshallGeometryQuery (hook) {
  const query = hook.params.query
  if (_.isNil(query)) return
  const geometry = query.geometry
  if (_.isNil(geometry)) return
  marshallGeometry(geometry)
}

function getGeometryQueryForBBox (bbox) {
  // Here we use the custom MongoDB CRS that enforces counter-clockwise winding order
  // and allows to support queries with a single-ringed GeoJSON polygon
  // whose area is greater than or equal to a single hemisphere.
  // Otherwise $geoIntersects queries for the complementary geometry.
  return {
    $geoIntersects: {
      $geometry: {
        type: 'Polygon',
        coordinates: [bbox],
        crs: {
          type: 'name',
          properties: { name: 'urn:x-mongodb:crs:strictwinding:EPSG:4326' }
        }
      }
    }
  }
}

export function marshallGeoJsonQuery (hook) {
  const query = hook.params.query
  if (query) {
    if (query.geoJson) {
      delete query.geoJson
      hook.params.asGeoJson = true
    }
  }
}

export function marshallSpatialQuery (hook) {
  const query = hook.params.query
  if (query) {
    if (!_.isNil(query.geometry)) marshallGeometry(query.geometry)
    // Shortcut for proximity query
    if ((!_.isNil(query.centerLon) || !_.isNil(query.longitude)) &&
        (!_.isNil(query.centerLat) || !_.isNil(query.latitude)) && !_.isNil(query.distance)) {
      const longitude = (_.isNil(query.centerLon) ? _.toNumber(query.longitude) : _.toNumber(query.centerLon))
      const latitude = (_.isNil(query.centerLat) ? _.toNumber(query.latitude) : _.toNumber(query.centerLat))
      const distance = _.toNumber(query.distance)
      // Transform to MongoDB spatial request
      delete query.centerLon
      delete query.longitude
      delete query.centerLat
      delete query.latitude
      delete query.distance
      // Aggregation requires a specific operator
      if (query.$aggregate) {
        query.$geoNear = {
          near: { type: 'Point', coordinates: [longitude, latitude] },
          maxDistance: distance,
          distanceField: 'distance',
          spherical: true
        }
      } else {
        /* We switched from $near to $geoWithin due to https://github.com/kalisio/kdk/issues/345
        query.geometry = {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [longitude, latitude]
            },
            $maxDistance: distance
          }
        }
        */
        query.geometry = {
          $geoWithin: {
            $centerSphere: [[longitude, latitude], distance / 6378137.0] // Earth radius as in radians
          }
        }
      }
    }
    // Shortcut for bbox query
    if (!_.isNil(query.south) && !_.isNil(query.north) && !_.isNil(query.west) && !_.isNil(query.east)) {
      const south = _.toNumber(query.south)
      const north = _.toNumber(query.north)
      const west = _.toNumber(query.west)
      const east = _.toNumber(query.east)
      // Transform to MongoDB spatial request
      delete query.south
      delete query.north
      delete query.west
      delete query.east
      
      // FIXME: MongoDB should allow to support queries with a single-ringed GeoJSON polygon
      // whose area is greater than or equal to a single hemisphere.
      // However, we did not succeeed in making it work as expected, for now on we split large polygon into two halfs.
      if ((east-west) <= 180) {
        // BBox as a polygon also requires the closing point.
        const bbox = [[west, south], [east, south], [east, north], [west, north], [west, south]]
        query.geometry = getGeometryQueryForBBox(bbox)
      } else {
        // BBox as a polygon also requires the closing point.
        const leftHalfBbox = [[west, south], [0.5*(west+east), south], [0.5*(west+east), north], [west, north], [west, south]]
        const rightHalfBbox = [[0.5*(west+east), south], [east, south], [east, north], [0.5*(west+east), north], [0.5*(west+east), south]]
        query.$or = [{ geometry: getGeometryQueryForBBox(leftHalfBbox) }, { geometry: getGeometryQueryForBBox(rightHalfBbox) }]
      }
    }
    // Shortcut for location query
    if (!_.isNil(query.longitude) && !_.isNil(query.latitude)) {
      const longitude = _.toNumber(query.longitude)
      const latitude = _.toNumber(query.latitude)
      // Transform to MongoDB spatial request
      delete query.longitude
      delete query.latitude
      const geometryQuery = {
        $geoIntersects: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          }
        }
      }
      query.geometry = geometryQuery
    }
  }
  // Include GeoJson query by default
  marshallGeoJsonQuery(hook)
}

export function asGeoJson (options = {}) {
  return function (hook) {
    const params = hook.params
    const query = params.query
    if (!options.force && !params.asGeoJson) return
    if (_.has(query, '$distinct') || _.has(query, '$aggregation')) return // Not applicable in this case
    const longitudeProperty = (options.longitudeProperty || 'longitude')
    const latitudeProperty = (options.latitudeProperty || 'latitude')
    const altitudeProperty = (options.altitudeProperty || 'altitude')
    const geometryProperty = (options.geometryProperty || 'geometry')
    const allowNullGeometries = _.get(options, 'allowNullGeometries', false)
    let results = _.get(hook, options.dataPath || 'result')
    // Already as GeoJson ?
    if (results.type === 'FeatureCollection') return
    const isPaginated = !_.isNil(results.data)
    const pagination = (isPaginated ? _.pick(results, ['total', 'skip', 'limit']) : {})
    results = (isPaginated ? results.data : results)
    // Single item case, i.e. GET ?
    const isFeatureCollection = Array.isArray(results)
    if (!isFeatureCollection) results = [results]
    results = results
      .filter(item => {
        // Check if item is not already in GeoJson feature format and we can convert if required
        return (_.has(item, longitudeProperty) && _.has(item, latitudeProperty)) ||
               // When performing feature aggregation on geometries the result can be an array
               Array.isArray(_.get(item, geometryProperty)) ||
               // Check for a geometry property (previously provided or already transformed item)
               (_.has(item, geometryProperty + '.type') && _.has(item, geometryProperty + '.coordinates')) ||
               (_.has(item, geometryProperty + '.geometry.type') && _.has(item, geometryProperty + '.geometry.coordinates')) ||
               // Check for null geometries when allowed
               allowNullGeometries
      })
      .map(item => {
        let coordinates
        // Keep track of coordinates before picking properties
        if (_.has(item, longitudeProperty) && _.has(item, latitudeProperty)) {
          coordinates = [_.get(item, longitudeProperty), _.get(item, latitudeProperty)]
          if (_.has(item, altitudeProperty)) {
            coordinates.push(_.get(item, altitudeProperty))
          }
        }
        if (options.pick) {
          item = _.pick(item, options.pick)
        }
        if (options.omit) {
          item = _.omit(item, options.omit)
        }
        // Item locations are already in GeoJson format
        if ((_.has(item, geometryProperty + '.type') && _.has(item, geometryProperty + '.coordinates')) ||
            (_.has(item, geometryProperty + '.geometry.type') && _.has(item, geometryProperty + '.geometry.coordinates'))) {
          return Object.assign({
            type: 'Feature',
            geometry: _.get(item, geometryProperty + '.geometry', _.get(item, geometryProperty)),
            properties: {}
          }, _.omit(item, [geometryProperty]))
        } else if (Array.isArray(_.get(item, geometryProperty))) {
          return Object.assign({
            type: 'Feature',
            geometry: { type: 'GeometryCollection', geometries: _.get(item, geometryProperty) },
            properties: {}
          }, _.omit(item, [geometryProperty]))
        } else {
          // Item locations are not already in GeoJson feature format so we need to convert
          return Object.assign({
            type: 'Feature',
            geometry: (coordinates ? { type: 'Point', coordinates } : null),
            properties: {}
          }, _.omit(item, [longitudeProperty, latitudeProperty]))
        }
      })
    // Move some data to properties ?
    if (options.properties) {
      results.forEach(item => {
        // True indicates to move all fields to properties
        if (options.properties === true) {
          _.forOwn(item, (value, key) => {
            if ((key === 'geometry') || (key === 'type') || (key === '_id')) return
            _.set(item, `properties.${key}`, _.get(item, key))
            _.unset(item, key)
          })
        } else { // Else we expect a specific mapping
          options.properties.forEach(mapping => {
            if (mapping.from) _.set(item, `properties.${mapping.to || mapping.from}`, _.get(item, `${mapping.from}`))
            if (mapping.delete) _.unset(item, `${mapping.from}`)
          })
        }
      })
    }
    // If we should make it available as a GeoJson feature collection create it
    if (isFeatureCollection && _.get(options, 'asFeatureCollection', true)) {
      // Copy pagination information if any so that client can use it anyway
      _.set(hook, options.dataPath || 'result', Object.assign({
        type: 'FeatureCollection',
        features: results
      }, pagination)) // If no pagination this merged object will be empty
    } else if (isPaginated) {
      // Copy pagination information if any so that client can use it anyway
      _.set(hook, options.dataPath || 'result', Object.assign({
        data: results
      }, pagination))
    } else {
      _.set(hook, options.dataPath || 'result', isFeatureCollection ? results : results[0])
    }
  }
}



// Verifies that only authorized accumulation operators are used
function validateGroupExpression(expression) {
  // Safe accumulation operators for $group
  const SAFE_GROUP_ACCUMULATORS = new Set([
    '$sum', '$avg', '$first', '$last', '$max', '$min'
  ])
  // Safe expression operators usable in $group
  const SAFE_GROUP_EXPRESSIONS = new Set([
    // Arithmetic operators
    '$add', '$subtract', '$multiply', '$divide', '$mod',
    '$abs', '$ceil', '$floor', '$round', '$trunc',
    '$sqrt', '$pow', '$exp', '$ln', '$log', '$log10',
    // Comparison operators
    '$eq', '$ne', '$gt', '$gte', '$lt', '$lte', '$cmp',
    // Logical operators
    '$and', '$or', '$not',
    // Date operators
    '$dateToString', '$year', '$month', '$dayOfMonth', '$hour',
    '$minute', '$second', '$dayOfWeek', '$dayOfYear', '$week',
    // Conditional operators
    '$cond', '$ifNull', '$switch',
    // Type operators
    '$toString', '$toInt', '$toDouble'
  ])
  // Dangerous operators to reject in $group (arbitrary code execution)
  const DANGEROUS_GROUP_OPERATORS = new Set([
    '$accumulator',  // Custom JavaScript execution
    '$function',     // JavaScript function execution
    '$where'         // JavaScript code execution
  ])

  if (_.isNil(expression)) {
    return
  } else if (Array.isArray(expression)) {
    expression.forEach(validateGroupExpression)
    return
  } else if (typeof expression === 'object') {
    for (const [key, value] of Object.entries(expression)) {
      // Check if it's an operator
      if (key.startsWith('$')) {
        if (DANGEROUS_GROUP_OPERATORS.has(key)) throw new Forbidden(`You are not allowed to use ${key} operator`)

        // Check if operator is in the allowed list
        const isAccumulator = SAFE_GROUP_ACCUMULATORS.has(key)
        const isExpression = SAFE_GROUP_EXPRESSIONS.has(key)
        if (!isAccumulator && !isExpression) throw new Forbidden(`You are not allowed to use ${key} operator`)
      }

      // Recursively validate the value
      validateGroupExpression(value)
    }
  }
}

export async function aggregateFeaturesQuery (hook) {
  const query = hook.params.query
  const service = hook.service
  if (!query) return
  // Perform aggregation
  if (query.$aggregate) {
    const collection = service.Model
    const indexes = await collection.indexes()
    let featureId = (service.options ? service.options.featureId : [])
    // Support compound ID
    featureId = (Array.isArray(featureId) ? featureId : [featureId])
    const hasFeatureId = !_.isEmpty(featureId)
    let featureIdType = (service.options ? service.options.featureIdType : [])
    featureIdType = (Array.isArray(featureIdType) ? featureIdType : [featureIdType])
    // Default is not to group by UUID
    const groupBy = { _id: '$_id' }
    let keys = ['_id']
    if (query.$groupBy) {
      groupBy._id = typeof query.$groupBy === 'string' // Group by matching ID(s), ie single ID or array of field to create a compound ID
        ? { [query.$groupBy]: '$properties.' + query.$groupBy }
      // Aggregated in an accumulator to avoid conflict with feature properties
        : query.$groupBy.reduce((object, id) => Object.assign(object, { [id]: '$properties.' + id }), {})
      keys = _.keys(groupBy._id)
    }
    // Do we only keep first or last available time ?
    const singleTime = (_.toNumber(query.$limit) === 1)
    if (singleTime) {
      // When single time no aggregation is performed at all so we only have raw features
      if (hasFeatureId) keys = keys.map(key => 'properties.' + key)
      // In this case no need to aggregate on each element we simply keep the first feature
      // BUG: according to https://jira.mongodb.org/browse/SERVER-9507 MongoDB is not yet
      // able to optimize this kind of operations to avoid full index scan
      // For now we should restrict it to short time range
      Object.assign(groupBy, { feature: { $first: '$$ROOT' } })
    } else {
      Object.assign(groupBy, {
        time: { $push: '$time' }, // Keep track of all times
        runTime: { $push: '$runTime' }, // Keep track of all run times
        type: { $last: '$type' }, // type is assumed similar for all results, keep last
        properties: { $last: '$properties' } // non-aggregated properties are assumed similar for all results, keep last
      })
      // Keep track of all levels as well if not targetting a specific one
      if (!_.has(query, 'level')) {
        Object.assign(groupBy, {
          level: { $push: '$level' }
        })
      }
      // Check if we aggregate geometry or simply properties
      if (!query.$aggregate.includes('geometry')) {
        Object.assign(groupBy, {
          geometry: { $last: '$geometry' } // geometry is assumed similar for all results, keep last
        })
      }
    }
    // Merge with any additional group expression
    const group = validateGroupExpression(_.get(query, '$group', {}))
    Object.assign(groupBy, group)
    // The query contains the match stage except options relevent to the aggregation pipeline
    const match = _.omit(query, ['$group', '$groupBy', '$aggregate', '$geoNear', '$sort', '$limit', '$skip'])
    // Check for any required type conversion (eg HTTP requests)
    for (let i = 0; i < featureId.length; i++) {
      const id = featureId[i]
      const idType = featureIdType[i]
      if (_.has(match, 'properties.' + id)) {
        if (idType === 'number') _.set(match, 'properties.' + id, _.toNumber(_.get(match, 'properties.' + id)))
      }
    }
    // Ensure we do not mix results with/without relevant element values
    // by separately querying each element then merging
    let aggregatedResults
    // Associative map used to optimize merging between aggregated elements
    const aggregatedResultsMap = new Map()
    const aggregateOptions = {
      allowDiskUse: true
    }
    await Promise.all(query.$aggregate.map(async element => {
      const isGeometry = (element === 'geometry')
      // Geometry is a root property while others are feature properties
      const prefix = (isGeometry ? '' : 'properties.')
      const pipeline = []
      // Check for geometry stage
      if (query.$geoNear) {
        pipeline.push({ $geoNear: query.$geoNear })
      }
      // Find matching features only
      pipeline.push({ $match: Object.assign({ [prefix + element]: { $exists: true } }, match) })
      // Ensure they are ordered by increasing time by default,
      // most recent forecast and lower level first
      pipeline.push({ $sort: Object.assign({ time: 1, runTime: -1, level: 1 }, query.$sort) })
      // Keep track of all feature values
      if (singleTime) {
        pipeline.push({ $group: groupBy })
        // As we replace the root document with the feature in this case keep track of any accumlated element before
        // If the accumulated properties is name maxProperty then we copy it in the feature as feature.properties.maxProperty
        if (!_.isEmpty(group)) {
          pipeline.push({
            $set: _.mapKeys(_.mapValues(group, (value, key) => `$${key}`), (value, key) => `feature.properties.${key}`)
          })
        }
        pipeline.push({ $replaceRoot: { newRoot: '$feature' } })
      } else {
        pipeline.push({ $group: Object.assign({ [element]: { $push: '$' + prefix + element } }, groupBy) })
      }
      debug(`Aggregating ${element} element for features`)
      pipeline.forEach(stage => {
        _.forOwn(stage, (value, key) => debug('Stage', key, value))
      })
      const aggregateElementOptions = Object.assign({}, aggregateOptions)
      debug('Aggregation options', aggregateElementOptions)
      const elementResults = await collection.aggregate(pipeline, aggregateElementOptions).toArray()
      debug(`Generated ${elementResults.length} feature(s) for ${element} element, picked first two`, elementResults.slice(0,2))
      // Rearrange data so that we get ordered arrays indexed by element
      elementResults.forEach(result => {
        result.time = { [element]: result.time }
        if (result.runTime) result.runTime = { [element]: result.runTime }
        if (!singleTime && !isGeometry) {
          // Set back the element values as properties because we aggregated in an accumulator
          // to avoid conflict with non-aggregated feature properties
          _.set(result, prefix + element, _.get(result, element))
          // Delete accumulator
          _.unset(result, element)
        }
      })
      // Now merge with previous element results
      if (!aggregatedResults) {
        aggregatedResults = elementResults
        aggregatedResults.forEach(result => {
          // Keep track of result in map to improve search later
          const resultKeys = keys.map(key => _.get(singleTime ? result : result._id, key))
          const resultKey = resultKeys.join('-')
          aggregatedResultsMap.set(resultKey, result)
        })
      } else {
        elementResults.forEach(result => {
          // When single time no aggregation is performed at all so we only have raw features
          const resultKeys = keys.map(key => _.get(singleTime ? result : result._id, key))
          /* Optimize previous result search with map, kept the naive code here for reference/debug purpose
          const previousResult = aggregatedResults.find(aggregatedResult => {
            const aggregatedResultKeys = keys.map(key => _.get(singleTime ? result : result._id, key))
            return _.isEqual(aggregatedResultKeys, resultKeys)
          })
          */
          const resultKey = resultKeys.join('-')
          const previousResult = aggregatedResultsMap.get(resultKey)
          // Merge with previous matching feature if any
          if (previousResult) {
            Object.assign(previousResult.time, result.time)
            if (result.runTime) {
              if (previousResult.runTime) Object.assign(previousResult.runTime, result.runTime)
              else previousResult.runTime = { [element]: result.runTime }
            }
            _.set(previousResult, prefix + element, _.get(result, prefix + element))
          } else {
            aggregatedResults.push(result)
            aggregatedResultsMap.set(resultKey, result)
          }
        })
      }
    }))
    delete query.$groupBy
    delete query.$group
    delete query.$aggregate
    delete query.$geoNear
    // Set result to avoid service DB call
    hook.result = aggregatedResults || []
  }
  return hook
}
