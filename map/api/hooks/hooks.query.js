import _ from 'lodash'
import { marshallGeometry } from '../marshall'
import makeDebug from 'debug'

const debug = makeDebug('kalisio:kMap:query:hooks')

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
    if (!_.isNil(query.centerLon) && !_.isNil(query.centerLat) && !_.isNil(query.distance)) {
      const lon = _.toNumber(query.centerLon)
      const lat = _.toNumber(query.centerLat)
      const d = _.toNumber(query.distance)
      // Transform to MongoDB spatial request
      delete query.centerLon
      delete query.centerLat
      delete query.distance
      query.geometry = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lon, lat]
          },
          $maxDistance: d
        }
      }
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
    if (query.$distinct) return // Not applicable in this case
    let results = hook.result
    const pagination = _.pick(results, ['total', 'skip', 'limit'])
    results = Array.isArray(results) ? results : results.data
    results = results
      .filter(item => {
        // Item locations are not already in GeoJson feature format so we need to convert if we can
        if (options.longitudeProperty && options.latitudeProperty) {
          return _.has(item, options.longitudeProperty) && _.has(item, options.latitudeProperty)
        } else {
          return true
        }
      })
      .map(item => {
        let coordinates
        // Item locations are not already in GeoJson feature format so we need to convert
        // Keep track of coordinates before picking properties
        if (options.longitudeProperty && options.latitudeProperty) {
          coordinates = [_.get(item, options.longitudeProperty), _.get(item, options.latitudeProperty)]
          if (options.altitudeProperty && _.has(item, options.altitudeProperty)) {
            coordinates.push(_.get(item, options.altitudeProperty))
          }
        }
        if (options.pick) {
          item = _.pick(item, options.pick)
        }
        if (options.omit) {
          item = _.omit(item, options.omit)
        }
        // Item locations are not already in GeoJson feature format so we need to convert
        if (options.longitudeProperty && options.latitudeProperty) {
          return Object.assign({ type: 'Feature', geometry: { type: 'Point', coordinates }, properties: {} }, item)
        } else {
          return item
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
    // Copy pagination information so that client can use it anyway
    if (_.get(options, 'asFeatureCollection', true)) {
      hook.result = Object.assign({
        type: 'FeatureCollection',
        features: results
      }, pagination)
    } else {
      hook.result = Object.assign({
        data: results
      }, pagination)
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
    const ids = typeof query.$groupBy === 'string' // Group by matching ID(s), ie single ID or array of field to create a compound ID
      ? { [query.$groupBy]: '$properties.' + query.$groupBy }
    // Aggregated in an accumulator to avoid conflict with feature properties
      : query.$groupBy.reduce((object, id) => Object.assign(object, { [id]: '$properties.' + id }), {})
    const groupBy = { _id: ids }
    // Do we only keep first or last available time ?
    const singleTime = (_.toNumber(query.$limit) === 1)
    if (singleTime) {
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
    const match = _.omit(query, ['$groupBy', '$aggregate', '$sort', '$limit', '$skip'])
    const aggregateOptions = {}
    // Check if we could provide a hint to the aggregation when targeting feature ID
    if (featureId && _.has(match, 'properties.' + featureId)) {
      aggregateOptions.hint = { ['properties.' + featureId]: 1 }
    }
    // Ensure we do not mix results with/without relevant element values
    // by separately querying each element then merging
    let aggregatedResults
    await Promise.all(query.$aggregate.map(async element => {
      const isGeometry = (element === 'geometry')
      // Geometry is a root property while others are feature properties
      const prefix = (isGeometry ? '' : 'properties.')
      // Find matching features only
      const pipeline = [{ $match: Object.assign({ [prefix + element]: { $exists: true } }, match) }]
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
          const previousResult = aggregatedResults.find(aggregatedResult => {
            let keys = _.keys(ids)
            // When single time no aggregation is perofrmed at all so we only have raw features
            if (singleTime) keys = keys.map(key => 'properties.' + key)
            return (_.isEqual(_.pick(aggregatedResult, keys), _.pick(result, keys)))
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
    delete query.$aggregate
    // Set result to avoid service DB call
    hook.result = aggregatedResults
  }
  return hook
}
