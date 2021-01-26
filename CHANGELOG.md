# Changelog

## [v1.2.1](https://github.com/kalisio/kdk/tree/v1.2.1) (2021-01-26)

[Full Changelog](https://github.com/kalisio/kdk/compare/v1.2.0...v1.2.1)

**Implemented enhancements:**

- Keep track of currently activated layers [\#268](https://github.com/kalisio/kdk/issues/268)
- Allow tiled layers with multiple grid sources to have multiple min/max zoom values. [\#250](https://github.com/kalisio/kdk/issues/250)
- Simplify meteo model configuration in tiled layers [\#241](https://github.com/kalisio/kdk/issues/241)
- Feature tooltip/popup must be translatable [\#216](https://github.com/kalisio/kdk/issues/216)

**Fixed bugs:**

- Logging hook causes high CPU usage [\#287](https://github.com/kalisio/kdk/issues/287)
- Removing a group causes all members of an organisation to be updated [\#286](https://github.com/kalisio/kdk/issues/286)
- Probe tooltip displayed when a feature has a weather property [\#280](https://github.com/kalisio/kdk/issues/280)
- Hint error when performing aggregation [\#279](https://github.com/kalisio/kdk/issues/279)
- getFeaturesFromLayer does not work on non-service layers [\#278](https://github.com/kalisio/kdk/issues/278)
- Next hour button does not work when the time line is rendered in mini mode [\#274](https://github.com/kalisio/kdk/issues/274)
- Cannot fetch data for archived weather layer [\#259](https://github.com/kalisio/kdk/issues/259)
- Cannot save GeoJson with invalid geometries [\#251](https://github.com/kalisio/kdk/issues/251)
- Less secured apps deprecation notice [\#100](https://github.com/kalisio/kdk/issues/100)

**Closed issues:**

- Provide a dense prop to the KAutocomplete component [\#284](https://github.com/kalisio/kdk/issues/284)
-  Provide a filter component to use for filtering collections [\#283](https://github.com/kalisio/kdk/issues/283)
- Provide an activity bar  [\#282](https://github.com/kalisio/kdk/issues/282)
- Provide a more generic Bar component [\#281](https://github.com/kalisio/kdk/issues/281)
- The timeseries widget should have a title \(the name of the layer/sensor\) [\#288](https://github.com/kalisio/kdk/issues/288)

**Merged pull requests:**

- chore\(deps\): bump ini from 1.3.5 to 1.3.8 in /docs [\#277](https://github.com/kalisio/kdk/pull/277) ([dependabot[bot]](https://github.com/apps/dependabot))
- chore\(deps\): bump node-fetch from 2.6.0 to 2.6.1 [\#267](https://github.com/kalisio/kdk/pull/267) ([dependabot[bot]](https://github.com/apps/dependabot))

## [v1.2.0](https://github.com/kalisio/kdk/tree/v1.2.0) (2020-11-10)

[Full Changelog](https://github.com/kalisio/kdk/compare/v1.1.1...v1.2.0)

**Implemented enhancements:**

- Tiled mesh/wind layers should support min zoom level [\#160](https://github.com/kalisio/kdk/issues/160)
- Upgrade Mongo DB driver to v3 [\#44](https://github.com/kalisio/kdk/issues/44)
- User should be able to disable geolocation using the navigation bar [\#258](https://github.com/kalisio/kdk/issues/258)
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
- iOS build should rely on iOS SDK 13 [\#67](https://github.com/kalisio/kdk/issues/67)

**Fixed bugs:**

- No data fetched for archived weather layer [\#260](https://github.com/kalisio/kdk/issues/260)
- Converting a property from string to number fails with spaces [\#253](https://github.com/kalisio/kdk/issues/253)
- Impossible to edit feature properties [\#195](https://github.com/kalisio/kdk/issues/195)
- Incorrect types for layer style after edition [\#173](https://github.com/kalisio/kdk/issues/173)
- The type property appears in the default layer schema [\#171](https://github.com/kalisio/kdk/issues/171)
- Layer style form not updated when configuring [\#170](https://github.com/kalisio/kdk/issues/170)
- Tiled features layer are slow on large datasets \(eg archive\) [\#157](https://github.com/kalisio/kdk/issues/157)
- Zoom to layer action does not work on tiled layers in map [\#123](https://github.com/kalisio/kdk/issues/123)
- Login form autocomplete does not work on first load in firefox [\#106](https://github.com/kalisio/kdk/issues/106)
- Handle checking an alert without available data [\#265](https://github.com/kalisio/kdk/issues/265)
- Location field display of location without a name is incorrect [\#264](https://github.com/kalisio/kdk/issues/264)
- AbortController interface not available under Safari - iOS 10.3 [\#261](https://github.com/kalisio/kdk/issues/261)
- KHistory duplicates items on route change [\#256](https://github.com/kalisio/kdk/issues/256)
- Member activity should not allow to update tag icon/color once created [\#254](https://github.com/kalisio/kdk/issues/254)
- Infobox not displayed in globe when selecting linear or polygon geometries [\#252](https://github.com/kalisio/kdk/issues/252)
- Editing a tag properties from the member card changes all the tags properties [\#257](https://github.com/kalisio/kdk/issues/257)
- Error when displaying vigicrues sections without available measures [\#248](https://github.com/kalisio/kdk/issues/248)
- It should not be possible to hide the last visible variable in time-series widget chart [\#247](https://github.com/kalisio/kdk/issues/247)
- Special characters displayed as HTML codes in editor title [\#246](https://github.com/kalisio/kdk/issues/246)
- Time-series widget chart flickering when hiding some variables [\#245](https://github.com/kalisio/kdk/issues/245)
- Multiple variables using the same color in timeseries widget [\#244](https://github.com/kalisio/kdk/issues/244)
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
- Prevent a media from being uploaded multiple times  [\#192](https://github.com/kalisio/kdk/issues/192)
- Sporadic error appears with openers [\#191](https://github.com/kalisio/kdk/issues/191)
- Background color in KSearchBar doest not allow to see anything [\#177](https://github.com/kalisio/kdk/issues/177)
- Selecting a line/polygon feature with timeseries widget raises an error [\#174](https://github.com/kalisio/kdk/issues/174)
- UIWebView API deprecation notice [\#47](https://github.com/kalisio/kdk/issues/47)
- Allow to directly take a picture when uploading a file [\#99](https://github.com/kalisio/kdk/issues/99)
- Status bar hides app bar on mobiles [\#87](https://github.com/kalisio/kdk/issues/87)

**Closed issues:**

- Extend pusher protocols for SMS/Emails [\#91](https://github.com/kalisio/kdk/issues/91)
- Fine-grained global rate limiting control [\#236](https://github.com/kalisio/kdk/issues/236)
- Filter members from tags/groups activity [\#228](https://github.com/kalisio/kdk/issues/228)
- History component should provide infinite scroll [\#90](https://github.com/kalisio/kdk/issues/90)

**Merged pull requests:**

- chore\(deps\): bump node-fetch from 2.6.0 to 2.6.1 [\#243](https://github.com/kalisio/kdk/pull/243) ([dependabot[bot]](https://github.com/apps/dependabot))
- chore\(deps\): bump prismjs from 1.20.0 to 1.21.0 in /docs [\#227](https://github.com/kalisio/kdk/pull/227) ([dependabot[bot]](https://github.com/apps/dependabot))
- chore\(deps\): bump elliptic from 6.5.2 to 6.5.3 in /docs [\#225](https://github.com/kalisio/kdk/pull/225) ([dependabot[bot]](https://github.com/apps/dependabot))
- chore\(deps\): bump lodash from 4.17.15 to 4.17.19 in /docs [\#215](https://github.com/kalisio/kdk/pull/215) ([dependabot[bot]](https://github.com/apps/dependabot))
- chore\(deps\): bump lodash from 4.17.15 to 4.17.19 [\#214](https://github.com/kalisio/kdk/pull/214) ([dependabot[bot]](https://github.com/apps/dependabot))

## [v1.1.1](https://github.com/kalisio/kdk/tree/v1.1.1) (2020-06-02)

[Full Changelog](https://github.com/kalisio/kdk/compare/v1.1.0...v1.1.1)

**Closed issues:**

- Provide a code input component [\#169](https://github.com/kalisio/kdk/issues/169)

## [v1.1.0](https://github.com/kalisio/kdk/tree/v1.1.0) (2020-05-28)

[Full Changelog](https://github.com/kalisio/kdk/compare/v1.0.0...v1.1.0)

**Implemented enhancements:**

- Refactor KFeatureInfoBox using the new widget design [\#119](https://github.com/kalisio/kdk/issues/119)
- Enhance feature selection [\#118](https://github.com/kalisio/kdk/issues/118)
- Allow the KToolBar to be vertical [\#117](https://github.com/kalisio/kdk/issues/117)
- Improve openers design on mobile [\#113](https://github.com/kalisio/kdk/issues/113)
- Enhance customization of KToolBar [\#112](https://github.com/kalisio/kdk/issues/112)
- Archived weather layers should be handled within the forecast layers selector [\#75](https://github.com/kalisio/kdk/issues/75)
- Refactor the CatalogPanel  [\#74](https://github.com/kalisio/kdk/issues/74)
- Merge KTimeline and KTimelineControl in a unique component  [\#73](https://github.com/kalisio/kdk/issues/73)
- NavigationBar should be closable [\#72](https://github.com/kalisio/kdk/issues/72)
- Layout should be able to manage a generic footer [\#71](https://github.com/kalisio/kdk/issues/71)
- Enhance Drawers management [\#70](https://github.com/kalisio/kdk/issues/70)
- Allow to run e2e on the targeted deployment platform [\#62](https://github.com/kalisio/kdk/issues/62)
- Allow to apply the CI process when working on a branch [\#61](https://github.com/kalisio/kdk/issues/61)
- Support tiling for feature layers in map [\#82](https://github.com/kalisio/kdk/issues/82)
- Upgrade to latest Node.js LTS [\#48](https://github.com/kalisio/kdk/issues/48)
- Allow to filter feature layers [\#89](https://github.com/kalisio/kdk/issues/89)
- Enhance e2e tests across the modules/apps [\#38](https://github.com/kalisio/kdk/issues/38)
- Optimize measure update for time-stamped features in globe [\#96](https://github.com/kalisio/kdk/issues/96)
- Create a component to provide styling options for feature layers in map [\#110](https://github.com/kalisio/kdk/issues/110)
- Code coverage not correctly pushed to Code Climate in travis application builds [\#51](https://github.com/kalisio/kdk/issues/51)
- Allow to specify the Browsers list to be used when building the testcafe image [\#159](https://github.com/kalisio/kdk/issues/159)
- Improve timeseries widget with timerange actions [\#152](https://github.com/kalisio/kdk/issues/152)
- Manage i18n in layer definitions [\#146](https://github.com/kalisio/kdk/issues/146)
-  Standardize the behavior of all widgets [\#143](https://github.com/kalisio/kdk/issues/143)
- It should be able to customize the leading action in the AppBar [\#132](https://github.com/kalisio/kdk/issues/132)
- Improve Mapillary layer performances [\#129](https://github.com/kalisio/kdk/issues/129)
- Refactor KLocationTimeSeries using the new widget design [\#121](https://github.com/kalisio/kdk/issues/121)
- Provide basic components to enable Mapillary integration [\#115](https://github.com/kalisio/kdk/issues/115)
- Enhance KTimeline design to be more responsive [\#109](https://github.com/kalisio/kdk/issues/109)
- Merge kdk modules into a single module [\#65](https://github.com/kalisio/kdk/issues/65)
- Manage real-time and archive/forecast mode [\#108](https://github.com/kalisio/kdk/issues/108)

**Fixed bugs:**

- Tiled wind layer doesn't work with old arpege-world resolution \(0.5\) [\#168](https://github.com/kalisio/kdk/issues/168)
- "e.arrayBuffer is not a function" error with WcsGridSource [\#167](https://github.com/kalisio/kdk/issues/167)
- Level selection doesn't work anymore on tiled mesh layers. [\#166](https://github.com/kalisio/kdk/issues/166)
- If a geocoder does not respond the geocoder service does not respond [\#125](https://github.com/kalisio/kdk/issues/125)
- Make activity refresh when changing route more customisable [\#114](https://github.com/kalisio/kdk/issues/114)
- Weacast grid source is missing some data when requesting a tile [\#77](https://github.com/kalisio/kdk/issues/77)
- KFab should be instanciated within a QPage [\#69](https://github.com/kalisio/kdk/issues/69)
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
- Complex feature service requests do not work in HTTP mode [\#138](https://github.com/kalisio/kdk/issues/138)
- The position of the LocationIndicator should be updated when opening/closing the NavBar [\#137](https://github.com/kalisio/kdk/issues/137)
- Timeseries widget not synchronized when disabling/removing a layer [\#135](https://github.com/kalisio/kdk/issues/135)
- Improve feature selection [\#134](https://github.com/kalisio/kdk/issues/134)
- Openers shoud be displayed only a component is assgined to the drawers or footer [\#131](https://github.com/kalisio/kdk/issues/131)
- Make the feature selection work in globe [\#127](https://github.com/kalisio/kdk/issues/127)
- min zoom level not correctly handled in tiled map layers [\#126](https://github.com/kalisio/kdk/issues/126)

**Closed issues:**

- KView should allow values as props [\#120](https://github.com/kalisio/kdk/issues/120)
- Enhance KWidget design [\#116](https://github.com/kalisio/kdk/issues/116)
- Provide an helper component to display a text with an icon  [\#76](https://github.com/kalisio/kdk/issues/76)
- Improve application webhook security [\#84](https://github.com/kalisio/kdk/issues/84)
- Provide a KOpener proxy that allows to simplify the use of the KOpener [\#130](https://github.com/kalisio/kdk/issues/130)

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
- Enable Greenkeeper to ease dependency upgrades [\#45](https://github.com/kalisio/kdk/issues/45)
- Add pull command to CLI [\#41](https://github.com/kalisio/kdk/issues/41)
- Update dependencies across modules/apps [\#39](https://github.com/kalisio/kdk/issues/39)
- Add a regex to only publish on tags of the form 'vX.X.X' [\#59](https://github.com/kalisio/kdk/issues/59)
- Migrate to Quasar 1.0 across modules [\#31](https://github.com/kalisio/kdk/issues/31)

**Fixed bugs:**

- Android build must target API level 28+ [\#49](https://github.com/kalisio/kdk/issues/49)
- Unlink CLI command does not unlink global modules \(only local ones\) [\#42](https://github.com/kalisio/kdk/issues/42)
- Make Travis pipeline more reliable  [\#37](https://github.com/kalisio/kdk/issues/37)

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

**Closed issues:**

- Upgrade out-of-date dependencies across modules [\#10](https://github.com/kalisio/kdk/issues/10)

## [v0.2.2](https://github.com/kalisio/kdk/tree/v0.2.2) (2019-02-11)

[Full Changelog](https://github.com/kalisio/kdk/compare/v0.2.1...v0.2.2)

## [v0.2.1](https://github.com/kalisio/kdk/tree/v0.2.1) (2019-02-11)

[Full Changelog](https://github.com/kalisio/kdk/compare/v0.2.0...v0.2.1)

## [v0.2.0](https://github.com/kalisio/kdk/tree/v0.2.0) (2019-02-11)

[Full Changelog](https://github.com/kalisio/kdk/compare/9494e1f254fd9e44c3a5994fd15e1e62b31196c7...v0.2.0)

**Implemented enhancements:**

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



\* *This Changelog was automatically generated by [github_changelog_generator](https://github.com/skywinder/Github-Changelog-Generator)*