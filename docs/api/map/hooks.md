# Hooks

## Query

### marshallSpatialQuery(hook)

Converts from client/server side spatial types (e.g. coordinates or numbers) to basic JS types, which is usually required when querying the database. Applies to [MongoDB geospatial operators](https://docs.mongodb.com/manual/reference/operator/query-geospatial/). It also provides a shortcut to create queries for features around a given location:
* **centerLon**: longitude of the location
* **centerLat**: latitude of the location
* **distance**: maximum distance to gather features in

> Reads the query object to process from `hook.params.query`

### aggregateFeaturesQuery(hook)

Constructs query for feature [aggregation over time](./services.md#time-based-feature-aggregation).

> Reads the query object to process from `hook.params.query.$aggregate`

