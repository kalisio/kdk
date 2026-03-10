# Project utilities

## Overview

This module provides utility functions for building catalog query objects scoped to a specific project.

## Functions

### `getCatalogProjectQuery(project)`

Builds a MongoDB-compatible query to retrieve only the catalog layers that belong to a given project.

The query covers both ID-identified layers (saved layers with a `_id`) and name-identified layers (in-memory or user-defined layers with only a `name`).

- **Parameters:**
  - `project` *(Object)*: A project object containing a `layers` array of layer descriptors.
- **Returns:** `Object` — A query object of the form `{ $or: [{ _id: { $in: [...] } }, { name: { $in: [...] } }] }`.

#### Example Usage

```javascript
import { getCatalogProjectQuery } from '@kalisio/kdk/map.client'

const query = getCatalogProjectQuery(project)
const layers = await api.getService('catalog').find({ query })
```

---

### `getViewsProjectQuery(project)`

Builds a MongoDB-compatible query to retrieve only the views (contexts) that belong to a given project.

- **Parameters:**
  - `project` *(Object)*: A project object containing a `views` array of view descriptors, each with an `_id`.
- **Returns:** `Object` — A query object of the form `{ _id: { $in: [...] } }`.
