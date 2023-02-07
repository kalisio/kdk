import _ from 'lodash'
import { segmentEach, coordEach } from '@turf/meta'
import length from '@turf/length'
import flatten from '@turf/flatten'
import { Units } from '../../core/client/units.js'

// TODO: maybe return datasets as [[segment1], [segment2], ...] when multilinestring ?
// TODO: add defaultResolution & defaultResolutionUnit

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
  const linestrings = geometry === 'MultiLineString' ? flatten(feature).features : [ feature ]

  // Extract profile altitude at each point if available on the segments
  const dataset = []
  let allCoordsHaveAltitude = true
  let curvilinearOffset = 0
  let curvilinearIndex = 0
  for (let i = 0; i < linestrings.length && allCoordsHaveAltitude; ++i) {
    const currentLine = linestrings[i]
    const dataUnit = _.get(currentLine, 'properties.altitudeUnit', 'm')
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

  // return allCoordsHaveAltitude ? [profileAltitudes, profileLabels] : [[], []]
  return allCoordsHaveAltitude ? dataset : []
}

/*
function extractProfileDataset (feature, distanceUnit, altitudeUnit) {
  // Check supported geometry
  const geometry = _.get(feature, 'geometry.type')
  if (geometry !== 'LineString' && geometry !== 'MultiLineString') {
    // logger.warn('the selected feature has an invald geometry')
    return []
  }

  const dataset = []
  let allCoordsHaveAltitude = true
  let curvilinearOffset = 0
  let curvilinearIndex = 0
  segmentEach(feature, (segment, featureIdx, multiFeatureIdx, geometryIdx, segmentIdx) => {
  })
}
*/

// Take a feature (linestring or multilinestring) and query elevation service
// In case of multilinestring, it is assumed that linestring N last point == linestring N+1 first point
// On success, returns a sorted array of { x: curvilinear abscissa, y: elevation, elevation: { resolution, corridorWidth } (sorted by x)
async function fetchElevationDataset (endpoint, additionalHeaders, feature, distanceUnit, altitudeUnit, defaultResolution, defaultResolutionUnit) {
  // Check supported geometry
  const geometry = _.get(feature, 'geometry.type')
  if (geometry !== 'LineString' && geometry !== 'MultiLineString') {
    // logger.warn('the selected feature has an invald geometry')
    return []
  }

  const queries = []
  const resolution = _.get(feature, 'properties.elevationProfile.resolution', defaultResolution)
  const resolutionUnit = _.get(feature, 'properties.elevationProfile.resolutionUnit', defaultResolutionUnit)
  const corridor = _.get(feature, 'properties.elevationProfile.corridorWidth')
  const corridorUnit = _.get(feature, 'properties.elevationProfile.corridorWidthUnit', 'm')
  if (geometry === 'MultiLineString') {
    flatten(feature).features.forEach((feat, index) => {
      queries.push({
        profile: feat,
        resolution: Units.convert(resolution[index], resolutionUnit, 'm'),
        corridorWidth: corridor ? Units.convert(corridor[index], corridorUnit, 'm') : 0,
        // securityMargin: securityMargin ? Units.convert(securityMargin[index], securityMarginUnit, 'm') : null
      })
    })
  } else {
    queries.push({
      profile: feature,
      resolution: Units.convert(resolution, resolutionUnit, 'm'),
      corridorWidth: corridor ? Units.convert(corridor, corridorUnit, 'm') : 0,
      // securityMargin: securityMargin ? Units.convert(securityMargin, securityMarginUnit, 'm') : null
    })
  }

  // Build a fetch per profile
  const fetchs = []
  for (const query of queries) {
    fetchs.push(fetch(endpoint +
                      `?resolution=${query.resolution}` +
                      (query.corridorWidth ? `&corridorWidth=${query.corridorWidth}` : ''), {
                      // (query.corridorWidth ? `&corridorWidth=${query.corridorWidth}` : '') +
                      // (query.securityMargin ? `&elevationOffset=${query.securityMargin}` : ''), {
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

  // Each profile will have a point on start and end points
  // When we have multi line string, we skip the first point for all segment
  // after the first one
  const dataset = []
  let skipFirstPoint = false
  let curvilinearOffset = 0
  for (let i = 0; i < queries.length; ++i) {
    const r = Units.convert(queries[i].resolution, resolutionUnit, distanceUnit)
    const w = Units.convert(queries[i].corridorWidth, corridorUnit, distanceUnit)

    const points = await responses[i].json()
    // Each point on the elevation profile will contains two properties;
    // - z: the elevation in meters
    // - t: the curvilinear abscissa relative to the queried profile in meters
    points.features.forEach((point, index) => {
      if (skipFirstPoint && index === 0) return

      const t = Units.convert(curvilinearOffset + _.get(point, 'properties.t', 0), 'm', distanceUnit)
      const e = Units.convert(point.properties.z, 'm', altitudeUnit)
      dataset.push({ x: t, y: e, elevation: { resolution: r, corridorWidth: w }})
    })

    // Update curvilinear offset for next profile, and skip next profile's first point
    // since it'll match with the current profile last point
    curvilinearOffset += length(queries[i].profile, { units: 'kilometers' }) * 1000
    skipFirstPoint = true
  }

  return dataset
}

export { fetchProfileDataset, fetchElevationDataset }
