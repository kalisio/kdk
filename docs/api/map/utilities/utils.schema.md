# Schema utilities

## Overview

This module provides utilities for generating JSON schemas from GeoJSON feature data.

## Functions

### `generatePropertiesSchema(geoJson, name)`

Generates a JSON Schema (draft-07) from the properties of GeoJSON features. The schema includes a field definition for each discovered property, with type inferred from the first non-null value.

- **Parameters:**
  - `geoJson` *(Object)*: A GeoJSON Feature or FeatureCollection to inspect.
  - `name` *(string)*: The schema title and the base for the schema `$id` URI.
- **Returns:** `Object` — A JSON Schema object with:
  - `$id`: `http://www.kalisio.xyz/schemas/<kebab-case-name>#`
  - `title`: `name`
  - `$schema`: `http://json-schema.org/draft-07/schema#`
  - `type`: `'object'`
  - `properties`: one entry per discovered property, each with `type`, `nullable: true`, and a `field` definition pointing to a KDK form component (`KNumberField`, `KToggleField`, or `KTextField`).

::: tip
Nested properties are flattened using dot notation. `null`/`undefined` values default to `string` type.
:::

#### Example Usage

```javascript
import { generatePropertiesSchema } from '@kalisio/kdk/map.client'

const geoJson = {
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', geometry: null, properties: { name: 'Lyon', population: 500000 } }
  ]
}
const schema = generatePropertiesSchema(geoJson, 'cities')
// schema.properties.name => { type: 'string', nullable: true, field: { component: 'form/KTextField', label: 'name' } }
// schema.properties.population => { type: 'number', nullable: true, field: { component: 'form/KNumberField', label: 'population' } }
```
