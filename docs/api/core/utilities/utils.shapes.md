# Shapes

## Overview

The `utils.shapes.js` module provides tools for generating HTML/SVG map marker shapes with optional icon, text, and HTML overlays. It is used throughout KDK to render styled point symbols for maps and legends.

## `Shapes`

A catalog of predefined SVG shape definitions. Each entry contains a `viewBox` array, an SVG `content` string, and optional `radiusToSize`, `icon`/`text` translation defaults, and `anchor` properties.

| Name | Description |
|------|-------------|
| `circle` | A filled circle. |
| `rect` | A square rectangle. |
| `rounded-rect` | A rectangle with rounded corners. |
| `diamond` | A rotated square. |
| `triangle` | An upward-pointing triangle. |
| `triangle-down` | A downward-pointing triangle. |
| `triangle-left` | A left-pointing triangle. |
| `triangle-right` | A right-pointing triangle. |
| `star` | A five-pointed star. |
| `marker-pin` | A map pin (teardrop) shape. Anchor: `bottom-center`. |
| `square-pin` | A rounded speech-bubble pin. Anchor: `bottom-center`. |

## Functions

### `createShape(options)`

Generates an HTML string representing a styled SVG shape with optional overlays, suitable for use as a Leaflet `DivIcon` or any inline HTML context.

- **Parameters:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `shape` | `string \| Object` | — | Predefined shape name (from `Shapes`) or a custom shape object with `viewBox`, `content`, and optional `translation`, `rotation`. |
| `size` | `Array` | — | `[width, height]` in pixels. Overrides `radius`. |
| `radius` | `number` | — | Used to compute size via the shape's `radiusToSize` function (default: `radius * 2`). Ignored if `size` is set. |
| `color` | `string` | `none` | Fill color. Accepts Quasar palette names, HTML color names, or CSS color values. |
| `opacity` | `number` | — | Fill opacity (0–1). |
| `stroke` | `Object` | — | Stroke style: `{ color, width, opacity, cap, join, dashArray, dashOffset }`. |
| `icon` | `Object` | — | Icon overlay: `{ classes, url, symbol, color, opacity, size, translation, rotation }`. Provide `classes` for font icons, `url` for image icons, or `symbol` for SVG `<use>` references. |
| `text` | `Object` | — | Text overlay: `{ label, classes, color, size, translation, rotation }`. |
| `html` | `string` | — | Arbitrary HTML overlay centered within the shape. |
| `extraStyle` | `string` | `''` | Additional CSS style string applied to the container div. |
| `id` | `string` | — | Optional `id` attribute for the container div. |

- **Returns:** `Object` with:
  - `html` *(string)*: The complete HTML string.
  - `size` *(Object)*: `{ width, height }` in pixels.
  - `anchor` *(string)*: The anchor point descriptor (e.g. `'middle-center'`, `'bottom-center'`).

## Usage

```javascript
import { createShape } from '@kalisio/kdk/core.client'

const { html, size, anchor } = createShape({
  shape: 'marker-pin',
  radius: 16,
  color: 'red',
  icon: { classes: 'las la-fire', color: 'white', size: 12 }
})
```
