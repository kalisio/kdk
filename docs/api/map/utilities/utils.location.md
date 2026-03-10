# Location utilities

## Overview

This module provides utility functions for parsing, formatting, and filtering geographic coordinates and geocoding results.

## Functions

### `parseCoordinates(str)`

Parses a coordinate string in either decimal-degree (`DD`) or simple decimal comma-separated format.

- **Parameters:**
  - `str` *(string)*: The coordinate string to parse. Supported formats:
    - DD: `48.85°N 2.35°E` or `2.35°E 48.85°N`
    - Simple: `-73.5, 45.5` (longitude, latitude)
- **Returns:** `{ longitude, latitude }` or `undefined` if the string does not match any supported format.

---

### `formatUserCoordinates(lat, lon, format, options)`

Formats a latitude/longitude pair as a human-readable string.

- **Parameters:**
  - `lat` *(number)*: Latitude.
  - `lon` *(number)*: Longitude.
  - `format` *(string)*: A [formatcoords](https://github.com/nerik/formatcoords) format string, or `'aeronautical'` for ICAO aeronautical notation.
  - `options` *(Object)*: Additional options passed to `formatcoords` (ignored in aeronautical mode).
- **Returns:** `string` — The formatted coordinate string.

::: tip
The aeronautical format produces strings like `4851N 00221E`, following ICAO conventions where latitude and longitude are expressed as `DDMMMN/S DDDMMME/W` with tenths of minutes.
:::

---

### `formatForwardGeocodingResult(result)`

Extracts a human-readable address label from a forward geocoding result feature.

The function tries the following sources in order:
1. `properties.formattedAddress`
2. Assembled from `streetNumber`, `streetName`, `city`, `zipcode`
3. The property named in `result.geokoder.matchProp`

- **Parameters:**
  - `result` *(Object)*: A geocoding result GeoJSON feature with a `properties` object.
- **Returns:** `string | undefined` — The label string, or `undefined` if the result is invalid.

---

### `filterGeocoders(geocoders, project)`

Filters a list of geocoder IDs to only include those relevant to the given project's layers.

When a geocoder source starts with `kano:`, the function checks whether the corresponding service is used by one of the project's layers (either as `service` or `probeService`). Non-`kano:` geocoders are always included.

- **Parameters:**
  - `geocoders` *(Array)*: Array of geocoder descriptors (strings or `{ value, label }` objects).
  - `project` *(Object | null)*: The current project object containing a `layers` array, or `null`/`undefined` to skip filtering.
- **Returns:** `Array` — The filtered geocoder array.
