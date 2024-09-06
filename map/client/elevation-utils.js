import _ from 'lodash'
import { segmentEach, coordEach } from '@turf/meta'
import { featureCollection, point } from '@turf/helpers'
import length from '@turf/length'
import flatten from '@turf/flatten'
import { Units } from '../../core/client/units.js'

// Take a feature (linestring or multilinestring) and extract altitudes + curvilinear abscissa
// In case of multilinestring, it is assumed that linestring N last point == linestring N+1 first point
// Distance is converted to distanceUnit
// Altitude is converted to altitudeUnit
// If there's no elevation on feature's coords, then returns an empty array
// On success, returns a sorted array of { x: curvilinear abscissa, y: elevation } (sorted by x)
function fetchProfileDataset (feature, distanceUnit, altitudeUnit) {
  // Check supported geometry
  const geometry = _.get(feature, 'geometry.type')
  if (geometry !== 'LineString' && geometry !== 'MultiLineString') {
    // logger.warn('the selected feature has an invald geometry')
    return []
  }

  // Split multi linestrings in individual linestrings
  const linestrings = geometry === 'MultiLineString' ? flatten(feature).features : [feature]

  // Extract profile altitude at each point if available on the segments
  const dataset = []
  const segments = []
  let allCoordsHaveAltitude = true
  let curvilinearOffset = 0
  let curvilinearIndex = 0
  for (let i = 0; i < linestrings.length && allCoordsHaveAltitude; ++i) {
    const currentLine = linestrings[i]
    const dataUnit = _.get(currentLine, 'properties.altitudeUnit', 'm')
    segments.push({ numPoints: currentLine.geometry.coordinates.length })

    // Gather profile altitude at each coord, make sure all coords have height along the way
    coordEach(currentLine, (coord, coordIdx) => {
      // Skip first point of all segments except the first one since we assume
      // last point of segment N = first point of segment N+1
      if (dataset.length && coordIdx === 0) return
      // if (profileAltitudes.length && coordIdx === 0) return
      // if (coord.length > 2) profileAltitudes.push(Units.convert(coord[2], dataUnit, altitudeUnit))
      if (coord.length > 2) dataset.push({ x: 0, y: Units.convert(coord[2], dataUnit, altitudeUnit) })
      else allCoordsHaveAltitude = false
    })
    // Compute curvilinear abscissa at each point
    if (allCoordsHaveAltitude) {
      segmentEach(currentLine, (segment) => {
        // if (profileLabels.length === 0) profileLabels.push(0)
        if (curvilinearIndex === 0) dataset[0].x = 0
        curvilinearOffset += length(segment, { units: 'kilometers' }) * 1000
        // profileLabels.push(Units.convert(curvilinearOffset, 'm', distanceUnit))
        curvilinearIndex += 1
        dataset[curvilinearIndex].x = Units.convert(curvilinearOffset, 'm', distanceUnit)
      })
    }
  }

  return { dataset: allCoordsHaveAltitude ? dataset : [], segments }
}

function asArray (val) { return (Array.isArray(val) || val === undefined) ? val : [val] }

