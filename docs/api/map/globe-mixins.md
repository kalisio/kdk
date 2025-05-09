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
* **getCenter()** get the current globe view center as `longitude`, `latitude` and `altitude` (note that the projected position on the ground is the one of the camera, it only matches the 2D version with orientation [0, 0, -90])
* **getCamera()** get the current globe view camera settings as `longitude`, `latitude` and `altitude` for position and `heading`, `pitch` and `roll` for orientation
* **getBounds()** get the current map view bounds as `[ [south, west], [north, east] ]`

This mixin also adds the following internal data properties:
* **layers** available layers as [catalog layer descriptors](./services.md#catalog-service)

### Scene post processing

Post processing can be enabled on the globe, you can use the following methods to control this feature:
* **setupPostProcess(postProcessName, options)** handles setup of 3d post process on the scene
* **selectFeaturesForPostProcess(postProcessName, layerName, featureIdList)** can be used for post process that requires *selected* features to operate

We currently only support `desaturate` post process. The `options` parameter in **setupPostProcess** only expects an `enabled: true|false` field. This post process requires *selected* feature to operate, it'll desaturate the whole scene, except features that are *selected*.

![Desaturate post process](../../.vitepress/public/images/desaturate-post-process.png)

## Globe Style

Make it possible to setup Cesium entities objects with style based on (Geo)Json (feature) properties stored in entities:
* **convertFromSimpleStyleSpec(style)** helper function to convert from [simple style spec options](https://github.com/mapbox/simplestyle-spec) to [Cesium style options](https://cesium.com/learn/cesiumjs/ref-doc/GeoJsonDataSource.html#.LoadOptions)
* **convertToCesiumObjects(style)** helper function to convert from JSON description to Cesium objects

Use **register/unregisterStyle(type, generator)** to (un)register a function generating a Cesium object depending on the given type:
  * `entityStyle` => **f(entity, options)** returns a [Cesium entity style object](https://cesium.com/learn/cesiumjs-learn/cesiumjs-creating-entities/)
  * `clusterStyle` => **f(entities, cluster, options)** returns a [Cesium cluster style object](https://cesium.com/learn/cesiumjs/ref-doc/EntityCluster.html#.newClusterCallback)

The mixin automatically registers defaults styling:
  * `entityStyle` => will create a style based on the following options merged with the following order of precedence
    * [simple style spec options](https://github.com/mapbox/simplestyle-spec) set on **feature.style** or **feature.properties**
    * [Cesium entity style options](https://cesium.com/learn/cesiumjs-learn/cesiumjs-creating-entities/) set on layer descriptor
    * [Cesium entity style options](https://cesium.com/learn/cesiumjs-learn/cesiumjs-creating-entities/) set on the **entityStyle** property in the component options
  * `clusterStyle` => will create a style based on the following options merged with the following order of precedence
    * [Cesium cluster style options](https://cesium.com/learn/cesiumjs/ref-doc/EntityCluster.html#.newClusterCallback) set on layer descriptor
    * [Cesium cluster style options](https://cesium.com/learn/cesiumjs/ref-doc/EntityCluster.html#.newClusterCallback) set on the **clusterStyle** property in the component options

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

Make it possible to generate [Cesium labels](https://cesium.com/learn/cesiumjs/ref-doc/LabelGraphics.html) as popups based on GeoJson feature properties stored in entities. Use **register/unregisterStyle(`popup`, generator)** to (un)register a function **f(entity, options)** returning a [Cesium entity style object](https://cesium.com/learn/cesiumjs-learn/cesiumjs-creating-entities/)

The mixin automatically registers a default generator that will create a popup displaying a property name/value table based on the following options with the following order of precedence
  * **popup**: set on **entity.properties** or layer descriptor or in the **popup** property of component options
    * **pick**: array of property names to appear in the popup
    * **omit**: array of property names not to appear in the popup
    * **template**: [Lodash template](https://lodash.com/docs/#template) to generate popup content with `feature`, its `properties` and translation function `$t` as context
    * **html**: HTML content of the popup, if provided will override default display
    * **options**: Cesium [label options](https://cesium.com/learn/cesiumjs/ref-doc/LabelGraphics.html)

::: tip
If you want to disable a default popup configuration like `popup: { }` (i.e. display all properties) on a per-layer basis you have to explicitely unset it on your layer options using `popup: null` or `popup: false`.
:::

## Globe Tooltip

Make it possible to generate [Cesium labels](https://cesium.com/learn/cesiumjs/ref-doc/LabelGraphics.html) as tooltips based on GeoJson feature properties stored in entities. Use **register/unregisterStyle(`tooltip`, generator)** to (un)register a function **f(entity, options)** returning a [Cesium entity style object](https://cesium.com/learn/cesiumjs-learn/cesiumjs-creating-entities/)

The mixin automatically registers a default generator that will create a tooltip based on the following options with the following order of precedence
  * **tooltip**: set on **entity.properties** or layer descriptor or in the **tooltip** property of component options
    * **property**: property name to appear in the tooltip
    * **template**: [Lodash template](https://lodash.com/docs/#template) to generate tooltip content with `feature`, its `properties` and translation function `$t` as context
    * **html**: HTML content of the tooltip, if provided will override default display
    * **options**: Cesium [label options](https://cesium.com/learn/cesiumjs/ref-doc/LabelGraphics.html)

::: tip
If you want to disable a default tooltip configuration like `tooltip: { property: 'name' }` (i.e. display all properties) on a per-layer basis you have to explicitely unset it on your layer options using `tooltip: null` or `tooltip: false`.
:::

## GeoJson Layer

Make it possible to manage and style raw or time-based GeoJson map layers:
* **createCesiumGeoJsonLayer(options)** automatically registered GeoJson Cesium layer constructor
* **updateLayer(name, geoJson, options)** update underlying GeoJson data of a given layer, options like the following can also be added:
  * `removeMissing` when `true` it will remove given features from the layer, otherwise it will add new ones found and update matching ones based on the `featureId` property of the layer definition
  * `remove` when `true` it will remove given features from the layer based on the `featureId` property of the layer definition

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
* **wall** boolean set to `true` on a `LineString` will result in an additional [WallGraphics](https://cesium.com/learn/cesiumjs/ref-doc/WallGraphics.html), which uses the styling options of the feature
* **corridor** boolean set to `true` on a `LineString` will result in a [CorridorGraphics](https://cesium.com/learn/cesiumjs/ref-doc/CorridorGraphics.html) instead, which uses the styling options of the feature
* **geodesic** boolean set to `true` on a `Point` will result in a great circle represented as a [EllipseGraphics](https://cesium.com/learn/cesiumjs/ref-doc/EllipseGraphics.html), which **radius** must be specified in meters and uses the styling options of the feature
* **icon-text** string set on a `Point` will result in a [LabelGraphics](https://cesium.com/learn/cesiumjs/ref-doc/LabelGraphics.html) instead of a [BillboardGraphics](https://cesium.com/learn/cesiumjs/ref-doc/BillboardGraphics.html), which uses the styling options of the feature

![Geodesic feature type](../../.vitepress/public/images/great-circle-3D.png)

![Wall feature type](../../.vitepress/public/images/wall-3D.png)

There are a few additional specific geometry types that can be instanciated for features. When using these, they replace the 3d object used to display the feature in the scene, you can't use them in addition to some other geometries. You can instanciate:
* an **animated wall** using the following properties:
```js
feature.properties.entityStyle = {
    wall: {
        minimumHeights: 200,            // height (altitude) for lowest edge of wall, can be an array if per point altitude is required
        maximumHeights: 250,            // height (altitude) for highest edge of wall, can be an array if per point altitude is required
        animateMaterialAlongPath: true, // true to trigger material animation along wall geometry
        material: {
            image: '/iframe/arrow-green.png', // source for animated texture
            animationSpeed: 50,               // animation speed, in ‘units of scene’ per second
            scale: 2,                         // texture scale factor (default to 1), can be an array to specify x and y scale factors
                                              // if both factors are equal, texture aspect ratio is maintained on the geometry
            reverseAnimation: true,           // true to reverse animation (default false)
                                              // animation flows by default from first point of geometry to last
            translucent: true,                // set to true if the geometry with this material is expected to appear translucent
            useAsDiffuse: false               // set to true to use texture as diffuse color, will be emissive otherwise (default false)
        }
    }
}
```
* an **animated corridor** using the following properties:
```js
feature.properties.entityStyle = {
    corridor: {
        width: 200,                     // width, in units of scene, of the corridor
        height: 250,                    // height (altitude) for the corridor
        animateMaterialAlongPath: true, // true to trigger material animation along wall geometry
        material: {
            image: '/iframe/arrow-green.png', // source for animated texture
            animationSpeed: 50,               // animation speed, in ‘units of scene’ per second
            scale: 2,                         // texture scale factor (default to 1), can be an array to specify x and y scale factors
                                              // if both factors are equal, texture aspect ratio is maintained on the geometry
            reverseAnimation: true,           // true to reverse animation (default false)
                                              // animation flows by default from first point of geometry to last
            translucent: true,                // set to true if the geometry with this material is expected to appear translucent
            useAsDiffuse: false               // set to true to use texture as diffuse color, will be emissive otherwise (default false)
        }
    }
}
```

![Animated wall](../../.vitepress/public/images/animated-wall.gif)

> [!NOTE]
> The `animateMaterialAlongPath` property in the `wall` (or `corridor`) object will create a custom wall (or corridor) object, don’t expect it to behave like a regular CesiumJS [WallGraphics](https://cesium.com/learn/cesiumjs/ref-doc/WallGraphics.html) (or [CorridorGraphics](https://cesium.com/learn/cesiumjs/ref-doc/CorridorGraphics.html)) object.

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
