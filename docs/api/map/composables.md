# Composables

## useSelection

Used to setup a reactive store for selection features, similar to core [selection composable](../../api/core/composables#useselection) with the following additional options:
* **options** options to setup the store
  * **multiple**: key for multiple selection, defaults to `'ctrlKey'`
  * **buffer**: buffer selection width, default to `10` pixels
  * **boxSelection**: flag to enalbe selection by bbox, defaults to `true`
  * **clusterSelection**: flag to enable selection of all fatures of a cluster when selecting a cluster, defaults to `false`

The composable exposes the following additional elements:
* **has/getSelectedLocation()**: check/get the selected location if any (when not selecting a feature)
* **has/getSelectedLayer()**: check/get the layer of selected features(s) if any
* **has/getSelectedFeature()**, **has/getSelectedFeatureCollection()**: check for selected features(s) depending on selection mode
* **centerOnSelection()**: center current view on selected items
* **getWidgetForSelection()**: get widget corresponding to selected items, can be customized using the `widget` layer property, defaults to `'time-series'` for layer with variables or `'information-box'` otherwise

## useProbe

Used to setup a reactive store for probing at a specific location, call **useProbe()** with the following arguments:
* **name** unique store name within the application
* **options** options to setup the store

The composable exposes the following:
* **probe**: the created store object
* **clearProbe()**: reset probing content
* **has/getProbedLocation()**: check/get the selected probing location if any
* **has/getProbedLayer()**: check/get the layer of selected probing location if any
* **probeAtLocation()**: launch a probing action
* **centerOnProbe()**: center current view on probed location
* **getWidgetForProbe()**: get widget corresponding to probed location, defaults to `'time-series'`

## useHighlight

Used to setup a reactive store for storing highlights related to selected features, call **useHighlight()** with the following arguments:
* **name** unique store name within the application
* **options** options to setup the store
  * **updateDelay**: debounce delay to update highlight whenever selection changes
  * **asBbox**: flag to indicate if lines/polygons are highlighted using their respective bounding bonx; defaults to `false`
  * [map style properties](./map-mixins.md#dynamic-styling) to customize highlight rendering

The composable exposes the following:
* **highlights**: the created store object
* **clearHighlights()**: reset highlight content
* **has/getHighlight(feature, layer)**: check/get a given highlight if any
* **highlight(feature, layer)**: highlight a new feature
* **unhighlight(feature, layer)**: unhighlight a feature

Under-the-hood, highlights are managed using a [GeoJson layer](./map-mixins.md#geojson-layer).

## useProject

Used to manage a map project, call **useProject()** with the following arguments:
* **route**: flag indicating if project should be extracted from route otherwise it should be loaded manually
* **context**: context ID for the project service
* **updateActivity**: defaults to `true`
* **planetApi**: target api object

> Watches route change to track project ID

The composable exposes the following:
* **project**: the current project object
* **projectId**: the ID of the project to be loaded
* **hasProject()**: check if a project to be loaded is specified
* **isProjectLoaded()**: check if current project is loaded
* **loadProject()**: load project if any specified
* **catalogProjectQuery**: get query to retrieve layers from catalog for current project

## useCatalog

Used to manage data coming from a catalog, possibly defined through a map project, call **useCatalog()** with the following arguments:
* **layers**: default filter query applied when retrieving layers from catalog (defaults to `{}`)
* **categories**: default filter query applied when retrieving categories from catalog (defaults to `{}`)
* **sublegends**: default filter query applied when retrieving sublegends from catalog (defaults to `{}`)
* **views**: default filter query applied when retrieving views from catalog (defaults to `{}`)
* **context**: context ID for the project service (defaults to empty)
* **planetApi**: the [client](../core/application.md#client-setup) to be used to retrieve catalog data (defaults to application client)

The composable exposes the following:
* **getLayers()**: function to retrieved the set of layers from the catalog
* **layers**: the retrieved set of layers from the catalog
* **getCategories()**: function to retrieved the set of categories from the catalog
* **categories**: the retrieved set of categories from the catalog
* **getSublegends()**: function to retrieved the set of sublegends from the catalog
* **sublegends**: the retrieved set of sublegends from the catalog
* **layersByCategory**: the retrieved set of layers organized by category, i.e. keys are category names and values associated layers list
* **orphanLayers**: the retrieved set of layers not belonging to any category
* **getViews()**: function to retrieved the set of views from the catalog
* **views**: the retrieved set of views from the catalog

## Activity

### useActivity

Used to setup states and options for a new activity, similar to core [activity composable](../../api/core/composables#useactivity) with the following additional options:
* **name** unique activity name within the application
* **options** options to setup the activity
  * **probe** `true` to also create a probe store associated with the activity
  * **highlight** `true` to also create a highlight store associated with the activity

The composable exposes the following additional elements:
* elements exposed by the [selection composable](./composables#useselection) associated to the activity
* elements exposed by the [probe composable](./composables#useprobe) associated to the activity
* elements exposed by the [highlight composable](./composables#usehighlight) associated to the activity

### useCurrentActivity

Used to access the current activity, similar to core [activity composable](../../api/core/composables#useactivity) with the following additional options:
* **options** options to retrieve the activity
  * **probe** `true` to also retrieve the probe store associated with the activity
  * **highlight** `true` to also retrieve the highlight store associated with the activity

The composable exposes the following additional elements:
* **get/setActivityProject()**: get or switch the current project used by the current activity