// Take a feature (linestring or multilinestring) and query elevation service
// It'll make a query per multi linestring element, or only one in case of linestring
// Results are converted to distance unit and altitude unit accordingly
// On success, returns an array of queries perfomed where each query is an object with the following elements :
//  - profile: the queried profile
//  - resolution: the resolution used in the query (converted to distanceUnit)
//  - corridorWidth: the corridor with (in distanceUnit) used to perform the query, or undefined if 'noCorridor' was set
//  - elevation: the qery result, a feature collection of points with properties 'z' (in altitudeUnit) and 't' (in distanceUnit)
//               where z is the elevation at the point, and t is the curvilinear abscissa along the queried profile
//  - length: the length (in distanceUnit) of the queried profile
async function queryElevation (endpoint, feature, distanceUnit, altitudeUnit, { additionalHeaders, defaultResolution, defaultResolutionUnit, noCorridor } = {}) {
  // Check supported geometry
  const geometry = _.get(feature, 'geometry.type')
  if (geometry !== 'LineString' && geometry !== 'MultiLineString') {
    // logger.warn('the selected feature has an invald geometry')
    return []
  }

  // When feature is a multi line string, make as many queries as line string segments
  const queries = []
  const resolution = asArray(_.get(feature, 'properties.elevationProfile.resolution', defaultResolution))
  const resolutionUnit = _.get(feature, 'properties.elevationProfile.resolutionUnit', defaultResolutionUnit)
  const corridor = noCorridor ? undefined : asArray(_.get(feature, 'properties.elevationProfile.corridorWidth'))
  const corridorUnit = noCorridor ? undefined : _.get(feature, 'properties.elevationProfile.corridorWidthUnit', 'm')
  if (geometry === 'MultiLineString') {
    flatten(feature).features.forEach((feat, index) => {
      queries.push({
        profile: feat,
        resolution: Units.convert(resolution[index], resolutionUnit, 'm'),
        corridorWidth: corridor ? Units.convert(corridor[index], corridorUnit, 'm') : undefined
      })
    })
  } else {
    queries.push({
      profile: feature,
      resolution: Units.convert(resolution[0], resolutionUnit, 'm'),
      corridorWidth: corridor ? Units.convert(corridor[0], corridorUnit, 'm') : undefined
    })
  }

  // Build a fetch per profile
  const fetchs = []
  for (const query of queries) {
    fetchs.push(fetch(endpoint +
                      `?resolution=${query.resolution}` +
                      (query.corridorWidth !== undefined ? `&corridorWidth=${query.corridorWidth}` : ''), {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(query.profile),
      headers: Object.assign({ 'Content-Type': 'application/json' }, additionalHeaders)
    }))
  }

  let responses
  try {
    responses = await Promise.all(fetchs)
    for (const res of responses) {
      if (!res.ok) throw new Error('Fetch failed')
    }
  } catch (error) {
    return []
  }

  // Each query has its own result
  for (let i = 0; i < queries.length; ++i) {
    const q = queries[i]

    // Each point on the elevation profile will contains two properties;
    // - z: the elevation in meters
    // - t: the curvilinear abscissa relative to the queried profile in meters
    q.elevation = await responses[i].json()
    q.length = length(q.profile, { units: 'kilometers' }) * 1000

    // Transform to user units
    q.resolution = Units.convert(resolution[i], resolutionUnit, distanceUnit)
    q.corridorWidth = corridor ? Units.convert(corridor[i], corridorUnit, distanceUnit) : undefined
    q.length = Units.convert(q.length, 'm', distanceUnit)

    for (const point of q.elevation.features) {
      point.properties.z = Units.convert(point.properties.z, 'm', altitudeUnit)
      point.properties.t = Units.convert(point.properties.t, 'm', distanceUnit)
    }
  }

  return queries
}

// Compatibility function used to handle 'securityMargin' property defined on the queried feature.
// If this property is set, it'll make it available on the individual queries in the 'securityMargin' member
function addSecurityMargin (feature, queries, altitudeUnit) {
  if (queries.length === 0) return

  const securityMargin = _.get(feature, 'properties.elevationProfile.securityMargin')
  if (securityMargin === undefined) return

  const securityMarginUnit = _.get(feature, 'properties.elevationProfile.securityMarginUnit', 'm')

  const geometry = _.get(feature, 'geometry.type')
  if (geometry === 'MultiLineString') {
    flatten(feature).features.forEach((feat, index) => {
      queries[index].securityMargin = Units.convert(securityMargin[index], securityMarginUnit, altitudeUnit)
    })
  } else {
    queries[0].securityMargin = Units.convert(securityMargin, securityMarginUnit, altitudeUnit)
  }
}

