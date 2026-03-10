# Catalog

## Overview

`useCatalog(options)` provides reactive access to catalog data (layers, categories, sublegends, and views) from the KDK catalog FeathersJS service. It exposes async fetch functions and computed properties that organize layers by category and identify orphan layers.

## Usage

```javascript
import { useCatalog } from '@kalisio/kdk/map.client'

const {
  layers, categories, sublegends, views,
  layersByCategory, orphanLayers,
  getLayers, getCategories, getSublegends, getViews
} = useCatalog({
  layers: { scope: 'user' },
  context: 'myOrg'
})

// Fetch data
await getLayers()
await getCategories()
```

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `options.layers` | `Object` | `{}` | Default filter query applied when retrieving layers from the catalog. |
| `options.categories` | `Object` | `{}` | Default filter query applied when retrieving categories. |
| `options.sublegends` | `Object` | `{}` | Default filter query applied when retrieving sublegends. |
| `options.views` | `Object` | `{}` | Default filter query applied when retrieving views (contexts). |
| `options.context` | `string` | `''` | Context ID for the catalog service (used for contextual/multi-tenant services). |
| `options.project` | `Object` | — | Optional project object. When provided, catalog queries are automatically scoped to that project's layers and views. |
| `options.planetApi` | `Object` | `api` | The [client API](../core/application.md#client-setup) instance used to reach the catalog service. |

## Exposed

| Name | Type | Description |
|------|------|-------------|
| `layers` | `Ref<Array>` | The retrieved set of layers from the catalog. |
| `categories` | `Ref<Array>` | The retrieved set of categories from the catalog. |
| `sublegends` | `Ref<Array>` | The retrieved set of sublegends from the catalog. |
| `views` | `Ref<Array>` | The retrieved set of views (contexts) from the catalog. |
| `layersByCategory` | `ComputedRef<Object>` | Layers organized by category name; keys are category names and values are arrays of matching layers. |
| `orphanLayers` | `ComputedRef<Array>` | Layers that do not belong to any category, sorted by `_id`. |
| `getLayers(filterQuery?)` | `async Function` | Fetches layers from the catalog, merging the optional `filterQuery` with `options.layers`. Updates `layers`. |
| `getCategories()` | `async Function` | Fetches categories from the catalog using `options.categories`. Updates `categories`. |
| `getSublegends()` | `async Function` | Fetches sublegends from the catalog using `options.sublegends`. Updates `sublegends`. |
| `getViews()` | `async Function` | Fetches views from the catalog using `options.views`. Updates `views`. |
