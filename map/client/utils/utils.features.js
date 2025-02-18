import _ from 'lodash'
import logger from 'loglevel'
import moment from 'moment'
import { getType, getGeom } from '@turf/invariant'
import explode from '@turf/explode'
import kinks from '@turf/kinks'
import clean from '@turf/clean-coords'
import rhumbBearing from '@turf/rhumb-bearing'
import rhumbDistance from '@turf/rhumb-distance'
import rotate from '@turf/transform-rotate'
import scale from '@turf/transform-scale'
import translate from '@turf/transform-translate'
import { api, Time } from '../../../core/client/index.js'
import { listenToServiceEvents, unlistenToServiceEvents } from '../../../core/client/utils/index.js'
import { isInMemoryLayer, isFeatureLayer } from './utils.layers.js'
import chroma from 'chroma-js'

export function processFeatures(geoJson, processor) {
  const features = (geoJson.type === 'FeatureCollection' ? geoJson.features : [geoJson])
  if (typeof processor === 'function') {
    features.forEach(feature => processor(feature))
  } else if (typeof processor === 'string') {
    const compiler = _.template(processor)
    features.forEach(feature => compiler({ feature, properties: feature.properties }))
  }
}

export function transformFeatures(geoJson, transform) {
  const features = (geoJson.type === 'FeatureCollection' ? geoJson.features : [geoJson])
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

export async function buildGradientPath(geoJson, options) {
  const variable = options.build.variable

  // Check if the GeoJSON is a FeatureCollection
  if (!geoJson || geoJson.type !== 'FeatureCollection') {
    console.error('Invalid GeoJSON, a FeatureCollection is required to build a gradient path')
    return
  }

  // Check chromajs has required infos
  if (!variable.chromajs.colors) {
    console.error(`Invalid chromajs on variable ${variable.name}, missing colors.`)
    return
  }
  let scale
  if (variable.chromajs.domain) {
    scale = chroma.scale(variable.chromajs.colors).domain(variable.chromajs.domain)
  } else if (variable.chromajs.classes) {
    scale = chroma.scale(variable.chromajs.colors).classes(variable.chromajs.classes)
  }
  if (!scale) {
    console.error(`Invalid chromajs on variable ${variable.name}, missing domain or classes.`)
    return
  }

  geoJson.features = geoJson.features.map((feature) => {
    const geometries = feature.geometry.geometries.map(g => g.coordinates)
    const values = feature.properties[variable.name]

    // Check if the feature has at least two geometries and they are different
    if (geometries.length < 2 || _.uniqBy(geometries, JSON.stringify).length < 2) {
      console.error('Invalid GeoJSON, at least two geometries are required to construct a line')
      // convert it to a point
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: geometries[0],
        },
        properties: feature.properties,
      }
    }

    const gradient = values.map(value => scale(value).hex())

    return {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: geometries,
      },
      properties: Object.assign({ gradient }, _.omit(feature.properties, variable.name), variable.gradientPath.properties)
    }
  })

  geoJson.total = geoJson.features.length
}

async function checkBuildInstructions(options) {
  const knownInstructions = ['gradientPath']
  if (!options.variables) return

  for (const instr of knownInstructions) {
    const variable = _.find(options.variables, (variable) => _.has(variable, instr))
    if (variable) {
      // { instruct: 'gradientPath', variable: { temperature: { ... } } }
      return { instruct: instr, variable }
    }
  }
}

export async function getBaseQueryForFeatures(options) {
  // Any base query to process ?
  const baseQuery = {}
  if (options.baseQuery) {
    if (typeof options.baseQuery === 'function') {
      const result = await options.baseQuery()
      // A null query indicate to skip update
      if (!result) return
      else Object.assign(baseQuery, result)
    } else {
      Object.assign(baseQuery, options.baseQuery)
    }
  }
  return baseQuery
}

