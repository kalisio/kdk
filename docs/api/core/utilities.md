# Utilities

## Account

### [utils.account](./utilities/utils.account.md)

Helper functions for user account management: email verification, password reset, identity change, and signup flows. Backed by the KDK `account` FeathersJS service.

## Actions

### [utils.actions](./utilities/utils.actions.md)

Exports `actionProps`, a reusable Vue props definition object shared by all KDK action components (buttons, FAB actions, tabs, items, etc.).

## Collection

### [utils.collection](./utilities/utils.collection.md)

Helpers for querying FeathersJS collections: `listItems`, `getOldestItem`, `getLatestItem`, `getDistinctValues`, `searchText`, `containsText`, and `getCollectionService`.

## Colors

### [utils.colors](./utilities/utils.colors.md)

Color utilities including Quasar and HTML palette constants, `getHtmlColor`, `getPaletteFromColor`, `findClosestPaletteColor`, `getContrastColor`, and `buildColorScale`.

## Content

### [utils.content](./utilities/utils.content.md)

The content binding and filtering engine. Provides `filterContent`, `bindContent`, `bindProperties`, `bindHandler`, `generateHandler`, `bindParams`, and `getBoundValue` to connect configuration-driven UI component definitions to their runtime context via `:xxx` syntax.

## Files

### [utils.files](./utilities/utils.files.md)

Browser-compatible file path and size utilities: `getFileName`, `getExtension`, `getBaseName`, `getDir`, and `formatSize`.

## Items

### [utils.items](./utilities/utils.items.md)

Exports `CardSectionProps`, a reusable Vue props definition object shared by KDK card section components.

## Locale

### [utils.locale](./utilities/utils.locale.md)

Locale detection utilities: `getBrowserLocale`, `getLocale`, and `getFallbackLocale`.

## Math

### [utils.math](./utilities/utils.math.md)

Mathematical helpers for animations and interpolation: `clamp`, `easeOut`, `linear`, and `cubicBezier`.

## Offline

### [utils.offline](./utilities/utils.offline.md)

Offline-first synchronisation utilities. Manages Automerge CRDT offline documents and offline-capable service instances via `LocalCache`.

## Push

### [utils.push](./utilities/utils.push.md)

Provides `subscribeToPushNotifications` for registering a device with the KDK web push notification system. Requires PWA mode.

## Screen

### [utils.screen](./utilities/utils.screen.md)

Responsive screen helpers: `computeResponsiveWidth`, `computeResponsiveHeight`, `computeResponsiveSize`, `getOrientation`, `toggleFullscreen`, and `lockOrientation`.

## Services

### [utils.services](./utilities/utils.services.md)

Service operation classification helpers and event listener utilities: `listenToServiceEvents`, `unlistenToServiceEvents`, and `isReadOperation`, `isCreateOperation`, `isUpdateOperation`, `isRemoveOperation`, `isDataOperation`, `isCustomOperation`.

## Session

### [utils.session](./utilities/utils.session.md)

Core authentication and session management functions: `login`, `register`, `logout`, `restoreSession`, `updateAbilities`, `updateUser`, `logoutUser`, `subscribeToUserChanges`, and `unsubscribeToUserChanges`.

## Shapes

### [utils.shapes](./utilities/utils.shapes.md)

SVG/HTML shape generation for map markers and point symbols. Exports the `Shapes` catalog and `createShape(options)` which produces HTML strings with optional icon, text, and HTML overlays.

## Tags

### [utils.tags](./utilities/utils.tags.md)

Provides `getTagsFilterOptions(service)` to fetch available tags for a given service from the KDK `tags` service.

## Time

### [utils.time](./utilities/utils.time.md)

Time-related utilities: `getTimezoneLabel`, `roundHours`, `roundMinutes`, and `getNearestIntervalTime` for interval-based time snapping.

## Tours

### [utils.tours](./utilities/utils.tours.md)

Exports `buildTours(config)` which transforms a Vue Router route configuration tree into a flat map of tour step arrays for the KDK tour system.
