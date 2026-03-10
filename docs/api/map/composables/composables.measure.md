# Measure

## Overview

`useMeasure()` provides helper functions to extract the relevant measurement value at the current application time from time-series data attached to probed features. It relies on the global `Time` service to determine the current time and uses nearest-time interpolation.

## Usage

```javascript
import { useMeasure } from '@kalisio/kdk/map.client'

const { getMeasureValueAtCurrentTime, getProbedLocationMeasureAtCurrentTime } = useMeasure()

// Get a single value at current time
const value = getMeasureValueAtCurrentTime(times, values)

// Get a cloned feature with all time-series resolved to current time values
const resolvedFeature = getProbedLocationMeasureAtCurrentTime(probedLocation)
```

## Exposed

| Name | Type | Description |
|------|------|-------------|
| `getMeasureValueAtCurrentTime(times, values)` | `Function` | Finds the value in `values` whose corresponding entry in `times` is nearest to the current application time. Returns `null` if no valid time index is found. If `times` or `values` is not an array (constant value), returns `values` directly. |
| `getProbedLocationMeasureAtCurrentTime(probedLocation)` | `Function` | Clones a probed GeoJSON feature and resolves all array-valued properties (time series) to their value at the current application time. Also updates the `time` map on the feature to reflect the resolved time. Returns the modified clone. |
