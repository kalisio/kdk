(window.webpackJsonp=window.webpackJsonp||[]).push([[16],{512:function(t,e,s){t.exports=s.p+"assets/img/marker-cluster-3D.e8927429.png"},562:function(t,e,s){"use strict";s.r(e);var r=s(13),a=Object(r.a)({},(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[r("h2",{attrs:{id:"globe-mixins"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#globe-mixins"}},[t._v("#")]),t._v(" Globe Mixins")]),t._v(" "),r("p",[t._v("The underlying globe object is based on "),r("a",{attrs:{href:"https://cesium.com/",target:"_blank",rel:"noopener noreferrer"}},[t._v("Cesium"),r("OutboundLink")],1),t._v(".")]),t._v(" "),r("h2",{attrs:{id:"base-globe"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#base-globe"}},[t._v("#")]),t._v(" Base Globe")]),t._v(" "),r("div",{staticClass:"custom-block danger"},[r("p",{staticClass:"custom-block-title"},[t._v("WARNING")]),t._v(" "),r("p",[t._v("This mixin is a mandatory one to build a globe activity")])]),t._v(" "),r("p",[t._v("Make it possible to manage globe layers and extend supported layer types:")]),t._v(" "),r("ul",[r("li",[r("strong",[t._v("setupGlobe(domElement, token)")]),t._v(" creates the underlying Cesium globe object with given Cesium Ion token")]),t._v(" "),r("li",[r("strong",[t._v("addLayer(options)/removeLayer(name)")]),t._v(" registers/destroys a layer based on a "),r("RouterLink",{attrs:{to:"/api/map/services.html#catalog-service"}},[t._v("catalog layer descriptor")])],1),t._v(" "),r("li",[r("strong",[t._v("showLayer/hideLayer(name)")]),t._v(" (un)hides the given layer in globe, on first show the layer will be lazily created")]),t._v(" "),r("li",[r("strong",[t._v("hasLayer(name)")]),t._v(" check if a given layer is already registered")]),t._v(" "),r("li",[r("strong",[t._v("isLayerVisible(name)")]),t._v(" check if a given layer is visible and underlying Cesium object created")]),t._v(" "),r("li",[r("strong",[t._v("zoomToLayer(name)")]),t._v(" fits the globe view to visualize a given layer")]),t._v(" "),r("li",[r("strong",[t._v("zoomToBounds(bounds)")]),t._v(" fits the globe view to visualize a given extent as bounds [ [south, west], [north, east] ]")]),t._v(" "),r("li",[r("strong",[t._v("getLayerByName(name)")]),t._v(" retrieve the "),r("RouterLink",{attrs:{to:"/api/map/services.html#catalog-service"}},[t._v("catalog layer descriptor")]),t._v(" for a given layer")],1),t._v(" "),r("li",[r("strong",[t._v("renameLayer(previousName, newName)")]),t._v(" rename a given layer")]),t._v(" "),r("li",[r("strong",[t._v("removeLayer(name)")]),t._v(" destroys a given layer")]),t._v(" "),r("li",[r("strong",[t._v("getCesiumLayerByName(name)")]),t._v(" retrieve the underlying Cesium object for a given layer")]),t._v(" "),r("li",[r("strong",[t._v("createCesiumLayer(options)")]),t._v(" creates the underlying Cesium object based on a "),r("RouterLink",{attrs:{to:"/api/map/services.html#catalog-service"}},[t._v("catalog layer descriptor")]),t._v(", will check all registered constructor for any one matching")],1),t._v(" "),r("li",[r("strong",[t._v("registerCesiumConstructor(constructor)")]),t._v(" registers a Cesium constructor function for a given type of layer")]),t._v(" "),r("li",[r("strong",[t._v("center(longitude, latitude, altitude, heading, pitch, roll)")]),t._v(" centers the globe view to visualize a given point at a given altitude with and orientation (default is pointing ground vertically [0, 0, -90])")]),t._v(" "),r("li",[r("strong",[t._v("getCenter()")]),t._v(" get the current globe view center as longitude, latitude and altitude")]),t._v(" "),r("li",[r("strong",[t._v("getBounds()")]),t._v(" get the current map view bounds as "),r("code",[t._v("[ [south, west], [north, east] ]")])])]),t._v(" "),r("p",[t._v("This mixin also adds the following internal data properties:")]),t._v(" "),r("ul",[r("li",[r("strong",[t._v("layers")]),t._v(" available layers as "),r("RouterLink",{attrs:{to:"/api/map/services.html#catalog-service"}},[t._v("catalog layer descriptors")])],1)]),t._v(" "),r("h2",{attrs:{id:"globe-style"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#globe-style"}},[t._v("#")]),t._v(" Globe Style")]),t._v(" "),r("p",[t._v("Make it possible to setup Cesium entities objects with style based on (Geo)Json (feature) properties stored in entities:")]),t._v(" "),r("ul",[r("li",[r("strong",[t._v("convertFromSimpleStyleSpec(style)")]),t._v(" helper function to convert from "),r("a",{attrs:{href:"https://github.com/mapbox/simplestyle-spec",target:"_blank",rel:"noopener noreferrer"}},[t._v("simple style spec options"),r("OutboundLink")],1),t._v(" to "),r("a",{attrs:{href:"https://cesiumjs.org/Cesium/Build/Documentation/GeoJsonDataSource.html#.load",target:"_blank",rel:"noopener noreferrer"}},[t._v("Cesium style options"),r("OutboundLink")],1)]),t._v(" "),r("li",[r("strong",[t._v("convertToCesiumObjects(style)")]),t._v(" helper function to convert from JSON description to Cesium objects")])]),t._v(" "),r("p",[t._v("Use "),r("strong",[t._v("register/unregisterStyle(type, generator)")]),t._v(" to (un)register a function generating a Cesium object depending on the given type:")]),t._v(" "),r("ul",[r("li",[r("code",[t._v("entityStyle")]),t._v(" => "),r("strong",[t._v("f(entity, options)")]),t._v(" returns a "),r("a",{attrs:{href:"https://cesium.com/docs/tutorials/creating-entities/",target:"_blank",rel:"noopener noreferrer"}},[t._v("Cesium entity style object"),r("OutboundLink")],1)]),t._v(" "),r("li",[r("code",[t._v("clusterStyle")]),t._v(" => "),r("strong",[t._v("f(entities, cluster, options)")]),t._v(" returns a "),r("a",{attrs:{href:"https://cesiumjs.org/Cesium/Build/Documentation/EntityCluster.html#~newClusterCallback",target:"_blank",rel:"noopener noreferrer"}},[t._v("Cesium cluster style object"),r("OutboundLink")],1)])]),t._v(" "),r("p",[t._v("The mixin automatically registers defaults styling:")]),t._v(" "),r("ul",[r("li",[r("code",[t._v("entityStyle")]),t._v(" => will create a style based on the following options merged with the following order of precedence\n"),r("ul",[r("li",[r("a",{attrs:{href:"https://github.com/mapbox/simplestyle-spec",target:"_blank",rel:"noopener noreferrer"}},[t._v("simple style spec options"),r("OutboundLink")],1),t._v(" set on "),r("strong",[t._v("feature.style")]),t._v(" or "),r("strong",[t._v("feature.properties")])]),t._v(" "),r("li",[r("a",{attrs:{href:"https://cesium.com/docs/tutorials/creating-entities/",target:"_blank",rel:"noopener noreferrer"}},[t._v("Cesium entity style options"),r("OutboundLink")],1),t._v(" set on layer descriptor")]),t._v(" "),r("li",[r("a",{attrs:{href:"https://cesium.com/docs/tutorials/creating-entities/",target:"_blank",rel:"noopener noreferrer"}},[t._v("Cesium entity style options"),r("OutboundLink")],1),t._v(" set on the "),r("strong",[t._v("entityStyle")]),t._v(" property in the component options")])])]),t._v(" "),r("li",[r("code",[t._v("clusterStyle")]),t._v(" => will create a style based on the following options merged with the following order of precedence\n"),r("ul",[r("li",[r("a",{attrs:{href:"https://cesiumjs.org/Cesium/Build/Documentation/EntityCluster.html#~newClusterCallback",target:"_blank",rel:"noopener noreferrer"}},[t._v("Cesium cluster style options"),r("OutboundLink")],1),t._v(" set on layer descriptor")]),t._v(" "),r("li",[r("a",{attrs:{href:"https://cesiumjs.org/Cesium/Build/Documentation/EntityCluster.html#~newClusterCallback",target:"_blank",rel:"noopener noreferrer"}},[t._v("Cesium cluster style options"),r("OutboundLink")],1),t._v(" set on the "),r("strong",[t._v("clusterStyle")]),t._v(" property in the component options")])])])]),t._v(" "),r("p",[t._v("Cesium styles often rely on dynamically created objects while the input styling configuration is a static JSON. As a consequence the following rules are used to convert from JSON to Cesium objects:")]),t._v(" "),r("ul",[r("li",[t._v("constants are expressed as strings starting with "),r("code",[t._v("'Cesium.'")])]),t._v(" "),r("li",[t._v("object instances are expressed as a "),r("code",[t._v("{ type, options }")]),t._v(" object where type is a string starting with "),r("code",[t._v("'Cesium.'")]),t._v(" followed by the class name like "),r("code",[t._v("'Cesium.CheckerboardMaterialProperty'")]),t._v(", options are constructor options for the object instance\nThe following Cesium code:")])]),t._v(" "),r("div",{staticClass:"language-js extra-class"},[r("pre",{pre:!0,attrs:{class:"language-js"}},[r("code",[t._v("ellipse"),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("material "),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Cesium"),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("CheckerboardMaterialProperty")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),r("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("evenColor")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" Cesium"),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("Color"),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),r("span",{pre:!0,attrs:{class:"token constant"}},[t._v("WHITE")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),r("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("oddColor")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" Cesium"),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("Color"),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),r("span",{pre:!0,attrs:{class:"token constant"}},[t._v("BLACK")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),r("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("repeat")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Cesium"),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("Cartesian2")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),r("span",{pre:!0,attrs:{class:"token number"}},[t._v("4")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token number"}},[t._v("4")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n"),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n")])])]),r("p",[t._v("will result in the following Json configuration:")]),t._v(" "),r("div",{staticClass:"language-js extra-class"},[r("pre",{pre:!0,attrs:{class:"language-js"}},[r("code",[r("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("ellipse")]),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),r("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("material")]),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),r("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("type")]),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token string"}},[t._v("'Cesium.CheckerboardMaterialProperty'")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),r("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("options")]),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      "),r("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("evenColor")]),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token string"}},[t._v("'Cesium.Color.WHITE'")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      "),r("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("oddColor")]),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token string"}},[t._v("'Cesium.Color.BLACK'")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      "),r("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("repeat")]),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),r("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("type")]),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token string"}},[t._v("'Cesium.Cartesian2'")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n        "),r("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("options")]),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),r("span",{pre:!0,attrs:{class:"token number"}},[t._v("4")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token number"}},[t._v("4")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n    "),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n  "),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),r("h2",{attrs:{id:"globe-popup"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#globe-popup"}},[t._v("#")]),t._v(" Globe Popup")]),t._v(" "),r("p",[t._v("Make it possible to generate "),r("a",{attrs:{href:"https://cesiumjs.org/Cesium/Build/Documentation/LabelGraphics.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("Cesium labels"),r("OutboundLink")],1),t._v(" as popups based on GeoJson feature properties stored in entities. Use "),r("strong",[t._v("register/unregisterStyle("),r("code",[t._v("popup")]),t._v(", generator)")]),t._v(" to (un)register a function "),r("strong",[t._v("f(entity, options)")]),t._v(" returning a "),r("a",{attrs:{href:"https://cesium.com/docs/tutorials/creating-entities/",target:"_blank",rel:"noopener noreferrer"}},[t._v("Cesium entity style object"),r("OutboundLink")],1)]),t._v(" "),r("p",[t._v("The mixin automatically registers a default generator that will create a popup displaying a property name/value table based on the following options with the following order of precedence")]),t._v(" "),r("ul",[r("li",[r("strong",[t._v("popup")]),t._v(": set on "),r("strong",[t._v("entity.properties")]),t._v(" or layer descriptor or in the "),r("strong",[t._v("popup")]),t._v(" property of component options\n"),r("ul",[r("li",[r("strong",[t._v("pick")]),t._v(": array of property names to appear in the popup")]),t._v(" "),r("li",[r("strong",[t._v("omit")]),t._v(": array of property names not to appear in the popup")]),t._v(" "),r("li",[r("strong",[t._v("template")]),t._v(": "),r("a",{attrs:{href:"https://lodash.com/docs/#template",target:"_blank",rel:"noopener noreferrer"}},[t._v("Lodash template"),r("OutboundLink")],1),t._v(" to generate popup content with "),r("code",[t._v("feature")]),t._v(", its "),r("code",[t._v("properties")]),t._v(" and translation function "),r("code",[t._v("$t")]),t._v(" as context")]),t._v(" "),r("li",[r("strong",[t._v("html")]),t._v(": HTML content of the popup, if provided will override default display")]),t._v(" "),r("li",[r("strong",[t._v("options")]),t._v(": Cesium "),r("a",{attrs:{href:"https://cesiumjs.org/Cesium/Build/Documentation/LabelGraphics.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("label options"),r("OutboundLink")],1)])])])]),t._v(" "),r("div",{staticClass:"custom-block tip"},[r("p",{staticClass:"custom-block-title"},[t._v("TIP")]),t._v(" "),r("p",[t._v("If you want to disable a default popup configuration like "),r("code",[t._v("popup: { }")]),t._v(" (i.e. display all properties) on a per-layer basis you have to explicitely unset it on your layer options using "),r("code",[t._v("popup: null")]),t._v(" or "),r("code",[t._v("popup: false")]),t._v(".")])]),t._v(" "),r("h2",{attrs:{id:"globe-tooltip"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#globe-tooltip"}},[t._v("#")]),t._v(" Globe Tooltip")]),t._v(" "),r("p",[t._v("Make it possible to generate "),r("a",{attrs:{href:"https://cesiumjs.org/Cesium/Build/Documentation/LabelGraphics.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("Cesium labels"),r("OutboundLink")],1),t._v(" as tooltips based on GeoJson feature properties stored in entities. Use "),r("strong",[t._v("register/unregisterStyle("),r("code",[t._v("tooltip")]),t._v(", generator)")]),t._v(" to (un)register a function "),r("strong",[t._v("f(entity, options)")]),t._v(" returning a "),r("a",{attrs:{href:"https://cesium.com/docs/tutorials/creating-entities/",target:"_blank",rel:"noopener noreferrer"}},[t._v("Cesium entity style object"),r("OutboundLink")],1)]),t._v(" "),r("p",[t._v("The mixin automatically registers a default generator that will create a tooltip based on the following options with the following order of precedence")]),t._v(" "),r("ul",[r("li",[r("strong",[t._v("tooltip")]),t._v(": set on "),r("strong",[t._v("entity.properties")]),t._v(" or layer descriptor or in the "),r("strong",[t._v("tooltip")]),t._v(" property of component options\n"),r("ul",[r("li",[r("strong",[t._v("property")]),t._v(": property name to appear in the tooltip")]),t._v(" "),r("li",[r("strong",[t._v("template")]),t._v(": "),r("a",{attrs:{href:"https://lodash.com/docs/#template",target:"_blank",rel:"noopener noreferrer"}},[t._v("Lodash template"),r("OutboundLink")],1),t._v(" to generate tooltip content with "),r("code",[t._v("feature")]),t._v(", its "),r("code",[t._v("properties")]),t._v(" and translation function "),r("code",[t._v("$t")]),t._v(" as context")]),t._v(" "),r("li",[r("strong",[t._v("html")]),t._v(": HTML content of the tooltip, if provided will override default display")]),t._v(" "),r("li",[r("strong",[t._v("options")]),t._v(": Cesium "),r("a",{attrs:{href:"https://cesiumjs.org/Cesium/Build/Documentation/LabelGraphics.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("label options"),r("OutboundLink")],1)])])])]),t._v(" "),r("div",{staticClass:"custom-block tip"},[r("p",{staticClass:"custom-block-title"},[t._v("TIP")]),t._v(" "),r("p",[t._v("If you want to disable a default tooltip configuration like "),r("code",[t._v("tooltip: { property: 'name' }")]),t._v(" (i.e. display all properties) on a per-layer basis you have to explicitely unset it on your layer options using "),r("code",[t._v("tooltip: null")]),t._v(" or "),r("code",[t._v("tooltip: false")]),t._v(".")])]),t._v(" "),r("h2",{attrs:{id:"geojson-layer"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#geojson-layer"}},[t._v("#")]),t._v(" GeoJson Layer")]),t._v(" "),r("p",[t._v("Make it possible to manage and style raw or time-based GeoJson map layers:")]),t._v(" "),r("ul",[r("li",[r("strong",[t._v("createCesiumGeoJsonLayer(options)")]),t._v(" automatically registered GeoJson Cesium layer constructor")]),t._v(" "),r("li",[r("strong",[t._v("updateLayer(name, geoJson)")]),t._v(" update underlying GeoJson data of a given layer")])]),t._v(" "),r("div",{staticClass:"custom-block danger"},[r("p",{staticClass:"custom-block-title"},[t._v("WARNING")]),t._v(" "),r("p",[t._v("The "),r("RouterLink",{attrs:{to:"/api/map/mixins.html#globe-style"}},[t._v("style mixin")]),t._v(" is mandatory when using this mixin. If you'd like to support popups/tooltips you should also use the "),r("RouterLink",{attrs:{to:"/api/map/mixins.html#globe-tooltip"}},[t._v("popup mixin")]),t._v(" and/or "),r("RouterLink",{attrs:{to:"/api/map/mixins.html#globe-tooltip"}},[t._v("tooltip mixin")]),t._v(".")],1)]),t._v(" "),r("div",{staticClass:"custom-block tip"},[r("p",{staticClass:"custom-block-title"},[t._v("TIP")]),t._v(" "),r("p",[t._v("Marker cluster options are to be provided in the "),r("strong",[t._v("cluster")]),t._v(" property of the Cesium layer options")])]),t._v(" "),r("p",[t._v("The following configuration illustrates a GeoJson marker cluster layer using options set on the layer descriptor (see image below):")]),t._v(" "),r("div",{staticClass:"language-js extra-class"},[r("pre",{pre:!0,attrs:{class:"language-js"}},[r("code",[r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),r("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("name")]),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token string"}},[t._v("'Layer'")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),r("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("description")]),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token string"}},[t._v("'My sites'")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),r("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("tags")]),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token string"}},[t._v("'business'")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),r("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("icon")]),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token string"}},[t._v("'star'")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),r("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("attribution")]),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token string"}},[t._v("'(c) My company'")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),r("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("type")]),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token string"}},[t._v("'OverlayLayer'")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),r("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("cesium")]),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),r("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("type")]),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token string"}},[t._v("'geoJson'")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),r("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("source")]),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token string"}},[t._v("'https://s3.eu-central-1.amazonaws.com/kargo/nuclear-sites.json'")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),r("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("cluster")]),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      "),r("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("pixelRange")]),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token number"}},[t._v("50")]),t._v("\n    "),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),r("span",{pre:!0,attrs:{class:"token string-property property"}},[t._v("'marker-symbol'")]),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token string"}},[t._v("'star'")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),r("span",{pre:!0,attrs:{class:"token string-property property"}},[t._v("'marker-color'")]),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token string"}},[t._v("'#FFA500'")]),t._v("\n  "),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),r("p",[r("img",{attrs:{src:s(512),alt:"3D marker cluster"}})]),t._v(" "),r("h3",{attrs:{id:"additional-feature-types"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#additional-feature-types"}},[t._v("#")]),t._v(" Additional feature types")]),t._v(" "),r("p",[t._v("The following options can be set as feature "),r("code",[t._v("properties")]),t._v(" to manage more geometry types:")]),t._v(" "),r("ul",[r("li",[r("strong",[t._v("wall")]),t._v(" boolean set to "),r("code",[t._v("true")]),t._v(" on a "),r("code",[t._v("LineString")]),t._v(" will result in an additional "),r("a",{attrs:{href:"https://cesiumjs.org/Cesium/Build/Documentation/WallGraphics.html?classFilter=wall",target:"_blank",rel:"noopener noreferrer"}},[t._v("WallGraphics"),r("OutboundLink")],1),t._v(", which uses the styling options of the feature")]),t._v(" "),r("li",[r("strong",[t._v("geodesic")]),t._v(" boolean set to "),r("code",[t._v("true")]),t._v(" on a "),r("code",[t._v("Point")]),t._v(" will result in a great circle represented as a "),r("a",{attrs:{href:"https://cesiumjs.org/Cesium/Build/Documentation/EllipseGraphics.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("EllipseGraphics"),r("OutboundLink")],1),t._v(", which "),r("strong",[t._v("radius")]),t._v(" must be specified in meters and uses the styling options of the feature")]),t._v(" "),r("li",[r("strong",[t._v("icon-text")]),t._v(" string set on a "),r("code",[t._v("Point")]),t._v(" will result in a "),r("a",{attrs:{href:"https://cesiumjs.org/Cesium/Build/Documentation/LabelGraphics.html?classFilter=label",target:"_blank",rel:"noopener noreferrer"}},[t._v("LabelGraphics"),r("OutboundLink")],1),t._v(" instead of a "),r("a",{attrs:{href:"https://cesiumjs.org/Cesium/Build/Documentation/BillboardGraphics.html?classFilter=bill",target:"_blank",rel:"noopener noreferrer"}},[t._v("BillboardGraphics"),r("OutboundLink")],1),t._v(", which uses the styling options of the feature")])]),t._v(" "),r("h3",{attrs:{id:"dynamic-styling"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#dynamic-styling"}},[t._v("#")]),t._v(" Dynamic styling")]),t._v(" "),r("p",[t._v("The same than for "),r("RouterLink",{attrs:{to:"/api/map/map-mixins.html#dynamic-styling"}},[t._v("dynamic map style")]),t._v(" applies for globe. Note however that templating will be applied once the 3D entities have been created, which means that you cannot use templating on "),r("a",{attrs:{href:"https://github.com/mapbox/simplestyle-spec",target:"_blank",rel:"noopener noreferrer"}},[t._v("simple style spec options"),r("OutboundLink")],1),t._v(" but rather on Cesium object options set on the "),r("code",[t._v("entityStyle")]),t._v(" layer option.")],1),t._v(" "),r("p",[t._v("For instance you can change the marker color or image based on a given features's property like this:")]),t._v(" "),r("div",{staticClass:"language-js extra-class"},[r("pre",{pre:!0,attrs:{class:"language-js"}},[r("code",[r("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("entityStyle")]),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),r("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("billboard")]),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),r("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("image")]),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token template-string"}},[r("span",{pre:!0,attrs:{class:"token template-punctuation string"}},[t._v("`")]),r("span",{pre:!0,attrs:{class:"token string"}},[t._v("<% if (properties.visibility < 75) { %>/statics/windyblack.png<% }\n              else if (properties.visibility < 300) { %>/statics/windyred.png<% }\n              else if (properties.visibility < 1500) { %>/statics/windyorange.png<% }\n              else if (properties.visibility < 3000) { %>/statics/windyyellow.png<% }\n              else { %>/statics/windygreen.png<% } %>")]),r("span",{pre:!0,attrs:{class:"token template-punctuation string"}},[t._v("`")])]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),r("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("color")]),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token template-string"}},[r("span",{pre:!0,attrs:{class:"token template-punctuation string"}},[t._v("`")]),r("span",{pre:!0,attrs:{class:"token string"}},[t._v('Cesium.Color.<% if (properties.visibility < 75) { %>BLACK<% }\n              else if (properties.visibility < 300) { %>ORANGERED<% }\n              else if (properties.visibility < 1500) { %>GOLD<% }\n              else if (properties.visibility < 3000) { %>YELLOW<% }\n              else { %>LIMEGREEN<% } %>"/>')]),r("span",{pre:!0,attrs:{class:"token template-punctuation string"}},[t._v("`")])]),t._v("\n  "),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),r("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("template")]),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),r("span",{pre:!0,attrs:{class:"token string"}},[t._v("'billboard.image'")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token string"}},[t._v("'billboard.color'")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n"),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),r("p",[t._v("You can also draw a path with a different styling on each part like this:")]),t._v(" "),r("div",{staticClass:"language-js extra-class"},[r("pre",{pre:!0,attrs:{class:"language-js"}},[r("code",[r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),r("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("type")]),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token string"}},[t._v("'FeatureCollection'")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),r("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("features")]),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),r("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("type")]),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token string"}},[t._v("'Feature'")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),r("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("properties")]),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("stroke")]),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token string"}},[t._v("'#000000'")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("weight")]),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),r("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("geometry")]),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("type")]),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token string"}},[t._v("'LineString'")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("coordinates")]),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v("...")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n  "),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),r("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("type")]),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token string"}},[t._v("'Feature'")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),r("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("properties")]),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("stroke")]),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token string"}},[t._v("'#FF00FF'")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("weight")]),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token number"}},[t._v("3")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),r("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("geometry")]),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("type")]),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token string"}},[t._v("'LineString'")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("coordinates")]),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),r("span",{pre:!0,attrs:{class:"token operator"}},[t._v("...")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v(" "),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n  "),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v("\n"),r("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),r("h2",{attrs:{id:"file-layer"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#file-layer"}},[t._v("#")]),t._v(" File Layer")]),t._v(" "),r("p",[t._v("Make it possible to drag'n'drop GeoJson or KML file on the globe. It will automatically create a new "),r("RouterLink",{attrs:{to:"/api/map/globe-mixins.html#geojson-layer"}},[t._v("GeoJson layer")]),t._v(" named after the filename on drop. As a consequence it has to be used with the GeoJson layer mixin and will use the configured styling.")],1),t._v(" "),r("h2",{attrs:{id:"globe-activity"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#globe-activity"}},[t._v("#")]),t._v(" Globe Activity")]),t._v(" "),r("p",[t._v("Make it easier to create 3D mapping activities:")]),t._v(" "),r("ul",[r("li",[r("strong",[t._v("initializeGlobe(token)")]),t._v(" setup the render engine with given Cesium ion access token, "),r("strong",[t._v("should be called first before any other method")])]),t._v(" "),r("li",[r("strong",[t._v("finalizeGlobe()")]),t._v(" destroy the render engine")])]),t._v(" "),r("div",{staticClass:"custom-block danger"},[r("p",{staticClass:"custom-block-title"},[t._v("WARNING")]),t._v(" "),r("p",[t._v("It assumes that the DOM element used by the render engine has a ref named "),r("code",[t._v("globe")])])])])}),[],!1,null,null,null);e.default=a.exports}}]);