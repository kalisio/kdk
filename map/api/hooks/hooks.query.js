import _ from 'lodash'
import { marshallGeometry } from '../marshall'
import makeDebug from 'debug'

const debug = makeDebug('kdk:map:query:hooks')

export function marshallGeometryQuery (hook) {
  const query = hook.params.query
  if (_.isNil(query)) return
  const geometry = query.geometry
  if (_.isNil(geometry)) return
  marshallGeometry(geometry)
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
      const geometryQuery = {
        $geoIntersects: {
          $geometry: {
            type: 'Polygon',
            coordinates: [ // BBox as a polygon
              [[west, south], [east, south], [east, north], [west, north], [west, south]] // Closing point
            ]
          }
        }
      }
      query.geometry = geometryQuery
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
    if (query.geoJson) {
      delete query.geoJson
      hook.params.asGeoJson = true
    }
  }
}

export function asGeoJson (options = {}) {
  return function (hook) {
    const params = hook.params
    const query = params.query
    if (!options.force && !params.asGeoJson) return
    if (query.$distinct || query.$aggregation) return // Not applicable in this case
    const longitudeProperty = (options.longitudeProperty || 'longitude')
    const latitudeProperty = (options.latitudeProperty || 'latitude')
    const altitudeProperty = (options.altitudeProperty || 'altitude')
    const geometryProperty = (options.geometryProperty || 'geometry')
    let results = _.get(hook, options.dataPath || 'result')
    // Already as GeoJson ?
    if (results.type === 'FeatureCollection') return
    const isPaginated = !_.isNil(results.data)
    const pagination = (isPaginated ? _.pick(results, ['total', 'skip', 'limit']) : {})
    results = (isPaginated ? results.data : results)
    results = results
      .filter(item => {
        // Check if item are not already in GeoJson feature format and we can convert if required
        return (_.has(item, longitudeProperty) && _.has(item, latitudeProperty)) ||
               // Check for a geometry property (previosuly provided or already transformed item)
               _.has(item, geometryProperty)
      })
      .map(item => {
        let coordinates
        // Item locations are not already in GeoJson feature format so we need to convert
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
        // Item locations are not already in GeoJson feature format so we need to convert
        if (coordinates) {
          return Object.assign({
            type: 'Feature', geometry: { type: 'Point', coordinates }, properties: {}
          }, _.omit(item, [longitudeProperty, latitudeProperty]))
        } else {
          return Object.assign({
            type: 'Feature', geometry: _.get(item, geometryProperty), properties: {}
          }, _.omit(item, [geometryProperty]))
        }
      })
    // Move some data to properties ?
    if (options.properties) {
      results.forEach(item => {
        options.properties.forEach(mapping => {
          if (mapping.from) _.set(item, `properties.${mapping.to || mapping.from}`, _.get(item, `${mapping.from}`))
          if (mapping.delete) _.unset(item, `${mapping.from}`)
        })
      })
    }
    // Copy pagination information if any so that client can use it anyway
    if (_.get(options, 'asFeatureCollection', true)) {
      _.set(hook, options.dataPath || 'result', Object.assign({
        type: 'FeatureCollection',
        features: results
      }, pagination)) // If no pagination this merged object will be empty
    } else if (isPaginated) {
      _.set(hook, options.dataPath || 'result', Object.assign({
        data: results
      }, pagination))
    } else {
      _.set(hook, options.dataPath || 'result', results)
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
    const featureId = (service.options ? service.options.featureId : '')
    const featureIdType = (service.options ? service.options.featureIdType : 'string')
    const ids = typeof query.$groupBy === 'string' // Group by matching ID(s), ie single ID or array of field to create a compound ID
      ? { [query.$groupBy]: '$properties.' + query.$groupBy }
    // Aggregated in an accumulator to avoid conflict with feature properties
      : query.$groupBy.reduce((object, id) => Object.assign(object, { [id]: '$properties.' + id }), {})
    const groupBy = { _id: ids }
    let keys = _.keys(ids)
    // Do we only keep first or last available time ?
    const singleTime = (_.toNumber(query.$limit) === 1)
    if (singleTime) {
      // When single time no aggregation is performed at all so we only have raw features
      keys = keys.map(key => 'properties.' + key)
      // In this case no need to aggregate on each element we simply keep the first feature
      // BUG: according to https://jira.mongodb.org/browse/SERVER-9507 MongoDB is not yet
      // able to optimize this kind of operations to avoid full index scan
      // For now we should restrict it to short time range
      Object.assign(groupBy, { feature: { $first: '$$ROOT' } })
    } else {
      Object.assign(groupBy, {
        time: { $push: '$time' }, // Keep track of all times
        type: { $last: '$type' }, // type is assumed similar for all results, keep last
        properties: { $last: '$properties' } // non-aggregated properties are assumed similar for all results, keep last
      })
      // Check if we aggregate geometry or simply properties
      if (!query.$aggregate.includes('geometry')) {
        Object.assign(groupBy, {
          geometry: { $last: '$geometry' } // geometry is assumed similar for all results, keep last
        })
      }
    }
    // The query contains the match stage except options relevent to the aggregation pipeline
    const match = _.omit(query, ['$groupBy', '$aggregate', '$geoNear', '$sort', '$limit', '$skip'])
    const aggregateOptions = {}
    // Check for any required type conversion (eg HTTP requests)
    if (featureId && _.has(match, 'properties.' + featureId)) {
      if (featureIdType === 'number') _.set(match, 'properties.' + featureId, _.toNumber(_.get(match, 'properties.' + featureId)))
      // Check if we could provide a hint to the aggregation when targeting feature ID
      // Indeed, in that case, we define the appropriate index
      aggregateOptions.hint = { ['properties.' + featureId]: 1 }
    }
    // Ensure we do not mix results with/without relevant element values
    // by separately querying each element then merging
    let aggregatedResults
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
      // Ensure they are ordered by increasing time by default
      pipeline.push({ $sort: query.$sort || { time: 1 } })
      // Keep track of all feature values
      if (singleTime) {
        pipeline.push({ $group: groupBy })
        pipeline.push({ $replaceRoot: { newRoot: '$feature' } })
      } else {
        pipeline.push({ $group: Object.assign({ [element]: { $push: '$' + prefix + element } }, groupBy) })
      }
      debug(`Aggregating ${element} element for features`)
      pipeline.forEach(stage => {
        _.forOwn(stage, (value, key) => debug('Stage', key, value))
      })
      const elementResults = await collection.aggregate(pipeline, aggregateOptions).toArray()
      debug(`Generated ${elementResults.length} feature(s) for ${element} element`)
      // Rearrange data so that we get ordered arrays indexed by element
      elementResults.forEach(result => {
        result.time = { [element]: result.time }
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
      } else {
        elementResults.forEach(result => {
          const resultKeys = _.pick(result, keys)
          const previousResult = aggregatedResults.find(aggregatedResult => {
            const aggregatedResultKeys = _.pick(aggregatedResult, keys)
            return _.isEqual(aggregatedResultKeys, resultKeys)
          })
          // Merge with previous matching feature if any
          if (previousResult) {
            Object.assign(previousResult.time, result.time)
            _.set(previousResult, prefix + element, _.get(result, prefix + element))
          } else {
            aggregatedResults.push(result)
          }
        })
      }
    }))
    delete query.$groupBy
    delete query.$aggregate
    delete query.$geoNear
    // Set result to avoid service DB call
    hook.result = aggregatedResults
  }
  return hook
}
