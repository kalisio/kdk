# Collection Filter

## Overview

This module exports two composables that work together to provide tag-based and time-based filtering for collections, driven by state stored in the [current activity context](./composables.activity.md).

- **`useCollectionFilter()`** — exposes the raw filter state and setter functions.
- **`useCollectionFilterQuery(options)`** — builds a reactive `filterQuery` object ready to be passed to `useCollection`.

## `useCollectionFilter()`

### Overview

Reads and writes the `tagsFilter` and `timeFilter` objects from the current activity's state store. No arguments required.

### Usage

```javascript
import { useCollectionFilter } from '@kalisio/kdk/core.client'

const { tagsFilterSelection, setTagsFilterSelection, hasTimeFilterSelection } = useCollectionFilter()
```

### Exposed

| Name | Type | Description |
|------|------|-------------|
| `tagsFilter` | `ComputedRef<Object>` | The full tags filter object from activity state. |
| `timeFilter` | `ComputedRef<Object>` | The full time filter object from activity state. |
| `tagsFilterOptions` | `ComputedRef<Array>` | Available tag options (`tagsFilter.options`). |
| `tagsFilterSelection` | `ComputedRef<Array>` | Currently selected tags (`tagsFilter.selection`). |
| `timeFilterRange` | `ComputedRef<Object>` | Available time range bounds (`timeFilter.range`). |
| `timeFilterSelection` | `ComputedRef<Object>` | Currently selected time range (`timeFilter.selection`: `{ start, end }`). |
| `hasTagsFilterOptions` | `ComputedRef<boolean>` | `true` when tag options are available. |
| `hasTagsFilterSelection` | `ComputedRef<boolean>` | `true` when at least one tag is selected. |
| `hasTimeFilterRange` | `ComputedRef<boolean>` | `true` when a valid, non-zero time range is available. |
| `hasTimeFilterSelection` | `ComputedRef<boolean>` | `true` when a valid time range selection (`start` and `end`) is set. |
| `setTagsFilterOptions(options)` | `Function` | Sets the available tag filter options. |
| `setTagsFilterSelection(selection)` | `Function` | Sets the selected tags. |
| `setTimeFilterRange(range)` | `Function` | Sets the available time filter range bounds. |
| `setTimeFilterSelection(selection)` | `Function` | Sets the selected time range (`{ start, end }`). |
| `clearTagsFilterSelection()` | `Function` | Clears the selected tags. |
| `clearTimeFilterSelection()` | `Function` | Clears the selected time range. |

---

## `useCollectionFilterQuery(options)`

### Overview

Builds a reactive `filterQuery` derived from the current tag and time filter selections. Also fetches the available filter options (time range bounds and tag options) on mount and keeps them updated via service events.

### Usage

```javascript
import { ref } from 'vue'
import { useCollectionFilterQuery } from '@kalisio/kdk/core.client'

const { filterQuery } = useCollectionFilterQuery({
  service: ref('events'),
  timeField: ref('createdAt'),
  tagFields: { status: { active: { label: 'Active' }, closed: { label: 'Closed' } } }
})
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `service` | `Ref<string>` | — | The FeathersJS service name. |
| `context` | `Ref<string>` | — | Optional context ID. |
| `baseQuery` | `Ref<Object>` | `{}` | Base query for fetching time range bounds. |
| `timeField` | `Ref<string>` | `ref('createdAt')` | The document field used for time filtering. |
| `tagFields` | `Object` | — | A map of `{ property: { tagKey: tagState } }` defining available tag filter options. |

### Exposed

| Name | Type | Description |
|------|------|-------------|
| `filterQuery` | `Ref<Object>` | The computed FeathersJS query fragment combining active tag and time filters. Pass this to `useCollection` as `filterQuery`. |
| `tagsFilterSelection` | `ComputedRef<Array>` | Currently selected tags (from `useCollectionFilter`). |
| `timeFilterSelection` | `ComputedRef<Object>` | Currently selected time range (from `useCollectionFilter`). |
| `hasTagsFilterSelection` | `ComputedRef<boolean>` | Whether any tags are selected. |
| `hasTimeFilterSelection` | `ComputedRef<boolean>` | Whether a time range is selected. |

### Lifecycle

- **`mounted`**: fetches time range bounds and tag options, then registers service event listeners to keep them current.
- **`beforeUnmount`**: removes service event listeners.
