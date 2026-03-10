# Weacast utilities

## Overview

This module provides functions for querying weather forecast data from the Weacast API, including dynamic probing at a geographic location and static probing at a pre-defined feature.

## Functions

### `getForecastForLocation({ longitude, latitude, startTime, endTime, forecastModel, forecastLevel, weacastApi })`

Probes weather forecast data at a specific geographic point for the given time range.

- **Parameters:**
  - `longitude` *(number)*: Longitude of the probe point.
  - `latitude` *(number)*: Latitude of the probe point.
  - `startTime` *(Moment)*: Start of the forecast time range.
  - `endTime` *(Moment)*: End of the forecast time range.
  - `forecastModel` *(Object)*: The active forecast model definition (must have `name` and `elements`).
  - `forecastLevel` *(number | null)*: Optional vertical level to filter elements by.
  - `weacastApi` *(Object)*: The Weacast API client instance.
- **Returns:** `Promise<Object | undefined>` — A GeoJSON feature with aggregated forecast properties, or `undefined` on error or when `forecastModel` is not set.

---

### `getForecastProbe({ name, forecastModel, weacastApi })`

Retrieves a named static Weacast probe definition.

- **Parameters:**
  - `name` *(string)*: The name of the probe to retrieve.
  - `forecastModel` *(Object)*: The active forecast model definition.
  - `weacastApi` *(Object)*: The Weacast API client instance.
- **Returns:** `Promise<Object | null>` — The probe object (with `elements`, `forecast`, `featureId`), or `null` if not found.

---

### `getForecastForFeature({ probe, featureId, startTime, endTime, forecastModel, forecastLevel, weacastApi })`

Retrieves aggregated forecast data for a specific feature of a static Weacast probe.

- **Parameters:**
  - `probe` *(Object)*: The probe definition as returned by `getForecastProbe`.
  - `featureId` *(string)*: The identifier value of the target feature.
  - `startTime` *(Moment)*: Start of the forecast time range.
  - `endTime` *(Moment)*: End of the forecast time range.
  - `forecastModel` *(Object)*: The active forecast model definition.
  - `forecastLevel` *(number | null)*: Optional vertical level to filter elements by.
  - `weacastApi` *(Object)*: The Weacast API client instance.
- **Returns:** `Promise<Object | undefined>` — A probe result object with aggregated forecast data (including derived wind direction/speed), or `undefined` on error.

::: tip
Derived wind direction and speed fields are always appended to the element list when querying probe results, regardless of the model element list.
:::
