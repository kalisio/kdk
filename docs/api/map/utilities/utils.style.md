# Style utilities

## Overview

This module provides constants and functions for converting between different map style representations (KDK internal style, Simple Style Spec, Leaflet/Cesium engine styles), and for generating and parsing style template expressions used for conditional feature styling.

## Constants

### Style Mapping Objects

These objects map property names between different style formats. They are used internally by the conversion functions.

| Constant | Description |
|----------|-------------|
| `IconStyleToSimpleStyle` | Maps KDK icon style keys to Simple Style Spec keys. |
| `PointStyleToSimpleStyle` | Maps KDK point style keys to Simple Style Spec keys. |
| `SimpleStyleToPointStyle` | Maps Simple Style Spec keys to KDK point style keys. |
| `PointStyleTemplateMappings` | Maps Simple Style Spec keys to KDK style template paths for point features. |
| `LineStyleToSimpleStyle` | Maps KDK line style keys to Simple Style Spec keys. |
| `SimpleStyleToLineStyle` | Maps Simple Style Spec keys to KDK line style keys. |
| `LineStyleTemplateMappings` | Maps Simple Style Spec keys to KDK style template paths for line features. |
| `PolygonStyleToSimpleStyle` | Maps KDK polygon style keys to Simple Style Spec keys. |
| `SimpleStyleToPolygonStyle` | Maps Simple Style Spec keys to KDK polygon style keys. |
| `PolygonStyleTemplateMappings` | Maps Simple Style Spec keys to KDK style template paths for polygon features. |
| `SimpleStyleNumbers` | List of Simple Style Spec property names that should be parsed as numbers. |
| `DefaultStyle` | The default KDK style object covering `point`, `line`, `polygon`, `leaflet.cluster`, and `cesium.cluster` defaults. |
| `kmlStyleSpecialProperties` | KML-specific property names treated specially during import (`extrude`, `altitudeMode`). |

## Conversion Functions

### `convertStyle(style, mapping, asNumber?)`

Converts a style object by remapping its keys according to a mapping object.

- **Parameters:**
  - `style` *(Object)*: The source style object.
  - `mapping` *(Object)*: A `{ sourceKey: targetPath }` mapping object.
  - `asNumber` *(Array, optional)*: Target key names whose values should be cast to numbers.
- **Returns:** `Object` — A new style object with remapped keys.

---

### `convertSimpleStyleColors(style)`

Converts Quasar palette color names (e.g. `'primary'`) in `stroke`, `fill`, and `marker-color` properties to their HTML color equivalents.

- **Returns:** `Object` — The mutated style object.

---

### `convertPointStyleToSimpleStyle(style)` / `convertSimpleStyleToPointStyle(style)`

Converts between KDK point style and Simple Style Spec.

---

### `convertLineStyleToSimpleStyle(style)` / `convertSimpleStyleToLineStyle(style)`

Converts between KDK line style and Simple Style Spec.

---

### `convertPolygonStyleToSimpleStyle(style)` / `convertSimpleStyleToPolygonStyle(style)`

Converts between KDK polygon style and Simple Style Spec (includes stroke conversion).

## Shape Helper Functions

### `getStyleType(geometryType)`

Returns the KDK style category string for a GeoJSON geometry type.

- **Parameters:**
  - `geometryType` *(string)*: GeoJSON geometry type (e.g. `'Point'`, `'LineString'`, `'Polygon'`).
- **Returns:** `'point'` | `'line'` | `'polygon'` | `undefined`

---

### `getShapeFromPointStyle(style, size?)`

Builds a KShape-compatible descriptor from a point style. Normalises the stroke width if greater than 1.

- **Returns:** `Object`

---

### `getShapeFromLineStyle(style, size?)`

Builds a KShape-compatible descriptor (polyline shape) from a line style.

- **Returns:** `Object`

---

### `getShapeFromPolygonStyle(style, size?)`

Builds a KShape-compatible descriptor (polygon shape) from a polygon style.

- **Returns:** `Object`

## Template Functions

### `getDefaultStyleFromTemplates(options)`

Extracts the default (else-branch) values from a style object that may contain EJS template expressions of the form `<% if (...) { %>value<% } else { %>default<% } %>`.

- **Parameters:**
  - `options` *(Object)*: A style object potentially containing template strings.
- **Returns:** `Object` — A plain style object with only the default values.

---

### `generateStyleTemplates(defaultStyle, styles, dotify?)`

Generates EJS style template expressions for each style property based on a set of conditional filter styles and a default style.

- **Parameters:**
  - `defaultStyle` *(Object)*: The default `{ point, line, polygon }` style applied when no condition matches.
  - `styles` *(Array)*: An array of `{ conditions, values }` objects:
    - `conditions` *(Array)*: Each condition has `{ booleanOperator, property, comparisonOperator, value }`.
    - `values` *(Object)*: The `{ point, line, polygon }` style to apply when the conditions are met.
  - `dotify` *(boolean, default `true`)*: When `true`, output keys use dot notation (e.g. `'style.point.color'`).
- **Returns:** `Object` — An object where each key is a style property path and each value is either an EJS template string or a plain value. A `template` array lists the property paths that require template evaluation.

---

### `filterQueryToConditions(query)`

Parses a MongoDB-style filter query object into an array of condition descriptors for use with `generateStyleTemplates`.

- **Parameters:**
  - `query` *(Object)*: A MongoDB query object (supports `$and`, `$or`, `$eq`, `$ne`, `$gt`, `$gte`, `$lt`, `$lte`, `$in`, `$nin`).
- **Returns:** `Array` — An array of `{ index, booleanOperator, property, comparisonOperator, value }` objects.
