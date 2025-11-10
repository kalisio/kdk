import _ from 'lodash'
import moment from 'moment'
import { unref } from 'vue'
import sift from 'sift'
import chroma from 'chroma-js'
import centroid from '@turf/centroid'
import { Time, Store, Units, i18n } from '../../../core/client/index.js'
import { getFeatureId, getFeatureLabel } from './utils.js'
import { getMeasureForFeature } from './utils.features.js'
import { formatUserCoordinates } from './utils.location.js'
import { isMeasureLayer } from './utils.layers.js'
import { getForecastForLocation, getForecastProbe, getForecastForFeature } from './utils.weacast.js'
import { useCurrentActivity } from '../composables/activity.js'

// When organizing time series by feature the dataset color is the variable color as given in the layer
// eg 'temperature' data in red and 'humidity' data in blue
// When organizing time series by variable the dataset color should be different for each feature
// eg 'Toulouse' data in red, 'Paris' data in blue, etc.
// We pregenerate a fixed set of colors for this to ensure they are always assigned in the same order
const nbColors = 10
const Colors = chroma.scale('Set1').colors(nbColors)

// Add a small delta (minutes) to data time range so that some ticks are always visible
// and points on on the left/right side are not cut
const TimeRangeDelta = 2

// ID of weather forecast probe timeseries
export const ForecastProbeId = 'forecast-probe'

export function getChartOptions (title) {
  return {
    title: {
      display: true,
      text: title,
      align: 'start'
    },
    scales: {
      x: {
        min: (startTime, endTime) => startTime.clone().subtract(TimeRangeDelta, 'minutes').valueOf(),
        max: (startTime, endTime) => endTime.clone().add(TimeRangeDelta, 'minutes').valueOf()
      }
    },
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
          generateLabels: (chart) => {
            return chart.data.datasets.map((dataset, index) => {
              // If we have a single value but like to draw a line it does not make sense so that we "force" point display
              const hasSingleValue = (dataset.data.length === 1)
              return {
                text: dataset.label,
                datasetIndex: index,
                fillStyle: dataset.backgroundColor,
                strokeStyle: dataset.borderColor,
                pointStyle: (hasSingleValue ? 'rectRot' : 'line'),
                hidden: !chart.isDatasetVisible(index)
              }
            })
          }
        }
      }
    }
  }
}

// Extract target variable data for timeseries from timeseries request result
async function getDataForVariable(data, variable, forecastLevel, runTime) {
  data = await data
  const times = _.get(data, 'time', _.get(data, 'forecastTime', {}))
  const runTimes = _.get(data, 'runTime', {})
  const properties = _.get(data, 'properties', {})
  // Check if we are targetting a specific variable at level (forecast model case)
  const name = (forecastLevel ? `${variable.name}-${forecastLevel}` : variable.name)
  let values = []
  // Aggregated variable available for feature ?
  if (properties[name] && Array.isArray(properties[name])) {
    // Build data structure as expected by visualisation
    values = properties[name].map((value, index) => {
      value = Units.convert(value, variable.unit, variable.targetUnit)
      return { time: moment.utc(times[name][index]).valueOf(), [name]: value }
    })
    // Keep only selected value if multiple are provided for the same time (eg different forecasts)
    if (variable.runTimes && runTime && !_.isEmpty(_.get(runTimes, name))) {
      values = values.filter((value, index) => (runTimes[name][index] === runTime.toISOString()))
    } else values = _.uniqBy(values, 'time')
  }
  return values
}

