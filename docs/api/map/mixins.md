# Mixins

## Navigator

::: warning
Only available on mobile devices
:::

Allow to launch native route navigation apps to go to a given location (the [launch navigator cordova plugin](https://github.com/dpa99c/phonegap-launch-navigator) is used under-the-hood):
* **canNavigate()** check if navigation is possible (mobile device and navigation app installed)
* **navigate(longitude, latitude)** launches native route navigation app for the given location

## Style

Used to add styling to layers on your 2D and 3D activities:
* **register/unregisterStyle (type, generator)** (un)registers the function to create the style object as per the input type (e.g. `markerStyle`, `featureStyle`, `popup`, `infobox` or `tooltip`)

The generator signature and return type depends on the mapping engine, please refer to specific map or globe mixins for more details.

## Infobox

Used to add the default [Infobox](../map/components.md#infobox) style to your 2D and 3D activities.

## Feature Selection

Used to support feature selection on your 2D and 3D activities.

## Feature Service

Ease requests to a [feature service](./services.md#feature-service) in order to get real-time updates and edit features:
* **getProbeFeatures(options)** retrieve the probe locations (if any) for a given [catalog layer descriptor](./services.md#catalog-service) to initialize the feature layer
* **getProbeFeaturesFromLayer(name)** same as above but using the layer name
* **getFeatures(options, queryInterval)** get the latest available features for a given [catalog layer descriptor](./services.md#catalog-service) at current time or in a given elapsed time range if a query interval in milliseconds is given
* **getFeaturesFromLayer(name, queryInterval)** same as above but using the layer name
* **getMeasureForFeature(options, feature, startTime, endTime)** get the available probe measures for a given [catalog layer descriptor](./services.md#catalog-service) in the given time range, will store result in `probedLocation` attribute and emits the `probed-location-changed` event
* **getProbedLocationMeasureAtCurrentTime()** computes measure values at current time (see [time mixin](./mixins.md#time)) once a location has been probed
* **createFeatures(geoJson, layerId)** creates a new set of features in feature service associated to the target layer based on input GeoJson
* **editFeaturesGeometry(geoJson)** edits the geometry of a set of features in feature service based on input GeoJson
* **editFeaturesProperties(geoJson)** edits the properties of a set of features in feature service based on input GeoJson
* **removeFeatures(geoJsonOrLayerId)** removes a set of features in feature service based on input GeoJson or all features associated to the target layer if any

::: tip
Please refer to [feature service API](./services.md#time-based-feature-aggregation) for more details on measure aggregation.
:::

## Weacast

Make it easier to integrate with [Weacast](https://weacast.github.io/weacast-docs/):
* **setupWeacast(config)** initializes a [Weacast client](https://weacast.github.io/weacast-docs/api/application.html#client-setup) in the `weacastApi` property
* **setupForecastModels()** retrieve available [forecast models](https://weacast.github.io/weacast-docs/architecture/main-concepts.html#forecast-model) from [Weacast API](https://weacast.github.io/weacast-docs/api/forecast.html)
* **setForecastModel(model)** updates the current [forecast model](https://weacast.github.io/weacast-docs/architecture/main-concepts.html#forecast-model) and emits the `forecast-model-changed` event
* **setForecastLevel(level)** updates the current forecast level and emits the `forecast-level-changed` event
* **getForecastForLocation(long, lat, startTime, endTime)** helper function to dynamically probe weather elements at a given location in a given time range using the [Weacast API](https://weacast.github.io/weacast-docs/api/probe.html#probes-api)
* **getForecastForFeature(featureId, startTime, endTime)** helper function to get weather element at static probe location in a given time range using the [Weacast API](https://weacast.github.io/weacast-docs/api/probe.html#probe-results-api)
* **getProbedLocationForecastAtCurrentTime()** computes element values at current time (see [time mixin](./mixins.md#time)) once a location has been probed (dynamically or statically)
* **getProbedLocationForecastMarker(feature, latlng)** generates a marker using a [wind barb](http://weather.rap.ucar.edu/info/about_windbarb.html) according to element values in feature

This mixin also adds the following internal data properties:
* **forecastModel**: currently selected forecast model
* **forecastModels**: list of available forecast models
* **forecastLevel**: currently selected forecast level

The currently selected forecast level or the list of available forecast levels is managed through the [levels mixin](./mixins.md#levels).

Here is an example of a forecast levels description object:
```js
{
  name: 'pressure',
  label: 'Pression',
  units: [
    'mb'
  ],
  values: [ 1000, 700, 450, 300, 200 ]
}
```

Note that in Weacast all meteorological elements are assumed to be atomic, i.e. each element is a 2D longitude/latitude grid of scalar values, there is no forecast level. As a consequence each forecast level will be associated to a different element in the Weacast configuration. This means that the forecast level is a pure construction of the KDK based on the following convention: if a forecast layer descriptor for an element named `gust` contains a list of forecast levels like `[ 1000, 700, 450, 300, 200 ]` then it is assumed that Weacast will provide the atomic elements named `gust-1000`, `gust-700`, `gust-450`, `gust-300`, `gust-200`. The right one will be retrieved according to currently selected forecast level using the pattern `element_name-forecast_level`.

::: tip
The mixin will automatically update forecast time whenever the current time is changed in the activity
:::

::: warning
If no config options are provided when initializing Weacast it is assumed that it runs as a backend service acccessible through [feathers-distributed](https://github.com/kalisio/feathers-distributed)
:::

## Time

Ease management of time-based component:
* **setCurrentTime(datetime)** change the current time to the given one and ensure it is internally stored as a UTC [moment](https://momentjs.com/) object to avoid any confusion, emits the `current-time-changed` event
* **setTimeFormat(format)** change the formats used to display date/time, each format is based on [moment](https://momentjs.com/docs/#/displaying/format/) display options and the object is structured like this
  * **time**
    * **short**: display format for time in "short" form
    * **long**: display format for time in "long" form
  * **date**
    * **short**: display format for date in "short" form
    * **long**: display format for date in "long" form
  * **year**
    * **short**: display format for year in "short" form
    * **long**: display format for year in "long" form
  * **utc**: boolean indicating if date/time should be displayed in UTC or according to user's locale
  * **locale**: the user's locale to be used when not displaying date/time in UTC
* **formatTime(format, datetime)**: get the formatted date/time for display according to current format settings, if no date/time given the current one set in component will be used. The format is the path to the actual format in the format object, e.g. `formatTime('time.short')` to get a formatted time in short form. The `iso` path is reserved for [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) display.

Here is an example of a format object:
```js
{
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
  utc: true,
  locale: 'en'
}
```

::: tip
The mixin is in sync with the `timeFormat` property of the [global store](../core/application.md#store) so that you can have a shared data/time display format accross all time-based components with a dedicated UI to change settings using e.g. `store.patch('timeFormat', { locale, utc })`.
:::

This mixin also adds the following internal data properties:
* **currentTime**: current time as UTC [moment](https://momentjs.com/) object
* **currentTimeFormat**: current format object to be used for display
* **currentFormattedTime**: same structure as the format object but contains ready-to-display values of the current time, e.g. `currentFormattedTime.time.short` will give you the formatted time string in short form according to current format settings.

## Activity

Make it easier to create 2D/3D mapping activities by providing methods available in both cases:
* **initialize()** setup view, Weacast, layers and timeline, **should be called first before any other method**
* **registerActivityActions()** register default activity actions (fullscreen mode, geolocation, geocoding, tracking, probing, etc.)
* **getCatalogLayers()** retrieve available [catalog layer descriptors](./services.md#catalog-service)
* **refreshLayers()** setup available layers based on [catalog layer descriptors](./services.md#catalog-service)
* **registerLayerActions(layer)** register default layer actions (zoom, save, edit, edit data, remove, etc.)
* **isLayerStorable/Removable/Editable(layer)** helper function to get the state of a given layer descriptor
* **onLayerAdded(layer)** layer action handler that will setup available action on layer
* **onTriggerLayer(layer)** trigger action handler that will hide/show a given layer
* **onZoomToLayer(layer)** zoom action handler that will zoom to a given layer
* **onCreateLayer()** create layer action handler that will open an [editor](../core/components.md#editors) to define layer properties
* **onSaveLayer(layer)** save action handler that will persist a given in-memory layer to persistent storage provided by a [feature service](./services.md#feature-service)
* **onEditLayer(layer)** edit action handler that will open an [editor](../core/components.md#editors) to change layer properties
* **onEditLayerData(layer)** edit data action handler that will (de)activate [feature edition mode](https://leaflet.github.io/Leaflet.draw/docs/leaflet-draw-latest.html) to update layer features geometry and properties
* **onRemoveLayer(layer)** remove action handler that will ask for confirmation before removing a persisted layer
* **onGeocoding()** geocoding action handler that will open a dialog to search for a location to go to
* **onGeolocate()** geolocation action handler that will launch a user's position lookup and go to found user's location
* **onTrackLocation()** location tracking action handler that will enable/disable a location indicator to display location values

::: tip
This mixin has to be initialized by providing a unique component/activity name like `mixins.activity('map')`. Indeed, the name is then used to retrieve the configuration associated with the activity from the global frontend [configuration](../../guides/basics/step-by-step.md#configuring-a-kapp) according to the following properties:
* **{name}**: 2D/3D view configuration
* **[name}Panel**: 2D/3D layers panel configuration
* **[name}Activity**: 2D/3D activity configuration
See e.g. [Kano configuration options](../kano/configuration.md) for more details.
:::

This mixin also adds the following internal data properties:
variables
* **variables** the set of available variables in catalog layers
* **probedLocation** the currently probed location feature (weather or measurement)

## Context

Used to be able to restore the user's context, i.e. view extent and active layers, in 2D/3D mapping activities by providing methods available in both cases:
* **storeContext(context)** stores current context as route (query) parameters and persists as well in local storage 
* **restoreContext(context)** restores previously stored context from local storage, catalog (if a default one has been saved) or route (query) parameters
* **clearContext(context)** clears the stored context so that it will not be restored anymore
* **getRouteContext(context)** gets the context parameters from current route (from either parameters or query)
* **updateRouteContext(context)** sets the context parameters on the current route (from either parameters or query)
* **saveContext (context)** saves the context in the catalog
* **loadContext (context)** sets the context from either the given parameters or the catalog (if context is an ID or a name)

At the present time two types of context are supported, although the system is flexible enough to easily add a new type:
* `view` to restore current view bounds stored as route parameters
* `layers` to restore currently active layers in catalog stored as route query parameters

::: tip
The mixin is in sync with the `restore.context` (context being either `view` or `layers`) property of the [global store](../core/application.md#store) so that you can have a shared restoration flag accross all mapping components with a dedicated UI to change settings using e.g. `store.patch('restore.view', true)`. This can be overriden by a similar property on the activity configuration if you'd like to disable context restoration on a particular activity.
:::

## Levels

Allow to configure the [**k-level-slider**
component](./components.md#level-slider). The slider is associated with a
layer and is only shown when properly configured. When the selected value
changes, the `selected-level-changed` event is broadcasted.

::: warning
The level slider is global, meaning that there's only one instance of the
slider, and it is shared by every layer.
:::

To configure the slider, we use an object with the following properties:
* **label**: defines the slider label which will be displayed by the
  k-level-slider component.
* **units**: an array defining the unit of the value we're manipulating.
  Currently we only care about `units[0]`.
* **values**: an array defining the discrete values the level can take.
* **range**: an object defining a continuous range of values:
  * **min**: the minimum value
  * **max**: the maximum value
  * **interval**: the interval to use between `min` and `max`, 1 by default if not
   specified
* **lazy**: a boolean indicating if `setSelectedLevel` is called as the slider
  moves (when `false`) or if it is only called when the slider is released (when
  `true`).

Here is an example of a configuration object:
```js
{
  label: 'Temperature',
  units: ['degC'],
  lazy: false,
  range: {
    min: -10,
    max: 10,
    interval: 2
  }
  /* or only some specific values
  values: [ -10, -8, 0, 4, 9 ]
  */
}
```
The mixin adds the following functions:
* **setSelectableLevels(layer, levels, initialLevel)** : defines the layer the
  slider is currently associated to, configures the selectable levels and sets the initial level.
* **clearSelectableLevels(layer)** : clears the slider definition associated
  with the layer. This function will only clear the slider configuration if the
  current layer associated with the slider is the same as the `layer` argument.
* **setSelectedLevel(level)** : selects a level value and broadcasts the
  `selected-level-changed` event. This is the function that is called when the
  slider moves.

This mixin also adds the following internal data properties:
* **selectedLevel**: the currently selected level value.
* **selectableLevels**: the current slider configuration object.