// Take a feature (linestring or multilinestring) and query elevation service
// On success returns the array of performed queries (one per multilinestring element, or only one if linestring)
// Queries are defined the same way as in queryElevation function
// If noSecurityMargin is set, it'll skip the security margin step
// If minElevationValue is set, any elevation lower than this will be set to 0 (expected in altitudeUnit)
async function fetchElevation (endpoint, feature, distanceUnit, altitudeUnit, { additionalHeaders, defaultResolution, defaultResolutionUnit, noCorridor, noSecurityMargin, minElevationValue } = {}) {
  const queries = await queryElevation(endpoint, feature, distanceUnit, altitudeUnit, { additionalHeaders, defaultResolution, defaultResolutionUnit, noCorridor })

  // Compatibility with initial airbus elevation profile where
  // securityMargin was an offset to add per segment
  if (!noSecurityMargin) { addSecurityMargin(feature, queries, altitudeUnit) }

  if (minElevationValue !== undefined) {
    for (let i = 0; i < queries.length; ++i) {
      const q = queries[i]
      for (const point of q.elevation.features) {
        if (point.properties.z < minElevationValue) { point.properties.z = 0 }
      }
    }
  }

  return queries
}

// Use the elevation queries to build a chartjs dataset and/or a geojson with the result
// In case of multilinestring (multiple queries), it is assumed that linestring N last point == linestring N+1 first point
// On success, if requested, the chartjs dataset is a sorted array of { x: curvilinear abscissa, y: elevation } (sorted by x)
// If queryParametersInDataset is set, each dataset element will also contain an elevation: { resolution, corridorWidth, securityMargin } object
// If requested the returned geojson will be a merge of each query result, where the 't' property will be adjusted for each multilinestring element
// If securityMargin is present in the queries, it'll be added to the 'z' property of each point
function extractElevation (queries, { noDataset, noGeojson, queryParametersInDataset, queryParametersInGeojson } = {}) {
  const dataset = []
  const allPoints = []

  // Each profile will have a point on start and end points
  // When we have multi line string, we skip the first point for all segment
  // after the first one
  let curvilinearOffset = 0
  for (let i = 0; i < queries.length; ++i) {
    // Add security margin if was in the query
    const zOffset = queries[i].securityMargin ? queries[i].securityMargin : 0

    // Parameters used for the query
    const r = queries[i].resolution
    const w = queries[i].corridorWidth
    const s = queries[i].securityMargin

    // Each point on the elevation profile will contains two properties;
    // - z: the elevation
    // - t: the curvilinear abscissa relative to the queried profile
    queries[i].elevation.features.forEach((p, index) => {
      // Skip first point of each new line segment, except for the first segment
      if (i !== 0 && index === 0) return

      const t = curvilinearOffset + p.properties.t
      // take security margin into account if provided
      const e = zOffset + p.properties.z

      if (!noDataset) {
        const datasetPoint = { x: t, y: e }
        if (queryParametersInDataset) {
          datasetPoint.elevation = { resolution: r }
          if (w !== undefined) datasetPoint.elevation.corridorWidth = w
          if (s !== undefined) datasetPoint.elevation.securityMargin = s
        }
        dataset.push(datasetPoint)
      }
      if (!noGeojson) {
        const props = { z: e, t }
        if (queryParametersInDataset) {
          props.resolution = r
          if (w !== undefined) props.corridorWidth = w
          if (s !== undefined) props.securityMargin = s
        }
        allPoints.push(point(p.geometry.coordinates, props))
      }
    })

    // Update curvilinear offset for next profile, and skip next profile's first point
    // since it'll match with the current profile last point
    curvilinearOffset += queries[i].length
  }

  const geojson = noGeojson ? {} : featureCollection(allPoints)
  return { dataset, geojson }
}

export { fetchProfileDataset, fetchElevation, extractElevation }