// Retrieve data coming from a weather forecast request for timeseries
async function fetchDataForForecastSeries({
  feature, location, layer, startTime, endTime,
  forecastModel, forecastLevel, weacastApi
}) {
  // Use current time range if not provided
  const { start, end } = Time.getRange()
  if (!startTime) startTime = start
  if (!endTime) endTime = end
  // Depending on input use the right function to retrieve data
  let data
  // No feature clicked => custom probe function or dynamic weacast probe at position
  if (!feature) {
    data = await getForecastForLocation({ longitude: location.lng, latitude: location.lat, startTime, endTime, forecastModel, forecastLevel, weacastApi })
  } else if (layer.probe) { // Static weacast probe
    const probe = await getForecastProbe({ name: layer.probe, forecastModel, weacastApi })
    if (probe) {
      data = await getForecastForFeature({ probe, featureId: _.get(feature, probe.featureId), startTime, endTime, forecastModel, forecastLevel, weacastApi })
    }
  } else { // Dynamic weacast probe at feature position
    const location = centroid(feature)
    const longitude = _.get(location, 'geometry.coordinates[0]')
    const latitude = _.get(location, 'geometry.coordinates[1]')
    data = await getForecastForLocation({ longitude, latitude, startTime, endTime, forecastModel, forecastLevel, weacastApi })
  }
  return data
}

// Retrieve data coming from a measure request for timeseries
// Can also use a custom probing function if provided
async function fetchDataForMeasureSeries({
  feature, location, layer, startTime, endTime, level, probeFunction
}) {
  // Use current time range if not provided
  const { start, end } = Time.getRange()
  if (!startTime) startTime = start
  if (!endTime) endTime = end
  // Depending on input use the right function to retrieve data
  let data
  // No feature clicked => custom probe function or dynamic weacast probe at position
  if (probeFunction) {
    data = await probeFunction({ feature, location, layer, level, startTime, endTime })
  } else if (isMeasureLayer(layer)) { // Static measure probe
    data = await getMeasureForFeature(layer, feature, startTime, endTime, level)
  }
  return data
}

