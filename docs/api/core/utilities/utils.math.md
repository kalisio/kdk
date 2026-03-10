# Math

## Overview

The `utils.math.js` module provides mathematical utility functions useful for animations and value interpolation.

## Functions

### `clamp(value, min, max)`

Constrains a value within a given range.

- **Parameters:**
  - `value` *(number)*: The value to clamp.
  - `min` *(number)*: The lower bound.
  - `max` *(number)*: The upper bound.
- **Returns:** `number` — `value` clamped to `[min, max]`.

### `easeOut(t, linearity?)`

Applies an ease-out curve to a normalised time value `t ∈ [0, 1]`.

- **Parameters:**
  - `t` *(number)*: Normalised time, typically in the range `[0, 1]`.
  - `linearity` *(number, default `0.5`)*: Controls the curve shape. Smaller values produce a more pronounced ease-out effect.
- **Returns:** `number` — the eased value.

### `linear(t, initial?, final?)`

Performs linear interpolation between `initial` and `final`.

- **Parameters:**
  - `t` *(number)*: Normalised time `[0, 1]`.
  - `initial` *(number, default `0`)*: Start value.
  - `final` *(number, default `1`)*: End value.
- **Returns:** `number` — the interpolated value.

### `cubicBezier(t, x1?, y1?, x2?, y2?)`

Evaluates a cubic Bézier curve at normalised time `t`. Defaults to the CSS `ease` curve control points.

- **Parameters:**
  - `t` *(number)*: Normalised time `[0, 1]`.
  - `x1` *(number, default `0.42`)*: First control point x.
  - `y1` *(number, default `0`)*: First control point y.
  - `x2` *(number, default `0.58`)*: Second control point x.
  - `y2` *(number, default `1`)*: Second control point y.
- **Returns:** `number` — the curve value at `t`.
