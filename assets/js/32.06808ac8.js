(window.webpackJsonp=window.webpackJsonp||[]).push([[32],{230:function(e,t,s){"use strict";s.r(t);var r=s(0),i=Object(r.a)({},function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"content"},[e._m(0),e._v(" "),e._m(1),e._v(" "),s("p",[e._v("Used to ensure you can safely access "),s("a",{attrs:{href:"https://vuejs.org/v2/guide/components-edge-cases.html#Accessing-Child-Component-Instances-amp-Child-Elements",target:"_blank",rel:"noopener noreferrer"}},[e._v("child references"),s("OutboundLink")],1),e._v(". Indeed, refs are created by Vuejs as a result of the render function, so you don't really know when you can safely access them.")]),e._v(" "),e._m(2),e._v(" "),e._m(3),e._v(" "),s("p",[e._v("Here is a code sample:")]),e._v(" "),e._m(4),e._m(5),e._v(" "),e._m(6),e._v(" "),s("blockquote",[s("p",[e._v("Will make the currently authenticated user available in the "),s("code",[e._v("user")]),e._v(" property of the "),s("router-link",{attrs:{to:"./application.html#store"}},[e._v("global store")]),e._v(".")],1)]),e._v(" "),e._m(7),e._v(" "),s("p",[e._v("Compute user' abilities and keeps it up-to-date on user' permissions changes.")]),e._v(" "),s("blockquote",[s("p",[e._v("Abilities are stored in the "),s("code",[e._v("user.abilities")]),e._v(" property of the "),s("router-link",{attrs:{to:"./application.html#store"}},[e._v("global store")]),e._v(".")],1)]),e._v(" "),e._m(8),e._v(" "),s("p",[e._v("Make it easier to update the application layout when the user changes his current activity:")]),e._v(" "),e._m(9),e._v(" "),e._m(10),e._v(" "),e._m(11),e._v(" "),s("p",[e._v("Used to retrieve items from a specific service and keep track of real-time updates using "),s("a",{attrs:{href:"https://github.com/feathersjs-ecosystem/feathers-reactive",target:"_blank",rel:"noopener noreferrer"}},[e._v("RxJS"),s("OutboundLink")],1),e._v(":")]),e._v(" "),e._m(12),e._v(" "),s("blockquote",[s("p",[e._v("To be used with the "),s("router-link",{attrs:{to:"./mixins.html#service"}},[e._v("service mixin")]),e._v(".")],1)]),e._v(" "),e._m(13),e._v(" "),s("p",[e._v("Make it easier to setup items displayed by a collection:")]),e._v(" "),e._m(14),e._v(" "),e._m(15),e._v(" "),e._m(16),e._v(" "),e._m(17),e._v(" "),s("ul",[e._m(18),e._v(" "),e._m(19),e._v(" "),s("li",[s("strong",[e._v("getActionsForContext()")]),e._v(" can be overriden in concrete context-aware components to provide actions required by the context to be set it in the "),s("router-link",{attrs:{to:"./components.html#layout"}},[e._v("application bar")]),e._v(", default behaviour is to get the action list from the configuration "),s("code",[e._v("context.actions")]),e._v(" property.")],1)]),e._v(" "),s("p",[e._v("The context service to be used is the one set in the "),s("code",[e._v("context.service")]),e._v(" property of the "),s("router-link",{attrs:{to:"./application.html#configuration"}},[e._v("configuration")]),e._v(".")],1),e._v(" "),e._m(20),e._v(" "),s("blockquote",[s("p",[e._v("Will make the context available in the "),s("code",[e._v("context")]),e._v(" property of the "),s("router-link",{attrs:{to:"./application.html#store"}},[e._v("global store")]),e._v(".")],1)]),e._v(" "),e._m(21),e._v(" "),e._m(22),e._v(" "),s("ul",[e._m(23),e._v(" "),e._m(24),e._v(" "),s("li",[s("strong",[e._v("serviceFind/Get/Update/Patch/Remove()")]),e._v(" to perform "),s("a",{attrs:{href:"https://docs.feathersjs.com/api/services.html#service-methods",target:"_blank",rel:"noopener noreferrer"}},[e._v("service operations"),s("OutboundLink")],1)])]),e._v(" "),e._m(25),e._v(" "),e._m(26),e._v(" "),e._m(27),e._v(" "),e._m(28),e._v(" "),s("div",{staticClass:"danger custom-block"},[s("p",{staticClass:"custom-block-title"},[e._v("WARNING")]),e._v(" "),s("p",[e._v("The "),s("router-link",{attrs:{to:"./mixins.html#service-proxy"}},[e._v("service mixin")]),e._v(" is mandatory when using this mixin.")],1)]),e._v(" "),e._m(29),e._v(" "),s("p",[e._v("Make it easier to access an underlying "),s("a",{attrs:{href:"https://json-schema.org/",target:"_blank",rel:"noopener noreferrer"}},[e._v("JSON schema"),s("OutboundLink")],1),e._v(" object for a given service from the "),s("strong",[e._v("schema-name")]),e._v(", "),s("strong",[e._v("service")]),e._v(" or "),s("strong",[e._v("schema-json")]),e._v(" props:")]),e._v(" "),e._m(30),e._v(" "),s("p",[e._v("If a JSON schema is directly provided (as a string) it will be parsed, otherwise it will load a schema file which name is computed like this:")]),e._v(" "),e._m(31),e._v(" "),s("div",{staticClass:"warning custom-block"},[s("p",{staticClass:"custom-block-title"},[e._v("WARNING")]),e._v(" "),s("p",[e._v("This mixin has been designed to be used with the "),s("router-link",{attrs:{to:"./mixins.html#service-proxy"}},[e._v("service mixin")]),e._v(" and the "),s("router-link",{attrs:{to:"./mixins.html#object-proxy"}},[e._v("object mixin")]),e._v(".")],1)]),e._v(" "),e._m(32),e._v(" "),e._m(33),e._v(" "),s("p",[e._v("Make it easier to build "),s("router-link",{attrs:{to:"./components.html#editors"}},[e._v("editors")]),e._v(" from "),s("strong",[e._v("baseObject")]),e._v(" and "),s("strong",[e._v("baseQuery")]),e._v(" props, as well as props defined on associated mixins:")],1),e._v(" "),s("ul",[e._m(34),e._v(" "),e._m(35),e._v(" "),e._m(36),e._v(" "),e._m(37),e._v(" "),e._m(38),e._v(" "),e._m(39),e._v(" "),e._m(40),e._v(" "),e._m(41),e._v(" "),e._m(42),e._v(" "),e._m(43),e._v(" "),s("li",[s("strong",[e._v("refresh()")]),e._v(" setups all the underlying objects to make it ready for edition\n"),s("ol",[s("li",[s("router-link",{attrs:{to:"./mixins.html#service-proxy"}},[e._v("load service")]),e._v(" from the "),s("strong",[e._v("contextId")]),e._v(" and "),s("strong",[e._v("service")]),e._v(" props")],1),e._v(" "),s("li",[s("router-link",{attrs:{to:"./mixins.html#schema-proxy"}},[e._v("load schema")]),e._v(" from the "),s("strong",[e._v("schema-name")]),e._v(", "),s("strong",[e._v("service")]),e._v(" or "),s("strong",[e._v("schema-json")]),e._v(" props")],1),e._v(" "),s("li",[s("router-link",{attrs:{to:"./mixins.html#object-proxy"}},[e._v("load object")]),e._v(" from the "),s("strong",[e._v("objectId")]),e._v(" and "),s("strong",[e._v("perspective")]),e._v(" props")],1),e._v(" "),s("li",[s("router-link",{attrs:{to:"./mixins.html#refs-resolver"}},[e._v("load form refs")]),e._v(" from the set of "),s("strong",[e._v("refs")]),e._v(" that have been defined")],1),e._v(" "),s("li",[s("router-link",{attrs:{to:"./components.html#forms"}},[e._v("build forms")])],1),e._v(" "),s("li",[s("router-link",{attrs:{to:"./components.html#forms"}},[e._v("fill forms")])],1)])])]),e._v(" "),s("div",{staticClass:"danger custom-block"},[s("p",{staticClass:"custom-block-title"},[e._v("WARNING")]),e._v(" "),s("p",[e._v("This mixin has been designed to be used with the "),s("router-link",{attrs:{to:"./mixins.html#service-proxy"}},[e._v("service mixin")]),e._v(", the "),s("router-link",{attrs:{to:"./mixins.html#schema-proxy"}},[e._v("schema mixin")]),e._v(", the "),s("router-link",{attrs:{to:"./mixins.html#object-proxy"}},[e._v("object mixin")]),e._v(" and the "),s("router-link",{attrs:{to:"./mixins.html#refs-resolver"}},[e._v("refs resolver mixin")]),e._v(".")],1)]),e._v(" "),e._m(44),e._v(" "),s("p",[e._v("Check out a code example "),s("a",{attrs:{href:"https://github.com/kalisio/kCore/blob/master/src/client/components/editor",target:"_blank",rel:"noopener noreferrer"}},[e._v("here"),s("OutboundLink")],1),e._v(" to see how to create your own editors.")]),e._v(" "),e._m(45),e._v(" "),s("p",[e._v("Make it easier to build "),s("router-link",{attrs:{to:"./components.html#editors"}},[e._v("form fields")]),e._v(" from the "),s("strong",[e._v("properties")]),e._v(" and "),s("strong",[e._v("display")]),e._v(" props:")],1),e._v(" "),s("ul",[e._m(46),e._v(" "),e._m(47),e._v(" "),e._m(48),e._v(" "),e._m(49),e._v(" "),e._m(50),e._v(" "),e._m(51),e._v(" "),s("li",[s("strong",[e._v("onChanged()")]),e._v(" emits the "),s("code",[e._v("field-changed")]),e._v(" event whenever the field value has changed, consequently the form will validate or invalidate the field, should be binded in template to events like "),s("a",{attrs:{href:"https://v0-14.quasar-framework.org/components/input.html#Vue-Events",target:"_blank",rel:"noopener noreferrer"}},[s("code",[e._v("blur")]),s("OutboundLink")],1),e._v(".")])]),e._v(" "),s("p",[s("a",{attrs:{href:"https://v0-14.quasar-framework.org/components/field.html",target:"_blank",rel:"noopener noreferrer"}},[e._v("Quasar field components"),s("OutboundLink")],1),e._v(" are usually used to implement form fields, the given set of computed properties are available to be bound:")]),e._v(" "),e._m(52),e._v(" "),e._m(53),e._v(" "),s("p",[e._v("Check out a code example "),s("a",{attrs:{href:"https://github.com/kalisio/kCore/blob/master/src/client/components/form",target:"_blank",rel:"noopener noreferrer"}},[e._v("here"),s("OutboundLink")],1),e._v(" to see how to create your own fields.")]),e._v(" "),e._m(54),e._v(" "),s("p",[e._v("Make it easier to display information about client and API versions in applications:")]),e._v(" "),e._m(55)])},[function(){var e=this.$createElement,t=this._self._c||e;return t("h1",{attrs:{id:"mixins"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#mixins","aria-hidden":"true"}},[this._v("#")]),this._v(" Mixins")])},function(){var e=this.$createElement,t=this._self._c||e;return t("h2",{attrs:{id:"refs-resolver"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#refs-resolver","aria-hidden":"true"}},[this._v("#")]),this._v(" Refs Resolver")])},function(){var e=this.$createElement,t=this._self._c||e;return t("ul",[t("li",[t("strong",[this._v("setRefs(refs)")]),this._v(" sets the array of reference names to be resolved on your component")]),this._v(" "),t("li",[t("strong",[this._v("async loadRefs()")]),this._v(" returns a promise resolved when the all the refs have been created")])])},function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"tip custom-block"},[t("p",{staticClass:"custom-block-title"},[this._v("TIP")]),this._v(" "),t("p",[this._v("If you don't need to dynamically change the set of refs to be accessible you can directly set them when initializing the mixin in your component.")])])},function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token operator"}},[e._v("<")]),e._v("template"),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v(">")]),e._v("\n  "),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v("<")]),e._v("my"),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v("-")]),e._v("child"),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v("-")]),e._v("component ref"),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v("=")]),s("span",{pre:!0,attrs:{class:"token string"}},[e._v('"child"')]),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v("/")]),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v(">")]),e._v("\n"),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v("<")]),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v("/")]),e._v("template"),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v(">")]),e._v("\n\n"),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v("<")]),e._v("script"),s("span",{pre:!0,attrs:{class:"token operator"}},[e._v(">")]),e._v("\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("import")]),e._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("{")]),e._v(" mixins "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("}")]),e._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("from")]),e._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[e._v("'@kalisio/kdk-core/client'")]),e._v("\n\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("export")]),e._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("default")]),e._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("{")]),e._v("\n  name"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(":")]),e._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[e._v("'MyComponent'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v("\n\tmixins"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(":")]),e._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("[")]),e._v("\n  \tmixins"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("refsResolver")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("[")]),s("span",{pre:!0,attrs:{class:"token string"}},[e._v("'child'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("]")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(")")]),e._v("\n\t"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("]")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(",")]),e._v("\n  methods"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(":")]),e._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("{")]),e._v("\n  \t"),s("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("async")]),e._v(" "),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("foo")]),e._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(")")]),e._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("{")]),e._v("\n  \t\t"),s("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("await")]),e._v(" "),s("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("this")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("loadRefs")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(")")]),e._v("\n  \t\t"),s("span",{pre:!0,attrs:{class:"token comment"}},[e._v("// We can now safely acces the ref")]),e._v("\n  \t\t"),s("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("this")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(".")]),e._v("$refs"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(".")]),e._v("child"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[e._v("build")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(")")]),e._v("\n  \t"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("}")]),e._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("}")]),e._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("}")]),e._v("\n")])])])},function(){var e=this.$createElement,t=this._self._c||e;return t("h2",{attrs:{id:"authentication"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#authentication","aria-hidden":"true"}},[this._v("#")]),this._v(" Authentication")])},function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("p",[e._v("Provide basic methods to "),s("strong",[e._v("register(user)")]),e._v(", "),s("strong",[e._v("login(email, password)")]),e._v(", "),s("strong",[e._v("logout()")]),e._v(", and "),s("strong",[e._v("restoreSession()")]),e._v(".")])},function(){var e=this.$createElement,t=this._self._c||e;return t("h2",{attrs:{id:"authorisation"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#authorisation","aria-hidden":"true"}},[this._v("#")]),this._v(" Authorisation")])},function(){var e=this.$createElement,t=this._self._c||e;return t("h2",{attrs:{id:"base-activity"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#base-activity","aria-hidden":"true"}},[this._v("#")]),this._v(" Base Activity")])},function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("ul",[s("li",[s("strong",[e._v("clearTitle()/setTitle()")]),e._v(" (un)sets the application bar title in store "),s("code",[e._v("appBar")]),e._v(" property")]),e._v(" "),s("li",[s("strong",[e._v("clearActions()/registerAction(type, action)")]),e._v(" (un)registers actions to be used by the activity\n"),s("ul",[s("li",[s("strong",[e._v("registerFabAction()")]),e._v(" registers actions to be used in action button, "),s("code",[e._v("type = 'fab'")])]),e._v(" "),s("li",[s("strong",[e._v("registerTabAction()")]),e._v(" registers actions to be used in navigation bar, "),s("code",[e._v("type = 'tabBar'")])])])]),e._v(" "),s("li",[s("strong",[e._v("clear/setRightPanelContent(component, content)")]),e._v(" (un)sets the application right panel in store "),s("code",[e._v("rightPanel")]),e._v(" property")]),e._v(" "),s("li",[s("strong",[e._v("clear/setSearchBar(field, services)")]),e._v(" (un)sets the application search bar in store "),s("code",[e._v("searchBar")]),e._v(" property")]),e._v(" "),s("li",[s("strong",[e._v("clearActivity()")]),e._v(" resets actions/title used by the activity")]),e._v(" "),s("li",[s("strong",[e._v("refreshActivity()")]),e._v(" should be overriden in concrete activities to implement action registration and title - search bar - right panel setup")])])},function(){var e=this.$createElement,t=this._self._c||e;return t("blockquote",[t("p",[this._v("Causes the activity to be automatically refreshed on user' permissions changes or route change.")])])},function(){var e=this.$createElement,t=this._self._c||e;return t("h2",{attrs:{id:"base-collection"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#base-collection","aria-hidden":"true"}},[this._v("#")]),this._v(" Base Collection")])},function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("ul",[s("li",[s("strong",[e._v("(un)subscribe()")]),e._v(" causes the component to (un)subscribe to real-time events")]),e._v(" "),s("li",[s("strong",[e._v("refreshCollection()")]),e._v(" queries the service to retrive items according to current pagination settings")]),e._v(" "),s("li",[s("strong",[e._v("getCollectionBaseQuery()")]),e._v(" should be overriden in concrete activities to implement any required parameter in the base query")]),e._v(" "),s("li",[s("strong",[e._v("getCollectionFilterQuery()")]),e._v(" should be overriden in concrete activities to provide any filtering parameter")])])},function(){var e=this.$createElement,t=this._self._c||e;return t("h2",{attrs:{id:"base-item"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#base-item","aria-hidden":"true"}},[this._v("#")]),this._v(" Base Item")])},function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("ul",[s("li",[s("strong",[e._v("clearActions()/registerAction(type, action)")]),e._v(" (un)registers actions to be used on the item\n"),s("ul",[s("li",[s("strong",[e._v("registerPaneAction()")]),e._v(" registers actions to be used in item pane, "),s("code",[e._v("type = 'pane'")])]),e._v(" "),s("li",[s("strong",[e._v("registerMenuAction()")]),e._v(" registers actions to be used in item menu, "),s("code",[e._v("type = 'menu'")])])])]),e._v(" "),s("li",[s("strong",[e._v("refreshActions()")]),e._v(" should be overriden in concrete items to implement action registration")])])},function(){var e=this.$createElement,t=this._self._c||e;return t("blockquote",[t("p",[this._v("Causes the item actions to be automatically refreshed on user' permissions changes.")])])},function(){var e=this.$createElement,t=this._self._c||e;return t("h2",{attrs:{id:"base-context"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#base-context","aria-hidden":"true"}},[this._v("#")]),this._v(" Base Context")])},function(){var e=this.$createElement,t=this._self._c||e;return t("p",[this._v("Retrieve the current context of the application from the "),t("strong",[this._v("contextId")]),this._v(" props, usually set on the target route:")])},function(){var e=this.$createElement,t=this._self._c||e;return t("li",[t("strong",[this._v("clearContext()")]),this._v(" clears actions set by the context and context in store")])},function(){var e=this.$createElement,t=this._self._c||e;return t("li",[t("strong",[this._v("refreshContext()")]),this._v(" clears the current context if "),t("strong",[this._v("contextId")]),this._v(" is not set or retrieve it if different from current one")])},function(){var e=this.$createElement,t=this._self._c||e;return t("blockquote",[t("p",[this._v("Causes the context to be automatically refreshed on route change.")])])},function(){var e=this.$createElement,t=this._self._c||e;return t("h2",{attrs:{id:"service-proxy"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#service-proxy","aria-hidden":"true"}},[this._v("#")]),this._v(" Service Proxy")])},function(){var e=this.$createElement,t=this._self._c||e;return t("p",[this._v("Make it easier to access an underlying service from the "),t("strong",[this._v("contextId")]),this._v(" and "),t("strong",[this._v("service")]),this._v(" props:")])},function(){var e=this.$createElement,t=this._self._c||e;return t("li",[t("strong",[this._v("getService()")]),this._v(" to retrieve the service")])},function(){var e=this.$createElement,t=this._self._c||e;return t("li",[t("strong",[this._v("loadService()")]),this._v(" causes the service to be resolved for current properties values")])},function(){var e=this.$createElement,t=this._self._c||e;return t("h2",{attrs:{id:"object-proxy"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#object-proxy","aria-hidden":"true"}},[this._v("#")]),this._v(" Object Proxy")])},function(){var e=this.$createElement,t=this._self._c||e;return t("p",[this._v("Make it easier to access an underlying object of a given service from the "),t("strong",[this._v("objectId")]),this._v(" and "),t("strong",[this._v("perspective")]),this._v(" props:")])},function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("ul",[s("li",[s("strong",[e._v("getObject()")]),e._v(" to retrieve the service object")]),e._v(" "),s("li",[s("strong",[e._v("getObjectId()")]),e._v(" to retrieve the service object ID")]),e._v(" "),s("li",[s("strong",[e._v("loadObject()")]),e._v(" causes the service object to be resolved for current properties values")])])},function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"tip custom-block"},[t("p",{staticClass:"custom-block-title"},[this._v("TIP")]),this._v(" "),t("p",[this._v("If a perspective is configured only that perspective will be retrieved.")])])},function(){var e=this.$createElement,t=this._self._c||e;return t("h2",{attrs:{id:"schema-proxy"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#schema-proxy","aria-hidden":"true"}},[this._v("#")]),this._v(" Schema Proxy")])},function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("ul",[s("li",[s("strong",[e._v("getSchema()")]),e._v(" to retrieve the schema object")]),e._v(" "),s("li",[s("strong",[e._v("getSchemaId()")]),e._v(" to retrieve the schema object ID")]),e._v(" "),s("li",[s("strong",[e._v("getSchemaName()")]),e._v(" to retrieve the schema name")]),e._v(" "),s("li",[s("strong",[e._v("loadSchema()")]),e._v(" causes the schema object to be resolved for current properties values")])])},function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("ul",[s("li",[e._v("basename is the given schema name or service name")]),e._v(" "),s("li",[e._v("suffix is "),s("code",[e._v(".update")]),e._v(" if the "),s("code",[e._v("objectId")]),e._v(" props is defined or "),s("code",[e._v(".create")]),e._v(" otherwise")]),e._v(" "),s("li",[s("code",[e._v("-perspective")]),e._v(" is added to suffix if the "),s("code",[e._v("perspective")]),e._v(" props is defined")]),e._v(" "),s("li",[e._v("extension is always "),s("code",[e._v(".json")])])])},function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("p",[e._v("For instance, if you set props like this "),s("code",[e._v('<my-editor service="users"/>')]),e._v(" on your component using the mixins, the "),s("code",[e._v("users.create.json")]),e._v(" schema file will be loaded. If you set props like this "),s("code",[e._v('<my-editor service="users" :objectId="objectId" perspective="profile"/>')]),e._v(", the "),s("code",[e._v("users.update-profile.json")]),e._v(" schema file will be loaded.")])},function(){var e=this.$createElement,t=this._self._c||e;return t("h2",{attrs:{id:"base-editor"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#base-editor","aria-hidden":"true"}},[this._v("#")]),this._v(" Base Editor")])},function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("li",[s("strong",[e._v("getMode()")]),e._v(" returns "),s("code",[e._v("updated")]),e._v(" or "),s("code",[e._v("create")]),e._v(" depending if the "),s("strong",[e._v("objectId")]),e._v(" props is defined or not")])},function(){var e=this.$createElement,t=this._self._c||e;return t("li",[t("strong",[this._v("setFormDisabled(name, disabled)")]),this._v(" used to disable/enable a given form by its refs name")])},function(){var e=this.$createElement,t=this._self._c||e;return t("li",[t("strong",[this._v("fillEditor()")]),this._v(" fill all forms with current object values")])},function(){var e=this.$createElement,t=this._self._c||e;return t("li",[t("strong",[this._v("clear()")]),this._v(" clear all forms back to default values")])},function(){var e=this.$createElement,t=this._self._c||e;return t("li",[t("strong",[this._v("validateForms()")]),this._v(" validate all forms")])},function(){var e=this.$createElement,t=this._self._c||e;return t("li",[t("strong",[this._v("applyForms()")]),this._v(" call "),t("strong",[this._v("apply()")]),this._v(" on all forms")])},function(){var e=this.$createElement,t=this._self._c||e;return t("li",[t("strong",[this._v("submittedForms()")]),this._v(" call "),t("strong",[this._v("submitted()")]),this._v(" on all forms")])},function(){var e=this.$createElement,t=this._self._c||e;return t("li",[t("strong",[this._v("getBaseObject()")]),this._v(" return retrieved object from service or input base object as defined in "),t("strong",[this._v("baseObject")]),this._v(" props, if a perspective is defined through the "),t("strong",[this._v("perspective")]),this._v(" props only that perspective is returned.")])},function(){var e=this.$createElement,t=this._self._c||e;return t("li",[t("strong",[this._v("getBaseQuery()")]),this._v(" return input base query as defined in "),t("strong",[this._v("baseQuery")]),this._v(" props, will automatically add object ID and perspective to query if any defined")])},function(){var e=this.$createElement,t=this._self._c||e;return t("li",[t("strong",[this._v("async apply(event, done)")]),this._v(" setups all the underlying objects to make it ready for edition")])},function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"tip custom-block"},[t("p",{staticClass:"custom-block-title"},[this._v("TIP")]),this._v(" "),t("p",[this._v("The "),t("strong",[this._v("baseObject")]),this._v(' props is usually used to keep track of existing or additional "hidden" or "internal" properties in addition to the ones edited throught the form.')])])},function(){var e=this.$createElement,t=this._self._c||e;return t("h2",{attrs:{id:"base-field"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#base-field","aria-hidden":"true"}},[this._v("#")]),this._v(" Base Field")])},function(){var e=this.$createElement,t=this._self._c||e;return t("li",[t("strong",[this._v("emptyModel()")]),this._v(' get the default "empty" value of the field, returns an empty string by default')])},function(){var e=this.$createElement,t=this._self._c||e;return t("li",[t("strong",[this._v("clear()")]),this._v(" set the current value of the field to be the default one if provided through "),t("code",[this._v("properties.field.default")]),this._v(', use "empty" model value otherwise')])},function(){var e=this.$createElement,t=this._self._c||e;return t("li",[t("strong",[this._v("value()")]),this._v(" get the current value of the field, simply gets the value from model by default")])},function(){var e=this.$createElement,t=this._self._c||e;return t("li",[t("strong",[this._v("fill(value)")]),this._v(" set the current value of the field, simply copies the value as model by default")])},function(){var e=this.$createElement,t=this._self._c||e;return t("li",[t("strong",[this._v("apply (object, field)")]),this._v(" applies the current field value on the given target object, simply copies the value in the object by default, to be overloaded if you need to perform specific operations before the form has been submitted")])},function(){var e=this.$createElement,t=this._self._c||e;return t("li",[t("strong",[this._v("submitted (object, field)")]),this._v(" does nothing by default, to be overloaded if you need to perform specific operations after the form has been submitted")])},function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("ul",[s("li",[s("strong",[e._v("icon")]),e._v(" alias for "),s("code",[e._v("properties.field.icon")]),e._v(" if "),s("code",[e._v("display.icon")]),e._v(" is "),s("code",[e._v("true")]),e._v(", empty by default")]),e._v(" "),s("li",[s("strong",[e._v("label")]),e._v(" alias for "),s("code",[e._v("properties.field.label")]),e._v(" if "),s("code",[e._v("display.label")]),e._v(" is "),s("code",[e._v("true")]),e._v(", empty by default")]),e._v(" "),s("li",[s("strong",[e._v("helper")]),e._v(" alias for "),s("code",[e._v("properties.field.helper")])]),e._v(" "),s("li",[s("strong",[e._v("disabled")]),e._v(" alias for "),s("code",[e._v("properties.field.disabled")]),e._v(", "),s("code",[e._v("false")]),e._v(" by default")]),e._v(" "),s("li",[s("strong",[e._v("hasError")]),e._v(" boolean indicating if a validation error has occured")]),e._v(" "),s("li",[s("strong",[e._v("errorLabel")]),e._v(" alias for "),s("code",[e._v("properties.field.errorLabel")]),e._v(", empty by default")])])},function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"tip custom-block"},[s("p",{staticClass:"custom-block-title"},[e._v("TIP")]),e._v(" "),s("p",[s("strong",[e._v("label")]),e._v(", "),s("strong",[e._v("helper")]),e._v(" and "),s("strong",[e._v("errorLabel")]),e._v(" properties will be automatically internationalized if corresponding values are valid translation keys.")])])},function(){var e=this.$createElement,t=this._self._c||e;return t("h2",{attrs:{id:"version"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#version","aria-hidden":"true"}},[this._v("#")]),this._v(" Version")])},function(){var e=this.$createElement,t=this._self._c||e;return t("ul",[t("li",[t("strong",[this._v("refreshVersionNames()")]),this._v(" retrieves the version information, it will be stored in "),t("code",[this._v("clientVersionName")]),this._v(" and "),t("code",[this._v("apiVersionName")]),this._v(" data variables")])])}],!1,null,null,null);i.options.__file="mixins.md";t.default=i.exports}}]);