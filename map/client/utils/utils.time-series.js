import _ from 'lodash'
import moment from 'moment'
import { Time, Units, i18n } from '../../../core/client/index.js'
import { isMeasureLayer } from './utils.layers.js'
import { getMeasureForFeature } from './utils.features.js'
import { getForecastForLocation, getForecastProbe, getForecastForFeature } from './utils.weacast.js'

async function getDataForVariable(data, variable, forecastLevel) {
  data = await data
  const time = _.get(data, 'time', _.get(data, 'forecastTime'))
  const runTime = _.get(data, 'runTime')
  const properties = _.get(data, 'properties', {})
  // Check if we are targetting a specific variable at level (forecast model case)
  const name = (forecastLevel ? `${variable.name}-${forecastLevel}` : variable.name)
  let values = []
  // Aggregated variable available for feature ?
  if (properties[name] && Array.isArray(properties[name])) {
    // Build data structure as expected by visualisation
    values = properties[name].map((value, index) => ({ time: moment.utc(time[name][index]).valueOf(), [name]: value }))
    // Keep only selected value if multiple are provided for the same time (eg different forecasts)
    if (variable.runTimes && !_.isEmpty(_.get(runTime, name)) && runTime) {
      values = values.filter((value, index) => (runTime[name][index] === runTime.toISOString()))
    } else values = _.uniqBy(values, 'time')
  }
  return values
}

async function fetchDataForSeries({
  feature, location, layer, startTime, endTime,
  level, forecastModel, forecastLevel, weacastApi
}) {
  // Use current time range if not provided
  const { start, end } = Time.getRange()
  if (!startTime) startTime = start
  if (!endTime) endTime = end
  // Depending on input use the right function to retrieve data
  let data
  // No feature clicked => dynamic weacast probe at position
  if (!feature) {
    data = await getForecastForLocation({ longitude: location.lng, latitude: location.lat, startTime, endTime, forecastModel, forecastLevel, weacastApi })
  } else if (layer.probe) { // Static weacast probe
    const probe = await getForecastProbe({ name: layer.probe, forecastModel, weacastApi })
    if (probe) {
      data = await getForecastForFeature({ probe, featureId: _.get(feature, probe.featureId), startTime, endTime, forecastModel, forecastLevel, weacastApi })
    }
  } else if (isMeasureLayer(layer)) { // Static measure probe
    data = await getMeasureForFeature(layer, feature, startTime, endTime, level)
  } else { // dynamic weacast probe at feature position
    const location = centroid(feature)
    const longitude = _.get(location, 'geometry.coordinates[0]')
    const latitude = _.get(location, 'geometry.coordinates[1]')
    data = await getForecastForLocation({ longitude, latitude, startTime, endTime, forecastModel, forecastLevel, weacastApi })
  }
  return data
}

// Build timeseries to be used in charts for target feature and associated layer definition or probe location
export function getTimeSeries({
  feature, location, layer, layers, startTime, endTime, runTime,
  level, forecastModel, forecastLevel, weacastApi
}) {
  // A feature comes from a single layer so target variables from it
  let variables = _.get(layer, 'variables', [])
  // However, a probe can target variables coming from multiple layers
  if (layers && layers.length > 0) layers.forEach(layer => { variables = variables.concat(_.get(layer, 'variables', [])) })
  if (variables.length === 0) return []
  const properties = _.get(feature, 'properties', {})
  // Fetch data function
  const fetch = () => fetchDataForSeries({
    feature, location, layer, startTime, endTime,
    level, forecastModel, forecastLevel, weacastApi
  })
  // Create promise to fetch data as it will be shared by all series,
  // indeed a measure stores all aggregated variables
  const data = fetch()
  
  const series = variables.map(variable => {
    // Base unit could be either directly the unit or the property of the measure storing the unit
    const baseUnit = _.get(properties, 'unit', variable.unit)
    // Known by the unit system ?
    const unit = Units.getUnit(baseUnit) || { name: baseUnit }
    const serie = {
      probedLocation: data,
      data: getDataForVariable(data, variable, forecastLevel),
      variable: {
        name: variable.name,
        label: `${i18n.tie(variable.label)} (${Units.getTargetUnitSymbol(baseUnit)})`,
        unit,
        targetUnit: Units.getTargetUnit(unit),
        chartjs: Object.assign({
          parsing: {
            xAxisKey: 'time',
            yAxisKey: (forecastLevel ? `${variable.name}-${forecastLevel}` : variable.name)
          },
          cubicInterpolationMode: 'monotone',
          tension: 0.4
        }, _.cloneDeep(variable.chartjs))
      }
    }
    // FIXME: how to share promise between series ?
    serie.fetch = () => {
      serie.probedLocation = fetch()
      serie.data = getDataForVariable(serie.probedLocation, variable, forecastLevel)
    }
    return serie
  })

  return series
}
