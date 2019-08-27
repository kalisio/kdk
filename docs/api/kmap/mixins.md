# Mixins

## Geolocation

Make your component automatically retrieve the user's location on initialization or when he has logged in (the [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API) is used under-the-hood):
* **updatePosition()** launches a geolocation

> Will make the position available in the `user.position` property of the currently authenticated user in the [global store](../kcore/application.md#store).

::: tip
Will raise an error toast on geolocation error
:::

## Navigator

::: warning
Only available on mobile devices
:::

Allow to launch native route navigation apps to go to a given location (the [launch navigator cordova plugin](https://github.com/dpa99c/phonegap-launch-navigator) is used under-the-hood):
* **canNavigate()** check if navigation is possible (mobile device and navigation app installed)
* **navigate(longitude, latitude)** launches native route navigation app for the given location

## Feature Service

Ease requests to a [feature service](./services.md#feature-service) in order to get real-time updates and edit features:
* **getProbeFeatures(options)** retrieve the probe locations (if any) for a given [catalog layer descriptor](./services.md#catalog) to initialize the feature layer
* **getProbeFeaturesFromLayer(name)** same as above but using the layer name
* **getFeatures(options, queryInterval)** get the latest available features for a given [catalog layer descriptor](./services.md#catalog) at current time or in a given elapsed time range if a query interval in milliseconds is given
* **getFeaturesFromLayer(name, queryInterval)** same as above but using the layer name
* **getMeasureForFeature(options, feature, startTime, endTime)** get the available probe measures for a given [catalog layer descriptor](./services.md#catalog) in the given time range, will store result in `probedLocation` attribute and emits the `probed-location-changed` event
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
* **forecastModel** currently selected forecast model
* **forecastModels** list of available forecast models
* **forecastLevel** currently selected forecast level
* **forecastLevels** list of available forecast levels

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
The mixin is in sync with the `timeFormat` property of the [global store](../kcore/application.md#store) so that you can have a shared data/time display format accross all time-based components with a dedicated UI to change settings using e.g. `store.patch('timeFormat', { locale, utc })`.
:::

This mixin also adds the following internal data properties:
* **currentTime**: current time as UTC [moment](https://momentjs.com/) object
* **currentTimeFormat**: current format object to be used for display
* **currentFormattedTime**: same structure as the format object but contains ready-to-display values of the current time, e.g. `currentFormattedTime.time.short` will give you the formatted time string in short form according to current format settings.

## Timeline

Ease integration of a timeline component in mapping activities:
* **setupTimeline()** setups the timeline according to currently selected forecast model time range if any (see [Weacast mixin](./mixins.md#weacast)) or based on the following global frontend [configuration](../../guides/basics/step-by-step.md#configuring-a-kapp) properties:
 * **start**: offset in seconds from now the timeline should begin
 * **end**: offset in seconds from now the timeline should end
* **getTimelineInterval()** default timeline interval function
* **getTimelineFormatter()** default timeline formatting function

## Timeseries

Ease integration of a graph component displaying weather or measurements as timeseries in mapping activities:
* **createProbedLocationLayer()** updates the marker layer used to locate the probe measurements come from
* **updateProbedLocationForecast()** updates the probe prediction values whenever the current forecast model has changed (see [Weacast mixin](./mixins.md#weacast))
* **isTimeseriesOpen()** check if the timeseries widget is currently visible
* **openTimeseries()** opens the timeseries widget to make it currently visible
* **closeTimeseries()** closes the timeseries widget to make it currently hidden
* **toggleTimeseries()** changes the visibility state of the timeseries widget

This mixin also adds the following internal data properties:
* **probedLocation** currently probed location feature

::: tip
The mixin keeps in sync the timeseries widget visibility state and the associated probe marker layer.
:::

::: danger
It assumes that the DOM element used to display the graph is a [KWidget](../kcore/components.md#kwidget) including a [KLocationTimeSeries](./components.md#klocationtimeseries) with a ref named `timeseriesWidget`.
:::

## Activity

Make it easier to create 2D/3D mapping activities by providing methods available in both cases:
* **initialize()** setup view, Weacast, layers and timeline, **should be called first before any other method**
* **registerActivityActions()** register default activity actions (fullscreen mode, geolocation, geocoding, tracking, probing, etc.)
* **getCatalogLayers()** retrieve available [catalog layer descriptors](./services.md#catalog)
* **refreshLayers()** setup available layers based on [catalog layer descriptors](./services.md#catalog)
* **registerLayerActions(layer)** register default layer actions (zoom, save, edit, edit data, remove, etc.)
* **isLayerStorable/Removable/Editable(layer)** helper function to get the state of a given layer descriptor
* **onLayerAdded(layer)** layer action handler that will setup available action on layer
* **onTriggerLayer(layer)** trigger action handler that will hide/show a given layer
* **onZoomToLayer(layer)** zoom action handler that will zoom to a given layer
* **onCreateLayer()** create layer action handler that will open an [editor](../kcore/components.md#editors) to define layer properties
* **onSaveLayer(layer)** save action handler that will persist a given in-memory layer to persistent storage provided by a [feature service](./services.md#feature-service)
* **onEditLayer(layer)** edit action handler that will open an [editor](../kcore/components.md#editors) to change layer properties
* **onEditLayerData(layer)** edit data action handler that will (de)activate [feature edition mode](https://leaflet.github.io/Leaflet.draw/docs/leaflet-draw-latest.html) to update layer features geometry and properties
* **onRemoveLayer(layer)** remove action handler that will ask for confirmation before removing a persisted layer
* **onGeocoding()** geocoding action handler that will open a dialog to search for a location to go to
* **onGeolocate()** geolocation action handler that will launch a user's position lookup and go to found user's location
* **onTrackLocation()** location tracking action handler that will enable/disable a location indicator to display location values
* **storeView()** stores current view bounds as query parameters and persists as well in local storage 
* **restoreView()** restores previously stored view bounds from local storage or query parameters
* **clearStoredView()** clears the stored view bounds so that it will not be restored anymore

::: tip
This mixin has to be initialized by providing a unique component/activity name like `mixins.activity('map')`. Indeed, the name is then used to retrieve the configuration associated with the activity from the global frontend [configuration](../../guides/basics/step-by-step.md#configuring-a-kapp) according to the following properties:
* **{name}**: 2D/3D view configuration
* **[name}Panel**: 2D/3D layers panel configuration
* **[name}Activity**: 2D/3D activity configuration
See [Kano configuration options](../kano/configuration.md) for more details.
:::

## Location indicator

Allow to display an indicator on top of the map indicating the current mouse location:
* **createLocationIndicator()** installs the indicator
* **removeLocationIndicator()** removes the indicator

::: tip
The mixin is in sync with the `locationFormat` property of the [global store](../kcore/application.md#store) so that you can have a shared location display format accross all mapping components with a dedicated UI to change settings using e.g. `store.patch('locationFormat', 'FFf')`.
:::

This mixin also adds the following internal data properties:
* **currentLocation**: current location as [latitude, longitude]
* **currentLocationFormat**: current location format object to be used for display as supported by [formatcoords](https://github.com/nerik/formatcoords)

## Legend

Allow to display a legend on top of the map according to currently active layer variables:
* **createLocationIndicator()** installs the indicator
* **removeLocationIndicator()** removes the indicator

::: tip
Will automatically hide/show the legend whenever a layer is.
:::

## Map

The underlying map object is based on [Leaflet](http://leafletjs.com/) and some mixins also rely on [Leaflet plugins](https://leafletjs.com/plugins.html). The following set of mixins is to be used to construct a new map activity and underlying Leaflet objects.

### Base Map

::: danger
This mixin is a mandatory one to build a map activity
:::

Make it possible to manage map layers and extend supported layer types:
* **setupMap(domElement, options)** creates the underlying Leaflet map object with given options
* **addLayer(options)/removeLayer(name)** registers/destroys a layer based on a [catalog layer descriptor](./services.md#catalog)
* **showLayer/hideLayer(name)** (un)hides the given layer in map, on first show the layer will be lazily created
* **hasLayer(name)** check if a given layer is already registered
* **isLayerVisible(name)** check if a given layer is visible and underlying Leaflet object created
* **zoomToLayer(name)** fits the map view to visualize a given layer
* **zoomToBounds(bounds)** fits the map view to visualize a given extent as bounds [ [south, west], [north, east] ]
* **getLayerByName(name)** retrieve the [catalog layer descriptor](./services.md#catalog) for a given layer
* **renameLayer(previousName, newName)** rename a given layer
* **removeLayer(name)** destroys a given layer
* **getLeafletLayerByName(name)** retrieve the underlying Leaflet object for a given layer
* **createLeafletLayer(options)** creates the underlying Leaflet object based on a [catalog layer descriptor](./services.md#catalog), will check all registered constructor for any one matching
* **getLeafletPaneByName(name)** retrieve the underlying Leaflet object for a given pane
* **createLeafletPane(name)** creates the underlying Leaflet object for a pane
* **removeLeafletPane(name)** destroys the underlying Leaflet object for a given pane
* **registerLeafletConstructor(constructor)** registers a Leaflet constructor function for a given type of layer
* **center(longitude, latitude, zoomLevel)** centers the map view to visualize a given point at a given zoom level
* **getCenter()** get the current map view center as longitude, latitude and zoom level
* **getBounds()** get the current map view bounds as `[ [south, west], [north, east] ]`
* **setCurrentTime(datetime)** sets the current time to be used for time-based visualisation (e.g. weather forecast data or dynamic features)

This mixin also adds the following internal data properties:
* **layers** available layers as [catalog layer descriptors](./services.md#catalog)

This mixin automatically includes some Leaflet plugins: [leaflet-fa-markers](https://github.com/danwild/leaflet-fa-markers) to create markers using Font Awesome icons, [Leaflet.fullscreen](https://github.com/Leaflet/Leaflet.fullscreen) to manage fullscreen mode, [Leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster) to create marker clusters, [Leaflet.VectorGrid](https://github.com/Leaflet/Leaflet.VectorGrid) to display [vector tiles](https://github.com/mapbox/vector-tile-spec).

#### Managing panes

Although DOM-based layers like [Markers](https://leafletjs.com/reference.html#marker) could make use of a `z-index` to possibly manage render order between them, SVG or canvas-based layers used to manage [GeoJson features](https://leafletjs.com/reference.html#geojson) like [Polylines](https://leafletjs.com/reference.html#polyline) provided no mean to do so. Similarly, there was no simple way to render some layers only at some specific zoom levels. This is the reason why Leaflet 1.0 introduced the concept of [panes](https://leafletjs.com/reference.html#map-pane).

If you add a `zIndex` option to your layer descriptor we will create a dedicated pane for you under-the-hood so that the layer will be rendered at its right rank. Check the `z-index` value of [the default panes](https://leafletjs.com/reference.html#map-pane) to select the appropriate one.

If you add a `panes` option to your layer descriptor we will create the dedicated panes for you under-the-hood so that you can then set in the `pane` option of any sublayer the pane it will belong to. Each pane must have a unique name and can be visible at specific zoom levels:
```json
{
  name: 'Layer',
  ...
  panes: [{
    name: 'waypoints',
    minZoom: 7,
    maxZoom: 14
  }]
}
```

### Map Style

Make it possible to generate Leaflet map objects with style based on (Geo)Json (feature) properties:
* **convertFromSimpleStyleSpec(style)** helper function to convert from [simple style spec options](https://github.com/mapbox/simplestyle-spec) to [Leaflet style options](https://leafletjs.com/reference.html#path-option)
* **createMarkerFromStyle(latlng, style)** helper function create a [Leaflet marker](https://leafletjs.com/reference.html#marker) from marker style options:
  * **icon** icon style options 
    * **type** type name (ie class) of the icon to be created for the marker
    * **options** icon constructor options
  * **type** type name (ie class) of the marker to be created
  * **options** marker constructor options
* **register/unregisterLeafletStyle(type, generator)** (un)registers a function generating a Leaflet object depending on the given type:
  * `markerStyle` => **f(feature, latlng, options)** returns a [Leaflet marker](https://leafletjs.com/reference.html#marker)
  * `featureStyle` => **f(feature, options)** returns a [Leaflet style object](https://leafletjs.com/reference.html#path-option)
  * `tooltip` => **f(feature, layer, options)** returns a [Leaflet tooltip](https://leafletjs.com/reference.html#tooltip), see [tooltip mixin](./mixins.md#map-tooltip)
  * `popup` => **f(feature, layer, options)** returns a [Leaflet popup](https://leafletjs.com/reference.html#popup), see [popup mixin](./mixins.md#map-popup)

::: tip
The [simple style spec options](https://github.com/mapbox/simplestyle-spec) does not cover all [Leaflet style options](https://leafletjs.com/reference.html#path-option). However you can use it simply by converting option names from camel case to kebab case.
:::

The mixin automatically registers defaults styling:
  * `markerStyle` => will create a marker based on the following options merged with the following order of precedence
    * [simple style spec options](https://github.com/mapbox/simplestyle-spec) set on **feature.style** or **feature.properties**
    * [simple style spec options](https://github.com/mapbox/simplestyle-spec) set on layer descriptor
    * [Leaflet style options](https://leafletjs.com/reference.html#path-option) set on the **pointStyle** property in the component
  * `featureStyle` => will create a style based on the following options merged with the following order of precedence
    * [simple style spec options](https://github.com/mapbox/simplestyle-spec) set on **feature.style** or **feature.properties**
    * [simple style spec options](https://github.com/mapbox/simplestyle-spec) set on layer descriptor
    * [Leaflet style options](https://leafletjs.com/reference.html#path-option) set on the **featureStyle** property in the component

### Map Popup

Make it possible to generate [Leaflet popups](https://leafletjs.com/reference.html#popup) based on GeoJson feature properties:
* use **register/unregisterLeafletStyle(`popup`, generator)** to (un)register a function **f(feature, layer, options)** returning a [Leaflet popup](https://leafletjs.com/reference.html#popup)

The mixin automatically registers a default generator that will create a popup displaying a property name/value table based on the following options with the following order of precedence
  * **popup**: set on **feature.properties** or layer descriptor or in the **popup** property of component options
    * **pick**: array of property names to appear in the popup
    * **omit**: array of property names not to appear in the popup
    * **template**: [Lodash template](https://lodash.com/docs/#template) to generate popup content with feature and its properties as context
    * **text**: text content of the popup, if provided will override default display
    * **options**: Leaflet [popup options](https://leafletjs.com/reference.html#popup-option)

### Map Tooltip

Make it possible to generate [Leaflet tooltips](https://leafletjs.com/reference.html#tooltip) based on GeoJson feature properties:
* use **register/unregisterLeafletStyle(`tooltip`, generator)** to (un)register a function **f(feature, layer, options)** returning a [Leaflet tooltip](https://leafletjs.com/reference.html#tooltip)

The mixin automatically registers a default generator that will create a tooltip based on the following options with the following order of precedence
  * **tooltip**: set on **feature.properties** or layer descriptor or in the **tooltip** property of component options
    * **property**: property name to appear in the tooltip
    * **template**: [Lodash template](https://lodash.com/docs/#template) to generate tooltip content with feature and its properties as context
    * **text**: text content of the tooltip, if provided will override default display
    * **options**: Leaflet [tooltip options](https://leafletjs.com/reference.html#tooltip-option)

### GeoJson Layer

Make it possible to manage and style raw or time-based GeoJson map layers ([Leaflet.Realtime plugin](https://github.com/perliedman/leaflet-realtime) is used under-the-hood):
* **createLeafletGeoJsonLayer(options)** automatically registered GeoJson Leaflet layer constructor
* **updateLayer(name, geoJson, remove)** update underlying GeoJson data of a given layer, if `remove` is `true` it will remove given features from the layer, otherwise it will add new ones found and update matching ones based on the `featureId` option

::: danger
The [style mixin](./mixins.md#map-style) is mandatory when using this mixin. If you'd like to support popups/tooltips you should also use the [popup mixin](./mixins.md#map-tooltip) and/or [tooltip mixin](./mixins.md#map-tooltip).
:::

If your component has a **onLeafletFeature(feature, layer, options)** method it will be called each time a new GeoJson feature is created.

::: tip
Marker cluster options are to be provided in the **cluster** property of the Leaflet layer options
:::

The following configuration illustrates a GeoJson marker cluster layer using options set on the layer descriptor (see image below):
```json
{
  name: 'Layer',
  description: 'My sites',
  tags: [ 'business' ],
  icon: 'star',
  attribution: '(c) My company',
  type: 'OverlayLayer',
  leaflet: {
    type: 'geoJson',
    source: 'https://s3.eu-central-1.amazonaws.com/kargo/nuclear-sites.json',
    cluster: {},
    'marker-color': 'orange',
    'icon-color': 'white',
    'icon-classes': 'fa fa-star',
    popup: {
      pick: [ 'NAME' ]
    },
    tooltip: {
      property: 'LABEL'
    }
  }
}
```

![2D marker cluster](../../assets/marker-cluster-2D.png)

#### Additional feature types

The following options can be set as feature `properties` to manage more geometry types:
* **geodesic** boolean set to `true` on a `LineString` will result in a geodesic line from the [Leaflet.Geodesic](https://github.com/henrythasler/Leaflet.Geodesic) plugin
* **geodesic** boolean set to `true` on a `Point` will result in a great circle from the [Leaflet.Geodesic](https://github.com/henrythasler/Leaflet.Geodesic) plugin, which **radius** must be specified in meters

#### Dynamic styling

Usually the same style is used for all features of a GeoJson layer, you might however require a more dynamic style base on each feature properties. To handle this use case you can either:
* provide styling options for each feature in their `properties` or `style` field
* use [Lodash templating](https://lodash.com/docs/#template) on layer styling options with feature and its properties as context

::: warning
Templating can only be efficient if compilers are created upfront, as a consequence you need to declare the list of templated options in your layer styling using the `template` property.
:::

For instance you can change the marker color or image based on a given features's property like this:
```js
'marker-color': `<% if (properties.visibility < 75) { %>#000000<% }
                  else if (properties.visibility < 300) { %>#d20200<% }
                  else if (properties.visibility < 1500) { %>#f9b40f<% }
                  else if (properties.visibility < 3000) { %>#eef52f<% }
                  else { %>#33c137<% } %>`,
'marker-symbol': `<% if (properties.visibility < 75) { %>/statics/windyblack.png<% }
                    else if (properties.visibility < 300) { %>/statics/windyred.png<% }
                    else if (properties.visibility < 1500) { %>/statics/windyorange.png<% }
                    else if (properties.visibility < 3000) { %>/statics/windyyellow.png<% }
                    else { %>/statics/windygreen.png<% } %>`,
template: ['marker-color', 'marker-symbol']
```

You can also draw a path with a different styling on each part like this:
```json
{
  type: 'FeatureCollection',
  features: [{
    type: 'Feature',
    properties: { stroke: '#000000', weight: 1 },
    geometry: { type: 'LineString', coordinates: [...] }
  }, {
    type: 'Feature',
    properties: { stroke: '#FF00FF', weight: 3 },
    geometry: { type: 'LineString', coordinates: [...] }
  }]
}
```

### Edit Layer

Make it possible to edit features of a [GeoJson layer](./mixins.md#geojson-layer) (geometry and properties):
* **editLayer(name)** start/stop layer edition on a given layer
* **updateFeatureProperties(feature, layer, leafletLayer)** update feature properties action handler that will open an [editor](../kcore/components.md#editors) to define feature properties

::: warning
It has to be used with the GeoJson layer mixin and will use the configured styling.
:::

### File Layer

Make it possible to drag'n'drop GeoJson or KML file on the map ([Leaflet.FileLayer plugin](https://github.com/makinacorpus/Leaflet.FileLayer) is used under-the-hood). It will automatically create a new [GeoJson layer](./mixins.md#geojson-layer) named after the filename on drop. As a consequence it has to be used with the GeoJson layer mixin and will use the configured styling.

### Forecast Layer

Make it possible to manage [Weacast map layers](https://weacast.github.io/weacast-docs/api/layers.html#forecast-data-layers):
* **createLeafletForecastLayer(options)** automatically registered Weacast Leaflet layer constructor

::: warning
This mixin assumes that your component has initialized its [Weacast client](https://weacast.github.io/weacast-docs/api/application.html#client-setup) in the `weacastApi` property by using e.g. the [Weacast mixin](./mixins.md#weacast)
:::

#### Map Activity

Make it easier to create 2D mapping activities:
* **initializeMap()** setup the mapping engine, **should be called first before any other method**
* **finalizeMap()** destroy the mapping engine

::: danger
It assumes that the DOM element used by the render engine has a ref named `map`
:::

## Globe

The underlying globe object is based on [Cesium](https://cesium.com/).

### Base Globe

::: danger
This mixin is a mandatory one to build a globe activity
:::

Make it possible to manage globe layers and extend supported layer types:
* **setupGlobe(domElement, token)** creates the underlying Cesium globe object with given Cesium Ion token
* **addLayer(options)/removeLayer(name)** registers/destroys a layer based on a [catalog layer descriptor](./services.md#catalog)
* **showLayer/hideLayer(name)** (un)hides the given layer in globe, on first show the layer will be lazily created
* **hasLayer(name)** check if a given layer is already registered
* **isLayerVisible(name)** check if a given layer is visible and underlying Cesium object created
* **zoomToLayer(name)** fits the globe view to visualize a given layer
* **zoomToBounds(bounds)** fits the globe view to visualize a given extent as bounds [ [south, west], [north, east] ]
* **getLayerByName(name)** retrieve the [catalog layer descriptor](./services.md#catalog) for a given layer
* **renameLayer(previousName, newName)** rename a given layer
* **removeLayer(name)** destroys a given layer
* **getCesiumLayerByName(name)** retrieve the underlying Cesium object for a given layer
* **createCesiumLayer(options)** creates the underlying Cesium object based on a [catalog layer descriptor](./services.md#catalog), will check all registered constructor for any one matching
* **registerCesiumConstructor(constructor)** registers a Cesium constructor function for a given type of layer
* **center(longitude, latitude, altitude, heading, pitch, roll)** centers the globe view to visualize a given point at a given altitude with and orientation (default is pointing ground vertically [0, 0, -90])
* **getCenter()** get the current globe view center as longitude, latitude and altitude
* **getBounds()** get the current map view bounds as `[ [south, west], [north, east] ]`

This mixin also adds the following internal data properties:
* **layers** available layers as [catalog layer descriptors](./services.md#catalog)

### Globe Style

Make it possible to setup Cesium entities objects with style based on (Geo)Json (feature) properties stored in entities:
* **convertFromSimpleStyleSpec(style)** helper function to convert from [simple style spec options](https://github.com/mapbox/simplestyle-spec) to [Cesium style options](https://cesiumjs.org/Cesium/Build/Documentation/GeoJsonDataSource.html#.load)
* **convertToCesiumObjects(style)** helper function to convert from JSON description to Cesium objects
* **register/unregisterCesiumStyle(type, generator)** (un)registers a function generating a Cesium object depending on the given type:
  * `entityStyle` => **f(entity, options)** returns a [Cesium entity style object](https://cesium.com/docs/tutorials/creating-entities/)
  * `clusterStyle` => **f(entities, cluster, options)** returns a [Cesium cluster style object](https://cesiumjs.org/Cesium/Build/Documentation/EntityCluster.html#~newClusterCallback)

The mixin automatically registers defaults styling:
  * `entityStyle` => will create a style based on the following options merged with the following order of precedence
    * [simple style spec options](https://github.com/mapbox/simplestyle-spec) set on **feature.style** or **feature.properties**
    * [Cesium entity style options](https://cesium.com/docs/tutorials/creating-entities/) set on layer descriptor
    * [Cesium entity style options](https://cesium.com/docs/tutorials/creating-entities/) set on the **entityStyle** property in the component options
  * `clusterStyle` => will create a style based on the following options merged with the following order of precedence
    * [Cesium cluster style options](https://cesiumjs.org/Cesium/Build/Documentation/EntityCluster.html#~newClusterCallback) set on layer descriptor
    * [Cesium cluster style options](https://cesiumjs.org/Cesium/Build/Documentation/EntityCluster.html#~newClusterCallback) set on the **clusterStyle** property in the component options

Cesium styles often rely on dynamically created objects while the input styling configuration is a static JSON. As a consequence the following rules are used to convert from JSON to Cesium objects:
* constants are expressed as strings starting with `'Cesium.'`
* object instances are expressed as a `{ type, options }` object where type is a string starting with `'Cesium.'` followed by the class name like `'Cesium.CheckerboardMaterialProperty'`, options are constructor options for the object instance
The following Cesium code:
```js
ellipse.material = new Cesium.CheckerboardMaterialProperty({
  evenColor : Cesium.Color.WHITE,
  oddColor : Cesium.Color.BLACK,
  repeat : new Cesium.Cartesian2(4, 4)
})
```
will result in the following Json configuration:
```json
ellipse: {
  material: {
    type: 'Cesium.CheckerboardMaterialProperty',
    options: {
      evenColor: 'Cesium.Color.WHITE',
      oddColor: 'Cesium.Color.BLACK',
      repeat: {
        type: 'Cesium.Cartesian2',
        options: [4, 4]
    }
  }
}
```

### Globe Popup

Make it possible to generate [Cesium labels](https://cesiumjs.org/Cesium/Build/Documentation/LabelGraphics.html) as popups based on GeoJson feature properties stored in entities:
* use **register/unregisterCesiumStyle(`popup`, generator)** to (un)register a function **f(entity, options)** returning a [Cesium entity style object](https://cesium.com/docs/tutorials/creating-entities/)

The mixin automatically registers a default generator that will create a popup displaying a property name/value table based on the following options with the following order of precedence
  * **popup**: set on **entity.properties** or layer descriptor or in the **popup** property of component options
    * **pick**: array of property names to appear in the popup
    * **omit**: array of property names not to appear in the popup
    * **template**: [Lodash template](https://lodash.com/docs/#template) to generate popup content with feature and its properties as context
    * **html**: HTML content of the popup, if provided will override default display
    * **options**: Cesium [label options](https://cesiumjs.org/Cesium/Build/Documentation/LabelGraphics.html)

### Globe Tooltip

Make it possible to generate [Cesium labels](https://cesiumjs.org/Cesium/Build/Documentation/LabelGraphics.html) as tooltips based on GeoJson feature properties stored in entities:
* use **register/unregisterCesiumStyle(`tooltip`, generator)** to (un)register a function **f(entity, options)** returning a [Cesium entity style object](https://cesium.com/docs/tutorials/creating-entities/)

The mixin automatically registers a default generator that will create a tooltip based on the following options with the following order of precedence
  * **tooltip**: set on **entity.properties** or layer descriptor or in the **tooltip** property of component options
    * **property**: property name to appear in the tooltip
    * **template**: [Lodash template](https://lodash.com/docs/#template) to generate tooltip content with feature and its properties as context
    * **html**: HTML content of the tooltip, if provided will override default display
    * **options**: Cesium [label options](https://cesiumjs.org/Cesium/Build/Documentation/LabelGraphics.html)

### GeoJson Layer

Make it possible to manage and style raw or time-based GeoJson map layers:
* **createCesiumGeoJsonLayer(options)** automatically registered GeoJson Cesium layer constructor
* **updateLayer(name, geoJson)** update underlying GeoJson data of a given layer

::: danger
The [style mixin](./mixins.md#globe-style) is mandatory when using this mixin. If you'd like to support popups/tooltips you should also use the [popup mixin](./mixins.md#globe-tooltip) and/or [tooltip mixin](./mixins.md#globe-tooltip).
:::

::: tip
Marker cluster options are to be provided in the **cluster** property of the Cesium layer options
:::

The following configuration illustrates a GeoJson marker cluster layer using options set on the layer descriptor (see image below):
```json
{
  name: 'Layer',
  description: 'My sites',
  tags: [ 'business' ],
  icon: 'star',
  attribution: '(c) My company',
  type: 'OverlayLayer',
  cesium: {
    type: 'geoJson',
    source: 'https://s3.eu-central-1.amazonaws.com/kargo/nuclear-sites.json',
    cluster: {
      pixelRange: 50
    },
    'marker-symbol': 'star',
    'marker-color': '#FFA500'
  }
}
```

![3D marker cluster](../../assets/marker-cluster-3D.png)

#### Additional feature types

The following options can be set as feature `properties` to manage more geometry types:
* **wall** boolean set to `true` on a `LineString` will result in an additional [WallGraphics](https://cesiumjs.org/Cesium/Build/Documentation/WallGraphics.html?classFilter=wall), which uses the styling options of the feature
* **geodesic** boolean set to `true` on a `Point` will result in a great circle represented as a [EllipseGraphics](https://cesiumjs.org/Cesium/Build/Documentation/EllipseGraphics.html), which **radius** must be specified in meters and uses the styling options of the feature
* **icon-text** string set on a `Point` will result in a [LabelGraphics](https://cesiumjs.org/Cesium/Build/Documentation/LabelGraphics.html?classFilter=label) instead of a [BillboardGraphics](https://cesiumjs.org/Cesium/Build/Documentation/BillboardGraphics.html?classFilter=bill), which uses the styling options of the feature

#### Dynamic styling

The same than for [dynamic map style](./mixins.md#dynamic-styling) applies for globe. Note however that templating will be applied once the 3D entities have been created, which means that you cannot use templating on [simple style spec options](https://github.com/mapbox/simplestyle-spec) but rather on Cesium object options set on the `entityStyle` layer option.

For instance you can change the marker color or image based on a given features's property like this:
```json
entityStyle: {
  billboard: {
    image: `<% if (properties.visibility < 75) { %>/statics/windyblack.png<% }
              else if (properties.visibility < 300) { %>/statics/windyred.png<% }
              else if (properties.visibility < 1500) { %>/statics/windyorange.png<% }
              else if (properties.visibility < 3000) { %>/statics/windyyellow.png<% }
              else { %>/statics/windygreen.png<% } %>`,
    color: `Cesium.Color.<% if (properties.visibility < 75) { %>BLACK<% }
              else if (properties.visibility < 300) { %>ORANGERED<% }
              else if (properties.visibility < 1500) { %>GOLD<% }
              else if (properties.visibility < 3000) { %>YELLOW<% }
              else { %>LIMEGREEN<% } %>"/>`
  },
  template: ['billboard.image', 'billboard.color']
}
```

You can also draw a path with a different styling on each part like this:
```json
{
  type: 'FeatureCollection',
  features: [{
    type: 'Feature',
    properties: { stroke: '#000000', weight: 1 },
    geometry: { type: 'LineString', coordinates: [...] }
  }, {
    type: 'Feature',
    properties: { stroke: '#FF00FF', weight: 3 },
    geometry: { type: 'LineString', coordinates: [...] }
  }]
}
```

### File Layer

Make it possible to drag'n'drop GeoJson or KML file on the globe. It will automatically create a new [GeoJson layer](./mixins.md#geojson-layer) named after the filename on drop. As a consequence it has to be used with the GeoJson layer mixin and will use the configured styling.

#### Globe Activity

Make it easier to create 3D mapping activities:
* **initializeGlobe(token)** setup the render engine with given Cesium ion access token, **should be called first before any other method**
* **finalizeGlobe()** destroy the render engine

::: danger
It assumes that the DOM element used by the render engine has a ref named `globe`
:::