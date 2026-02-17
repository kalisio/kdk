import _ from 'lodash'
import logger from 'loglevel'

export async function getForecastForLocation ({ longitude, latitude, startTime, endTime, forecastModel, forecastLevel, weacastApi }) {
  // Not yet ready
  if (!forecastModel) return
  // From now to last available time
  const geometry = {
    type: 'Point',
    coordinates: [longitude, latitude]
  }
  const query = {
    forecastTime: {
      $gte: startTime.toISOString(),
      $lte: endTime.toISOString()
    },
    geometry: {
      $geoIntersects: {
        $geometry: geometry
      }
    }
  }
  let probedLocation
  try {
    let elements = forecastModel.elements.map(element => element.name)
    // Filter available elements according to current level if any
    if (forecastLevel) elements = elements.filter(element => element.endsWith(forecastLevel.toString()))
    else {
      elements = elements.filter(element => {
        const tokens = element.split('-')
        return (tokens.length === 0) || !_.isFinite(_.toNumber(tokens[tokens.length - 1]))
      })
    }
    const response = await weacastApi.getService('probes')
      .create({
        forecast: forecastModel.name,
        elements
      }, { query })
    if (response.features.length > 0) {
      probedLocation = response.features[0]
    } else throw new Error('Cannot find valid forecast at location')
  } catch (error) {
    logger.error(error)
  }
  return probedLocation
}

export async function getForecastProbe ({ name, forecastModel, weacastApi }) {
  const results = await weacastApi.getService('probes').find({
    query: {
      name,
      forecast: forecastModel.name,
      $paginate: false,
      $select: ['elements', 'forecast', 'featureId']
    }
  })
  if (results.length > 0) {
    const probe = results[0]
    return probe
  } else {
    return null
  }
}

export async function getForecastForFeature ({ probe, featureId, startTime, endTime, forecastModel, forecastLevel, weacastApi }) {
  let probedLocation
  try {
    let elements = forecastModel.elements.map(element => element.name)
    // Filter available elements according to current level if any
    if (forecastLevel) {
      elements = elements.filter(element => element.endsWith(forecastLevel.toString()))
    } else {
      elements = elements.filter(element => {
        const tokens = element.split('-')
        return (tokens.length === 0) || !_.isFinite(_.toNumber(tokens[tokens.length - 1]))
      })
    }
    // Need to add derived values for static probes as they are not computed on the fly
    const windDirection = (forecastLevel ? `windDirection-${forecastLevel}` : 'windDirection')
    const windSpeed = (forecastLevel ? `windSpeed-${forecastLevel}` : 'windSpeed')
    elements = elements.concat([windDirection, windSpeed])

    const results = await weacastApi.getService('probe-results').find({
      query: {
        probeId: probe._id,
        forecastTime: {
          $gte: startTime.toISOString(),
          $lte: endTime.toISOString()
        },
        [probe.featureId]: featureId,
        $groupBy: probe.featureId,
        $aggregate: elements
      }
    })
    if (results.length > 0) {
      probedLocation = results[0]
    } else throw new Error('Cannot find valid forecast for feature')
  } catch (error) {
    logger.error(error)
  }
  return probedLocation
}
