(window.webpackJsonp=window.webpackJsonp||[]).push([[35],{565:function(e,t,a){"use strict";a.r(t);var r=a(13),o=Object(r.a)({},(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[a("h1",{attrs:{id:"mixins"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#mixins"}},[e._v("#")]),e._v(" Mixins")]),e._v(" "),a("h2",{attrs:{id:"navigator"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#navigator"}},[e._v("#")]),e._v(" Navigator")]),e._v(" "),a("div",{staticClass:"custom-block warning"},[a("p",{staticClass:"custom-block-title"},[e._v("WARNING")]),e._v(" "),a("p",[e._v("Only available on mobile devices")])]),e._v(" "),a("p",[e._v("Allow to launch native route navigation apps to go to a given location (the "),a("a",{attrs:{href:"https://github.com/dpa99c/phonegap-launch-navigator",target:"_blank",rel:"noopener noreferrer"}},[e._v("launch navigator cordova plugin"),a("OutboundLink")],1),e._v(" is used under-the-hood):")]),e._v(" "),a("ul",[a("li",[a("strong",[e._v("canNavigate()")]),e._v(" check if navigation is possible (mobile device and navigation app installed)")]),e._v(" "),a("li",[a("strong",[e._v("navigate(longitude, latitude)")]),e._v(" launches native route navigation app for the given location")])]),e._v(" "),a("h2",{attrs:{id:"style"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#style"}},[e._v("#")]),e._v(" Style")]),e._v(" "),a("p",[e._v("Used to add styling to layers on your 2D and 3D activities:")]),e._v(" "),a("ul",[a("li",[a("strong",[e._v("register/unregisterStyle (type, generator)")]),e._v(" (un)registers the function to create the style object as per the input type (e.g. "),a("code",[e._v("markerStyle")]),e._v(", "),a("code",[e._v("featureStyle")]),e._v(", "),a("code",[e._v("popup")]),e._v(", "),a("code",[e._v("infobox")]),e._v(" or "),a("code",[e._v("tooltip")]),e._v(")")])]),e._v(" "),a("p",[e._v("The generator signature and return type depends on the mapping engine, please refer to specific map or globe mixins for more details.")]),e._v(" "),a("h2",{attrs:{id:"infobox"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#infobox"}},[e._v("#")]),e._v(" Infobox")]),e._v(" "),a("p",[e._v("Used to add "),a("RouterLink",{attrs:{to:"/api/map/components.html#infobox"}},[e._v("information box")]),e._v(" style to your 2D and 3D activities. This makes it possible to display metadata provided as GeoJson feature properties.")],1),e._v(" "),a("p",[e._v("Use "),a("strong",[e._v("register/unregisterStyle("),a("code",[e._v("infobox")]),e._v(", generator)")]),e._v(" to (un)register a function "),a("strong",[e._v("f(feature, options)")]),e._v(" returning the feature properties to be displayed. The mixin automatically registers a default generator that will create an information box displaying a property name/value table based on the following options with the following order of precedence")]),e._v(" "),a("ul",[a("li",[a("strong",[e._v("infobox")]),e._v(": set on "),a("strong",[e._v("feature.properties")]),e._v(" or layer descriptor or in the "),a("strong",[e._v("infobox")]),e._v(" property of component options\n"),a("ul",[a("li",[a("strong",[e._v("pick")]),e._v(": array of property names to appear in the information box")]),e._v(" "),a("li",[a("strong",[e._v("omit")]),e._v(": array of property names not to appear in the information box")])])])]),e._v(" "),a("div",{staticClass:"custom-block tip"},[a("p",{staticClass:"custom-block-title"},[e._v("TIP")]),e._v(" "),a("p",[e._v("If you want to disable a default information box configuration like "),a("code",[e._v("infobox: { }")]),e._v(" (i.e. display all properties) on a per-layer basis you have to explicitely unset it on your layer options using "),a("code",[e._v("infobox: null")]),e._v(" or "),a("code",[e._v("infobox: false")]),e._v(".")])]),e._v(" "),a("h2",{attrs:{id:"feature-selection"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#feature-selection"}},[e._v("#")]),e._v(" Feature Selection")]),e._v(" "),a("p",[e._v("Used to support feature selection on your 2D and 3D activities. A selected feature will be automtically highlighted on the map and (un)selecting a feature will automatically (hide) show "),a("RouterLink",{attrs:{to:"/api/map/components.html#widgets"}},[e._v("map widgets")]),e._v(".")],1),e._v(" "),a("div",{staticClass:"custom-block tip"},[a("p",{staticClass:"custom-block-title"},[e._v("TIP")]),e._v(" "),a("p",[e._v("If you'd like to make your features unselectable simply create your layer with the "),a("code",[e._v("isSelectable")]),e._v(" property set to "),a("code",[e._v("false")]),e._v(".")])]),e._v(" "),a("h2",{attrs:{id:"feature-service"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#feature-service"}},[e._v("#")]),e._v(" Feature Service")]),e._v(" "),a("p",[e._v("Ease requests to a "),a("RouterLink",{attrs:{to:"/api/map/services.html#feature-service"}},[e._v("feature service")]),e._v(" in order to get real-time updates and edit features:")],1),e._v(" "),a("ul",[a("li",[a("strong",[e._v("getProbeFeatures(options)")]),e._v(" retrieve the probe locations (if any) for a given "),a("RouterLink",{attrs:{to:"/api/map/services.html#catalog-service"}},[e._v("catalog layer descriptor")]),e._v(" to initialize the feature layer")],1),e._v(" "),a("li",[a("strong",[e._v("getProbeFeaturesFromLayer(name)")]),e._v(" same as above but using the layer name")]),e._v(" "),a("li",[a("strong",[e._v("getFeatures(options, queryInterval)")]),e._v(" get the latest available features for a given "),a("RouterLink",{attrs:{to:"/api/map/services.html#catalog-service"}},[e._v("catalog layer descriptor")]),e._v(" at current time or in a given elapsed time range if a query interval in milliseconds is given")],1),e._v(" "),a("li",[a("strong",[e._v("getFeaturesFromLayer(name, queryInterval)")]),e._v(" same as above but using the layer name")]),e._v(" "),a("li",[a("strong",[e._v("getMeasureForFeature(options, feature, startTime, endTime)")]),e._v(" get the available probe measures for a given "),a("RouterLink",{attrs:{to:"/api/map/services.html#catalog-service"}},[e._v("catalog layer descriptor")]),e._v(" in the given time range, will store result in "),a("code",[e._v("probedLocation")]),e._v(" attribute and emits the "),a("code",[e._v("probed-location-changed")]),e._v(" event")],1),e._v(" "),a("li",[a("strong",[e._v("getProbedLocationMeasureAtCurrentTime()")]),e._v(" computes measure values at current time (see "),a("RouterLink",{attrs:{to:"/api/map/mixins.html#time"}},[e._v("time mixin")]),e._v(") once a location has been probed")],1),e._v(" "),a("li",[a("strong",[e._v("createFeatures(geoJson, layerId)")]),e._v(" creates a new set of features in feature service associated to the target layer based on input GeoJson")]),e._v(" "),a("li",[a("strong",[e._v("editFeaturesGeometry(geoJson)")]),e._v(" edits the geometry of a set of features in feature service based on input GeoJson")]),e._v(" "),a("li",[a("strong",[e._v("editFeaturesProperties(geoJson)")]),e._v(" edits the properties of a set of features in feature service based on input GeoJson")]),e._v(" "),a("li",[a("strong",[e._v("removeFeatures(geoJsonOrLayerId)")]),e._v(" removes a set of features in feature service based on input GeoJson or all features associated to the target layer if any")])]),e._v(" "),a("div",{staticClass:"custom-block tip"},[a("p",{staticClass:"custom-block-title"},[e._v("TIP")]),e._v(" "),a("p",[e._v("Please refer to "),a("RouterLink",{attrs:{to:"/api/map/services.html#time-based-feature-aggregation"}},[e._v("feature service API")]),e._v(" for more details on measure aggregation.")],1)]),e._v(" "),a("h2",{attrs:{id:"weacast"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#weacast"}},[e._v("#")]),e._v(" Weacast")]),e._v(" "),a("p",[e._v("Make it easier to integrate with "),a("a",{attrs:{href:"https://weacast.github.io/weacast-docs/",target:"_blank",rel:"noopener noreferrer"}},[e._v("Weacast"),a("OutboundLink")],1),e._v(":")]),e._v(" "),a("ul",[a("li",[a("strong",[e._v("setupWeacast(config)")]),e._v(" initializes a "),a("a",{attrs:{href:"https://weacast.github.io/weacast-docs/api/application.html#client-setup",target:"_blank",rel:"noopener noreferrer"}},[e._v("Weacast client"),a("OutboundLink")],1),e._v(" in the "),a("code",[e._v("weacastApi")]),e._v(" property")]),e._v(" "),a("li",[a("strong",[e._v("setupForecastModels()")]),e._v(" retrieve available "),a("a",{attrs:{href:"https://weacast.github.io/weacast-docs/architecture/main-concepts.html#forecast-model",target:"_blank",rel:"noopener noreferrer"}},[e._v("forecast models"),a("OutboundLink")],1),e._v(" from "),a("a",{attrs:{href:"https://weacast.github.io/weacast-docs/api/forecast.html",target:"_blank",rel:"noopener noreferrer"}},[e._v("Weacast API"),a("OutboundLink")],1)]),e._v(" "),a("li",[a("strong",[e._v("setForecastModel(model)")]),e._v(" updates the current "),a("a",{attrs:{href:"https://weacast.github.io/weacast-docs/architecture/main-concepts.html#forecast-model",target:"_blank",rel:"noopener noreferrer"}},[e._v("forecast model"),a("OutboundLink")],1),e._v(" and emits the "),a("code",[e._v("forecast-model-changed")]),e._v(" event")]),e._v(" "),a("li",[a("strong",[e._v("setForecastLevel(level)")]),e._v(" updates the current forecast level and emits the "),a("code",[e._v("forecast-level-changed")]),e._v(" event")]),e._v(" "),a("li",[a("strong",[e._v("getForecastForLocation(long, lat, startTime, endTime)")]),e._v(" helper function to dynamically probe weather elements at a given location in a given time range using the "),a("a",{attrs:{href:"https://weacast.github.io/weacast-docs/api/probe.html#probes-api",target:"_blank",rel:"noopener noreferrer"}},[e._v("Weacast API"),a("OutboundLink")],1)]),e._v(" "),a("li",[a("strong",[e._v("getForecastForFeature(featureId, startTime, endTime)")]),e._v(" helper function to get weather element at static probe location in a given time range using the "),a("a",{attrs:{href:"https://weacast.github.io/weacast-docs/api/probe.html#probe-results-api",target:"_blank",rel:"noopener noreferrer"}},[e._v("Weacast API"),a("OutboundLink")],1)]),e._v(" "),a("li",[a("strong",[e._v("getProbedLocationForecastAtCurrentTime()")]),e._v(" computes element values at current time (see "),a("RouterLink",{attrs:{to:"/api/map/mixins.html#time"}},[e._v("time mixin")]),e._v(") once a location has been probed (dynamically or statically)")],1),e._v(" "),a("li",[a("strong",[e._v("getProbedLocationForecastMarker(feature, latlng)")]),e._v(" generates a marker using a "),a("a",{attrs:{href:"http://weather.rap.ucar.edu/info/about_windbarb.html",target:"_blank",rel:"noopener noreferrer"}},[e._v("wind barb"),a("OutboundLink")],1),e._v(" according to element values in feature")])]),e._v(" "),a("p",[e._v("This mixin also adds the following internal data properties:")]),e._v(" "),a("ul",[a("li",[a("strong",[e._v("forecastModel")]),e._v(": currently selected forecast model")]),e._v(" "),a("li",[a("strong",[e._v("forecastModels")]),e._v(": list of available forecast models")]),e._v(" "),a("li",[a("strong",[e._v("forecastLevel")]),e._v(": currently selected forecast level")])]),e._v(" "),a("p",[e._v("The currently selected forecast level or the list of available forecast levels is managed through the "),a("RouterLink",{attrs:{to:"/api/map/mixins.html#levels"}},[e._v("levels mixin")]),e._v(".")],1),e._v(" "),a("p",[e._v("Here is an example of a forecast levels description object:")]),e._v(" "),a("div",{staticClass:"language-js extra-class"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("{")]),e._v("\n  name"),a("span",{pre:!0,attrs:{class:"token operator"}},[e._v(":")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[e._v("'pressure'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v("\n  label"),a("span",{pre:!0,attrs:{class:"token operator"}},[e._v(":")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[e._v("'Pression'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v("\n  units"),a("span",{pre:!0,attrs:{class:"token operator"}},[e._v(":")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("[")]),e._v("\n    "),a("span",{pre:!0,attrs:{class:"token string"}},[e._v("'mb'")]),e._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v("\n  values"),a("span",{pre:!0,attrs:{class:"token operator"}},[e._v(":")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("[")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[e._v("1000")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[e._v("700")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[e._v("450")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[e._v("300")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[e._v("200")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("]")]),e._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("}")]),e._v("\n")])])]),a("p",[e._v("Note that in Weacast all meteorological elements are assumed to be atomic, i.e. each element is a 2D longitude/latitude grid of scalar values, there is no forecast level. As a consequence each forecast level will be associated to a different element in the Weacast configuration. This means that the forecast level is a pure construction of the KDK based on the following convention: if a forecast layer descriptor for an element named "),a("code",[e._v("gust")]),e._v(" contains a list of forecast levels like "),a("code",[e._v("[ 1000, 700, 450, 300, 200 ]")]),e._v(" then it is assumed that Weacast will provide the atomic elements named "),a("code",[e._v("gust-1000")]),e._v(", "),a("code",[e._v("gust-700")]),e._v(", "),a("code",[e._v("gust-450")]),e._v(", "),a("code",[e._v("gust-300")]),e._v(", "),a("code",[e._v("gust-200")]),e._v(". The right one will be retrieved according to currently selected forecast level using the pattern "),a("code",[e._v("element_name-forecast_level")]),e._v(".")]),e._v(" "),a("div",{staticClass:"custom-block tip"},[a("p",{staticClass:"custom-block-title"},[e._v("TIP")]),e._v(" "),a("p",[e._v("The mixin will automatically update forecast time whenever the current time is changed in the activity")])]),e._v(" "),a("div",{staticClass:"custom-block warning"},[a("p",{staticClass:"custom-block-title"},[e._v("WARNING")]),e._v(" "),a("p",[e._v("If no config options are provided when initializing Weacast it is assumed that it runs as a backend service acccessible through "),a("a",{attrs:{href:"https://github.com/kalisio/feathers-distributed",target:"_blank",rel:"noopener noreferrer"}},[e._v("feathers-distributed"),a("OutboundLink")],1)])]),e._v(" "),a("h2",{attrs:{id:"time"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#time"}},[e._v("#")]),e._v(" Time")]),e._v(" "),a("p",[e._v("Ease management of time-based component:")]),e._v(" "),a("ul",[a("li",[a("strong",[e._v("setCurrentTime(datetime)")]),e._v(" change the current time to the given one and ensure it is internally stored as a UTC "),a("a",{attrs:{href:"https://momentjs.com/",target:"_blank",rel:"noopener noreferrer"}},[e._v("moment"),a("OutboundLink")],1),e._v(" object to avoid any confusion, emits the "),a("code",[e._v("current-time-changed")]),e._v(" event")]),e._v(" "),a("li",[a("strong",[e._v("setTimeFormat(format)")]),e._v(" change the formats used to display date/time, each format is based on "),a("a",{attrs:{href:"https://momentjs.com/docs/#/displaying/format/",target:"_blank",rel:"noopener noreferrer"}},[e._v("moment"),a("OutboundLink")],1),e._v(" display options and the object is structured like this\n"),a("ul",[a("li",[a("strong",[e._v("time")]),e._v(" "),a("ul",[a("li",[a("strong",[e._v("short")]),e._v(': display format for time in "short" form')]),e._v(" "),a("li",[a("strong",[e._v("long")]),e._v(': display format for time in "long" form')])])]),e._v(" "),a("li",[a("strong",[e._v("date")]),e._v(" "),a("ul",[a("li",[a("strong",[e._v("short")]),e._v(': display format for date in "short" form')]),e._v(" "),a("li",[a("strong",[e._v("long")]),e._v(': display format for date in "long" form')])])]),e._v(" "),a("li",[a("strong",[e._v("year")]),e._v(" "),a("ul",[a("li",[a("strong",[e._v("short")]),e._v(': display format for year in "short" form')]),e._v(" "),a("li",[a("strong",[e._v("long")]),e._v(': display format for year in "long" form')])])]),e._v(" "),a("li",[a("strong",[e._v("utc")]),e._v(": boolean indicating if date/time should be displayed in UTC or according to user's locale")]),e._v(" "),a("li",[a("strong",[e._v("locale")]),e._v(": the user's locale to be used when not displaying date/time in UTC")])])]),e._v(" "),a("li",[a("strong",[e._v("formatTime(format, datetime)")]),e._v(": get the formatted date/time for display according to current format settings, if no date/time given the current one set in component will be used. The format is the path to the actual format in the format object, e.g. "),a("code",[e._v("formatTime('time.short')")]),e._v(" to get a formatted time in short form. The "),a("code",[e._v("iso")]),e._v(" path is reserved for "),a("a",{attrs:{href:"https://en.wikipedia.org/wiki/ISO_8601",target:"_blank",rel:"noopener noreferrer"}},[e._v("ISO 8601"),a("OutboundLink")],1),e._v(" display.")])]),e._v(" "),a("p",[e._v("Here is an example of a format object:")]),e._v(" "),a("div",{staticClass:"language-js extra-class"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("{")]),e._v("\n  time"),a("span",{pre:!0,attrs:{class:"token operator"}},[e._v(":")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("{")]),e._v("\n    short"),a("span",{pre:!0,attrs:{class:"token operator"}},[e._v(":")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[e._v("'H[h]'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v("\n    long"),a("span",{pre:!0,attrs:{class:"token operator"}},[e._v(":")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[e._v("'HH:mm'")]),e._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v("\n  date"),a("span",{pre:!0,attrs:{class:"token operator"}},[e._v(":")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("{")]),e._v("\n    short"),a("span",{pre:!0,attrs:{class:"token operator"}},[e._v(":")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[e._v("'DD/MM'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v("\n    long"),a("span",{pre:!0,attrs:{class:"token operator"}},[e._v(":")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[e._v("'dddd D'")]),e._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v("\n  year"),a("span",{pre:!0,attrs:{class:"token operator"}},[e._v(":")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("{")]),e._v("\n    short"),a("span",{pre:!0,attrs:{class:"token operator"}},[e._v(":")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[e._v("'YY'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v("\n    long"),a("span",{pre:!0,attrs:{class:"token operator"}},[e._v(":")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[e._v("'YYYY'")]),e._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v("\n  utc"),a("span",{pre:!0,attrs:{class:"token operator"}},[e._v(":")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token boolean"}},[e._v("true")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v("\n  locale"),a("span",{pre:!0,attrs:{class:"token operator"}},[e._v(":")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[e._v("'en'")]),e._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("}")]),e._v("\n")])])]),a("div",{staticClass:"custom-block tip"},[a("p",{staticClass:"custom-block-title"},[e._v("TIP")]),e._v(" "),a("p",[e._v("The mixin is in sync with the "),a("code",[e._v("timeFormat")]),e._v(" property of the "),a("RouterLink",{attrs:{to:"/api/core/application.html#store"}},[e._v("global store")]),e._v(" so that you can have a shared data/time display format accross all time-based components with a dedicated UI to change settings using e.g. "),a("code",[e._v("store.patch('timeFormat', { locale, utc })")]),e._v(".")],1)]),e._v(" "),a("p",[e._v("This mixin also adds the following internal data properties:")]),e._v(" "),a("ul",[a("li",[a("strong",[e._v("currentTime")]),e._v(": current time as UTC "),a("a",{attrs:{href:"https://momentjs.com/",target:"_blank",rel:"noopener noreferrer"}},[e._v("moment"),a("OutboundLink")],1),e._v(" object")]),e._v(" "),a("li",[a("strong",[e._v("currentTimeFormat")]),e._v(": current format object to be used for display")]),e._v(" "),a("li",[a("strong",[e._v("currentFormattedTime")]),e._v(": same structure as the format object but contains ready-to-display values of the current time, e.g. "),a("code",[e._v("currentFormattedTime.time.short")]),e._v(" will give you the formatted time string in short form according to current format settings.")])]),e._v(" "),a("h2",{attrs:{id:"activity"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#activity"}},[e._v("#")]),e._v(" Activity")]),e._v(" "),a("p",[e._v("Make it easier to create 2D/3D mapping activities by providing methods available in both cases:")]),e._v(" "),a("ul",[a("li",[a("strong",[e._v("initialize()")]),e._v(" setup view, Weacast, layers and timeline, "),a("strong",[e._v("should be called first before any other method")])]),e._v(" "),a("li",[a("strong",[e._v("registerActivityActions()")]),e._v(" register default activity actions (fullscreen mode, geolocation, geocoding, tracking, probing, etc.)")]),e._v(" "),a("li",[a("strong",[e._v("getCatalogLayers()")]),e._v(" retrieve available "),a("RouterLink",{attrs:{to:"/api/map/services.html#catalog-service"}},[e._v("catalog layer descriptors")])],1),e._v(" "),a("li",[a("strong",[e._v("refreshLayers()")]),e._v(" setup available layers based on "),a("RouterLink",{attrs:{to:"/api/map/services.html#catalog-service"}},[e._v("catalog layer descriptors")])],1),e._v(" "),a("li",[a("strong",[e._v("registerLayerActions(layer)")]),e._v(" register default layer actions (zoom, save, edit, edit data, remove, etc.)")]),e._v(" "),a("li",[a("strong",[e._v("isLayerStorable/Removable/Editable(layer)")]),e._v(" helper function to get the state of a given layer descriptor")]),e._v(" "),a("li",[a("strong",[e._v("onLayerAdded(layer)")]),e._v(" layer action handler that will setup available action on layer")]),e._v(" "),a("li",[a("strong",[e._v("onTriggerLayer(layer)")]),e._v(" trigger action handler that will hide/show a given layer")]),e._v(" "),a("li",[a("strong",[e._v("onZoomToLayer(layer)")]),e._v(" zoom action handler that will zoom to a given layer")]),e._v(" "),a("li",[a("strong",[e._v("onCreateLayer()")]),e._v(" create layer action handler that will open an "),a("RouterLink",{attrs:{to:"/api/core/components.html#editors"}},[e._v("editor")]),e._v(" to define layer properties")],1),e._v(" "),a("li",[a("strong",[e._v("onSaveLayer(layer)")]),e._v(" save action handler that will persist a given in-memory layer to persistent storage provided by a "),a("RouterLink",{attrs:{to:"/api/map/services.html#feature-service"}},[e._v("feature service")])],1),e._v(" "),a("li",[a("strong",[e._v("onEditLayer(layer)")]),e._v(" edit action handler that will open an "),a("RouterLink",{attrs:{to:"/api/core/components.html#editors"}},[e._v("editor")]),e._v(" to change layer properties")],1),e._v(" "),a("li",[a("strong",[e._v("onEditLayerData(layer)")]),e._v(" edit data action handler that will (de)activate "),a("a",{attrs:{href:"https://leaflet.github.io/Leaflet.draw/docs/leaflet-draw-latest.html",target:"_blank",rel:"noopener noreferrer"}},[e._v("feature edition mode"),a("OutboundLink")],1),e._v(" to update layer features geometry and properties")]),e._v(" "),a("li",[a("strong",[e._v("onRemoveLayer(layer)")]),e._v(" remove action handler that will ask for confirmation before removing a persisted layer")]),e._v(" "),a("li",[a("strong",[e._v("onGeocoding()")]),e._v(" geocoding action handler that will open a dialog to search for a location to go to")]),e._v(" "),a("li",[a("strong",[e._v("onGeolocate()")]),e._v(" geolocation action handler that will launch a user's position lookup and go to found user's location")]),e._v(" "),a("li",[a("strong",[e._v("onTrackLocation()")]),e._v(" location tracking action handler that will enable/disable a location indicator to display location values")])]),e._v(" "),a("div",{staticClass:"custom-block tip"},[a("p",{staticClass:"custom-block-title"},[e._v("TIP")]),e._v(" "),a("p",[e._v("This mixin has to be initialized by providing a unique component/activity name like "),a("code",[e._v("mixins.activity('map')")]),e._v(". Indeed, the name is then used to retrieve the configuration associated with the activity from the global frontend "),a("RouterLink",{attrs:{to:"/guides/basics/step-by-step.html#configuring-a-kapp"}},[e._v("configuration")]),e._v(" according to the following properties:")],1),e._v(" "),a("ul",[a("li",[a("strong",[e._v("{name}")]),e._v(": 2D/3D view configuration")]),e._v(" "),a("li",[a("strong",[e._v("[name}Panel")]),e._v(": 2D/3D layers panel configuration")]),e._v(" "),a("li",[a("strong",[e._v("[name}Activity")]),e._v(": 2D/3D activity configuration\nSee e.g. "),a("RouterLink",{attrs:{to:"/api/kano/configuration.html"}},[e._v("Kano configuration options")]),e._v(" for more details.")],1)])]),e._v(" "),a("p",[e._v("This mixin also adds the following internal data properties:\nvariables")]),e._v(" "),a("ul",[a("li",[a("strong",[e._v("variables")]),e._v(" the set of available variables in catalog layers")]),e._v(" "),a("li",[a("strong",[e._v("probedLocation")]),e._v(" the currently probed location feature (weather or measurement)")])]),e._v(" "),a("h2",{attrs:{id:"context"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#context"}},[e._v("#")]),e._v(" Context")]),e._v(" "),a("p",[e._v("Used to be able to restore the user's context, i.e. view extent and active layers, in 2D/3D mapping activities by providing methods available in both cases:")]),e._v(" "),a("ul",[a("li",[a("strong",[e._v("storeContext(context)")]),e._v(" stores current context as route (query) parameters and persists as well in local storage")]),e._v(" "),a("li",[a("strong",[e._v("restoreContext(context)")]),e._v(" restores previously stored context from local storage, catalog (if a default one has been saved) or route (query) parameters")]),e._v(" "),a("li",[a("strong",[e._v("clearContext(context)")]),e._v(" clears the stored context so that it will not be restored anymore")]),e._v(" "),a("li",[a("strong",[e._v("getRouteContext(context)")]),e._v(" gets the context parameters from current route (from either parameters or query)")]),e._v(" "),a("li",[a("strong",[e._v("updateRouteContext(context)")]),e._v(" sets the context parameters on the current route (from either parameters or query)")]),e._v(" "),a("li",[a("strong",[e._v("saveContext (context)")]),e._v(" saves the context in the catalog")]),e._v(" "),a("li",[a("strong",[e._v("loadContext (context)")]),e._v(" sets the context from either the given parameters or the catalog (if context is an ID or a name)")])]),e._v(" "),a("p",[e._v("At the present time two types of context are supported, although the system is flexible enough to easily add a new type:")]),e._v(" "),a("ul",[a("li",[a("code",[e._v("view")]),e._v(" to restore current view bounds stored as route parameters")]),e._v(" "),a("li",[a("code",[e._v("layers")]),e._v(" to restore currently active layers in catalog stored as route query parameters")])]),e._v(" "),a("div",{staticClass:"custom-block tip"},[a("p",{staticClass:"custom-block-title"},[e._v("TIP")]),e._v(" "),a("p",[e._v("The mixin is in sync with the "),a("code",[e._v("restore.context")]),e._v(" (context being either "),a("code",[e._v("view")]),e._v(" or "),a("code",[e._v("layers")]),e._v(") property of the "),a("RouterLink",{attrs:{to:"/api/core/application.html#store"}},[e._v("global store")]),e._v(" so that you can have a shared restoration flag accross all mapping components with a dedicated UI to change settings using e.g. "),a("code",[e._v("store.patch('restore.view', true)")]),e._v(". This can be overriden by a similar property on the activity configuration if you'd like to disable context restoration on a particular activity.")],1)]),e._v(" "),a("h2",{attrs:{id:"levels"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#levels"}},[e._v("#")]),e._v(" Levels")]),e._v(" "),a("p",[e._v("Allow to configure the "),a("RouterLink",{attrs:{to:"/api/map/components.html#level-slider"}},[a("strong",[e._v("k-level-slider")]),e._v("\ncomponent")]),e._v(". The slider is associated with a\nlayer and is only shown when properly configured. When the selected value\nchanges, the "),a("code",[e._v("selected-level-changed")]),e._v(" event is broadcasted.")],1),e._v(" "),a("div",{staticClass:"custom-block warning"},[a("p",{staticClass:"custom-block-title"},[e._v("WARNING")]),e._v(" "),a("p",[e._v("The level slider is global, meaning that there's only one instance of the\nslider, and it is shared by every layer.")])]),e._v(" "),a("p",[e._v("To configure the slider, we use an object with the following properties:")]),e._v(" "),a("ul",[a("li",[a("strong",[e._v("label")]),e._v(": defines the slider label which will be displayed by the\nk-level-slider component.")]),e._v(" "),a("li",[a("strong",[e._v("units")]),e._v(": an array defining the unit of the value we're manipulating.\nCurrently we only care about "),a("code",[e._v("units[0]")]),e._v(".")]),e._v(" "),a("li",[a("strong",[e._v("values")]),e._v(": an array defining the discrete values the level can take.")]),e._v(" "),a("li",[a("strong",[e._v("range")]),e._v(": an object defining a continuous range of values:\n"),a("ul",[a("li",[a("strong",[e._v("min")]),e._v(": the minimum value")]),e._v(" "),a("li",[a("strong",[e._v("max")]),e._v(": the maximum value")]),e._v(" "),a("li",[a("strong",[e._v("interval")]),e._v(": the interval to use between "),a("code",[e._v("min")]),e._v(" and "),a("code",[e._v("max")]),e._v(", 1 by default if not\nspecified")])])]),e._v(" "),a("li",[a("strong",[e._v("lazy")]),e._v(": a boolean indicating if "),a("code",[e._v("setSelectedLevel")]),e._v(" is called as the slider\nmoves (when "),a("code",[e._v("false")]),e._v(") or if it is only called when the slider is released (when\n"),a("code",[e._v("true")]),e._v(").")])]),e._v(" "),a("p",[e._v("Here is an example of a configuration object:")]),e._v(" "),a("div",{staticClass:"language-js extra-class"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("{")]),e._v("\n  label"),a("span",{pre:!0,attrs:{class:"token operator"}},[e._v(":")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[e._v("'Temperature'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v("\n  units"),a("span",{pre:!0,attrs:{class:"token operator"}},[e._v(":")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("[")]),a("span",{pre:!0,attrs:{class:"token string"}},[e._v("'degC'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("]")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v("\n  lazy"),a("span",{pre:!0,attrs:{class:"token operator"}},[e._v(":")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token boolean"}},[e._v("false")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v("\n  range"),a("span",{pre:!0,attrs:{class:"token operator"}},[e._v(":")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("{")]),e._v("\n    min"),a("span",{pre:!0,attrs:{class:"token operator"}},[e._v(":")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[e._v("-")]),a("span",{pre:!0,attrs:{class:"token number"}},[e._v("10")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v("\n    max"),a("span",{pre:!0,attrs:{class:"token operator"}},[e._v(":")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[e._v("10")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v("\n    interval"),a("span",{pre:!0,attrs:{class:"token operator"}},[e._v(":")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[e._v("2")]),e._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("}")]),e._v("\n  "),a("span",{pre:!0,attrs:{class:"token comment"}},[e._v("/* or only some specific values\n  values: [ -10, -8, 0, 4, 9 ]\n  */")]),e._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("}")]),e._v("\n")])])]),a("p",[e._v("The mixin adds the following functions:")]),e._v(" "),a("ul",[a("li",[a("strong",[e._v("setSelectableLevels(layer, levels, initialLevel)")]),e._v(" : defines the layer the\nslider is currently associated to, configures the selectable levels and sets the initial level.")]),e._v(" "),a("li",[a("strong",[e._v("clearSelectableLevels(layer)")]),e._v(" : clears the slider definition associated\nwith the layer. This function will only clear the slider configuration if the\ncurrent layer associated with the slider is the same as the "),a("code",[e._v("layer")]),e._v(" argument.")]),e._v(" "),a("li",[a("strong",[e._v("setSelectedLevel(level)")]),e._v(" : selects a level value and broadcasts the\n"),a("code",[e._v("selected-level-changed")]),e._v(" event. This is the function that is called when the\nslider moves.")])]),e._v(" "),a("p",[e._v("This mixin also adds the following internal data properties:")]),e._v(" "),a("ul",[a("li",[a("strong",[e._v("selectedLevel")]),e._v(": the currently selected level value.")]),e._v(" "),a("li",[a("strong",[e._v("selectableLevels")]),e._v(": the current slider configuration object.")])])])}),[],!1,null,null,null);t.default=o.exports}}]);