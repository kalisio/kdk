# Collection Service Utilities

This module provides utility functions for interacting with FeathersJS services, facilitating operations such as retrieving services, listing items, and fetching the oldest or latest records.

## Functions

### `getCollectionService(name, context)`

Retrieves a service from the API within the specified context.

#### Parameters:

- `name` *(string)*: The name of the service to retrieve.
- `context` *(string, optional)*: The context in which to retrieve the service.

#### Returns:

- *(Object)*: The requested service instance.

---

### `listItems(service, fields, filter = {}, limit = 50)`

Retrieves a list of items from a specified service.

#### Parameters:

- `service` *(Object)*: The FeathersJS service instance.
- `fields` *(Array)*: The fields to select from the service.
- `filter` *(Object, optional)*: Query filters (default: `{}`).
- `limit` *(number, optional)*: The maximum number of items to retrieve (default: `50`).

#### Returns:

- *(Promise**)*: A promise resolving to the list of retrieved items.

---

### `getOldestItem(service, field = 'createdAt', filter = {})`

Fetches the oldest item in a service based on a specified field.

#### Parameters:

- `service` *(Object)*: The FeathersJS service instance.
- `field` *(string, optional)*: The field to sort by (default: `'createdAt'`).
- `filter` *(Object, optional)*: Query filters (default: `{}`).

#### Returns:

- *(Promise**)*: A promise resolving to the oldest item.

---

### `getOldestTime(service, field = 'createdAt', filter = {})`

Retrieves the timestamp of the oldest item based on a specified field.

#### Parameters:

- `service` *(Object)*: The FeathersJS service instance.
- `field` *(string, optional)*: The field to retrieve the timestamp from (default: `'createdAt'`).
- `filter` *(Object, optional)*: Query filters (default: `{}`).

#### Returns:

- *(Promise\<string | number | undefined>)*: A promise resolving to the timestamp of the oldest item.

---

### `getLatestItem(service, field = 'createdAt', filter = {})`

Fetches the latest item in a service based on a specified field.

#### Parameters:

- `service` *(Object)*: The FeathersJS service instance.
- `field` *(string, optional)*: The field to sort by (default: `'createdAt'`).
- `filter` *(Object, optional)*: Query filters (default: `{}`).

#### Returns:

- *(Promise**)*: A promise resolving to the latest item.

---

### `getLatestTime(service, field = 'createdAt', filter = {})`

Retrieves the timestamp of the latest item based on a specified field.

#### Parameters:

- `service` *(Object)*: The FeathersJS service instance.
- `field` *(string, optional)*: The field to retrieve the timestamp from (default: `'createdAt'`).
- `filter` *(Object, optional)*: Query filters (default: `{}`).

#### Returns:

- *(Promise\<string | number | undefined>)*: A promise resolving to the timestamp of the latest item.

---

### `enumerateField(service, field, filter = {})`

Retrieves all distinct values of a specified field within a service.

#### Parameters:

- `service` *(Object)*: The FeathersJS service instance.
- `field` *(string)*: The field to retrieve distinct values from.
- `filter` *(Object, optional)*: Query filters (default: `{}`).

#### Returns:

- *(Promise**)*: A promise resolving to an array of distinct field values.

