import _ from 'lodash'
import logger from 'loglevel'
import moment from 'moment'
import { getType } from '@turf/invariant'
import explode from '@turf/explode'
import kinks from '@turf/kinks'
import clean from '@turf/clean-coords'
import rhumbBearing from '@turf/rhumb-bearing'
import rhumbDistance from '@turf/rhumb-distance'
import rotate from '@turf/transform-rotate'
import scale from '@turf/transform-scale'
import translate from '@turf/transform-translate'
import { api, Time } from '../../../core/client/index.js'
import chroma from 'chroma-js'

export function processFeatures (geoJson, processor) {
  const features = (geoJson.type === 'FeatureCollection' ? geoJson.features : [geoJson])
  if (typeof processor === 'function') {
    features.forEach(feature => processor(feature))
  } else if (typeof processor === 'string') {
    const compiler = _.template(processor)
    features.forEach(feature => compiler({ feature, properties: feature.properties }))
  }
}

export function transformFeatures (geoJson, transform) {
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



export async function constructFeatures (geoJson, options) {
  const construct = options.construct;
  const variable = options.variables[0]; // for now we only support one variable
  const chromajs = {
    range: variable.chromajs?.range || ['red', 'yellow', 'green'],
    domain: variable.chromajs?.domain || [0, 100],
  };


  // Initial validation
  if (!geoJson || geoJson.type !== 'FeatureCollection') return;
  if (!construct || typeof construct?.type !== 'string') return;

  const { features } = geoJson;
  if (!Array.isArray(features) || features.length < 2) return;

  // Group features by featureId (featureId is in the properties of each feature)
  const groupedFeatures = _.groupBy(features, f => _.get(f, 'properties.' + options.featureId));

  // Calculate the color scale
  const colorScale = chroma.scale(chromajs.range).domain(chromajs.domain);

  // For each group of features, create a lineString feature
  const newFeatures = Object.entries(groupedFeatures).map(([featureId, group]) => {
    // Sort the group by time (if the "time" property exists), NECESARY or else the line will be messed up
    const sortedGroup = group.sort((a, b) => new Date(a.properties.time) - new Date(b.properties.time));

    // valueName is either at the root of the feature or in the properties
    const valueName = _.has(sortedGroup[0], variable.name) ? variable.name : 'properties.' + variable.name;

    // if the value is time, we need to convert all the values to a number and generate a domain from the min to the max
    if (valueName === 'time') {
      // get the first and last time values
      chromajs.minTime = new Date(sortedGroup[sortedGroup.length - 1].time).getTime();
      chromajs.maxTime = new Date(sortedGroup[0].time).getTime();
    }

    // Prepare data for coordinates and gradients
    const { coordinates, gradients, name } = sortedGroup.reduce(
      (acc, feature) => {
        acc.coordinates.push(feature.geometry.coordinates);

        // get the value from the feature, if it's time, convert it as a percentage of the min and max time
        let value = _.get(feature, valueName);
        if (valueName === 'time') {
            const timeValue = new Date(value).getTime();
            value = ((timeValue - chromajs.minTime) / (chromajs.maxTime - chromajs.minTime)) * 100;
        } 
        const  gradient = colorScale(value).hex();
        acc.gradients.push(gradient);
        return acc;
      },
      { coordinates: [], gradients: [], name : '' }
    );

    // Create the new feature
    return {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates,
      },
      properties: {
        gradient: gradients,
        [options.featureId]: featureId,
        name : sortedGroup[0].properties.name || sortedGroup[0].properties[options.featureId],
        ...(construct.properties || {}),
      },
    };
  });

  // Replace the original features with the newly created ones
  geoJson.features = newFeatures;
  geoJson.type = 'FeatureCollection';
  geoJson.total = newFeatures.length;
}





