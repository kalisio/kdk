# Changelog

## [v1.5.0](https://github.com/kalisio/kdk/tree/v1.5.0) (2022-01-07)

[Full Changelog](https://github.com/kalisio/kdk/compare/v1.4.2...v1.5.0)

**Implemented enhancements:**

- The capture action should take into account the current activity \(map or globe\) [\#507](https://github.com/kalisio/kdk/issues/507)
- Handle the current time within the map context [\#503](https://github.com/kalisio/kdk/issues/503)
- Features filter should sort the list of values alphabetically to ease selection [\#405](https://github.com/kalisio/kdk/issues/405)
- Provide measurements capabilities [\#359](https://github.com/kalisio/kdk/issues/359)

**Fixed bugs:**

- Content filter does not work on items in an array [\#512](https://github.com/kalisio/kdk/issues/512)
- Layer selector should not be wrapped [\#509](https://github.com/kalisio/kdk/issues/509)
- User context not correctly restored from URL for a single layer [\#506](https://github.com/kalisio/kdk/issues/506)
- Built-in layers should not be part of user context [\#505](https://github.com/kalisio/kdk/issues/505)
- The capture action should take into account the current time [\#504](https://github.com/kalisio/kdk/issues/504)
- Editing layer style : Marker color selector won't preselect the current color [\#502](https://github.com/kalisio/kdk/issues/502)
- Edit layer style : Adding space in Tooltip between text and drop menu [\#501](https://github.com/kalisio/kdk/issues/501)
- None of Popup, Tooltip and Information box display option working in style editor [\#499](https://github.com/kalisio/kdk/issues/499)
- Station properties lost when a measure is available [\#510](https://github.com/kalisio/kdk/issues/510)

**Merged pull requests:**

- chore\(deps\): bump mermaid from 8.13.5 to 8.13.8 in /docs [\#513](https://github.com/kalisio/kdk/pull/513) ([dependabot[bot]](https://github.com/apps/dependabot))
- chore\(deps\): bump mermaid from 8.8.4 to 8.13.5 in /docs [\#498](https://github.com/kalisio/kdk/pull/498) ([dependabot[bot]](https://github.com/apps/dependabot))

## [v1.4.2](https://github.com/kalisio/kdk/tree/v1.4.2) (2021-12-09)

[Full Changelog](https://github.com/kalisio/kdk/compare/v1.4.1...v1.4.2)

**Fixed bugs:**

- Impossible to load some GPX files [\#497](https://github.com/kalisio/kdk/issues/497)
- The import dialog should not allow to import layers with unsupported mime types [\#496](https://github.com/kalisio/kdk/issues/496)
- Closing the mapillary widget does not stop playing [\#495](https://github.com/kalisio/kdk/issues/495)

## [v1.4.1](https://github.com/kalisio/kdk/tree/v1.4.1) (2021-11-24)

[Full Changelog](https://github.com/kalisio/kdk/compare/v1.4.0...v1.4.1)

**Implemented enhancements:**

- Add export data action in timeseries widget  [\#491](https://github.com/kalisio/kdk/issues/491)
- Enhance feature aggregation to manage forecast data [\#488](https://github.com/kalisio/kdk/issues/488)
- Provide a map capture component  [\#487](https://github.com/kalisio/kdk/issues/487)
- The import component does not allow to import GPX [\#484](https://github.com/kalisio/kdk/issues/484)
- Homogenize client side file reading  [\#483](https://github.com/kalisio/kdk/issues/483)
- When dropping/importing a GeoJSON file we should zoom to the given bbox if defined [\#475](https://github.com/kalisio/kdk/issues/475)
- Improve online help [\#33](https://github.com/kalisio/kdk/issues/33)
- Feature aggregation is slow [\#81](https://github.com/kalisio/kdk/issues/81)

**Fixed bugs:**

- Draw mode in location input exhibits a location marker [\#494](https://github.com/kalisio/kdk/issues/494)
- asGeoJson hook does not handle geometry collection [\#493](https://github.com/kalisio/kdk/issues/493)
- getContextParameters in mixin.context should filter system layers and temporary layers [\#492](https://github.com/kalisio/kdk/issues/492)
- asGeoJson hook does not return geometry if longitude/latitude properties are also available [\#486](https://github.com/kalisio/kdk/issues/486)
- Impossible to import map layer with self-intersecting lines [\#485](https://github.com/kalisio/kdk/issues/485)
- KColumn does not handle pagination correctly [\#482](https://github.com/kalisio/kdk/issues/482)
- mixin base collection should take into account the sort base query to sort the items [\#481](https://github.com/kalisio/kdk/issues/481)
- KHistory should take into account a date field [\#480](https://github.com/kalisio/kdk/issues/480)
- Time range query should take into account a given field [\#479](https://github.com/kalisio/kdk/issues/479)
- Time range query is not initialized in Time.js [\#478](https://github.com/kalisio/kdk/issues/478)
- Saved user settings are erased by default values [\#477](https://github.com/kalisio/kdk/issues/477)
- Mapillary viewer not synchronized correctly with coverage layer [\#133](https://github.com/kalisio/kdk/issues/133)
- PDF files cannot be selected in KUploader on a mobile application [\#101](https://github.com/kalisio/kdk/issues/101)
- OAuth2 does not work in mobile apps [\#85](https://github.com/kalisio/kdk/issues/85)

## [v1.4.0](https://github.com/kalisio/kdk/tree/v1.4.0) (2021-10-22)

[Full Changelog](https://github.com/kalisio/kdk/compare/v1.3.6...v1.4.0)

**Implemented enhancements:**

- Allow to draw a mask using a given GeoJSON polygon  [\#476](https://github.com/kalisio/kdk/issues/476)
- Use Control.fileLayerLoad instead of FileLoader in mixin.file-layers.js [\#472](https://github.com/kalisio/kdk/issues/472)
- Enhance layer selector UI [\#471](https://github.com/kalisio/kdk/issues/471)
- Allow to specify a color map on layers without variables [\#469](https://github.com/kalisio/kdk/issues/469)
- Update role field in AddMember UI [\#468](https://github.com/kalisio/kdk/issues/468)
- Allow to set whether a KSelectField is clearable or not [\#467](https://github.com/kalisio/kdk/issues/467)
- Provide helper functions to get senior roles or junior roles according a given role [\#463](https://github.com/kalisio/kdk/issues/463)
- Provide helper functions to check whether a role is senior or junior  [\#461](https://github.com/kalisio/kdk/issues/461)
- Provide a role field [\#460](https://github.com/kalisio/kdk/issues/460)
- Allow to unselect a base layer [\#459](https://github.com/kalisio/kdk/issues/459)
- KHistory must be provide month and year infomation [\#457](https://github.com/kalisio/kdk/issues/457)
- Improve permissions system to manage authorizations based on linked resources [\#437](https://github.com/kalisio/kdk/issues/437)
- Multiple collection refreshs when using sorter/filter in activity [\#432](https://github.com/kalisio/kdk/issues/432)
- Add ability to toggle items in list [\#431](https://github.com/kalisio/kdk/issues/431)
- KHistory should use collection based renderer [\#430](https://github.com/kalisio/kdk/issues/430)
- Close or cancel modal actions should be rendered using a form button [\#427](https://github.com/kalisio/kdk/issues/427)
- Support GetTile requests for WMTS layers [\#423](https://github.com/kalisio/kdk/issues/423)
- Homogenize team cards  [\#417](https://github.com/kalisio/kdk/issues/417)
- Enhance time management [\#410](https://github.com/kalisio/kdk/issues/410)
- Use geoman instead of leaflet-draw in edit layer mixin [\#378](https://github.com/kalisio/kdk/issues/378)
- Mapillary v3 API has been retired, update mapillary widget/layer to use v4 API [\#300](https://github.com/kalisio/kdk/issues/300)
- Provide a kanban component [\#296](https://github.com/kalisio/kdk/issues/296)
- Avoid fetching collection data twice on route changes [\#255](https://github.com/kalisio/kdk/issues/255)
- The navigator mixin should be able to display an icon for each available app [\#208](https://github.com/kalisio/kdk/issues/208)

**Fixed bugs:**

- Items are not correctly ordered in collections when using append mode [\#465](https://github.com/kalisio/kdk/issues/465)
- Cannot run pixi  in headless chrome due to WebGL support [\#464](https://github.com/kalisio/kdk/issues/464)
- Authorise hook function does not merge correctly a single $or query [\#462](https://github.com/kalisio/kdk/issues/462)
- KStamp does not handle the textSize prop [\#456](https://github.com/kalisio/kdk/issues/456)
- KItem should format the description using html [\#454](https://github.com/kalisio/kdk/issues/454)
- Legend displaying 2 times when saving layer [\#436](https://github.com/kalisio/kdk/issues/436)
- It is not possible to cancel when editing an icon [\#435](https://github.com/kalisio/kdk/issues/435)
- ChipsPane should allow multiple valuePath to handle various type of objects [\#434](https://github.com/kalisio/kdk/issues/434)
- Chips label should be truncated when length is too long [\#433](https://github.com/kalisio/kdk/issues/433)
- Destroying the map if a GeoJson layer is visible raises an error [\#328](https://github.com/kalisio/kdk/issues/328)

**Closed issues:**

- When deleting tag or group : not deleted in event model [\#455](https://github.com/kalisio/kdk/issues/455)
- Organisation owner should see all groups [\#450](https://github.com/kalisio/kdk/issues/450)
- Event participants : allow to call members in a specific group AND tag ? [\#446](https://github.com/kalisio/kdk/issues/446)
- Option to see members not within a group [\#445](https://github.com/kalisio/kdk/issues/445)
- Add a hook to manage standard MongoDB aggregation [\#438](https://github.com/kalisio/kdk/issues/438)

**Merged pull requests:**

- chore\(deps\): bump prismjs from 1.24.0 to 1.25.0 in /docs [\#466](https://github.com/kalisio/kdk/pull/466) ([dependabot[bot]](https://github.com/apps/dependabot))
- chore\(deps\): bump url-parse from 1.5.1 to 1.5.3 in /docs [\#441](https://github.com/kalisio/kdk/pull/441) ([dependabot[bot]](https://github.com/apps/dependabot))
- chore\(deps\): bump path-parse from 1.0.6 to 1.0.7 in /docs [\#440](https://github.com/kalisio/kdk/pull/440) ([dependabot[bot]](https://github.com/apps/dependabot))
- chore\(deps\): bump path-parse from 1.0.6 to 1.0.7 [\#439](https://github.com/kalisio/kdk/pull/439) ([dependabot[bot]](https://github.com/apps/dependabot))
- chore\(deps\): bump sanitize-html from 1.27.1 to 2.3.2 [\#353](https://github.com/kalisio/kdk/pull/353) ([dependabot[bot]](https://github.com/apps/dependabot))

## [v1.3.6](https://github.com/kalisio/kdk/tree/v1.3.6) (2021-07-15)

[Full Changelog](https://github.com/kalisio/kdk/compare/v1.3.5...v1.3.6)

**Implemented enhancements:**

- Style editor should allow to control layer visibility in globe [\#429](https://github.com/kalisio/kdk/issues/429)
- Add filtering capabilities in OWS layer field [\#428](https://github.com/kalisio/kdk/issues/428)

## [v1.3.5](https://github.com/kalisio/kdk/tree/v1.3.5) (2021-07-02)

[Full Changelog](https://github.com/kalisio/kdk/compare/v1.3.4...v1.3.5)

**Implemented enhancements:**

- Provide helper function to check view/edit/remove ability on an item [\#422](https://github.com/kalisio/kdk/issues/422)
- Allow to define a path to the value in KChipsPane [\#416](https://github.com/kalisio/kdk/issues/416)
- Allow to filter a schema according a list of fields when building a form [\#415](https://github.com/kalisio/kdk/issues/415)
- Card rendering should support a dense mode [\#414](https://github.com/kalisio/kdk/issues/414)
- Make possible to use a template string for storage service name in uploader [\#413](https://github.com/kalisio/kdk/issues/413)
- Refactor KHistory to rely on KColumn [\#412](https://github.com/kalisio/kdk/issues/412)
- Provide a generic time range component [\#411](https://github.com/kalisio/kdk/issues/411)
- Provide a way to observe the page content size [\#400](https://github.com/kalisio/kdk/issues/400)
- Make location field more user-friendly [\#399](https://github.com/kalisio/kdk/issues/399)
- Enhance the location field/map to manage any geometry type [\#397](https://github.com/kalisio/kdk/issues/397)
- Add ability to emit click events from canvas layer. [\#388](https://github.com/kalisio/kdk/issues/388)
- Provide a basic chart container [\#362](https://github.com/kalisio/kdk/issues/362)
- Provide a generic setttings component [\#317](https://github.com/kalisio/kdk/issues/317)
- Allow in-memory GeoJson be passed on GeoJson layer addition [\#94](https://github.com/kalisio/kdk/issues/94)

**Fixed bugs:**

- Gradient path width changes with min/max map zoom [\#424](https://github.com/kalisio/kdk/issues/424)
- KItemField clears the input pattern when an item is found [\#421](https://github.com/kalisio/kdk/issues/421)
- When filtering a collection the pattern is cleared if a filter item is found  [\#420](https://github.com/kalisio/kdk/issues/420)
- Changing the geometry type in realtime GeoJson layer does not work [\#406](https://github.com/kalisio/kdk/issues/406)
- Minimize and maximize actions seem mixed up on KWindow [\#402](https://github.com/kalisio/kdk/issues/402)
- List of values is incomplete when editing the features filter [\#404](https://github.com/kalisio/kdk/issues/404)
- FR version : data export generates .cvs instead of .csv [\#403](https://github.com/kalisio/kdk/issues/403)
- HistoryEntry card is not correclty aligned on the left side [\#401](https://github.com/kalisio/kdk/issues/401)
- Exclusive option not taken into account in user-defined categories [\#395](https://github.com/kalisio/kdk/issues/395)

## [v1.3.4](https://github.com/kalisio/kdk/tree/v1.3.4) (2021-06-08)

[Full Changelog](https://github.com/kalisio/kdk/compare/v1.3.3...v1.3.4)

**Implemented enhancements:**

- Allow KChipsField to be used without icon edition [\#390](https://github.com/kalisio/kdk/issues/390)
- Enhance KMenu rendering with a dropdown icon [\#386](https://github.com/kalisio/kdk/issues/386)
- Allow to specify a schema name to an editor [\#381](https://github.com/kalisio/kdk/issues/381)
- Collections empty section should not be defined using an absolute position [\#377](https://github.com/kalisio/kdk/issues/377)
- Allow location map to be embedded in a card [\#373](https://github.com/kalisio/kdk/issues/373)
- Provide an helper component to display a color [\#371](https://github.com/kalisio/kdk/issues/371)
- Provide an helper component to create card sections [\#369](https://github.com/kalisio/kdk/issues/369)
- Enhance card rendering [\#368](https://github.com/kalisio/kdk/issues/368)
-  Disable hiding action button label when screen gets too small [\#367](https://github.com/kalisio/kdk/issues/367)
- Add ability to configure the opacity of a WMS layer in style editor [\#366](https://github.com/kalisio/kdk/issues/366)
- Support temporal requests for WMS layers [\#363](https://github.com/kalisio/kdk/issues/363)

**Fixed bugs:**

- Editing toast appear when removing a layer [\#394](https://github.com/kalisio/kdk/issues/394)
- KChangeRole no longer handle multiple resources [\#389](https://github.com/kalisio/kdk/issues/389)
- Select field must be clearable [\#387](https://github.com/kalisio/kdk/issues/387)
- General abilities are lost in query for find operations [\#385](https://github.com/kalisio/kdk/issues/385)
- User abilities modified in place [\#384](https://github.com/kalisio/kdk/issues/384)
- KLocationMap is not refreshed when updating the location [\#383](https://github.com/kalisio/kdk/issues/383)
- Cannot unselect the icon in the KIconChooser [\#382](https://github.com/kalisio/kdk/issues/382)
- Default edit action in based-item mixin does not handle query params [\#380](https://github.com/kalisio/kdk/issues/380)
- Wrong date on probe tooltip [\#370](https://github.com/kalisio/kdk/issues/370)
- WMS legend not shown when switching between multiple WMS layers [\#365](https://github.com/kalisio/kdk/issues/365)
- WMS legend not shown when the layer is active by default [\#364](https://github.com/kalisio/kdk/issues/364)
- Dragging while editing a polyline/polygon adds a new point [\#361](https://github.com/kalisio/kdk/issues/361)
- Tiled mesh/wind layers based on a weacast grid source do not work with levels [\#346](https://github.com/kalisio/kdk/issues/346)
- Deleting the layer while being edited leaves activity in edit mode [\#376](https://github.com/kalisio/kdk/issues/376)

## [v1.3.3](https://github.com/kalisio/kdk/tree/v1.3.3) (2021-05-13)

[Full Changelog](https://github.com/kalisio/kdk/compare/v1.3.2...v1.3.3)

**Implemented enhancements:**

- Provide a specified base layers selector [\#358](https://github.com/kalisio/kdk/issues/358)
- Enhance collection filtering [\#348](https://github.com/kalisio/kdk/issues/348)

**Fixed bugs:**

- Cannot connect to WFS service supporting geojson output [\#354](https://github.com/kalisio/kdk/issues/354)
-  Cordova apps don't respect Apple app privacy guideline [\#352](https://github.com/kalisio/kdk/issues/352)
- Wrong Y axis in timeseries widget [\#351](https://github.com/kalisio/kdk/issues/351)
- Empty category in catalog [\#350](https://github.com/kalisio/kdk/issues/350)
- Tiled features layer not correctly updated when panning [\#273](https://github.com/kalisio/kdk/issues/273)
- Cannot add two layers with different translation keys but the same label [\#147](https://github.com/kalisio/kdk/issues/147)
- Adding/removing a member does not trigger real-time update for user GUI [\#102](https://github.com/kalisio/kdk/issues/102)

## [v1.3.2](https://github.com/kalisio/kdk/tree/v1.3.2) (2021-05-04)

[Full Changelog](https://github.com/kalisio/kdk/compare/v1.3.1...v1.3.2)

## [v1.3.1](https://github.com/kalisio/kdk/tree/v1.3.1) (2021-05-04)

[Full Changelog](https://github.com/kalisio/kdk/compare/v1.3.0...v1.3.1)

**Fixed bugs:**

- Incorrect path in position indicator component [\#349](https://github.com/kalisio/kdk/issues/349)

## [v1.3.0](https://github.com/kalisio/kdk/tree/v1.3.0) (2021-05-04)

[Full Changelog](https://github.com/kalisio/kdk/compare/v1.2.1...v1.3.0)

**Implemented enhancements:**

- KFileField should support CSV files [\#343](https://github.com/kalisio/kdk/issues/343)
- Provide a color field [\#342](https://github.com/kalisio/kdk/issues/342)
- Allow to apply a theme [\#341](https://github.com/kalisio/kdk/issues/341)
- KTextareaField should allow to include hyperlinks [\#340](https://github.com/kalisio/kdk/issues/340)
- Enhance the way to prompt the user when removing an item [\#339](https://github.com/kalisio/kdk/issues/339)
- Allow to stop event propagation in KAction [\#338](https://github.com/kalisio/kdk/issues/338)
- Make team activities sortable [\#337](https://github.com/kalisio/kdk/issues/337)
- Allow to filter the members according the role and the invitation status [\#335](https://github.com/kalisio/kdk/issues/335)
- Allow to assign an avatar to an organisation  [\#333](https://github.com/kalisio/kdk/issues/333)
- Provide an helper component to display an avatar [\#332](https://github.com/kalisio/kdk/issues/332)
- Inject the service within the items [\#329](https://github.com/kalisio/kdk/issues/329)
- Factorize code to display geographic coordinates and allow support of additional formats [\#326](https://github.com/kalisio/kdk/issues/326)
- Add a message indicating why a layer is disabled [\#323](https://github.com/kalisio/kdk/issues/323)
- Support to only select an icon without a color in icon chooser [\#321](https://github.com/kalisio/kdk/issues/321)
- Support line awesome in icon chooser [\#320](https://github.com/kalisio/kdk/issues/320)
- Add a feature to manage layer categories in catalog [\#319](https://github.com/kalisio/kdk/issues/319)
- Enhance form fields label display [\#315](https://github.com/kalisio/kdk/issues/315)
- Enhance location search with automatic zoom and map marker [\#313](https://github.com/kalisio/kdk/issues/313)
- Provide a unique action to add a layer into the catalog [\#311](https://github.com/kalisio/kdk/issues/311)
- KModal should provide a default close action if no toolbar is specified [\#310](https://github.com/kalisio/kdk/issues/310)
- Add a hook to check for object unicity [\#307](https://github.com/kalisio/kdk/issues/307)
- Enhance place chooser ui [\#306](https://github.com/kalisio/kdk/issues/306)
- Provide an icon library used by the components [\#304](https://github.com/kalisio/kdk/issues/304)
- Modularize TiledFeatureLayer to fetch data from arbitrary geojson sources [\#301](https://github.com/kalisio/kdk/issues/301)
- Add a feature to manage favorite views in 2D/3D maps [\#299](https://github.com/kalisio/kdk/issues/299)
- Add a spatial query shortcut for geometries including a given location [\#297](https://github.com/kalisio/kdk/issues/297)
- The status of an alert should reflect if the last check has failed [\#293](https://github.com/kalisio/kdk/issues/293)
- Enhance feature layer filter  [\#290](https://github.com/kalisio/kdk/issues/290)
- Refactor and homogenize the layout [\#285](https://github.com/kalisio/kdk/issues/285)
- Support realtime update in catalog [\#269](https://github.com/kalisio/kdk/issues/269)
- Default role not set when editing member role in group [\#229](https://github.com/kalisio/kdk/issues/229)
- Use QFilePicker instead of KFileInput [\#186](https://github.com/kalisio/kdk/issues/186)
- Enhance layer style form [\#182](https://github.com/kalisio/kdk/issues/182)
- Allow to create layers based on external web service URL [\#92](https://github.com/kalisio/kdk/issues/92)

**Fixed bugs:**

- Features chart settings not displayed correctly [\#347](https://github.com/kalisio/kdk/issues/347)
- $geoNear, $near, and $nearSphere are not allowed in this context [\#345](https://github.com/kalisio/kdk/issues/345)
- Sorter should apply the default option [\#336](https://github.com/kalisio/kdk/issues/336)
- Disable browser autocomplete on customized q-select based fields [\#334](https://github.com/kalisio/kdk/issues/334)
- Layers with per meteo model min/maxZoom don't update their isDisabled state accordingly [\#331](https://github.com/kalisio/kdk/issues/331)
- Changing min/max zoom when editing style does not work correctly [\#330](https://github.com/kalisio/kdk/issues/330)
- preventRemoveUser hook prevents removing others users than the target one [\#318](https://github.com/kalisio/kdk/issues/318)
- Resend invitation does not encrypt password [\#316](https://github.com/kalisio/kdk/issues/316)
- populatePreviousObject hook does not work when used on remove operation [\#314](https://github.com/kalisio/kdk/issues/314)
- Context associated to resources is not always of the same type [\#312](https://github.com/kalisio/kdk/issues/312)
- Fastlane cannot be installed anymore on travis [\#308](https://github.com/kalisio/kdk/issues/308)
- Improve timeseries widget readability [\#305](https://github.com/kalisio/kdk/issues/305)
- Search by item does not take service context into account [\#294](https://github.com/kalisio/kdk/issues/294)
- Probe tooltip displayed when a feature has a weather property [\#280](https://github.com/kalisio/kdk/issues/280)
- Location indicator not updated when navigating with keyboard [\#124](https://github.com/kalisio/kdk/issues/124)
- asGeoJson hook breaks reactivity [\#79](https://github.com/kalisio/kdk/issues/79)

**Merged pull requests:**

- chore\(deps\): bump y18n from 4.0.0 to 4.0.1 in /docs [\#325](https://github.com/kalisio/kdk/pull/325) ([dependabot[bot]](https://github.com/apps/dependabot))
- chore\(deps\): bump y18n from 4.0.0 to 4.0.1 [\#324](https://github.com/kalisio/kdk/pull/324) ([dependabot[bot]](https://github.com/apps/dependabot))

## [v1.2.1](https://github.com/kalisio/kdk/tree/v1.2.1) (2021-01-26)

[Full Changelog](https://github.com/kalisio/kdk/compare/v1.2.0...v1.2.1)

**Implemented enhancements:**

- Provide a dense prop to the KAutocomplete component [\#284](https://github.com/kalisio/kdk/issues/284)
-  Provide a filter component to use for filtering collections [\#283](https://github.com/kalisio/kdk/issues/283)
- Provide an activity bar  [\#282](https://github.com/kalisio/kdk/issues/282)
- Keep track of currently activated layers [\#268](https://github.com/kalisio/kdk/issues/268)
- Cannot fetch data for archived weather layer [\#259](https://github.com/kalisio/kdk/issues/259)
- Cannot save GeoJson with invalid geometries [\#251](https://github.com/kalisio/kdk/issues/251)
- Allow tiled layers with multiple grid sources to have multiple min/max zoom values. [\#250](https://github.com/kalisio/kdk/issues/250)
- Simplify meteo model configuration in tiled layers [\#241](https://github.com/kalisio/kdk/issues/241)
- Feature tooltip/popup must be translatable [\#216](https://github.com/kalisio/kdk/issues/216)

**Fixed bugs:**

- Logging hook causes high CPU usage [\#287](https://github.com/kalisio/kdk/issues/287)
- Removing a group causes all members of an organisation to be updated [\#286](https://github.com/kalisio/kdk/issues/286)
- Hint error when performing aggregation [\#279](https://github.com/kalisio/kdk/issues/279)
- getFeaturesFromLayer does not work on non-service layers [\#278](https://github.com/kalisio/kdk/issues/278)
- Next hour button does not work when the time line is rendered in mini mode [\#274](https://github.com/kalisio/kdk/issues/274)
- Less secured apps deprecation notice [\#100](https://github.com/kalisio/kdk/issues/100)

**Closed issues:**

- Provide a more generic Bar component [\#281](https://github.com/kalisio/kdk/issues/281)
- The timeseries widget should have a title \(the name of the layer/sensor\) [\#288](https://github.com/kalisio/kdk/issues/288)

## [v1.2.0](https://github.com/kalisio/kdk/tree/v1.2.0) (2020-11-10)

[Full Changelog](https://github.com/kalisio/kdk/compare/v1.1.1...v1.2.0)

**Implemented enhancements:**

- Handle checking an alert without available data [\#265](https://github.com/kalisio/kdk/issues/265)
- Location field display of location without a name is incorrect [\#264](https://github.com/kalisio/kdk/issues/264)
- User should be able to disable geolocation using the navigation bar [\#258](https://github.com/kalisio/kdk/issues/258)
- Member activity should not allow to update tag icon/color once created [\#254](https://github.com/kalisio/kdk/issues/254)
- Multiple variables using the same color in timeseries widget [\#244](https://github.com/kalisio/kdk/issues/244)
- Filter members from tags/groups activity [\#228](https://github.com/kalisio/kdk/issues/228)
- Allow layer variable definition to customise axis options in timeseries [\#224](https://github.com/kalisio/kdk/issues/224)
- Allow to disable geometry update in realtime layer [\#220](https://github.com/kalisio/kdk/issues/220)
- Provide basic tours for generic components [\#218](https://github.com/kalisio/kdk/issues/218)
- If any, use the color of the icons to render the actions in the fab [\#206](https://github.com/kalisio/kdk/issues/206)
- Create a welcome component [\#203](https://github.com/kalisio/kdk/issues/203)
- Allow KTextArea to support ellipsis CSS classes [\#200](https://github.com/kalisio/kdk/issues/200)
- Provide a utility function to create a thumbnail from a data uri [\#194](https://github.com/kalisio/kdk/issues/194)
- Create a tour component [\#193](https://github.com/kalisio/kdk/issues/193)
- KChipsField and KTagField should be displayed using outline [\#190](https://github.com/kalisio/kdk/issues/190)
- Migrate to line awesome icons [\#189](https://github.com/kalisio/kdk/issues/189)
- Allow to reissue an invitation from a guest card [\#188](https://github.com/kalisio/kdk/issues/188)
- Integrate page models to ease end-to-end testing [\#187](https://github.com/kalisio/kdk/issues/187)
- Allow to display an icon within a badge assigned to an action of KFeatureActionButton [\#185](https://github.com/kalisio/kdk/issues/185)
- Create a tags activity [\#184](https://github.com/kalisio/kdk/issues/184)
- Allow to zoom on an image when browsing the medias [\#183](https://github.com/kalisio/kdk/issues/183)
- Allow to display an icon within a badge assigned to an action of KOverflowMenu [\#181](https://github.com/kalisio/kdk/issues/181)
- Allow to display an icon within a badge assigned to an action of KFab [\#180](https://github.com/kalisio/kdk/issues/180)
- Allow emit hook to skip event emission [\#179](https://github.com/kalisio/kdk/issues/179)
- Improve layer selector display [\#178](https://github.com/kalisio/kdk/issues/178)
- Allow to display an icon within a badge assigned to an action of KToolBar [\#176](https://github.com/kalisio/kdk/issues/176)
- Check unique hook should raise a specific error message [\#175](https://github.com/kalisio/kdk/issues/175)
- Tiled mesh/wind layers should support min zoom level [\#160](https://github.com/kalisio/kdk/issues/160)
- Zoom to layer action does not work on tiled layers in map [\#123](https://github.com/kalisio/kdk/issues/123)
- iOS build should rely on iOS SDK 13 [\#67](https://github.com/kalisio/kdk/issues/67)
- History component should provide infinite scroll [\#90](https://github.com/kalisio/kdk/issues/90)
- UIWebView API deprecation notice [\#47](https://github.com/kalisio/kdk/issues/47)
- Upgrade Mongo DB driver to v3 [\#44](https://github.com/kalisio/kdk/issues/44)
- Allow to directly take a picture when uploading a file [\#99](https://github.com/kalisio/kdk/issues/99)
- Extend pusher protocols for SMS/Emails [\#91](https://github.com/kalisio/kdk/issues/91)

**Fixed bugs:**

- AbortController interface not available under Safari - iOS 10.3 [\#261](https://github.com/kalisio/kdk/issues/261)
- No data fetched for archived weather layer [\#260](https://github.com/kalisio/kdk/issues/260)
- KHistory duplicates items on route change [\#256](https://github.com/kalisio/kdk/issues/256)
- Converting a property from string to number fails with spaces [\#253](https://github.com/kalisio/kdk/issues/253)
- Infobox not displayed in globe when selecting linear or polygon geometries [\#252](https://github.com/kalisio/kdk/issues/252)
- Editing a tag properties from the member card changes all the tags properties [\#257](https://github.com/kalisio/kdk/issues/257)
- Error when displaying vigicrues sections without available measures [\#248](https://github.com/kalisio/kdk/issues/248)
- It should not be possible to hide the last visible variable in time-series widget chart [\#247](https://github.com/kalisio/kdk/issues/247)
- Special characters displayed as HTML codes in editor title [\#246](https://github.com/kalisio/kdk/issues/246)
- Time-series widget chart flickering when hiding some variables [\#245](https://github.com/kalisio/kdk/issues/245)
- Various issues with icon field [\#242](https://github.com/kalisio/kdk/issues/242)
- Vigicrues tooltip not displayed [\#240](https://github.com/kalisio/kdk/issues/240)
- Feature updated in tiled real-time GeoJson layer when a measure without associated probe is found [\#239](https://github.com/kalisio/kdk/issues/239)
- Impossible to edit features when imported from a filename containing whitespaces [\#238](https://github.com/kalisio/kdk/issues/238)
- Error raised when hiding a layer in selector [\#237](https://github.com/kalisio/kdk/issues/237)
- Editing layer style resets the default visibility [\#235](https://github.com/kalisio/kdk/issues/235)
- Creating a layer without a schema causes different issues [\#234](https://github.com/kalisio/kdk/issues/234)
- Business layer style should not be editable by default [\#232](https://github.com/kalisio/kdk/issues/232)
- Time-series widget chart flickering when changing sensor or time [\#230](https://github.com/kalisio/kdk/issues/230)
- Probed location variables not correctly computed when data contains a single time [\#223](https://github.com/kalisio/kdk/issues/223)
- KMediaBrowser fullscreen mode must be unset when closed [\#222](https://github.com/kalisio/kdk/issues/222)
- KTextArea editor should be rendered using the dense mode on small size screens [\#221](https://github.com/kalisio/kdk/issues/221)
- Remove the source property from layer options when building the leaflet layer [\#219](https://github.com/kalisio/kdk/issues/219)
- KTextArea containing multilines or HTML is not displayed correctly anymore [\#217](https://github.com/kalisio/kdk/issues/217)
- Edit layer style action appears on measure layers [\#212](https://github.com/kalisio/kdk/issues/212)
- Enable edit style layer action on user-defined layers only [\#213](https://github.com/kalisio/kdk/issues/213)
- The Location Map cannot request the tiles through the API Gateway [\#211](https://github.com/kalisio/kdk/issues/211)
- Updating the value of an existing tag makes updateTags hook detect it as a new one [\#210](https://github.com/kalisio/kdk/issues/210)
- The location map does not truncate the location info when it is too long [\#209](https://github.com/kalisio/kdk/issues/209)
- The navigation app selector does not work anymore \(cordova\) [\#207](https://github.com/kalisio/kdk/issues/207)
- KUploader tries to create thumbnails on already stored files [\#204](https://github.com/kalisio/kdk/issues/204)
- KIconChooser is not well initialized [\#202](https://github.com/kalisio/kdk/issues/202)
- Ellipsis is not working in KCard [\#201](https://github.com/kalisio/kdk/issues/201)
- TimeSeries widget is not well resized [\#199](https://github.com/kalisio/kdk/issues/199)
- KTagField raises an error when the tag does not have any icon [\#198](https://github.com/kalisio/kdk/issues/198)
- Quasar native messages are not translated [\#197](https://github.com/kalisio/kdk/issues/197)
- Device not correctly update [\#196](https://github.com/kalisio/kdk/issues/196)
- Impossible to edit feature properties [\#195](https://github.com/kalisio/kdk/issues/195)
- Prevent a media from being uploaded multiple times  [\#192](https://github.com/kalisio/kdk/issues/192)
- Sporadic error appears with openers [\#191](https://github.com/kalisio/kdk/issues/191)
- Background color in KSearchBar doest not allow to see anything [\#177](https://github.com/kalisio/kdk/issues/177)
- Selecting a line/polygon feature with timeseries widget raises an error [\#174](https://github.com/kalisio/kdk/issues/174)
- Incorrect types for layer style after edition [\#173](https://github.com/kalisio/kdk/issues/173)
- The type property appears in the default layer schema [\#171](https://github.com/kalisio/kdk/issues/171)
- Layer style form not updated when configuring [\#170](https://github.com/kalisio/kdk/issues/170)
- Tiled features layer are slow on large datasets \(eg archive\) [\#157](https://github.com/kalisio/kdk/issues/157)
- Login form autocomplete does not work on first load in firefox [\#106](https://github.com/kalisio/kdk/issues/106)
- Status bar hides app bar on mobiles [\#87](https://github.com/kalisio/kdk/issues/87)

**Closed issues:**

- Fine-grained global rate limiting control [\#236](https://github.com/kalisio/kdk/issues/236)

## [v1.1.1](https://github.com/kalisio/kdk/tree/v1.1.1) (2020-06-02)

[Full Changelog](https://github.com/kalisio/kdk/compare/v1.1.0...v1.1.1)

**Implemented enhancements:**

- Provide a code input component [\#169](https://github.com/kalisio/kdk/issues/169)

## [v1.1.0](https://github.com/kalisio/kdk/tree/v1.1.0) (2020-05-28)

[Full Changelog](https://github.com/kalisio/kdk/compare/v1.0.0...v1.1.0)

**Implemented enhancements:**

- Allow to specify the Browsers list to be used when building the testcafe image [\#159](https://github.com/kalisio/kdk/issues/159)
- Improve timeseries widget with timerange actions [\#152](https://github.com/kalisio/kdk/issues/152)
- Manage i18n in layer definitions [\#146](https://github.com/kalisio/kdk/issues/146)
-  Standardize the behavior of all widgets [\#143](https://github.com/kalisio/kdk/issues/143)
- The position of the LocationIndicator should be updated when opening/closing the NavBar [\#137](https://github.com/kalisio/kdk/issues/137)
- Improve feature selection [\#134](https://github.com/kalisio/kdk/issues/134)
- It should be able to customize the leading action in the AppBar [\#132](https://github.com/kalisio/kdk/issues/132)
- Provide a KOpener proxy that allows to simplify the use of the KOpener [\#130](https://github.com/kalisio/kdk/issues/130)
- Improve Mapillary layer performances [\#129](https://github.com/kalisio/kdk/issues/129)
- Make the feature selection work in globe [\#127](https://github.com/kalisio/kdk/issues/127)
- Refactor KLocationTimeSeries using the new widget design [\#121](https://github.com/kalisio/kdk/issues/121)
- KView should allow values as props [\#120](https://github.com/kalisio/kdk/issues/120)
- Refactor KFeatureInfoBox using the new widget design [\#119](https://github.com/kalisio/kdk/issues/119)
- Enhance feature selection [\#118](https://github.com/kalisio/kdk/issues/118)
- Allow the KToolBar to be vertical [\#117](https://github.com/kalisio/kdk/issues/117)
- Enhance KWidget design [\#116](https://github.com/kalisio/kdk/issues/116)
- Provide basic components to enable Mapillary integration [\#115](https://github.com/kalisio/kdk/issues/115)
- Make activity refresh when changing route more customisable [\#114](https://github.com/kalisio/kdk/issues/114)
- Improve openers design on mobile [\#113](https://github.com/kalisio/kdk/issues/113)
- Enhance customization of KToolBar [\#112](https://github.com/kalisio/kdk/issues/112)
- Enhance KTimeline design to be more responsive [\#109](https://github.com/kalisio/kdk/issues/109)
- Archived weather layers should be handled within the forecast layers selector [\#75](https://github.com/kalisio/kdk/issues/75)
- Refactor the CatalogPanel  [\#74](https://github.com/kalisio/kdk/issues/74)
- Merge KTimeline and KTimelineControl in a unique component  [\#73](https://github.com/kalisio/kdk/issues/73)
- NavigationBar should be closable [\#72](https://github.com/kalisio/kdk/issues/72)
- Layout should be able to manage a generic footer [\#71](https://github.com/kalisio/kdk/issues/71)
- Enhance Drawers management [\#70](https://github.com/kalisio/kdk/issues/70)
- Merge kdk modules into a single module [\#65](https://github.com/kalisio/kdk/issues/65)
- Allow to run e2e on the targeted deployment platform [\#62](https://github.com/kalisio/kdk/issues/62)
- Allow to apply the CI process when working on a branch [\#61](https://github.com/kalisio/kdk/issues/61)
- Support tiling for feature layers in map [\#82](https://github.com/kalisio/kdk/issues/82)
- Improve application webhook security [\#84](https://github.com/kalisio/kdk/issues/84)
- Upgrade to latest Node.js LTS [\#48](https://github.com/kalisio/kdk/issues/48)
- Allow to filter feature layers [\#89](https://github.com/kalisio/kdk/issues/89)
- Enhance e2e tests across the modules/apps [\#38](https://github.com/kalisio/kdk/issues/38)
- Optimize measure update for time-stamped features in globe [\#96](https://github.com/kalisio/kdk/issues/96)
- Manage real-time and archive/forecast mode [\#108](https://github.com/kalisio/kdk/issues/108)
- Code coverage not correctly pushed to Code Climate in travis application builds [\#51](https://github.com/kalisio/kdk/issues/51)

**Fixed bugs:**

- Tiled wind layer doesn't work with old arpege-world resolution \(0.5\) [\#168](https://github.com/kalisio/kdk/issues/168)
- "e.arrayBuffer is not a function" error with WcsGridSource [\#167](https://github.com/kalisio/kdk/issues/167)
- Level selection doesn't work anymore on tiled mesh layers. [\#166](https://github.com/kalisio/kdk/issues/166)
- Probe location name not updated in timeseries widget [\#158](https://github.com/kalisio/kdk/issues/158)
- Tiled feature layers missing some values when changing time [\#156](https://github.com/kalisio/kdk/issues/156)
- Displayed time in timeseries widget does not show minutes [\#155](https://github.com/kalisio/kdk/issues/155)
- Visual lag on tiled mesh layer with geotiff grid source [\#153](https://github.com/kalisio/kdk/issues/153)
- BBox not defined in tiled layers relying on OpenDAP grid source [\#151](https://github.com/kalisio/kdk/issues/151)
- Tiled mesh layers not correctly unloaded when data is not available [\#150](https://github.com/kalisio/kdk/issues/150)
- Tile layers not correctly unloaded after navigating in time [\#149](https://github.com/kalisio/kdk/issues/149)
- Location indicator performs probing on selection [\#148](https://github.com/kalisio/kdk/issues/148)
- Saving a layer in http mode generates an error with http code 500 [\#145](https://github.com/kalisio/kdk/issues/145)
- Allow to select a feature even if the schema is not defined [\#144](https://github.com/kalisio/kdk/issues/144)
- On HTTP mode, timeseries data for a feature are not correct [\#142](https://github.com/kalisio/kdk/issues/142)
- Missing zero values in tooltip display [\#141](https://github.com/kalisio/kdk/issues/141)
- Error raised on clustered tile layers [\#140](https://github.com/kalisio/kdk/issues/140)
- Timeseries do not update correctly when changing time [\#139](https://github.com/kalisio/kdk/issues/139)
- Complex service requests do not work in HTTP mode [\#138](https://github.com/kalisio/kdk/issues/138)
- Timeseries widget not synchronized when disabling/removing a layer [\#135](https://github.com/kalisio/kdk/issues/135)
- Openers shoud be displayed only a component is assgined to the drawers or footer [\#131](https://github.com/kalisio/kdk/issues/131)
- min zoom level not correctly handled in tiled map layers [\#126](https://github.com/kalisio/kdk/issues/126)
- If a geocoder does not respond the geocoder service does not respond [\#125](https://github.com/kalisio/kdk/issues/125)
- Weacast grid source is missing some data when requesting a tile [\#77](https://github.com/kalisio/kdk/issues/77)
- KFab should be instanciated within a QPage [\#69](https://github.com/kalisio/kdk/issues/69)

**Closed issues:**

- Provide an helper component to display a text with an icon  [\#76](https://github.com/kalisio/kdk/issues/76)

## [v1.0.0](https://github.com/kalisio/kdk/tree/v1.0.0) (2020-01-20)

[Full Changelog](https://github.com/kalisio/kdk/compare/v0.3.0...v1.0.0)

**Implemented enhancements:**

- Allow to run the client test either with firefox or chrome [\#58](https://github.com/kalisio/kdk/issues/58)
- Enhance branch management in CLI [\#57](https://github.com/kalisio/kdk/issues/57)
- Migrate to Testcafe 1.7.x [\#56](https://github.com/kalisio/kdk/issues/56)
- Simplify organisation services management [\#55](https://github.com/kalisio/kdk/issues/55)
- Provide a default testcafe image including testcafe-vue-selectors [\#54](https://github.com/kalisio/kdk/issues/54)
- Take advantage of new conditional builds feature of Travis [\#53](https://github.com/kalisio/kdk/issues/53)
- Add a command to manage releases with CLI [\#50](https://github.com/kalisio/kdk/issues/50)
- Android build must target API level 28+ [\#49](https://github.com/kalisio/kdk/issues/49)
- Enable Greenkeeper to ease dependency upgrades [\#45](https://github.com/kalisio/kdk/issues/45)
- Add pull command to CLI [\#41](https://github.com/kalisio/kdk/issues/41)
- Update dependencies across modules/apps [\#39](https://github.com/kalisio/kdk/issues/39)
- Make Travis pipeline more reliable  [\#37](https://github.com/kalisio/kdk/issues/37)
- Add a regex to only publish on tags of the form 'vX.X.X' [\#59](https://github.com/kalisio/kdk/issues/59)
- Migrate to Quasar 1.0 across modules [\#31](https://github.com/kalisio/kdk/issues/31)

**Fixed bugs:**

- Unlink CLI command does not unlink global modules \(only local ones\) [\#42](https://github.com/kalisio/kdk/issues/42)

**Closed issues:**

- Publishing apk to Google is no more working [\#52](https://github.com/kalisio/kdk/issues/52)

## [v0.3.0](https://github.com/kalisio/kdk/tree/v0.3.0) (2019-07-22)

[Full Changelog](https://github.com/kalisio/kdk/compare/v0.2.2...v0.3.0)

**Implemented enhancements:**

- Allow CLI to select modules from the workspace to apply command on [\#36](https://github.com/kalisio/kdk/issues/36)
- Allow CLI to manage repositories in different organizations [\#34](https://github.com/kalisio/kdk/issues/34)
- Integrate the cli within kdk project [\#32](https://github.com/kalisio/kdk/issues/32)
- Favor service inheritance over hooks for low-level internal operations [\#29](https://github.com/kalisio/kdk/issues/29)
- Define a solution to deploy our apps as microservices [\#7](https://github.com/kalisio/kdk/issues/7)

**Security fixes:**

- Upgrade out-of-date dependencies across modules [\#10](https://github.com/kalisio/kdk/issues/10)

## [v0.2.2](https://github.com/kalisio/kdk/tree/v0.2.2) (2019-02-11)

[Full Changelog](https://github.com/kalisio/kdk/compare/v0.2.1...v0.2.2)

## [v0.2.1](https://github.com/kalisio/kdk/tree/v0.2.1) (2019-02-11)

[Full Changelog](https://github.com/kalisio/kdk/compare/v0.2.0...v0.2.1)

## [v0.2.0](https://github.com/kalisio/kdk/tree/v0.2.0) (2019-02-11)

[Full Changelog](https://github.com/kalisio/kdk/compare/9494e1f254fd9e44c3a5994fd15e1e62b31196c7...v0.2.0)

**Implemented enhancements:**

- Create a component to provide styling options for feature layers in map [\#110](https://github.com/kalisio/kdk/issues/110)
- Migrate the documentation to VuePress [\#30](https://github.com/kalisio/kdk/issues/30)
- Change props 'id' by 'objectId' [\#27](https://github.com/kalisio/kdk/issues/27)
- Add slack notifications from Travis CI [\#24](https://github.com/kalisio/kdk/issues/24)
- Unify lodash imports [\#21](https://github.com/kalisio/kdk/issues/21)
- Billing module [\#19](https://github.com/kalisio/kdk/issues/19)
- Sanatize user inputs [\#18](https://github.com/kalisio/kdk/issues/18)
- Coverage for end-to-end testing [\#16](https://github.com/kalisio/kdk/issues/16)
- Filter real-time events [\#15](https://github.com/kalisio/kdk/issues/15)
- Secure removal of "important" objects [\#13](https://github.com/kalisio/kdk/issues/13)
- Migrate to Feathers v3 across modules [\#12](https://github.com/kalisio/kdk/issues/12)
- Setup frontend testing [\#11](https://github.com/kalisio/kdk/issues/11)
- i18n [\#6](https://github.com/kalisio/kdk/issues/6)

**Fixed bugs:**

- Code from external modules not correctly transpiled [\#28](https://github.com/kalisio/kdk/issues/28)
- Unify the use of icons [\#23](https://github.com/kalisio/kdk/issues/23)
- Optimize data refresh in activities [\#17](https://github.com/kalisio/kdk/issues/17)

**Closed issues:**

- Refactor the activities using KNavBar to use KTabBar [\#14](https://github.com/kalisio/kdk/issues/14)
- Manage authorizations [\#9](https://github.com/kalisio/kdk/issues/9)
- \[kClient\] Initiate the module [\#5](https://github.com/kalisio/kdk/issues/5)
- Migrate kComponents to other modules \(kCore, kTeam, ...\) [\#4](https://github.com/kalisio/kdk/issues/4)
- Find a solution to manage deployment access keys \(AWS, Google, etc.\) [\#3](https://github.com/kalisio/kdk/issues/3)
- Add $off\(\) whenever we use $on\(\) [\#2](https://github.com/kalisio/kdk/issues/2)
- Handle activity routing correctly [\#1](https://github.com/kalisio/kdk/issues/1)



\* *This Changelog was automatically generated by [github_changelog_generator](https://github.com/github-changelog-generator/github-changelog-generator)*
