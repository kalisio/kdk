# Tours

## Overview

The `utils.tours.js` module exports a single default function that transforms an application route configuration into a flat map of tour step arrays, ready to be consumed by the KDK tour system.

## Functions

### `buildTours(config)`

Recursively traverses a route configuration object and extracts all `tour` definitions into a flat map keyed by tour name.

- **Parameters:**
  - `config` *(Object)*: A route configuration object (typically the routes array/object passed to Vue Router). Each entry may have:
    - `name` or `path`: used as the tour name key.
    - `tour`: an array of steps (single tour) or an object of `{ paramValue: stepsArray }` (parameterised tours).
    - `children`: nested route entries to recurse into.

- **Returns:** `Object` — a flat map of `{ tourName: stepsArray }`. For parameterised tours, the main route tour is keyed as `routeName` and sub-tours as `routeName/paramValue`.

## Usage

```javascript
import buildTours from '@kalisio/kdk/core.client'
import routes from './routes.js'

const tours = buildTours(routes)
// { 'home': [...steps], 'map/layers': [...steps] }
```
