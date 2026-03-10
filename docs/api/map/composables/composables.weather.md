# Weather

## Overview

`useWeather(options)` provides helper functions for working with Weacast weather forecast data on map features. It resolves forecast field paths based on the activity's current forecast model and level, formats forecast data as HTML, and creates Leaflet wind barb markers and tooltips.

## Usage

```javascript
import { useWeather } from '@kalisio/kdk/map.client'

const {
  getProbedLocationForecastFields,
  isWeatherProbe,
  getForecastAsHtml,
  getProbedLocationForecastAtCurrentTime,
  createWindBarbIcon,
  getProbedLocationForecastMarker,
  getProbedLocationForecastTooltip
} = useWeather()
```

## Exposed

| Name | Type | Description |
|------|------|-------------|
| `getProbedLocationForecastFields(variables?)` | `Function` | Returns an object mapping standard weather field names (`windDirection`, `windSpeed`, `temperature`, `gust`, `precipitations`, `humidity`, `time`, `name`) to their property paths on a probed feature. Paths are adjusted for the activity's current `forecastLevel`. If `variables` is provided, field labels are resolved from the variable definitions using i18n. |
| `isWeatherProbe(feature)` | `Function` | Returns `true` if the feature contains both `windDirection` and `windSpeed` forecast properties, indicating it is a weather probed location. |
| `getForecastAsHtml(feature, fields?)` | `Function` | Formats available forecast values (wind speed, gust, wind direction, precipitations, humidity, temperature) from the given feature as an HTML string, including time and station name when available. Returns an empty string if no values are present. |
| `getWindBarbOptions(feature, fields?)` | `Function` | Returns a Leaflet `WindBarb.Icon` options object for the given feature, or `null` if wind data is missing or invalid. |
| `createWindBarbIcon(feature, fields?)` | `Function` | Creates and returns a Leaflet `WindBarb.Icon` for the given feature, or `null` if wind data is unavailable. |
| `getForecastValueAtCurrentTime(times, values)` | `Function` | Returns the forecast value in `values` whose corresponding time in `times` is nearest to the current application time, respecting the forecast model interval. Returns `null` if no valid time is found within tolerance, or `values` directly if it is not an array. |
| `getProbedLocationForecastAtCurrentTime(probedLocation)` | `Function` | Clones a probed GeoJSON feature and resolves all array-valued forecast properties to their value at the current application time. Also updates the `forecastTime` map. Returns the modified clone. |
| `getProbedLocationForecastTooltip(feature, layer, options, fields?)` | `Function` | Creates a Leaflet tooltip bound to `layer` with the forecast HTML content of `feature`, or `null` if there is no content. |
| `getProbedLocationForecastMarker(feature, latlng, options, fields?)` | `Function` | Creates a Leaflet marker with a wind barb icon at `latlng` for the given feature, or `null` if wind data is unavailable. |

## Notes

- The composable watches the current activity ref so that `forecastModel` and `forecastLevel` changes on the activity are reflected in subsequent calls.
- Wind speed values are formatted using the KDK `Units` system (m/s by default).
- Temperature is formatted in degrees Celsius (degC).
