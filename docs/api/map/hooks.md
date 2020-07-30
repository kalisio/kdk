# Hooks

## Query

### asGeoJson(options)

> Return a hook function according to provided options

Transform the hook results into a [GeoJson](https://tools.ietf.org/html/rfc7946) object:
* **force**: set to `true` to perform transformation whatever hook parameters, otherwise this hook will only be run when `hook.params.asGeoJson` is `true` (default)
* **longitudeProperty**: name of the field where to read the longitude on result items
* **latitudeProperty**: name of the field where to read the latitude on result items
* **altitudeProperty**: name of the field where to read the altitude on result items
* **pick**: an array of properties to be picked on result items using [Lodash](https://lodash.com/docs#pick)
* **omit**: an array of properties to be omitted on result items using [Lodash](https://lodash.com/docs#omit)
* **properties**: a map between input key path and output key path supporting dot notation, a value of the map is a structure like this:
  * **from**: input key path
  * **to**: output key path (defaults to input path if not given)
  * **delete**: boolean indicating if the input key path should be deleted or not after mapping
* **asFeatureCollection**: true to output a [GeoJson feature collection](https://tools.ietf.org/html/rfc7946#page-12) (default) otherwise will generate an array of [GeoJson features](https://tools.ietf.org/html/rfc7946#page-11)

### marshallSpatialQuery(hook)

Converts from client/server side spatial types (e.g. coordinates or numbers) to basic JS types, which is usually required when querying the database. Applies to [MongoDB geospatial operators](https://docs.mongodb.com/manual/reference/operator/query-geospatial/). It also manages [shortcuts to create spatial queries](./services.md#./services.md#advanced-feature-filtering) for features in a given area.

Also set `hook.params.asGeoJson` to `true` when `hook.query.geoJson` is `true` (see above).

### aggregateFeaturesQuery(hook)

Constructs query for feature [aggregation over time](./services.md#time-based-feature-aggregation).

> Reads the query object to process from `hook.params.query.$aggregate`

