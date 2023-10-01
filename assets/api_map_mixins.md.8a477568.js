import{_ as e,o as s,c as a,Q as t}from"./chunks/framework.70a39c86.js";const u=JSON.parse('{"title":"Mixins","description":"","frontmatter":{},"headers":[],"relativePath":"api/map/mixins.md","filePath":"api/map/mixins.md"}'),o={name:"api/map/mixins.md"},n=t(`<h1 id="mixins" tabindex="-1">Mixins <a class="header-anchor" href="#mixins" aria-label="Permalink to &quot;Mixins&quot;">​</a></h1><h2 id="navigator" tabindex="-1">Navigator <a class="header-anchor" href="#navigator" aria-label="Permalink to &quot;Navigator&quot;">​</a></h2><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>Only available on mobile devices</p></div><p>Allow to launch native route navigation apps to go to a given location (the <a href="https://github.com/dpa99c/phonegap-launch-navigator" target="_blank" rel="noreferrer">launch navigator cordova plugin</a> is used under-the-hood):</p><ul><li><strong>canNavigate()</strong> check if navigation is possible (mobile device and navigation app installed)</li><li><strong>navigate(longitude, latitude)</strong> launches native route navigation app for the given location</li></ul><h2 id="style" tabindex="-1">Style <a class="header-anchor" href="#style" aria-label="Permalink to &quot;Style&quot;">​</a></h2><p>Used to add styling to layers on your 2D and 3D activities:</p><ul><li><strong>register/unregisterStyle (type, generator)</strong> (un)registers the function to create the style object as per the input type (e.g. <code>markerStyle</code>, <code>featureStyle</code>, <code>popup</code>, <code>infobox</code> or <code>tooltip</code>)</li></ul><p>The generator signature and return type depends on the mapping engine, please refer to specific map or globe mixins for more details.</p><h2 id="infobox" tabindex="-1">Infobox <a class="header-anchor" href="#infobox" aria-label="Permalink to &quot;Infobox&quot;">​</a></h2><p>Used to add <a href="./../map/components.html#infobox">information box</a> style to your 2D and 3D activities. This makes it possible to display metadata provided as GeoJson feature properties.</p><p>Use <strong>register/unregisterStyle(<code>infobox</code>, generator)</strong> to (un)register a function <strong>f(feature, options)</strong> returning the feature properties to be displayed. The mixin automatically registers a default generator that will create an information box displaying a property name/value table based on the following options with the following order of precedence</p><ul><li><strong>infobox</strong>: set on <strong>feature.properties</strong> or layer descriptor or in the <strong>infobox</strong> property of component options <ul><li><strong>pick</strong>: array of property names to appear in the information box</li><li><strong>omit</strong>: array of property names not to appear in the information box</li></ul></li></ul><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>If you want to disable a default information box configuration like <code>infobox: { }</code> (i.e. display all properties) on a per-layer basis you have to explicitely unset it on your layer options using <code>infobox: null</code> or <code>infobox: false</code>.</p></div><h2 id="feature-selection" tabindex="-1">Feature Selection <a class="header-anchor" href="#feature-selection" aria-label="Permalink to &quot;Feature Selection&quot;">​</a></h2><p>Used to support feature selection on your 2D and 3D activities. A selected feature will be automtically highlighted on the map and (un)selecting a feature will automatically (hide) show <a href="./../map/components.html#widgets">map widgets</a>.</p><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>If you&#39;d like to make your features unselectable simply create your layer with the <code>isSelectable</code> property set to <code>false</code>.</p></div><h2 id="feature-service" tabindex="-1">Feature Service <a class="header-anchor" href="#feature-service" aria-label="Permalink to &quot;Feature Service&quot;">​</a></h2><p>Ease requests to a <a href="./services.html#feature-service">feature service</a> in order to get real-time updates and edit features:</p><ul><li><strong>getProbeFeatures(options)</strong> retrieve the probe locations (if any) for a given <a href="./services.html#catalog-service">catalog layer descriptor</a> to initialize the feature layer</li><li><strong>getProbeFeaturesFromLayer(name)</strong> same as above but using the layer name</li><li><strong>getFeatures(options, queryInterval)</strong> get the latest available features for a given <a href="./services.html#catalog-service">catalog layer descriptor</a> at current time or in a given elapsed time range if a query interval in milliseconds is given</li><li><strong>getFeaturesFromLayer(name, queryInterval)</strong> same as above but using the layer name</li><li><strong>getMeasureForFeature(options, feature, startTime, endTime)</strong> get the available probe measures for a given <a href="./services.html#catalog-service">catalog layer descriptor</a> in the given time range, will store result in <code>probedLocation</code> attribute and emits the <code>probed-location-changed</code> event</li><li><strong>getProbedLocationMeasureAtCurrentTime()</strong> computes measure values at current time (see <a href="./mixins.html#time">time mixin</a>) once a location has been probed</li><li><strong>createFeatures(geoJson, layerId)</strong> creates a new set of features in feature service associated to the target layer based on input GeoJson</li><li><strong>editFeaturesGeometry(geoJson)</strong> edits the geometry of a set of features in feature service based on input GeoJson</li><li><strong>editFeaturesProperties(geoJson)</strong> edits the properties of a set of features in feature service based on input GeoJson</li><li><strong>removeFeatures(geoJsonOrLayerId)</strong> removes a set of features in feature service based on input GeoJson or all features associated to the target layer if any</li></ul><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>Please refer to <a href="./services.html#time-based-feature-aggregation">feature service API</a> for more details on measure aggregation.</p></div><h2 id="weacast" tabindex="-1">Weacast <a class="header-anchor" href="#weacast" aria-label="Permalink to &quot;Weacast&quot;">​</a></h2><p>Make it easier to integrate with <a href="https://weacast.github.io/weacast-docs/" target="_blank" rel="noreferrer">Weacast</a>:</p><ul><li><strong>setupWeacast(config)</strong> initializes a <a href="https://weacast.github.io/weacast-docs/api/application.html#client-setup" target="_blank" rel="noreferrer">Weacast client</a> in the <code>weacastApi</code> property</li><li><strong>setupForecastModels()</strong> retrieve available <a href="https://weacast.github.io/weacast-docs/architecture/main-concepts.html#forecast-model" target="_blank" rel="noreferrer">forecast models</a> from <a href="https://weacast.github.io/weacast-docs/api/forecast.html" target="_blank" rel="noreferrer">Weacast API</a></li><li><strong>setForecastModel(model)</strong> updates the current <a href="https://weacast.github.io/weacast-docs/architecture/main-concepts.html#forecast-model" target="_blank" rel="noreferrer">forecast model</a> and emits the <code>forecast-model-changed</code> event</li><li><strong>setForecastLevel(level)</strong> updates the current forecast level and emits the <code>forecast-level-changed</code> event</li><li><strong>getForecastForLocation(long, lat, startTime, endTime)</strong> helper function to dynamically probe weather elements at a given location in a given time range using the <a href="https://weacast.github.io/weacast-docs/api/probe.html#probes-api" target="_blank" rel="noreferrer">Weacast API</a></li><li><strong>getForecastForFeature(featureId, startTime, endTime)</strong> helper function to get weather element at static probe location in a given time range using the <a href="https://weacast.github.io/weacast-docs/api/probe.html#probe-results-api" target="_blank" rel="noreferrer">Weacast API</a></li><li><strong>getProbedLocationForecastAtCurrentTime()</strong> computes element values at current time (see <a href="./mixins.html#time">time mixin</a>) once a location has been probed (dynamically or statically)</li><li><strong>getProbedLocationForecastMarker(feature, latlng)</strong> generates a marker using a <a href="http://weather.rap.ucar.edu/info/about_windbarb.html" target="_blank" rel="noreferrer">wind barb</a> according to element values in feature</li></ul><p>This mixin also adds the following internal data properties:</p><ul><li><strong>forecastModel</strong>: currently selected forecast model</li><li><strong>forecastModels</strong>: list of available forecast models</li><li><strong>forecastLevel</strong>: currently selected forecast level</li></ul><p>The currently selected forecast level or the list of available forecast levels is managed through the <a href="./mixins.html#levels">levels mixin</a>.</p><p>Here is an example of a forecast levels description object:</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">name</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&#39;pressure&#39;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">label</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&#39;Pression&#39;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">units</span><span style="color:#E1E4E8;">: [</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#9ECBFF;">&#39;mb&#39;</span></span>
<span class="line"><span style="color:#E1E4E8;">  ],</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">values</span><span style="color:#E1E4E8;">: [ </span><span style="color:#79B8FF;">1000</span><span style="color:#E1E4E8;">, </span><span style="color:#79B8FF;">700</span><span style="color:#E1E4E8;">, </span><span style="color:#79B8FF;">450</span><span style="color:#E1E4E8;">, </span><span style="color:#79B8FF;">300</span><span style="color:#E1E4E8;">, </span><span style="color:#79B8FF;">200</span><span style="color:#E1E4E8;"> ]</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">name</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&#39;pressure&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">label</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&#39;Pression&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">units</span><span style="color:#24292E;">: [</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#032F62;">&#39;mb&#39;</span></span>
<span class="line"><span style="color:#24292E;">  ],</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">values</span><span style="color:#24292E;">: [ </span><span style="color:#005CC5;">1000</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">700</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">450</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">300</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">200</span><span style="color:#24292E;"> ]</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p>Note that in Weacast all meteorological elements are assumed to be atomic, i.e. each element is a 2D longitude/latitude grid of scalar values, there is no forecast level. As a consequence each forecast level will be associated to a different element in the Weacast configuration. This means that the forecast level is a pure construction of the KDK based on the following convention: if a forecast layer descriptor for an element named <code>gust</code> contains a list of forecast levels like <code>[ 1000, 700, 450, 300, 200 ]</code> then it is assumed that Weacast will provide the atomic elements named <code>gust-1000</code>, <code>gust-700</code>, <code>gust-450</code>, <code>gust-300</code>, <code>gust-200</code>. The right one will be retrieved according to currently selected forecast level using the pattern <code>element_name-forecast_level</code>.</p><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>The mixin will automatically update forecast time whenever the current time is changed in the activity</p></div><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>If no config options are provided when initializing Weacast it is assumed that it runs as a backend service acccessible through <a href="https://github.com/kalisio/feathers-distributed" target="_blank" rel="noreferrer">feathers-distributed</a></p></div><h2 id="time" tabindex="-1">Time <a class="header-anchor" href="#time" aria-label="Permalink to &quot;Time&quot;">​</a></h2><p>Ease management of time-based component:</p><ul><li><strong>setCurrentTime(datetime)</strong> change the current time to the given one and ensure it is internally stored as a UTC <a href="https://momentjs.com/" target="_blank" rel="noreferrer">moment</a> object to avoid any confusion, emits the <code>current-time-changed</code> event</li><li><strong>setTimeFormat(format)</strong> change the formats used to display date/time, each format is based on <a href="https://momentjs.com/docs/#/displaying/format/" target="_blank" rel="noreferrer">moment</a> display options and the object is structured like this <ul><li><strong>time</strong><ul><li><strong>short</strong>: display format for time in &quot;short&quot; form</li><li><strong>long</strong>: display format for time in &quot;long&quot; form</li></ul></li><li><strong>date</strong><ul><li><strong>short</strong>: display format for date in &quot;short&quot; form</li><li><strong>long</strong>: display format for date in &quot;long&quot; form</li></ul></li><li><strong>year</strong><ul><li><strong>short</strong>: display format for year in &quot;short&quot; form</li><li><strong>long</strong>: display format for year in &quot;long&quot; form</li></ul></li><li><strong>utc</strong>: boolean indicating if date/time should be displayed in UTC or according to user&#39;s locale</li><li><strong>locale</strong>: the user&#39;s locale to be used when not displaying date/time in UTC</li></ul></li><li><strong>formatTime(format, datetime)</strong>: get the formatted date/time for display according to current format settings, if no date/time given the current one set in component will be used. The format is the path to the actual format in the format object, e.g. <code>formatTime(&#39;time.short&#39;)</code> to get a formatted time in short form. The <code>iso</code> path is reserved for <a href="https://en.wikipedia.org/wiki/ISO_8601" target="_blank" rel="noreferrer">ISO 8601</a> display.</li></ul><p>Here is an example of a format object:</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">time</span><span style="color:#E1E4E8;">: {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#B392F0;">short</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&#39;H[h]&#39;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#B392F0;">long</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&#39;HH:mm&#39;</span></span>
<span class="line"><span style="color:#E1E4E8;">  },</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">date</span><span style="color:#E1E4E8;">: {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#B392F0;">short</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&#39;DD/MM&#39;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#B392F0;">long</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&#39;dddd D&#39;</span></span>
<span class="line"><span style="color:#E1E4E8;">  },</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">year</span><span style="color:#E1E4E8;">: {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#B392F0;">short</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&#39;YY&#39;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#B392F0;">long</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&#39;YYYY&#39;</span></span>
<span class="line"><span style="color:#E1E4E8;">  },</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">utc</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">true</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">locale</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&#39;en&#39;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">time</span><span style="color:#24292E;">: {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">short</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&#39;H[h]&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">long</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&#39;HH:mm&#39;</span></span>
<span class="line"><span style="color:#24292E;">  },</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">date</span><span style="color:#24292E;">: {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">short</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&#39;DD/MM&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">long</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&#39;dddd D&#39;</span></span>
<span class="line"><span style="color:#24292E;">  },</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">year</span><span style="color:#24292E;">: {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">short</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&#39;YY&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">long</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&#39;YYYY&#39;</span></span>
<span class="line"><span style="color:#24292E;">  },</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">utc</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">true</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">locale</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&#39;en&#39;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>The mixin is in sync with the <code>timeFormat</code> property of the <a href="./../core/application.html#store">global store</a> so that you can have a shared data/time display format accross all time-based components with a dedicated UI to change settings using e.g. <code>store.patch(&#39;timeFormat&#39;, { locale, utc })</code>.</p></div><p>This mixin also adds the following internal data properties:</p><ul><li><strong>currentTime</strong>: current time as UTC <a href="https://momentjs.com/" target="_blank" rel="noreferrer">moment</a> object</li><li><strong>currentTimeFormat</strong>: current format object to be used for display</li><li><strong>currentFormattedTime</strong>: same structure as the format object but contains ready-to-display values of the current time, e.g. <code>currentFormattedTime.time.short</code> will give you the formatted time string in short form according to current format settings.</li></ul><h2 id="activity" tabindex="-1">Activity <a class="header-anchor" href="#activity" aria-label="Permalink to &quot;Activity&quot;">​</a></h2><p>Make it easier to create 2D/3D mapping activities by providing methods available in both cases:</p><ul><li><strong>initialize()</strong> setup view, Weacast, layers and timeline, <strong>should be called first before any other method</strong></li><li><strong>registerActivityActions()</strong> register default activity actions (fullscreen mode, geolocation, geocoding, tracking, probing, etc.)</li><li><strong>getCatalogLayers()</strong> retrieve available <a href="./services.html#catalog-service">catalog layer descriptors</a></li><li><strong>refreshLayers()</strong> setup available layers based on <a href="./services.html#catalog-service">catalog layer descriptors</a></li><li><strong>registerLayerActions(layer)</strong> register default layer actions (zoom, save, edit, edit data, remove, etc.)</li><li><strong>isLayerStorable/Removable/Editable(layer)</strong> helper function to get the state of a given layer descriptor</li><li><strong>onLayerAdded(layer)</strong> layer action handler that will setup available action on layer</li><li><strong>onTriggerLayer(layer)</strong> trigger action handler that will hide/show a given layer</li><li><strong>onZoomToLayer(layer)</strong> zoom action handler that will zoom to a given layer</li><li><strong>onCreateLayer()</strong> create layer action handler that will open an <a href="./../core/components.html#editors">editor</a> to define layer properties</li><li><strong>onSaveLayer(layer)</strong> save action handler that will persist a given in-memory layer to persistent storage provided by a <a href="./services.html#feature-service">feature service</a></li><li><strong>onEditLayer(layer)</strong> edit action handler that will open an <a href="./../core/components.html#editors">editor</a> to change layer properties</li><li><strong>onEditLayerData(layer)</strong> edit data action handler that will (de)activate <a href="https://leaflet.github.io/Leaflet.draw/docs/leaflet-draw-latest.html" target="_blank" rel="noreferrer">feature edition mode</a> to update layer features geometry and properties</li><li><strong>onRemoveLayer(layer)</strong> remove action handler that will ask for confirmation before removing a persisted layer</li><li><strong>onGeocoding()</strong> geocoding action handler that will open a dialog to search for a location to go to</li><li><strong>onGeolocate()</strong> geolocation action handler that will launch a user&#39;s position lookup and go to found user&#39;s location</li><li><strong>onTrackLocation()</strong> location tracking action handler that will enable/disable a location indicator to display location values</li></ul><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>This mixin has to be initialized by providing a unique component/activity name like <code>mixins.activity(&#39;map&#39;)</code>. Indeed, the name is then used to retrieve the configuration associated with the activity from the global frontend <a href="./../../guides/basics/step-by-step.html#configuring-a-kapp">configuration</a> according to the following properties:</p><ul><li><strong>{name}</strong>: 2D/3D view configuration</li><li><strong>[name}Panel</strong>: 2D/3D layers panel configuration</li><li><strong>[name}Activity</strong>: 2D/3D activity configuration See e.g. <a href="./../kano/configuration.html">Kano configuration options</a> for more details.</li></ul></div><p>This mixin also adds the following internal data properties: variables</p><ul><li><strong>variables</strong> the set of available variables in catalog layers</li><li><strong>probedLocation</strong> the currently probed location feature (weather or measurement)</li></ul><h2 id="context" tabindex="-1">Context <a class="header-anchor" href="#context" aria-label="Permalink to &quot;Context&quot;">​</a></h2><p>Used to be able to restore the user&#39;s context, i.e. view extent and active layers, in 2D/3D mapping activities by providing methods available in both cases:</p><ul><li><strong>storeContext(context)</strong> stores current context as route (query) parameters and persists as well in local storage</li><li><strong>restoreContext(context)</strong> restores previously stored context from local storage, catalog (if a default one has been saved) or route (query) parameters</li><li><strong>clearContext(context)</strong> clears the stored context so that it will not be restored anymore</li><li><strong>getRouteContext(context)</strong> gets the context parameters from current route (from either parameters or query)</li><li><strong>updateRouteContext(context)</strong> sets the context parameters on the current route (from either parameters or query)</li><li><strong>saveContext (context)</strong> saves the context in the catalog</li><li><strong>loadContext (context)</strong> sets the context from either the given parameters or the catalog (if context is an ID or a name)</li></ul><p>At the present time two types of context are supported, although the system is flexible enough to easily add a new type:</p><ul><li><code>view</code> to restore current view bounds stored as route parameters</li><li><code>layers</code> to restore currently active layers in catalog stored as route query parameters</li></ul><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>The mixin is in sync with the <code>restore.context</code> (context being either <code>view</code> or <code>layers</code>) property of the <a href="./../core/application.html#store">global store</a> so that you can have a shared restoration flag accross all mapping components with a dedicated UI to change settings using e.g. <code>store.patch(&#39;restore.view&#39;, true)</code>. This can be overriden by a similar property on the activity configuration if you&#39;d like to disable context restoration on a particular activity.</p></div><h2 id="levels" tabindex="-1">Levels <a class="header-anchor" href="#levels" aria-label="Permalink to &quot;Levels&quot;">​</a></h2><p>Allow to configure the <a href="./components.html#level-slider"><strong>k-level-slider</strong> component</a>. The slider is associated with a layer and is only shown when properly configured. When the selected value changes, the <code>selected-level-changed</code> event is broadcasted.</p><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>The level slider is global, meaning that there&#39;s only one instance of the slider, and it is shared by every layer.</p></div><p>To configure the slider, we use an object with the following properties:</p><ul><li><strong>label</strong>: defines the slider label which will be displayed by the k-level-slider component.</li><li><strong>units</strong>: an array defining the unit of the value we&#39;re manipulating. Currently we only care about <code>units[0]</code>.</li><li><strong>values</strong>: an array defining the discrete values the level can take.</li><li><strong>range</strong>: an object defining a continuous range of values: <ul><li><strong>min</strong>: the minimum value</li><li><strong>max</strong>: the maximum value</li><li><strong>interval</strong>: the interval to use between <code>min</code> and <code>max</code>, 1 by default if not specified</li></ul></li><li><strong>lazy</strong>: a boolean indicating if <code>setSelectedLevel</code> is called as the slider moves (when <code>false</code>) or if it is only called when the slider is released (when <code>true</code>).</li></ul><p>Here is an example of a configuration object:</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">{</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">label</span><span style="color:#E1E4E8;">: </span><span style="color:#9ECBFF;">&#39;Temperature&#39;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">units</span><span style="color:#E1E4E8;">: [</span><span style="color:#9ECBFF;">&#39;degC&#39;</span><span style="color:#E1E4E8;">],</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">lazy</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">false</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#B392F0;">range</span><span style="color:#E1E4E8;">: {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#B392F0;">min</span><span style="color:#E1E4E8;">: </span><span style="color:#F97583;">-</span><span style="color:#79B8FF;">10</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#B392F0;">max</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">10</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#B392F0;">interval</span><span style="color:#E1E4E8;">: </span><span style="color:#79B8FF;">2</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#6A737D;">/* or only some specific values</span></span>
<span class="line"><span style="color:#6A737D;">  values: [ -10, -8, 0, 4, 9 ]</span></span>
<span class="line"><span style="color:#6A737D;">  */</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">{</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">label</span><span style="color:#24292E;">: </span><span style="color:#032F62;">&#39;Temperature&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">units</span><span style="color:#24292E;">: [</span><span style="color:#032F62;">&#39;degC&#39;</span><span style="color:#24292E;">],</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">lazy</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">false</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6F42C1;">range</span><span style="color:#24292E;">: {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">min</span><span style="color:#24292E;">: </span><span style="color:#D73A49;">-</span><span style="color:#005CC5;">10</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">max</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">10</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6F42C1;">interval</span><span style="color:#24292E;">: </span><span style="color:#005CC5;">2</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#6A737D;">/* or only some specific values</span></span>
<span class="line"><span style="color:#6A737D;">  values: [ -10, -8, 0, 4, 9 ]</span></span>
<span class="line"><span style="color:#6A737D;">  */</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p>The mixin adds the following functions:</p><ul><li><strong>setSelectableLevels(layer, levels, initialLevel)</strong> : defines the layer the slider is currently associated to, configures the selectable levels and sets the initial level.</li><li><strong>clearSelectableLevels(layer)</strong> : clears the slider definition associated with the layer. This function will only clear the slider configuration if the current layer associated with the slider is the same as the <code>layer</code> argument.</li><li><strong>setSelectedLevel(level)</strong> : selects a level value and broadcasts the <code>selected-level-changed</code> event. This is the function that is called when the slider moves.</li></ul><p>This mixin also adds the following internal data properties:</p><ul><li><strong>selectedLevel</strong>: the currently selected level value.</li><li><strong>selectableLevels</strong>: the current slider configuration object.</li></ul>`,63),l=[n];function r(i,p,c,d,g,h){return s(),a("div",null,l)}const m=e(o,[["render",r]]);export{u as __pageData,m as default};