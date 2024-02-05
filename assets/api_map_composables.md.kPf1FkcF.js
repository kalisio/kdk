import{_ as e,c as t,o,V as i}from"./chunks/framework.MC2QjGNi.js";const b=JSON.parse('{"title":"Composables","description":"","frontmatter":{},"headers":[],"relativePath":"api/map/composables.md","filePath":"api/map/composables.md"}'),s={name:"api/map/composables.md"},l=i('<h1 id="composables" tabindex="-1">Composables <a class="header-anchor" href="#composables" aria-label="Permalink to &quot;Composables&quot;">​</a></h1><h2 id="useselection" tabindex="-1">useSelection <a class="header-anchor" href="#useselection" aria-label="Permalink to &quot;useSelection&quot;">​</a></h2><p>Used to setup a reactive store for selection features, similar to core <a href="./../../api/core/composables.html#useselection">selection composable</a> with the following additional options:</p><ul><li><strong>options</strong> options to setup the store <ul><li><strong>multiple</strong>: key for multiple selection, defaults to <code>&#39;ctrlKey&#39;</code></li><li><strong>buffer</strong>: buffer selection width, default to <code>10</code> pixels</li><li><strong>boxSelection</strong>: flag to enalbe selection by bbox, defaults to <code>true</code></li><li><strong>clusterSelection</strong>: flag to enable selection of all fatures of a cluster when selecting a cluster, defaults to <code>false</code></li></ul></li></ul><p>The composable exposes the following additional elements:</p><ul><li><strong>has/getSelectedLocation()</strong>: check/get the selected location if any (when not selecting a feature)</li><li><strong>has/getSelectedLayer()</strong>: check/get the layer of selected features(s) if any</li><li><strong>has/getSelectedFeature()</strong>, <strong>has/getSelectedFeatureCollection()</strong>: check for selected features(s) depending on selection mode</li><li><strong>centerOnSelection()</strong>: center current view on selected items</li><li><strong>getWidgetForSelection()</strong>: get widget corresponding to selected items, can be customized using the <code>widget</code> layer property, defaults to <code>&#39;time-series&#39;</code> for layer with variables or <code>&#39;information-box&#39;</code> otherwise</li></ul><h2 id="useprobe" tabindex="-1">useProbe <a class="header-anchor" href="#useprobe" aria-label="Permalink to &quot;useProbe&quot;">​</a></h2><p>Used to setup a reactive store for probing at a specific location, call <strong>useProbe()</strong> with the following arguments:</p><ul><li><strong>name</strong> unique store name within the application</li><li><strong>options</strong> options to setup the store</li></ul><p>The composable exposes the following:</p><ul><li><strong>probe</strong>: the created store object</li><li><strong>clearProbe()</strong>: reset probing content</li><li><strong>has/getProbedLocation()</strong>: check/get the selected probing location if any</li><li><strong>has/getProbedLayer()</strong>: check/get the layer of selected probing location if any</li><li><strong>probeAtLocation()</strong>: launch a probing action</li><li><strong>centerOnProbe()</strong>: center current view on probed location</li><li><strong>getWidgetForProbe()</strong>: get widget corresponding to probed location, defaults to <code>&#39;time-series&#39;</code></li></ul><h2 id="usehighlight" tabindex="-1">useHighlight <a class="header-anchor" href="#usehighlight" aria-label="Permalink to &quot;useHighlight&quot;">​</a></h2><p>Used to setup a reactive store for storing highlights related to selected features, call <strong>useHighlight()</strong> with the following arguments:</p><ul><li><strong>name</strong> unique store name within the application</li><li><strong>options</strong> options to setup the store <ul><li><strong>updateDelay</strong>: debounce delay to update highlight whenever selection changes</li><li><strong>asBbox</strong>: flag to indicate if lines/polygons are highlighted using their respective bounding bonx; defaults to <code>false</code></li><li><a href="./map-mixins.html#dynamic-styling">map style properties</a> to customize highlight rendering</li></ul></li></ul><p>The composable exposes the following:</p><ul><li><strong>highlights</strong>: the created store object</li><li><strong>clearHighlights()</strong>: reset highlight content</li><li><strong>has/getHighlight(feature, layer)</strong>: check/get a given highlight if any</li><li><strong>highlight(feature, layer)</strong>: highlight a new feature</li><li><strong>unhighlight(feature, layer)</strong>: unhighlight a feature</li></ul><p>Under-the-hood, highlights are managed using a <a href="./map-mixins.html#geojson-layer">GeoJson layer</a>.</p><h2 id="useproject" tabindex="-1">useProject <a class="header-anchor" href="#useproject" aria-label="Permalink to &quot;useProject&quot;">​</a></h2><p>Used to manage a map project, call <strong>useProject()</strong> with the following arguments:</p><ul><li><strong>route</strong> flag indicating if project should be extracted from route otherwise it should be loaded manually</li><li><strong>context</strong> context ID for the project service</li><li><strong>updateActivity</strong>: defaults to <code>true</code></li><li><strong>planetApi</strong>: target api object</li></ul><blockquote><p>Watches route change to track project ID</p></blockquote><p>The composable exposes the following:</p><ul><li><strong>project</strong>: the current project object</li><li><strong>projectId</strong>: the ID of the project to be loaded</li><li><strong>hasProject()</strong>: check if a project to be loaded is specified</li><li><strong>isProjectLoaded()</strong>: check if current project is loaded</li><li><strong>loadProject()</strong>: load project if any specified</li><li><strong>catalogProjectQuery</strong>: get query to retrieve layers from catalog for current project</li></ul><h2 id="activity" tabindex="-1">Activity <a class="header-anchor" href="#activity" aria-label="Permalink to &quot;Activity&quot;">​</a></h2><h3 id="useactivity" tabindex="-1">useActivity <a class="header-anchor" href="#useactivity" aria-label="Permalink to &quot;useActivity&quot;">​</a></h3><p>Used to setup states and options for a new activity, similar to core <a href="./../../api/core/composables.html#useactivity">activity composable</a> with the following additional options:</p><ul><li><strong>name</strong> unique activity name within the application</li><li><strong>options</strong> options to setup the activity <ul><li><strong>probe</strong> <code>true</code> to also create a probe store associated with the activity</li><li><strong>highlight</strong> <code>true</code> to also create a highlight store associated with the activity</li></ul></li></ul><p>The composable exposes the following additional elements:</p><ul><li>elements exposed by the <a href="./composables.html#useselection">selection composable</a> associated to the activity</li><li>elements exposed by the <a href="./composables.html#useprobe">probe composable</a> associated to the activity</li><li>elements exposed by the <a href="./composables.html#usehighlight">highlight composable</a> associated to the activity</li></ul><h3 id="usecurrentactivity" tabindex="-1">useCurrentActivity <a class="header-anchor" href="#usecurrentactivity" aria-label="Permalink to &quot;useCurrentActivity&quot;">​</a></h3><p>Used to access the current activity, similar to core <a href="./../../api/core/composables.html#useactivity">activity composable</a> with the following additional options:</p><ul><li><strong>options</strong> options to retrieve the activity <ul><li><strong>probe</strong> <code>true</code> to also retrieve the probe store associated with the activity</li><li><strong>highlight</strong> <code>true</code> to also retrieve the highlight store associated with the activity</li></ul></li></ul><p>The composable exposes the following additional elements:</p><ul><li><strong>get/setActivityProject()</strong>: get or switch the current project used by the current activity</li></ul>',34),r=[l];function a(n,c,h,g,u,p){return o(),t("div",null,r)}const f=e(s,[["render",a]]);export{b as __pageData,f as default};
