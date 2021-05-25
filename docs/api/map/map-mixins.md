# Map Mixins

The underlying map object is based on [Leaflet](http://leafletjs.com/) and some mixins also rely on [Leaflet plugins](https://leafletjs.com/plugins.html). The following set of mixins is to be used to construct a new map activity and underlying Leaflet objects.

## Base Map

::: danger
This mixin is a mandatory one to build a map activity
:::

Make it possible to manage map layers and extend supported layer types:
* **setupMap(domElement, options)** creates the underlying Leaflet map object with given options
* **addLayer(options)/removeLayer(name)** registers/destroys a layer based on a [catalog layer descriptor](./services.md#catalog-service)
* **showLayer/hideLayer(name)** (un)hides the given layer in map, on first show the layer will be lazily created
* **hasLayer(name)** check if a given layer is already registered
* **isLayerVisible(name)** check if a given layer is visible and underlying Leaflet object created
* **zoomToLayer(name)** fits the map view to visualize a given layer
* **zoomToBounds(bounds)** fits the map view to visualize a given extent as bounds [ [south, west], [north, east] ]
* **getLayerByName(name)** retrieve the [catalog layer descriptor](./services.md#catalog-service) for a given layer
* **renameLayer(previousName, newName)** rename a given layer
* **removeLayer(name)** destroys a given layer
* **getLeafletLayerByName(name)** retrieve the underlying Leaflet object for a given layer
* **createLeafletLayer(options)** creates the underlying Leaflet object based on a [catalog layer descriptor](./services.md#catalog-service), will check all registered constructor for any one matching
* **getLeafletPaneByName(name)** retrieve the underlying Leaflet object for a given pane
* **createLeafletPane(name)** creates the underlying Leaflet object for a pane
* **removeLeafletPane(name)** destroys the underlying Leaflet object for a given pane
* **registerLeafletConstructor(constructor)** registers a Leaflet constructor function for a given type of layer
* **center(longitude, latitude, zoomLevel)** centers the map view to visualize a given point at a given zoom level
* **getCenter()** get the current map view center as longitude, latitude and zoom level
* **getBounds()** get the current map view bounds as `[ [south, west], [north, east] ]`
* **setCurrentTime(datetime)** sets the current time to be used for time-based visualisation (e.g. weather forecast data or dynamic features)

This mixin also adds the following internal data properties:
* **layers** available layers as [catalog layer descriptors](./services.md#catalog-service)

This mixin automatically includes some Leaflet plugins: [leaflet-fa-markers](https://github.com/danwild/leaflet-fa-markers) to create markers using Font Awesome icons, [Leaflet.fullscreen](https://github.com/Leaflet/Leaflet.fullscreen) to manage fullscreen mode, [Leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster) to create marker clusters, [Leaflet.VectorGrid](https://github.com/Leaflet/Leaflet.VectorGrid) to display [vector tiles](https://github.com/mapbox/vector-tile-spec).

### Managing panes

Although DOM-based layers like [Markers](https://leafletjs.com/reference.html#marker) could make use of a `z-index` to possibly manage render order between them, SVG or canvas-based layers used to manage [GeoJson features](https://leafletjs.com/reference.html#geojson) like [Polylines](https://leafletjs.com/reference.html#polyline) provided no mean to do so. Similarly, there was no simple way to render some layers only at some specific zoom levels. This is the reason why Leaflet 1.0 introduced the concept of [panes](https://leafletjs.com/reference.html#map-pane).

If you add a `zIndex` option to your layer descriptor we will create a dedicated pane for you under-the-hood so that the layer will be rendered at its right rank. Check the `z-index` value of [the default panes](https://leafletjs.com/reference.html#map-pane) to select the appropriate one.

If you add a `panes` option to your layer descriptor we will create the dedicated panes for you under-the-hood so that you can then set in the `pane` option of any sublayer the pane it will belong to. Each pane must have a unique name and can be visible at specific zoom levels:
```js
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

## Map Style

Make it possible to generate Leaflet map objects with style based on (Geo)Json (feature) properties:
* **convertFromSimpleStyleSpec(style)** helper function to convert from [simple style spec options](https://github.com/mapbox/simplestyle-spec) to [Leaflet style options](https://leafletjs.com/reference.html#path-option)
* **createMarkerFromStyle(latlng, style)** helper function create a [Leaflet marker](https://leafletjs.com/reference.html#marker) from marker style options:
  * **icon** icon style options 
    * **type** type name (ie constructor function) of the icon to be created for the marker, e.g. [`icon`](https://leafletjs.com/reference.html#icon) (defaults), [`divIcon`](https://leafletjs.com/reference.html#divicon) or [`icon.fontAwesome`](https://github.com/danwild/leaflet-fa-markers)
    * **options** icon constructor options
  * **type** type name (ie constructor function) of the marker to be created, e.g. `marker` (defaults) or `circleMarker`
  * **options** marker constructor options

Use **register/unregisterStyle(type, generator)** to (un)register a function generating a Leaflet object depending on the given type:
  * `markerStyle` => **f(feature, latlng, options)** returns a [Leaflet marker](https://leafletjs.com/reference.html#marker)
  * `featureStyle` => **f(feature, options)** returns a [Leaflet style object](https://leafletjs.com/reference.html#path-option)

::: tip
The [simple style spec options](https://github.com/mapbox/simplestyle-spec) does not cover all [Leaflet style options](https://leafletjs.com/reference.html#path-option). However you can use it simply by converting option names from camel case to kebab case.
:::

Our mapping extends the simple style spec and can be used to create styles more easily:
* `weight: mapped as `weight`,
* `radius`: mapped as `radius`,
* `line-cap`: mapped as `lineCap`,
* `line-join`: mapped as `lineJoin`,
* `dash-array`: mapped as `dashArray`,
* `dash-offset`: mapped as `dashOffset`,
* `marker-size`: mapped as `icon.options.iconSize`,
* `marker-symbol`: mapped as `icon.options.iconUrl`,
* `marker-type`: mapped as `type`,
* `icon-size`: mapped as `icon.options.iconSize`,
* `icon-anchor`: mapped as `icon.options.iconAnchor`,
* `icon-class`: mapped as `icon.options.className`,
* `icon-html`: mapped as `icon.options.html` and automatically switch to `divIcon` constructor function,
* `icon-classes`: mapped as `icon.options.iconClasses` and automatically switch to `icon.fontAwesome` constructor function,
* `marker-color`: mapped as `icon.options.markerColor` for `icon.fontAwesome`,
* `icon-color`: mapped as `icon.options.iconColor` for `icon.fontAwesome`,
* `icon-x-offset`: mapped as `icon.options.iconXOffset` for `icon.fontAwesome`,
* `icon-y-offset`: mapped as `icon.options.iconYOffset` for `icon.fontAwesome`

The mixin automatically registers defaults styling:
  * `markerStyle` => will create a marker based on the following options merged with the following order of precedence
    * [simple style spec options](https://github.com/mapbox/simplestyle-spec) set on **feature.style** or **feature.properties**
    * [simple style spec options](https://github.com/mapbox/simplestyle-spec) set on layer descriptor
    * [Leaflet style options](https://leafletjs.com/reference.html#path-option) set on the **pointStyle** property in the component
  * `featureStyle` => will create a style based on the following options merged with the following order of precedence
    * [simple style spec options](https://github.com/mapbox/simplestyle-spec) set on **feature.style** or **feature.properties**
    * [simple style spec options](https://github.com/mapbox/simplestyle-spec) set on layer descriptor
    * [Leaflet style options](https://leafletjs.com/reference.html#path-option) set on the **featureStyle** property in the component

## Map Popup

Make it possible to generate [Leaflet popups](https://leafletjs.com/reference.html#popup) based on GeoJson feature properties. Use **register/unregisterStyle(`popup`, generator)** to (un)register a function **f(feature, layer, options)** returning a [Leaflet popup](https://leafletjs.com/reference.html#popup)

The mixin automatically registers a default generator that will create a popup displaying a property name/value table based on the following options with the following order of precedence
  * **popup**: set on **feature.properties** or layer descriptor or in the **popup** property of component options
    * **pick**: array of property names to appear in the popup
    * **omit**: array of property names not to appear in the popup
    * **template**: [Lodash template](https://lodash.com/docs/#template) to generate popup content with `feature`, its `properties` and translation function `$t` as context
    * **text**: text content of the popup, if provided will override default display
    * **options**: Leaflet [popup options](https://leafletjs.com/reference.html#popup-option)

## Map Tooltip

Make it possible to generate [Leaflet tooltips](https://leafletjs.com/reference.html#tooltip) based on GeoJson feature properties. Use **register/unregisterStyle(`tooltip`, generator)** to (un)register a function **f(feature, layer, options)** returning a [Leaflet tooltip](https://leafletjs.com/reference.html#tooltip)

The mixin automatically registers a default generator that will create a tooltip based on the following options with the following order of precedence
  * **tooltip**: set on **feature.properties** or layer descriptor or in the **tooltip** property of component options
    * **property**: property name to appear in the tooltip
    * **template**: [Lodash template](https://lodash.com/docs/#template) to generate tooltip content with `feature`, its `properties` and translation function `$t` as context
    * **text**: text content of the tooltip, if provided will override default display
    * **options**: Leaflet [tooltip options](https://leafletjs.com/reference.html#tooltip-option)

## GeoJson Layer

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
```js
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

### Additional feature types

The following options can be set as feature `properties` to manage more geometry types:
* **geodesic** boolean set to `true` on a `LineString` will result in a geodesic line from the [Leaflet.Geodesic](https://github.com/henrythasler/Leaflet.Geodesic) plugin
* **geodesic** boolean set to `true` on a `Point` will result in a great circle from the [Leaflet.Geodesic](https://github.com/henrythasler/Leaflet.Geodesic) plugin, which **radius** must be specified in meters

### Dynamic styling

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
```js
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

## Edit Layer

Make it possible to edit features of a [GeoJson layer](./map-mixins.md#geojson-layer) (geometry and properties):
* **editLayer(name)** start/stop layer edition on a given layer
* **updateFeatureProperties(feature, layer, leafletLayer)** update feature properties action handler that will open an [editor](../core/components.md#editors) to define feature properties

::: warning
It has to be used with the GeoJson layer mixin and will use the configured styling.
:::

## File Layer

Make it possible to drag'n'drop GeoJson or KML file on the map ([Leaflet.FileLayer plugin](https://github.com/makinacorpus/Leaflet.FileLayer) is used under-the-hood). It will automatically create a new [GeoJson layer](./map-mixins.md#geojson-layer) named after the filename on drop. As a consequence it has to be used with the GeoJson layer mixin and will use the configured styling.

## Forecast Layer

Make it possible to manage [Weacast map layers](https://weacast.github.io/weacast-docs/api/layers.html#forecast-data-layers):
* **createLeafletForecastLayer(options)** automatically registered Weacast Leaflet layer constructor

::: warning
This mixin assumes that your component has initialized its [Weacast client](https://weacast.github.io/weacast-docs/api/application.html#client-setup) in the `weacastApi` property by using e.g. the [Weacast mixin](./mixins.md#weacast)
:::

## Canvas Layer

Make it possible to draw custom graphic elements on top of other layers using HTML canvas elements. These custom graphic elements are defined by their draw function and are run in the client application, using a controlled draw context. It is not possible for these draw functions to access anything outside the specified context.

* **createLeafletCanvasLayer (options)** is automatically registered to allow creation of such Leaflet layer.
* **updateCanvasLayerDrawCode (layerName, newDrawCode, autoRedraw)** update the draw code used by the layer named `layerName`. `autoRedraw` is a boolean used to enable automatic refresh of the layer at each displayed frame (required eg. to animate elements). `newDrawCode` is expected to be an array of objects where each object is of the following form :
  * `{ feature: 'LAYER_NAME?FEATURE_NAME', code: '... some javascript draw code ...' }` will run the given draw code only for the feature named `FEATURE_NAME` in the layer named `LAYER_NAME`.
  * `{ layer: 'LAYER_NAME', code: '... some javascript draw code ...' }` will run the given draw code for each feature of the layer named `LAYER_NAME`.

* **setCanvasLayerContext (layerName, userContext)** is used to add some user provided members to the draw context. The `userContext` object will be merged with the application draw context and it's member will become available to the draw functions.

The following configuration illustrates a layer used to draw feature property **name** as text at the feature position for all features of the layer named **Airports**.

```js
{
  name: 'AirportNames',
  type: 'OverlayLayer',
  icon: 'local_airport',
  leaflet: {
    type: 'kanvasLayer',
    isVisible: true,
    draw: [
      layer: 'Airports', code: `
        const props = ctx.feature.properties
        const coords = {
          lat: ctx.feature.geometry.coordinates[1],
          lon: ctx.feature.geometry.coordinates[0]
        }

        const pos = ctx.latLonToCanvas(coords)
        ctx.canvas.font = '10px sans-serif'
        ctx.canvas.fillStyle = '#ffb300'
        ctx.canvas.fillText(ctx.feature.properties.name, pos.x, pos.y)
      `
    ]
  }
}
```

The `ctx` object is the draw context and is the only object available from the draw code.

By default, the following fields are available on the draw context :
* **canvas** the canvas rendering interface by which the drawing will occur. Draw api is available [here](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D).
* **now** the time of the draw function call, can be useful to animate things.
* **zoom** the current map zoom value.
* **latLonToCanvas (coords)** a helper method to project from latitude/longitude to canvas coordinates (pixels).
* **vec2 (a, b)** a helper method to build a vec2 object from two points (where points and vec2 are objects with `x` and `y` members ).
* **len2 (vec)** a helper method to compute length of a vec2 vector.
* **scale2 (vec, value)** a helper method to scale a vec2 vector by `value`.
* **norm2 (vec)** a helper method to return the corresponding normalized vec2 vector.

::: tip
Customizing the draw context is useful to build an application specific library of draw functions and make these available to the layer specified draw code.
:::

The draw context can be customized:
 * by the application using the `CanvasDrawContext` singleton. In this case you should call `CanvasDrawContext.merge(contextAdditionObject)`  to merge the content of `contextAdditionObject` with the draw context. This call must be done before the canvas layer mixin is created.
 * at runtime, by the client using the `setCanvasLayerContext` method.

## Map Activity

Make it easier to create 2D mapping activities:
* **initializeMap()** setup the mapping engine, **should be called first before any other method**
* **finalizeMap()** destroy the mapping engine

::: danger
It assumes that the DOM element used by the render engine has a ref named `map`
:::
