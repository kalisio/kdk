# Changelog

## [v1.1.0](https://github.com/kalisio/kdk/tree/v1.1.0) (2020-05-28)

[Full Changelog](https://github.com/kalisio/kdk/compare/v1.0.0...v1.1.0)

**Implemented enhancements:**

- Refactor KFeatureInfoBox using the new widget design [\#119](https://github.com/kalisio/kdk/issues/119)
- Enhance feature selection [\#118](https://github.com/kalisio/kdk/issues/118)
- Allow the KToolBar to be vertical [\#117](https://github.com/kalisio/kdk/issues/117)
- Improve openers design on mobile [\#113](https://github.com/kalisio/kdk/issues/113)
- Enhance customization of KToolBar [\#112](https://github.com/kalisio/kdk/issues/112)
- Create a component to provide styling options for feature layers in map [\#110](https://github.com/kalisio/kdk/issues/110)
- Optimize measure update for time-stamped features in globe [\#96](https://github.com/kalisio/kdk/issues/96)
- Allow to filter feature layers [\#89](https://github.com/kalisio/kdk/issues/89)
- Support tiling for feature layers in map [\#82](https://github.com/kalisio/kdk/issues/82)
- Archived weather layers should be handled within the forecast layers selector [\#75](https://github.com/kalisio/kdk/issues/75)
- Refactor the CatalogPanel  [\#74](https://github.com/kalisio/kdk/issues/74)
- Merge KTimeline and KTimelineControl in a unique component  [\#73](https://github.com/kalisio/kdk/issues/73)
- NavigationBar should be closable [\#72](https://github.com/kalisio/kdk/issues/72)
- Layout should be able to manage a generic footer [\#71](https://github.com/kalisio/kdk/issues/71)
- Enhance Drawers management [\#70](https://github.com/kalisio/kdk/issues/70)
- Allow to run e2e on the targeted deployment platform [\#62](https://github.com/kalisio/kdk/issues/62)
- Allow to apply the CI process when working on a branch [\#61](https://github.com/kalisio/kdk/issues/61)
- Code coverage not correctly pushed to Code Climate in travis application builds [\#51](https://github.com/kalisio/kdk/issues/51)
- Upgrade to latest Node.js LTS [\#48](https://github.com/kalisio/kdk/issues/48)
- Enhance e2e tests across the modules/apps [\#38](https://github.com/kalisio/kdk/issues/38)
- Allow to specify the Browsers list to be used when building the testcafe image [\#159](https://github.com/kalisio/kdk/issues/159)
- Improve timeseries widget with timerange actions [\#152](https://github.com/kalisio/kdk/issues/152)
- Manage i18n in layer definitions [\#146](https://github.com/kalisio/kdk/issues/146)
-  Standardize the behavior of all widgets [\#143](https://github.com/kalisio/kdk/issues/143)
- It should be able to customize the leading action in the AppBar [\#132](https://github.com/kalisio/kdk/issues/132)
- Improve Mapillary layer performances [\#129](https://github.com/kalisio/kdk/issues/129)
- Refactor KLocationTimeSeries using the new widget design [\#121](https://github.com/kalisio/kdk/issues/121)
- Provide basic components to enable Mapillary integration [\#115](https://github.com/kalisio/kdk/issues/115)
- Enhance KTimeline design to be more responsive [\#109](https://github.com/kalisio/kdk/issues/109)
- Manage real-time and archive/forecast mode [\#108](https://github.com/kalisio/kdk/issues/108)
- Merge kdk modules into a single module [\#65](https://github.com/kalisio/kdk/issues/65)

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
- Improve application webhook security [\#84](https://github.com/kalisio/kdk/issues/84)
- Provide an helper component to display a text with an icon  [\#76](https://github.com/kalisio/kdk/issues/76)
- Provide a KOpener proxy that allows to simplify the use of the KOpener [\#130](https://github.com/kalisio/kdk/issues/130)

## [v1.0.0](https://github.com/kalisio/kdk/tree/v1.0.0) (2020-01-20)

[Full Changelog](https://github.com/kalisio/kdk/compare/v0.3.0...v1.0.0)

**Implemented enhancements:**

- Add a regex to only publish on tags of the form 'vX.X.X' [\#59](https://github.com/kalisio/kdk/issues/59)
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