// Build timeseries to be used in charts for target feature and associated layer definition or probe location
export function getForecastTimeSeries({
  feature, location, layer, startTime, endTime, runTime,
  forecastLayers, forecastModel, forecastLevel, weacastApi, fetchDelay
}) {
  let forecastVariables = []
  if (forecastLayers && forecastLayers.length > 0) forecastLayers.forEach(layer => { forecastVariables = forecastVariables.concat(_.get(layer, 'variables', [])) })
  forecastVariables = _.uniqBy(forecastVariables, 'name')
  if (forecastVariables.length === 0) return []
  const properties = _.get(feature, 'properties', {})
  // Create promise to fetch data as it will be shared by all series,
  // indeed a weather forecast request gets all aggregated variables
  const forecastData = fetchDataForForecastSeries({
    feature, location, layer, startTime, endTime, forecastModel, forecastLevel, weacastApi
  })
  // Fetch data function to request data update,
  // we use debounce as a weather forecast request stores all aggregated variables
  // so that when all series are updated at once a single query will be send.
  const fetchForecast = _.debounce(() => fetchDataForForecastSeries({
    feature, location, layer, startTime, endTime, forecastModel, forecastLevel, weacastApi
  }), fetchDelay || 250, { leading: true, trailing: false })
  
  const series = forecastVariables.map(variable => {
    // Base unit could be either directly the unit or the property of the measure storing the unit
    const baseUnit = _.get(properties, 'unit', variable.unit)
    // Known by the unit system ?
    const unit = Units.getUnit(baseUnit)
    const targetUnit = Units.getTargetUnit(baseUnit)
    const serie = {
      probedLocationData: forecastData,
      data: getDataForVariable(forecastData, variable, forecastLevel, runTime),
      variable: {
        name: variable.name,
        label: `${i18n.tie(variable.label)} (${Units.getTargetUnitSymbol(baseUnit)})`,
        unit,
        targetUnit,
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
    serie.fetch = () => {
      serie.probedLocationData = fetchForecast()
      serie.data = getDataForVariable(serie.probedLocationData, variable, forecastLevel, runTime)
      return serie.data
    }
    return serie
  })

  return series
}

// Build timeseries to be used in charts for target feature and associated layer definition or probe location
export function getMeasureTimeSeries({
  feature, location, layer, layers, startTime, endTime, runTime,
  level, probeFunction, fetchDelay
}) {
  // A feature comes from a single layer so target variables from it by default
  let variables = _.get(layer, 'variables', [])
  // However, a probe can target variables coming from multiple layers
  if (layers && layers.length > 0) layers.forEach(layer => { variables = variables.concat(_.get(layer, 'variables', [])) })
  variables = _.uniqBy(variables, 'name')
  if (variables.length === 0) return []
  const properties = _.get(feature, 'properties', {})
  // Create promise to fetch data as it will be shared by all series,
  // indeed a measure request gets all aggregated variables
  const data = fetchDataForMeasureSeries({
    feature, location, layer, startTime, endTime, level, probeFunction
  })
  // Fetch data function to request data update,
  // we use debounce as a measure request stores all aggregated variables
  // so that when all series are updated at once a single query will be send.
  const fetch = _.debounce(() => fetchDataForMeasureSeries({
    feature, location, layer, startTime, endTime, level, probeFunction
  }), fetchDelay || 250, { leading: true, trailing: false })
  
  const series = variables.map(variable => {
    // Base unit could be either directly the unit or the property of the measure storing the unit
    const baseUnit = _.get(properties, 'unit', variable.unit)
    // Known by the unit system ?
    const unit = Units.getUnit(baseUnit)
    const targetUnit = Units.getTargetUnit(baseUnit)
    const serie = {
      probedLocationData: data,
      data: getDataForVariable(data, variable),
      variable: {
        name: variable.name,
        label: `${i18n.tie(variable.label)} (${Units.getTargetUnitSymbol(baseUnit)})`,
        unit,
        targetUnit,
        chartjs: Object.assign({
          parsing: {
            xAxisKey: 'time',
            yAxisKey: variable.name
          },
          cubicInterpolationMode: 'monotone',
          tension: 0.4
        }, _.cloneDeep(variable.chartjs))
      }
    }
    serie.fetch = () => {
      serie.probedLocationData = fetch()
      serie.data = getDataForVariable(serie.probedLocationData, variable)
      return serie.data
    }
    return serie
  })

  return series
}

// Helper function to update time series whenever something related changes, eg time span
export async function updateTimeSeries (previousTimeSeries) {
  const { CurrentActivity, hasSelectedItems, getSelectedItems, hasProbedLocation, getProbedLocation } = useCurrentActivity()
  const activity = unref(CurrentActivity)
  if (!activity) return
  // Initialize the time range
  const span = Store.get('timeseries.span')
  const start = moment(Time.getCurrentTime()).subtract(span, 'm')
  const end = moment(Time.getCurrentTime()).add(span, 'm')
  Time.patchRange({ start, end })
  // Weather probe targets variables coming from multiple layers
  const forecastLayers = _.values(activity.layers).filter(sift({ tags: ['weather', 'forecast'] }))
  const featureLevel = activity.selectableLevelsLayer ? ` - ${activity.selectedLevel} ${activity.selectableLevels.unit}` : ''
  const forecastLevel = activity.forecastLevel ? ` - ${activity.forecastLevel} ${activity.selectableLevels.unit}` : ''

  let timeSeries = []
  if (hasProbedLocation()) {
    const coordinates = formatUserCoordinates(getProbedLocation().lat, getProbedLocation().lng, Store.get('locationFormat', 'FFf'))
    // When custom probe function we provide visible layers as input
    if (activity.probeLocation) {
      let variableLayers = _.difference(_.values(activity.layers).filter(sift({ variables: { $exists: true }, isVisible: true })), forecastLayers)
      variableLayers = variableLayers.filter(layer => activity.canProbeLocation({ location: getProbedLocation(), layer, level: activity.selectedLevel }))
      variableLayers.forEach(layer => {
        const series = getMeasureTimeSeries({
          location: getProbedLocation(),
          layer,
          level: activity.selectedLevel,
          probeFunction: activity.probeLocation
        })
        if (!_.isEmpty(series)) {
          timeSeries.push({
            id: `${layer.name}-measure-probe`,
            label: `${layer.label} (${coordinates})` + featureLevel,
            series
          })
        }
      })
    }
    // Or weather forecast probe
    if (_.isEmpty(timeSeries) && activity.forecastModel) {
      const series = getForecastTimeSeries({
        location: getProbedLocation(),
        forecastLayers,
        forecastModel: activity.forecastModel,
        forecastLevel: activity.forecastLevel,
        weacastApi: activity.getWeacastApi()
      })
      if (!_.isEmpty(series)) {
        timeSeries.push({
          id: ForecastProbeId,
          label: `${activity.forecastModel.label} (${coordinates})` + forecastLevel,
          series
        })
      }
    }
  }
  if (hasSelectedItems()) {
    getSelectedItems().forEach(item => {
      const featureId = getFeatureId(item.feature, item.layer)
      const featureLabel = getFeatureLabel(item.feature, item.layer)
      // Measure
      if (isMeasureLayer(item.layer)) {
        const series = getMeasureTimeSeries({
          feature: item.feature,
          layer: item.layer,
          level: activity.selectedLevel
        })
        if (!_.isEmpty(series)) {
          timeSeries.push({
            id: `${item.layer.name}-${featureId}-measure`,
            label: `${item.layer.label} - ${featureLabel || featureId}` + featureLevel,
            series
          })
        }
      }
      // Or weather forecast probe
      if (_.isEmpty(timeSeries) && activity.forecastModel) {
        const series = getForecastTimeSeries({
          feature: item.feature,
          layer: item.layer,
          forecastLayers,
          forecastModel: activity.forecastModel,
          forecastLevel: activity.forecastLevel,
          weacastApi: activity.getWeacastApi()
        })
        if (!_.isEmpty(series)) {
          timeSeries.push({
            id: `${item.layer.name}-${featureId}-probe`,
            label: `${activity.forecastModel.label} (${item.layer.label} - ${featureLabel || featureId})` + forecastLevel,
            series
          })
        }
      }
    })
  }

  const groupBy = Store.get('timeseries.groupBy')
  // Default is to group by feature
  if (groupBy === 'variable') {
    const timeSeriesByVariable = {}
    timeSeries.forEach((timeSerie, index) => {
      timeSerie.series.forEach(serie => {
        // We do not mix variables with different units
        const variable = `${_.get(serie, 'variable.name')}-${_.get(serie, 'variable.unit.name')}`
        const variableLabel = _.get(serie, 'variable.label')
        // When organizing time series by feature chart name is the feature name while the dataset label is the variable name,
        // eg a 'Toulouse' station collecting 'temperature' and 'humidity' data
        // When organizing time series by variable the chart name is the variable name while the dataset label is the feature name
        // eg the 'temperature' data for different stations 'Toulouse', 'Paris', etc.
        _.set(serie, 'variable.label', timeSerie.label)
        _.set(serie, 'variable.chartjs.backgroundColor', Colors[index % nbColors])
        _.set(serie, 'variable.chartjs.borderColor', Colors[index % nbColors])
        if (timeSeriesByVariable[variable]) {
          timeSeriesByVariable[variable].series.push(serie)
        } else {
          timeSeriesByVariable[variable] = {
            id: variable,
            label: variableLabel,
            series: [serie]
          }
        }
      })
    })
    timeSeries = _.values(timeSeriesByVariable)
  }
  // Restore previous state if any
  if (previousTimeSeries) {
    timeSeries.forEach(timeSerie => {
      const previousTimeSerie = _.find(previousTimeSeries, { id: timeSerie.id })
      // Keep track of some states only
      if (previousTimeSerie) Object.assign(timeSerie, _.pick(previousTimeSerie, ['visible', 'pinned', 'logarithmic']))
    })
  }
  // Make first serie visible if required, always measure first if any
  if (!_.isEmpty(timeSeries) && !_.find(timeSeries, { visible: true })) {
    const timeSerie = _.find(timeSeries, timeSerie => timeSerie.label.includes('measure')) || timeSeries[0]
    timeSerie.visible = true
  }
  return timeSeries
}
