# Base Activity

## Overview

The `baseActivity(name)` factory function returns a Vue mixin that makes it easier to manage the application layout when the user navigates to an activity. It provides methods to configure and clear all layout elements (header, footer, panes, page, stickies, FAB, windows) from the activity's configuration options, and re-applies them whenever user abilities change.

The mixin reads its configuration from `config[activityName]` (where `activityName` defaults to the component's name in camelCase if not explicitly provided) and delegates all layout mutations to the [Layout](../application.md) singleton.

## Usage

```javascript
import { baseActivity } from '@kalisio/kdk/core/client'

export default {
  mixins: [baseActivity('myActivity')],
  // ...
}
```

The corresponding activity configuration in `config/default.js` (or environment-specific files) may look like:

```javascript
myActivity: {
  padding: true,
  header: { ... },
  footer: { ... },
  topPane: { content: [...], mode: 'default' },
  leftPane: { content: [...], mode: 'default' },
  bottomPane: { content: [...], mode: 'default' },
  rightPane: { content: [...], mode: 'default' },
  page: { content: [...] },
  stickies: { content: [...] },
  fab: { content: [...] },
  windows: {
    left: { ... },
    right: { ... },
    top: { ... },
    bottom: { ... }
  }
}
```

## Lifecycle

- **`beforeCreate`**: resolves `activityName` (from the `name` argument or the component's own name) and reads `activityOptions` from the application config.
- **`mounted`**: calls `configureActivity()` and registers a listener on the `user-abilities-changed` event so the layout is refreshed whenever permissions change.
- **`beforeUnmount`**: unregisters the `user-abilities-changed` listener and calls `clearActivity()` to restore the layout to its default state.

## Methods

### General

#### `getAppName()`

Returns the application name as defined in `config.appName`.

- **Returns:** `string`

---

### Padding

#### `configurePadding()`

Applies the `padding` value from `activityOptions` to the layout, if defined.

#### `setPadding(padding)`

Sets the layout padding.

- **Parameters:**
  - `padding` *(boolean | number)*: The padding value to apply.

#### `clearPadding()`

Resets the layout padding to its default value (`true`).

---

### Header

#### `configureHeader()`

Applies the `header` configuration from `activityOptions` to the layout, if defined.

#### `clearHeader()`

Resets the layout header to its default state.

---

### Footer

#### `configureFooter()`

Applies the `footer` configuration from `activityOptions` to the layout, if defined.

#### `clearFooter()`

Resets the layout footer to its default state.

---

### Panes

Each of the four panes (`top`, `left`, `bottom`, `right`) exposes the same set of methods. The examples below use `Top` — replace it with `Left`, `Bottom`, or `Right` as needed.

#### `getTopPane()`

Returns the current state of the top pane.

- **Returns:** pane state object

#### `getTopPaneMode()`

Returns the active mode of the top pane.

- **Returns:** `string | undefined`

#### `isTopPaneVisible()`

Returns whether the top pane is currently visible.

- **Returns:** `boolean`

#### `setTopPane(content, mode, filter)`

Sets the content, mode, and filter of the top pane.

- **Parameters:**
  - `content` *(array | object)*: Component definitions to render inside the pane.
  - `mode` *(string)*: The active mode used to select which components to display.
  - `filter` *(object)*: A [sift](https://github.com/crcn/sift.js) filter applied to the component list.

#### `setTopPaneMode(mode)`

Switches the active mode of the top pane without replacing its content.

- **Parameters:**
  - `mode` *(string)*: The new mode.

#### `setTopPaneVisible(visible)`

Shows or hides the top pane.

- **Parameters:**
  - `visible` *(boolean)*: `true` to show, `false` to hide.

#### `configureTopPane()`

Applies the `topPane` configuration from `activityOptions` to the layout, if defined.

#### `clearTopPane()`

Resets the top pane to its default state.

> The same methods exist for the **left**, **bottom**, and **right** panes, replacing `Top` with the corresponding placement name.

---

### Page

#### `getPage()`

Returns the current state of the page element.

- **Returns:** page state object

#### `setPage(content, mode, filter, sticky)`

Sets the content of the page element.

- **Parameters:**
  - `content` *(array | object)*: Component definitions.
  - `mode` *(string)*: The active mode.
  - `filter` *(object)*: A sift filter.
  - `sticky` *(boolean)*: Whether the page content is sticky.

#### `setPageMode(mode)`

Switches the active mode of the page element.

- **Parameters:**
  - `mode` *(string)*: The new mode.

#### `configurePage()`

Applies the `page` configuration from `activityOptions` to the layout, if defined.

#### `clearPage()`

Resets the page element to its default state.

---

### Stickies

#### `getStickies()`

Returns the current state of the stickies element.

- **Returns:** stickies state object

#### `setStickies(content, mode, filter, sticky)`

Sets the content of the stickies element.

- **Parameters:**
  - `content` *(array | object)*: Component definitions.
  - `mode` *(string)*: The active mode.
  - `filter` *(object)*: A sift filter.
  - `sticky` *(boolean)*: Whether items are sticky.

#### `setStickiesMode(mode)`

Switches the active mode of the stickies element.

- **Parameters:**
  - `mode` *(string)*: The new mode.

#### `configureStickies()`

Applies the `stickies` configuration from `activityOptions` to the layout, if defined.

#### `clearStickies()`

Resets the stickies element to its default state.

---

### FAB (Floating Action Button)

#### `getFab()`

Returns the current state of the FAB element.

- **Returns:** FAB state object

#### `setFab(content, mode, filter)`

Sets the content of the FAB.

- **Parameters:**
  - `content` *(array | object)*: Component definitions for the FAB actions.
  - `mode` *(string)*: The active mode.
  - `filter` *(object)*: A sift filter.

#### `configureFab()`

Applies the `fab` configuration from `activityOptions` to the layout, if defined.

#### `clearFab()`

Resets the FAB to its default state.

---

### Windows

#### `configureWindows()`

Iterates over the `windows` map in `activityOptions` and sets each window at its corresponding placement (`top`, `right`, `bottom`, `left`).

#### `clearWindows()`

Clears all windows that were defined in `activityOptions`.

#### `openWindow(placement)`

Makes the window at the given placement visible.

- **Parameters:**
  - `placement` *(string)*: One of `'top'`, `'right'`, `'bottom'`, `'left'`.

#### `closeWindow(placement)`

Hides the window at the given placement.

- **Parameters:**
  - `placement` *(string)*: One of `'top'`, `'right'`, `'bottom'`, `'left'`.

#### `findWindow(widget)`

Finds the window that contains a given widget.

- **Parameters:**
  - `widget` *(string)*: The widget ID to look up.
- **Returns:** `{ placement, window }` — the placement name and window state object, or `{ placement: undefined, window: undefined }` if not found.

#### `isWidgetWindowVisible(widget)`

Returns whether the window hosting the given widget is currently visible.

- **Parameters:**
  - `widget` *(string)*: The widget ID.
- **Returns:** `boolean`

#### `openWidget(widget)`

Activates the given widget in its window and makes the window visible.

- **Parameters:**
  - `widget` *(string)*: The widget ID.

#### `closeWidget(widget)`

Hides the window that contains the given widget.

- **Parameters:**
  - `widget` *(string)*: The widget ID.

---

### Focus and Mode

#### `clearFocus()`

Clears the current layout focus, restoring the default z-index of the previously focused element.

#### `clearMode()`

Resets the global layout mode to `undefined`.

---

### Activity Lifecycle

#### `configureActivity()`

Convenience method that sequentially calls all `configure*` methods:
`configurePadding`, `configureHeader`, `configureFooter`, `configureTopPane`, `configureLeftPane`, `configureBottomPane`, `configureRightPane`, `configurePage`, `configureStickies`, `configureFab`, `configureWindows`.

This is called automatically on `mounted` and whenever the `user-abilities-changed` event is emitted.

#### `clearActivity()`

Convenience method that sequentially calls all `clear*` methods:
`clearPadding`, `clearFocus`, `clearHeader`, `clearFooter`, `clearTopPane`, `clearBottomPane`, `clearLeftPane`, `clearRightPane`, `clearPage`, `clearStickies`, `clearFab`, `clearWindows`, `clearMode`.

This is called automatically on `beforeUnmount`.

---

### Navigation

#### `goBack()`

Navigates to the previous route using `this.$router.back()`.

#### `refresh()`

Reloads the current page using `window.location.reload()`.

---

### Tours

#### `launchTour(name)`

Launches an interactive tour. If `name` is omitted, the tour name is derived from the current route name, appending the `page` route parameter when present (e.g. `myRoute/myPage`).

- **Parameters:**
  - `name` *(string, optional)*: The name of the tour to launch.

::: tip
Tour names are matched against entries in the KDK tour store (`tours.current`).
:::