export async function getFilterQueryForFeatures(options) {
  // Any filter query to process ?
  const filterQuery = {}
  if (options.filterQuery) {
    if (typeof options.filterQuery === 'function') {
      const result = await options.filterQuery()
      Object.assign(filterQuery, result)
    } else {
      Object.assign(filterQuery, options.filterQuery)
    }
  }
  // Any filters to process ?
  const filters = _.get(options, 'filters', [])
  if (!_.isEmpty(filters)) {
    // To be flexible enough filters can provide a query for their active and inactive state
    // Similarly, filters can be combined with a different operator for each state
    const filterOperators = _.get(options, 'filterOperators', { active: '$or', inactive: '$and' })
    // Aggregate filter queries according to filter states
    const activeFilters = filters
      .filter(filter => filter.isActive)
      .map(filter => filter.active)
      .filter(query => !_.isEmpty(query))
    if (!_.isEmpty(activeFilters)) filterQuery[filterOperators.active] = activeFilters
    const inactiveFilters = filters
      .filter(filter => !filter.isActive)
      .map(filter => filter.inactive)
      .filter(query => !_.isEmpty(query))
    if (!_.isEmpty(inactiveFilters)) filterQuery[filterOperators.inactive] = inactiveFilters
  }
  return filterQuery
}

export async function getSortQueryForFeatures(options) {
  // Any sort query to process ?
  const sortQuery = {}
  if (options.sortQuery) {
    if (typeof options.sortQuery === 'function') {
      const result = await options.sortQuery()
      Object.assign(sortQuery, result)
    } else {
      Object.assign(sortQuery, options.sortQuery)
    }
  }
  return { $sort: sortQuery }
}

export function getFeaturesUpdateInterval(options) {
  const interval = _.get(options, 'every')
  return (interval ? moment.duration(interval) : null)
}

export function getFeaturesQueryInterval(options) {
  const interval = getFeaturesUpdateInterval(options)
  let queryInterval = _.get(options, 'queryFrom')
  // If query interval not given use 2 x refresh interval as default value
  // this ensures we cover last interval if server/client update processes are not in sync
  if (!queryInterval && interval) queryInterval = moment.duration(-2 * interval.asMilliseconds())
  return (queryInterval ? moment.duration(queryInterval) : null)
}

export function shouldSkipFeaturesUpdate(lastUpdateTime, options, interval) {
  // If not given try to compute query interval from options
  if (!interval) {
    interval = getFeaturesUpdateInterval(options)
  }
  // We assume this is not a time-varying layer
  if (!interval) return true
  const now = Time.getCurrentTime()
  const elapsed = moment.duration(now.diff(lastUpdateTime))
  // If query interval has elapsed since last update we need to update again
  return (Math.abs(elapsed.asMilliseconds()) < interval.asMilliseconds())
}

export async function getProbeFeatures(options) {
  // Any base/filter/sort query to process ?
  const query = await getBaseQueryForFeatures(options)
  const filterQuery = await getFilterQueryForFeatures(options)
  const sortQuery = await getSortQueryForFeatures(options)
  Object.assign(query, filterQuery, sortQuery)
  // Check API to be used in case the layer is coming from a remote "planet"
  const planetApi = (typeof options.getPlanetApi === 'function' ? options.getPlanetApi() : api)
  const response = await planetApi.getService(options.probeService).find(Object.assign({ query }, options.baseParams))
  if (options.processor) processFeatures(response, options.processor)
  if (options.transform) transformFeatures(response, options.transform)
  return response
}

