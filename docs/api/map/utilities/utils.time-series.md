# Time-series utilities

## Overview

This module provides functions for building and updating Chart.js-compatible time-series datasets from weather forecast or measurement data associated with probed locations and selected map features.

## Constants

| Name | Description |
|------|-------------|
| `ForecastProbeId` | Fixed ID string (`'forecast-probe'`) used for forecast probe time-series entries. |

## Functions

### `getChartOptions(title)`

Returns a base Chart.js options object with a titled chart, time-based x-axis, and a custom legend that uses point styles.

- **Parameters:**
  - `title` *(string)*: The chart title displayed at the top-left.
- **Returns:** `Object` — A Chart.js options configuration object.

---

### `getForecastTimeSeries({ feature, location, layer, startTime, endTime, runTime, forecastLayers, forecastModel, forecastLevel, forecastLevelUnit, weacastApi, fetchDelay })`

Builds an array of time-series descriptors for weather forecast variables at a probed location or feature.

- **Parameters:**
  - `feature` *(Object | null)*: The clicked GeoJSON feature, or `null` for a position-only probe.
  - `location` *(Object)*: The probe location `{ lng, lat }`.
  - `layer` *(Object)*: The layer associated with the feature.
  - `startTime` *(Moment, optional)*: Start of the time range. Defaults to current range start.
  - `endTime` *(Moment, optional)*: End of the time range. Defaults to current range end.
  - `runTime` *(Moment, optional)*: Specific forecast run time to filter values by.
  - `forecastLayers` *(Array)*: Layers tagged as weather/forecast from which variables are collected.
  - `forecastModel` *(Object)*: The active forecast model definition.
  - `forecastLevel` *(number | null)*: Optional vertical level.
  - `forecastLevelUnit` *(string)*: Unit label for the level.
  - `weacastApi` *(Object)*: The Weacast API client instance.
  - `fetchDelay` *(number, optional)*: Debounce delay in milliseconds for data re-fetches. Defaults to `250`.
- **Returns:** `Array` — An array of series descriptor objects, each with `probedLocationData`, `data` (Promise), `variable` (name, label, unit, chartjs options), and a `fetch()` method for data refresh.

---

### `getMeasureTimeSeries({ feature, location, layer, layers, startTime, endTime, runTime, level, levelUnit, probeFunction, fetchDelay })`

Builds an array of time-series descriptors for measurement variables at a probed location or feature.

- **Parameters:**
  - `feature` *(Object | null)*: The clicked GeoJSON feature, or `null` for a position-only probe.
  - `location` *(Object)*: The probe location `{ lng, lat }`.
  - `layer` *(Object)*: The primary layer associated with the feature.
  - `layers` *(Array, optional)*: Additional layers whose variables should be included.
  - `startTime` *(Moment, optional)*: Start of the time range.
  - `endTime` *(Moment, optional)*: End of the time range.
  - `level` *(number | null)*: Optional vertical level.
  - `levelUnit` *(string)*: Unit label for the level.
  - `probeFunction` *(Function, optional)*: Custom async probe function `({ feature, location, layer, level, startTime, endTime }) => data`. When provided, replaces the default `getMeasureForFeature` call.
  - `fetchDelay` *(number, optional)*: Debounce delay in milliseconds for data re-fetches. Defaults to `250`.
- **Returns:** `Array` — An array of series descriptor objects (same shape as `getForecastTimeSeries`).

---

### `updateTimeSeries(previousTimeSeries)`

Recomputes the full set of time-series for the current activity state: probed location and/or selected features. Handles both measure and forecast probes, supports grouping by variable or by feature, and restores `visible`, `pinned`, and `logarithmic` state from a previous series array.

- **Parameters:**
  - `previousTimeSeries` *(Array | null)*: The previous time-series array, used to restore UI state. Pass `null` on first call.
- **Returns:** `Promise<Array>` — The new time-series array. Each entry has `{ id, label, series[] }`. The first visible series is automatically set to `visible: true` if none are visible. Measure time-series are preferred over forecast probes when both are available.

::: tip
Time-series can be grouped by variable instead of by feature by setting `Store.patch('timeseries.groupBy', 'variable')`. In variable grouping mode, datasets are coloured using a 10-colour `Set1` Chroma.js scale.
:::
