# Utilities

Here are a set of utility functions:
* **generatePropertiesSchema (geoJson, name)** generate a JSON schema from the given GeoJson features
* **fetchGeoJson (dataSource, processor)** fetch GeoJson features from the given source and apply processor function (if any) on each feature
* **getNearestTime (time, times)** find the nearest time of a given one in a given moment time list
* **getTimeInterval (times, mode = 'minimum')** find the minimum or maximum time interval in a given moment time list

### Store objects

The `locationFormat` property of the [global store](../core/application.md#store) is used to have a shared location display format accross all mapping components with a dedicated UI to change settings using e.g. `store.patch('locationFormat', 'FFf')`.

::: tip
The location format object to be used for display supports [formatcoords](https://github.com/nerik/formatcoords).
:::

The `timeFormat` property of the [global store](../core/application.md#store) is used to have a shared time display format accross all mapping components with a dedicated UI to change settings using e.g. 
```js
store.patch('timeFormat', {
  time: {
    short: 'H[h]',
    long: 'HH:mm'
  },
  date: {
    short: 'DD/MM',
    long: 'dddd D'
  },
  year: {
    short: 'YY',
    long: 'YYYY'
  },
  utc: false,
  locale: utils.getLocale()
})
```

::: tip
The time format object properties to be used for display supports [momentjs formats](https://momentjs.com/docs/#/displaying/format/).
:::

In addition, the [global store](../core/application.md#store) contains the following defaults objects:
```js
selection: {
  location: current picked position on map,
  feature: currently selected feature on map,
  layer: source layer of currently selected feature
}
// Default view settings
restore: {
  view: true,
  layers: false
}
// Default timeline parameters
timeline: {
  step: 60 // 1H
}
// Default timeseries parameters
timeseries: {
  span: 1440 // 24H
}
```

### Geolocation

Your component can automatically retrieve the user's location on initialization or when he has logged in (the [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API) is used under-the-hood). The position, respectively error, is available in the `position`, respectively `error`, property of the `geolocation` object in the [global store](../core/application.md#store).

```js
import { Geolocation } from '@kalisio/kdk/map.client'
// Launch a geolocation
await Geolocation.update()
const position = this.$store.get('geolocation.position')
```

### [utils.features](./utilities/utils.features.md)
