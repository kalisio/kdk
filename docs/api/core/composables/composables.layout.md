# Layout

## Overview

`useLayout()` provides programmatic control over the KDK application layout. It exposes methods to configure or clear the entire layout from a configuration object, change the global layout mode, and manage individual panes for all four placements (`top`, `left`, `bottom`, `right`).

It delegates all mutations to the [Layout](../application.md) singleton.

## Usage

```javascript
import { useLayout } from '@kalisio/kdk/core.client'

const { configureLayout, clearLayout, setTopPane, setLeftPaneVisible } = useLayout()
```

## Exposed

### Global

| Name | Description |
|------|-------------|
| `Layout` | Direct reference to the `Layout` singleton for advanced use. |
| `configureLayout(configuration, context)` | Applies a full layout configuration object. Supports `view`, `padding`, `header`, `footer`, `page`, `stickies`, `fab`, `panes.*`, `windows.*`, and `mode` keys. Also accepts legacy `leftPane`, `rightPane`, `topPane`, `bottomPane` keys for backward compatibility. `context` is the binding context (usually `this`). |
| `clearLayout()` | Resets all layout elements (focus, view, padding, header, footer, page, stickies, fab, all panes, all windows, mode) to their defaults. |
| `setLayoutMode(mode)` | Sets the global layout mode if `mode` is truthy. |

### Per-placement pane methods

The following methods are generated for each placement: **Top**, **Left**, **Bottom**, **Right**. Replace `{Placement}` with the desired placement name.

| Name | Description |
|------|-------------|
| `set{Placement}Pane(options, context)` | Sets the content, mode, and filter of the pane at the given placement. |
| `set{Placement}PaneMode(mode)` | Switches the active mode of the pane. |
| `set{Placement}PaneFilter(filter)` | Applies a sift filter to the pane's component list. |
| `set{Placement}PaneVisible(visible)` | Shows or hides the pane. |
| `set{Placement}PaneOpener(opener)` | Shows or hides the pane's opener/toggle button. |
| `clear{Placement}Pane()` | Resets the pane to its default state. |