export async function getFeaturesQuery(options, queryInterval, queryLevel) {
  // If not given try to compute query interval from options
  if (!queryInterval) {
    queryInterval = getFeaturesQueryInterval(options)
  }
  // Any base query to process ?
  let query = await getBaseQueryForFeatures(options)

  // Check if we have a known instruction to build
  const instruct = await checkBuildInstructions(options)
  options.build = instruct

  // Request features with at least one data available during last query interval
  if (queryInterval) {
    // If we have a build instruction 
    if (instruct) {
      query = Object.assign({
        $groupBy: options.featureId,
        $aggregate: ['geometry', instruct.variable.name]
      }, query)
    }
    // Check if we have variables to be aggregated in time or not
    else if (options.variables) {
      query = Object.assign({
        $groupBy: options.featureId,
        // Take care we might have multiple variables targetting the same value name
        // but that differentiate using others properties (compound feature ID)
        $aggregate: _.uniq(options.variables.map(variable => variable.name))
      }, query)

    } else if (options.featureId) {
      query = Object.assign({
        $groupBy: options.featureId,
        $aggregate: ['geometry']
      }, query)

    }

    const now = Time.getCurrentTime()
    if (moment.isDuration(queryInterval)) {
      // Depending on the duration format we might have negative or positive values
      const gte = (queryInterval.asMilliseconds() > 0
        ? now.clone().subtract(queryInterval)
        : now.clone().add(queryInterval))
      const lte = now
      Object.assign(query, {
        $sort: { time: -1, runTime: -1 },
        time: {
          $gte: gte.toISOString(),
          $lte: lte.toISOString()
        }
      })
      // If we can aggregate then keep track of last element of each aggregation
      // for the build instruction we need to keep all elements
      if (options.featureId && !instruct) query.$limit = 1
    } else if (typeof queryInterval === 'object') {
      query.time = queryInterval
    } else {
      Object.assign(query, {
        $sort: { time: -1, runTime: -1 },
        time: { $lte: now.toISOString() }
      })
      // If we can aggregate then keep track of last element of each aggregation
      // for the build instruction we need to keep all elements
      if (options.featureId && !instruct) query.$limit = 1
    }
  }
  if (!_.isNil(queryLevel)) {
    query.level = queryLevel
  }
  // Any filter/sort query to process ?
  const filterQuery = await getFilterQueryForFeatures(options)
  const sortQuery = await getSortQueryForFeatures(options)
  // Take care to not erase possible existing sort options
  _.merge(query, filterQuery, sortQuery)
  return query
}

export function isFeatureInQueryInterval(feature, options) {
  // We assume this is not a time-varying layer
  if (!feature.time) return true
  const queryInterval = getFeaturesQueryInterval(options)
  if (!moment.isDuration(queryInterval)) return true
  const now = Time.getCurrentTime()
  const time = moment.utc(feature.time)
  // Depending on the duration format we might have negative or positive values
  const gte = (queryInterval.asMilliseconds() > 0
    ? now.clone().subtract(queryInterval)
    : now.clone().add(queryInterval))
  const lte = now
  // In realtime mode take into account that we don't update time continuously but according to a frequency
  // so that we might receive features "in the future" according to the current time
  if (Time.isRealtime()) lte.add(Time.get().interval, 's')
  return time.isSameOrAfter(gte) && time.isSameOrBefore(lte)
}

export async function getFeaturesFromQuery(options, query) {
  // Check API to be used in case the layer is coming from a remote "planet"
  const planetApi = (typeof options.getPlanetApi === 'function' ? options.getPlanetApi() : api)
  const response = await planetApi.getService(options.service).find(Object.assign({ query }, options.baseParams))
  if (options.processor) processFeatures(response, options.processor)
  if (options.transform) transformFeatures(response, options.transform)
  if (options.build) {
    switch (options.build.instruct) {
      case 'gradientPath':
        await buildGradientPath(response, options)
        break
    }
    delete options.build
  }

  return response
}

export function getMeasureForFeatureBaseQuery(layer, feature) {
  // We might have a different ID to identify measures related to a timeseries (what is called a chronicle)
  // than measures displayed on a map. For instance mobile measures might appear at different locations,
  // but when selecting one we would like to display the timeseries related to all locations.
  let featureId = layer.chronicleId || layer.featureId
  // Support compound ID
  featureId = (Array.isArray(featureId) ? featureId : [featureId])
  const query = featureId.reduce((result, id) =>
    Object.assign(result, { ['properties.' + id]: _.get(feature, 'properties.' + id) }),
    {})
  query.$groupBy = featureId
  return query
}

