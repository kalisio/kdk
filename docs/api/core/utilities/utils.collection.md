# Collection

## Overview

The `utils.collection.js` module provides utility functions for interacting with collections in a KDK-based application. 

It leverages **Lodash** for object manipulation and **FeathersJS** services to perform database operations efficiently.

## Functions

### `getCollectionService(name, context)`

Retrieves a service instance for a specified collection.

- **Parameters:**
  - `name` *(string)*: The name of the collection service.
  - `context` *(object)*: The context in which the service operates.
- **Returns:** The requested service instance.

### `listItems(service, fields, filter = {}, limit = 50)`

Fetches a list of items from a given service, applying optional filters and field selection.

- **Parameters:**
  - `service` *(object)*: The service instance to query.
  - `fields` *(array)*: The fields to select in the query.
  - `filter` *(Object, optional, default `{}`)* – Additional query filters.
  - `limit` *(number, optional, default=50)*: The maximum number of items to retrieve.
- **Returns:** A promise resolving to the list of retrieved items.

### `getOldestItem(service, field = 'createdAt', filter = {})`

Retrieves the oldest item from a service based on a specified field.

- **Parameters:**
  - `service` *(object)*: The service instance to query.
  - `field` *(string, optional, default='createdAt')*: The field used to determine the oldest item.
  - `filter` *(Object, optional, default `{}`)* – Additional query filters.
- **Returns:** A promise resolving to the oldest item.

### `getOldestTime(service, field = 'createdAt', filter = {})`

Retrieves the timestamp of the oldest item from a service based on a specified field.

- **Parameters:**
  - `service` *(object)*: The service instance to query.
  - `field` *(string, optional, default='createdAt')*: The field used to determine the oldest timestamp.
  - `filter` *(Object, optional, default `{}`)* – Additional query filters.
- **Returns:** A promise resolving to the timestamp of the oldest item.

### `getLatestItem(service, field = 'createdAt', filter = {})`

Retrieves the latest item from a service based on a specified field.

- **Parameters:**
  - `service` *(object)*: The service instance to query.
  - `field` *(string, optional, default='createdAt')*: The field used to determine the latest item.
  - `filter` *(Object, optional, default `{}`)* – Additional query filters.
- **Returns:** A promise resolving to the latest item.

### `getLatestTime(service, field = 'createdAt', filter = {})`

Retrieves the timestamp of the latest item from a service based on a specified field.

- **Parameters:**
  - `service` *(object)*: The service instance to query.
  - `field` *(string, optional, default='createdAt')*: The field used to determine the latest timestamp.
  - `filter` *(Object, optional, default `{}`)* – Additional query filters.
- **Returns:** A promise resolving to the timestamp of the latest item.

### `getDistinctValues(service, field, filter = {})`

Retrieves a list of distinct values for a specified field in a collection.

- **Parameters:**
  - `service` *(object)*: The service instance to query.
  - `field` *(string)*: The field for which distinct values are required.
  - `filter` *(Object, optional, default `{}`)* – Additional query filters.
- **Returns:** A promise resolving to an array of unique values.

## Example usage

```javascript
import { getCollectionService, listItems } from './utils.collection.js'

const service = getCollectionService('myCollection', context)
const items = await listItems(service, ['name', 'age'], { active: true }, 100)
console.log('Active items:', items)
```
### `searchText(service, text, caseSensitive = false, diacriticSensitive = false, filter = {})`

Searches for a given text in a service using a [$text}(https://www.mongodb.com/docs/manual/reference/operator/query/text/) query.

- **Parameters:**
  - `service` *(Object)* – The service to perform the search on.
  - `text` *(String)* – The text to search for.
  - `caseSensitive` *(Boolean, optional, default: `false`)* – Whether the search should be case-sensitive.
  - `diacriticSensitive` *(Boolean, optional, default: `false`)* – Whether the search should be diacritic-sensitive.
  - `filter` *(Object, optional, default `{}`)* – Additional query filters.
- **Returns:** A promise that resolves to the search results.

## Example usage

```javascript
const results = await searchText(myService, 'example')
console.log(results)
```

:::  
`$text` performs a text query on the content of the fields indexed with a [text index](https://www.mongodb.com/docs/manual/core/indexes/index-types/index-text/#std-label-index-type-text). 
:::

### `containsText(service, field, text, caseSensitive = false, diacriticSensitive = false, filter = {})`

Checks if a specific field in the search results contains the exact text.

- **Parameters:**
  - `service` *(Object)* – The service to perform the search on.
  - `field` *(String)* – The field to check in the search results.
  - `text` *(String)* – The text to match against.
  - `caseSensitive` *(Boolean, optional, default: `false`)* – Whether the search should be case-sensitive.
  - `diacriticSensitive` *(Boolean, optional, default: `false`)* – Whether the search should be diacritic-sensitive.
  - `filter` *(Object, optional, default `{}`)* – Additional query filters.
- **Returns:** A promise that resolves to `true` if an exact match is found, otherwise `false`.

