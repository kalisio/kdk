# Tags

## Overview

The `utils.tags.js` module provides helpers for working with the KDK `tags` service.

## Functions

### `async getTagsFilterOptions(service)`

Fetches all tags associated with a given service name and formats them as filter options by adding a `label` property equal to each tag's `name`.

- **Parameters:**
  - `service` *(string)*: The service name to filter tags by.
- **Returns:** `Promise<Array>` — an array of tag objects with a `label` property added, or an empty array if the `tags` service is not registered.

```javascript
import { getTagsFilterOptions } from '@kalisio/kdk/core.client'

const options = await getTagsFilterOptions('events')
// [{ name: 'urgent', label: 'urgent', ... }, ...]
```
