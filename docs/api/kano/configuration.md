# Configuration

The default frontend configuration file can be found [here](https://github.com/kalisio/kano/blob/master/config/default.js).
Most options come from the "standard" frontend [configuration](../../guides/basics/step-by-step.md#configuring-a-kapp) of KDK-based app, here are the main one:
* **appName**: displayed application name,
* **appLogo**: displayed application logo,
* **publisher**: 'Kalisio',
* **screens**: connection screens configuration
  * **banner**: displayed application banner,
  * **login**: login screen configuration
    * **providers**: array of OAuth2 providers to be used (like `['google', 'github']`),
    * **links**: links displayed at the bottom of the screen,
  * **logout**: logout screen configuration
    * **links**: links displayed at the bottom of the screen,
  * **changeEndpoint**: change endpoint screen configuration (only useful for mobile apps)
    * **links**: links displayed at the bottom of the screen,
* **layout**: layout configuration, see [Quasar docs](https://v0-14.quasar-framework.org/components/layout.html#Vue-Properties) for details,
* **sideNav**: side navigation component configuration
  * **banner**: displayed application banner,
  * **components**: key/value pairs of components displayed in side navigation (an entry looks like `user_actions: 'layout/KLinksPanel'`),
* **XXX**: configuration object for component YYY of e.g. side navigation
* **mapPanel**: 2D map layers panel configuration
    * **categories**: list of categories to be displayed in 2D map layers panel,
  * **globePanel**: 2D globe layers panel configuration
    * **categories**: list of categories to be displayed in 3D globe layers panel,
* **mapActivity**: 2D map activity configuration
  * **buttons**: active UI buttons among `['side-nav', 'panel']`,
  * **actions**: active UI action in FAB among `['fullscreen', 'geolocate', 'geocode', 'track-location', 'probe-location', 'create-layer']`,
* **globeActivity**: 3D globe activity configuration
  * **buttons**: active UI buttons among `['side-nav', 'panel']`,
  * **actions**: active UI action in FAB among `['fullscreen', 'geolocate', 'geocode', 'track-location', 'vr']`
* **map**: 2D map view configuration
	* **viewer**: 2D map initialization [options](https://leafletjs.com/reference.html#map-option),
	* **featureStyle**: default GeoJSON [layer style](../kmap/mixins.md#map-style) for polygons/lines,
	* **pointStyle**: default GeoJSON [layer style](../kmap/mixins.md#map-style) for points,
	* **popup**: default GeoJSON [popup style](../kmap/mixins.md#map-popup),
	* **tooltip**: default GeoJSON [tooltip style](../kmap/mixins.md#map-tooltip),
	* **cluster**: default GeoJSON [clustering style](../kmap/mixins.md#map-style),
	* **fileLayers**: default file layer [options](../kmap/mixins.md#file-layer),
* **globe**: 3D globe view configuration
	* **viewer**: 3D globe initialization [options](https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html#Viewer)
	* **fileLayers**: default file layer [options](../kmap/mixins.md#file-layer),
	* **featureStyle**: default GeoJSON [layer style](../kmap/mixins.md#globe-style) for polygons/lines/points,
	* **entityStyle**: default [entity style](../kmap/mixins.md#globe-style),
	* **tooltip**: default GeoJSON [tooltip style](../kmap/mixins.md#globe-tooltip),
	* **popup**: default GeoJSON [popup style](../kmap/mixins.md#globe-popup),
	* **clusterStyle**: default GeoJSON [clustering style](../kmap/mixins.md#globe-style),
	* **cluster**: default GeoJSON [cluster options](../kmap/mixins.md#globe-style)