export async function getMeasureForFeatureQuery(layer, feature, startTime, endTime, level) {
  const query = await getFeaturesQuery(_.merge({
    baseQuery: getMeasureForFeatureBaseQuery(layer, feature)
  }, layer), {
    $gte: startTime.toISOString(),
    $lte: endTime.toISOString()
  }, level)
  return query
}

export async function getMeasureForFeatureFromQuery(layer, feature, query) {
  const result = await getFeaturesFromQuery(layer, query)
  return _.get(result, 'features[0]')
}

export async function getMeasureForFeature(layer, feature, startTime, endTime, level) {
  let probedLocation
  try {
    const query = await getMeasureForFeatureQuery(layer, feature, startTime, endTime, level)
    probedLocation = await getMeasureForFeatureFromQuery(layer, feature, query)
  } catch (error) {
    logger.error(error)
  }
  return probedLocation
}

export function checkFeatures(geoJson, options = {
  kinks: true,
  redundantCoordinates: true
}) {
  const features = (geoJson.type === 'FeatureCollection' ? geoJson.features : [geoJson])
  // Removes redundant coordinates
  if (options.redundantCoordinates) {
    features.forEach(feature => clean(feature, { mutate: true }))
  }
  // Filter invalid features
  let kinksFeatures
  if (options.kinks) {
    kinksFeatures = _.remove(features, feature => {
      const type = getType(feature)
      if ((type === 'MultiPolygon') || (type === 'Polygon')) {
        const invalidFeatures = kinks(feature)
        return _.get(invalidFeatures, 'features', []).length > 0
      } else { // No possible self-intersection on points, self-intersections allowed on lines
        return false
      }
    })
  }
  return { kinks: kinksFeatures }
}

export async function createFeatures(geoJson, layer, chunkSize = 5000, processCallback) {
  if (!layer) return
  const features = (geoJson.type === 'FeatureCollection' ? geoJson.features : [geoJson])
  features.forEach(feature => {
    // Remove any temporary ID as we will use the one from MongoDB
    delete feature._id
    feature.layer = layer._id
  })
  // Single edition mode
  if (features.length === 1) {
    const feature = await api.getService(layer.service).create(features[0])
    return feature
  } else {
    // Create chunks to avoid reaching some limits (upload size, timeout, etc.)
    // We create chunks according to the number of points and not features.
    // Indeed otherwise it would create very different chunks depending on the geometry type
    // (eg a bucket of 1000 polygons can actually contains a lot of points).
    // const chunks = _.chunk(features, chunkSize)
    const chunks = []
    let chunkPoints = 0
    let chunk = []
    features.forEach(feature => {
      const explodedFeature = explode(feature)
      const nbPoints = explodedFeature.features.length
      // Check if current chunk is not full
      if ((chunkPoints + nbPoints) <= chunkSize) {
        chunkPoints += nbPoints
        chunk.push(feature)
      } else {
        // Otherwise push current chunk if not empty
        if (chunk.length > 0) {
          chunks.push(chunk)
        }
        // Then start new chunk
        chunk = [feature]
        chunkPoints = nbPoints
      }
    })
    // Push last chunk
    if (chunk.length > 0) {
      chunks.push(chunk)
    }
    // Write the chunks
    for (let i = 0; i < chunks.length; i++) {
      await api.getService(layer.service).create(chunks[i])
      if (typeof processCallback === 'function') await processCallback(i, chunks[i])
    }
  }
}

