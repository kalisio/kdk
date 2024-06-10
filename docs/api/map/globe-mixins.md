## Globe Mixins

The underlying globe object is based on [Cesium](https://cesium.com/).

## Base Globe

::: danger
This mixin is a mandatory one to build a globe activity
:::

Make it possible to manage globe layers and extend supported layer types:
* **setupGlobe(domElement, token, options)** creates the underlying Cesium globe object with given Cesium Ion token and viewer options
* **addLayer(options)/removeLayer(name)** registers/destroys a layer based on a [catalog layer descriptor](./services.md#catalog-service)
* **showLayer/hideLayer(name)** (un)hides the given layer in globe, on first show the layer will be lazily created
* **hasLayer(name)** check if a given layer is already registered
* **isLayerVisible(name)** check if a given layer is visible and underlying Cesium object created
* **zoomToLayer(name)** fits the globe view to visualize a given layer
* **zoomToBounds(bounds)** fits the globe view to visualize a given extent as bounds [ [south, west], [north, east] ]
* **getLayerByName(name)** retrieve the [catalog layer descriptor](./services.md#catalog-service) for a given layer
* **renameLayer(previousName, newName)** rename a given layer
* **removeLayer(name)** destroys a given layer
* **getCesiumLayerByName(name)** retrieve the underlying Cesium object for a given layer
* **createCesiumLayer(options)** creates the underlying Cesium object based on a [catalog layer descriptor](./services.md#catalog-service), will check all registered constructor for any one matching
* **registerCesiumConstructor(constructor)** registers a Cesium constructor function for a given type of layer
* **center(longitude, latitude, altitude, heading, pitch, roll, options)** centers the globe view to visualize a given point at a given altitude with and orientation (default is pointing ground vertically [0, 0, -90]),
 some options like an animation `duration` can also be added
* **getCenter()** get the current globe view center as longitude, latitude and altitude
* **getBounds()** get the current map view bounds as `[ [south, west], [north, east] ]`

This mixin also adds the following internal data properties:
* **layers** available layers as [catalog layer descriptors](./services.md#catalog-service)

## Globe Style

Make it possible to setup Cesium entities objects with style based on (Geo)Json (feature) properties stored in entities:
* **convertFromSimpleStyleSpec(style)** helper function to convert from [simple style spec options](https://github.com/mapbox/simplestyle-spec) to [Cesium style options](https://cesiumjs.org/Cesium/Build/Documentation/GeoJsonDataSource.html#.load)
* **convertToCesiumObjects(style)** helper function to convert from JSON description to Cesium objects

Use **register/unregisterStyle(type, generator)** to (un)register a function generating a Cesium object depending on the given type:
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
```js
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

## Globe Popup

Make it possible to generate [Cesium labels](https://cesiumjs.org/Cesium/Build/Documentation/LabelGraphics.html) as popups based on GeoJson feature properties stored in entities. Use **register/unregisterStyle(`popup`, generator)** to (un)register a function **f(entity, options)** returning a [Cesium entity style object](https://cesium.com/docs/tutorials/creating-entities/)

The mixin automatically registers a default generator that will create a popup displaying a property name/value table based on the following options with the following order of precedence
  * **popup**: set on **entity.properties** or layer descriptor or in the **popup** property of component options
    * **pick**: array of property names to appear in the popup
    * **omit**: array of property names not to appear in the popup
    * **template**: [Lodash template](https://lodash.com/docs/#template) to generate popup content with `feature`, its `properties` and translation function `$t` as context
    * **html**: HTML content of the popup, if provided will override default display
    * **options**: Cesium [label options](https://cesiumjs.org/Cesium/Build/Documentation/LabelGraphics.html)

::: tip
If you want to disable a default popup configuration like `popup: { }` (i.e. display all properties) on a per-layer basis you have to explicitely unset it on your layer options using `popup: null` or `popup: false`.
:::

## Globe Tooltip

Make it possible to generate [Cesium labels](https://cesiumjs.org/Cesium/Build/Documentation/LabelGraphics.html) as tooltips based on GeoJson feature properties stored in entities. Use **register/unregisterStyle(`tooltip`, generator)** to (un)register a function **f(entity, options)** returning a [Cesium entity style object](https://cesium.com/docs/tutorials/creating-entities/)

The mixin automatically registers a default generator that will create a tooltip based on the following options with the following order of precedence
  * **tooltip**: set on **entity.properties** or layer descriptor or in the **tooltip** property of component options
    * **property**: property name to appear in the tooltip
    * **template**: [Lodash template](https://lodash.com/docs/#template) to generate tooltip content with `feature`, its `properties` and translation function `$t` as context
    * **html**: HTML content of the tooltip, if provided will override default display
    * **options**: Cesium [label options](https://cesiumjs.org/Cesium/Build/Documentation/LabelGraphics.html)

::: tip
If you want to disable a default tooltip configuration like `tooltip: { property: 'name' }` (i.e. display all properties) on a per-layer basis you have to explicitely unset it on your layer options using `tooltip: null` or `tooltip: false`.
:::

## GeoJson Layer

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
```js
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

![3D marker cluster](../../.vitepress/public/images/marker-cluster-3D.png)

### Additional feature types

The following options can be set as feature `properties` to manage more geometry types:
* **wall** boolean set to `true` on a `LineString` will result in an additional [WallGraphics](https://cesiumjs.org/Cesium/Build/Documentation/WallGraphics.html?classFilter=wall), which uses the styling options of the feature
* **geodesic** boolean set to `true` on a `Point` will result in a great circle represented as a [EllipseGraphics](https://cesiumjs.org/Cesium/Build/Documentation/EllipseGraphics.html), which **radius** must be specified in meters and uses the styling options of the feature
* **icon-text** string set on a `Point` will result in a [LabelGraphics](https://cesiumjs.org/Cesium/Build/Documentation/LabelGraphics.html?classFilter=label) instead of a [BillboardGraphics](https://cesiumjs.org/Cesium/Build/Documentation/BillboardGraphics.html?classFilter=bill), which uses the styling options of the feature

### Dynamic styling

The same than for [dynamic map style](./map-mixins.md#dynamic-styling) applies for globe. Note however that templating will be applied once the 3D entities have been created, which means that you cannot use templating on [simple style spec options](https://github.com/mapbox/simplestyle-spec) but rather on Cesium object options set on the `entityStyle` layer option.

For instance you can change the marker color or image based on a given features's property like this:
```js
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

## File Layer

Make it possible to drag'n'drop GeoJson or KML file on the globe. It will automatically create a new [GeoJson layer](./globe-mixins.md#geojson-layer) named after the filename on drop. As a consequence it has to be used with the GeoJson layer mixin and will use the configured styling.

## Globe Activity

Make it easier to create 3D mapping activities:
* **initializeGlobe(token)** setup the render engine with given Cesium ion access token, **should be called first before any other method**
* **finalizeGlobe()** destroy the render engine

::: danger
It assumes that the DOM element used by the render engine has a ref named `globe`
:::