export async function getBaseQueryForFeatures (options) {
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

export async function getFilterQueryForFeatures (options) {
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

export async function getSortQueryForFeatures (options) {
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

export function getFeaturesUpdateInterval (options) {
  const interval = _.get(options, 'every')
  return (interval ? moment.duration(interval) : null)
}

export function getFeaturesQueryInterval (options) {
  const interval = getFeaturesUpdateInterval(options)
  let queryInterval = _.get(options, 'queryFrom')
  // If query interval not given use 2 x refresh interval as default value
  // this ensures we cover last interval if server/client update processes are not in sync
  if (!queryInterval && interval) queryInterval = moment.duration(-2 * interval.asMilliseconds())
  return (queryInterval ? moment.duration(queryInterval) : null)
}

export function shouldSkipFeaturesUpdate (lastUpdateTime, options, interval) {
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

export async function getProbeFeatures (options) {
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

export async function getFeaturesQuery (options, queryInterval, queryLevel) {
  // If not given try to compute query interval from options
  if (!queryInterval) {
    queryInterval = getFeaturesQueryInterval(options)
  }
  // Any base query to process ?
  let query = await getBaseQueryForFeatures(options)
  // Request features with at least one data available during last query interval
  if (queryInterval) {
    // Check if we are in construct mode 
    if (options.construct) {

      // for now don't do anything special

      // query = Object.assign({
      // }, query)
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
      if (options.featureId && !_.has(options, "construct")) query.$limit = 1
    } else if (typeof queryInterval === 'object') {
      query.time = queryInterval
    } else {
      Object.assign(query, {
        $sort: { time: -1, runTime: -1 },
        time: { $lte: now.toISOString() }
      })
      // If we can aggregate then keep track of last element of each aggregation
      if (options.featureId && !_.has(options, "construct")) query.$limit = 1
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

export function isFeatureInQueryInterval (feature, options) {
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

export async function getFeaturesFromQuery (options, query) {
  // Check API to be used in case the layer is coming from a remote "planet"
  const planetApi = (typeof options.getPlanetApi === 'function' ? options.getPlanetApi() : api)
  const response = await planetApi.getService(options.service).find(Object.assign({ query }, options.baseParams))
  if (options.processor) processFeatures(response, options.processor)
  if (options.transform) transformFeatures(response, options.transform)
  if (options.construct) await constructFeatures(response, options)
  return response
}

export function getMeasureForFeatureBaseQuery (layer, feature) {
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

export async function getMeasureForFeatureQuery (layer, feature, startTime, endTime, level) {
  const query = await getFeaturesQuery(_.merge({
    baseQuery: getMeasureForFeatureBaseQuery(layer, feature)
  }, layer), {
    $gte: startTime.toISOString(),
    $lte: endTime.toISOString()
  }, level)
  return query
}

export async function getMeasureForFeatureFromQuery (layer, feature, query) {
  const result = await getFeaturesFromQuery(layer, query)
  return _.get(result, 'features[0]')
}

export async function getMeasureForFeature (layer, feature, startTime, endTime, level) {
  let probedLocation
  try {
    const query = await getMeasureForFeatureQuery(layer, feature, startTime, endTime, level)
    probedLocation = await getMeasureForFeatureFromQuery(layer, feature, query)
  } catch (error) {
    logger.error(error)
  }
  return probedLocation
}

export function checkFeatures (geoJson, options = {
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

export async function createFeatures (geoJson, layer, chunkSize = 5000, processCallback) {
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

export async function editFeaturesGeometry (geoJson, layer) {
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

export async function editFeaturesProperties (geoJson, layer) {
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

export async function removeFeatures (geoJson, layer) {
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

export async function fetchGeoJson (dataSource, options = {}) {
  const response = await fetch(dataSource)
  if (response.status !== 200) {
    throw new Error(`Impossible to fetch ${dataSource}: ` + response.status)
  }
  const data = await response.json()
  if (options.processor) processFeatures(data, options.processor)
  if (options.transform) transformFeatures(data, options.transform)
  return data
}

export function getFeatureStyleType (feature) {
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