export async function editFeaturesGeometry(geoJson, layer) {
  const features = (geoJson.type === 'FeatureCollection' ? geoJson.features : [geoJson])
  const updatedFeatures = []
  for (let i = 0; i < features.length; i++) {
    const feature = features[i]
    if (feature._id) {
      const updatedFeature = await api.getService(layer.service).patch(feature._id, _.pick(feature, ['geometry']))
      updatedFeatures.push(updatedFeature)
    }
  }
  return (geoJson.type === 'FeatureCollection' ? Object.assign(geoJson, { features: updatedFeatures }) : updatedFeatures)
}

export async function editFeaturesProperties(geoJson, layer) {
  const features = (geoJson.type === 'FeatureCollection' ? geoJson.features : [geoJson])
  const updatedFeatures = []
  for (let i = 0; i < features.length; i++) {
    const feature = features[i]
    if (feature._id) {
      const updatedFeature = await api.getService(layer.service).patch(feature._id, _.pick(feature, ['properties']))
      updatedFeatures.push(updatedFeature)
    }
  }
  return (geoJson.type === 'FeatureCollection' ? Object.assign(geoJson, { features: updatedFeatures }) : updatedFeatures)
}

export async function removeFeatures(geoJson, layer) {
  // Remove all features of a given layer
  if (!geoJson) {
    await api.getService(layer.service).remove(null, { query: { layer: layer._id } })
  } else {
    const features = (geoJson.type === 'FeatureCollection' ? geoJson.features : [geoJson])
    for (let i = 0; i < features.length; i++) {
      const feature = features[i]
      if (feature._id) await api.getService(layer.service).remove(feature._id)
    }
  }
}

export async function fetchGeoJson(dataSource, options = {}) {
  const response = await fetch(dataSource)
  if (response.status !== 200) {
    throw new Error(`Impossible to fetch ${dataSource}: ` + response.status)
  }
  const data = await response.json()
  if (options.processor) processFeatures(data, options.processor)
  if (options.transform) transformFeatures(data, options.transform)
  return data
}

export function getFeatureStyleType(feature) {
  const geometryType = _.get(feature, 'geometry.type')
  if (!geometryType) {
    logger.warn('[KDK] feature has undefined geometry')
    return
  }
  if (geometryType === 'Point') return 'point'
  if (['LineString', 'MultiLineString'].includes(geometryType)) return 'line'
  if (['Polygon', 'MultiPolygon'].includes(geometryType)) return 'polygon'
  logger.warn(`[KDK] unsupported geometry of type of ${geometryType}`)
  return
}

// Bind listeners to layer service events and store it in the returned object
export function listenToFeaturesServiceEventsForLayer (layer, {
  context = null, created = null, updated = null, patched = null, removed = null, all = null,
} = {}, listeners) {
  if (!layer.service || isInMemoryLayer(layer)) return
  // serviceEvents property can be used to force realtime events on non user-defined layer, ie when service is not 'features'
  if (!isFeatureLayer(layer) && !layer.serviceEvents) return
  // Check if already registered
  unlistenToFeaturesServiceEventsForLayer(layer, listeners)
  // Generate listeners targetting the right layer as in some cases the features won't hold it.
  // Indeed, contrary to user-defined layers, which store the layer ID in the layer property of the features,
  // multiple built-in layers might target the same service with a different base query so that filtering according to layer ID is not relevent.
  const generateListenerForEvent = (listener, layer) => {
    if (!listener) return null
    else return (feature) => {
      // We only support single feature edition
      if (!getType(feature) || !getGeom(feature)) return

      if (feature.layer) {
        if (feature.layer === layer._id) listener(feature, layer)
      } else {
        listener(feature, layer)
      }
    }
  }
  return listenToServiceEvents(layer.service, {
    context,
    created: generateListenerForEvent(created, layer),
    updated: generateListenerForEvent(updated, layer),
    patched: generateListenerForEvent(patched, layer),
    removed: generateListenerForEvent(removed, layer),
    all: generateListenerForEvent(all, layer)
  })
}

// Unbind previously stored listeners from layer service events
export function unlistenToFeaturesServiceEventsForLayer (layer, listeners) {
  unlistenToServiceEvents(listeners)
}
