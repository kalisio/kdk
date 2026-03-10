# Selection

## Overview

`useSelection(name, options)` creates or retrieves a named reactive selection store. It supports single and multiple selection modes, optional filtering, and item deduplication using a configurable comparator function. The store is initialised with an empty items array, `mode: 'single'`, and `enabled: true` on first call.

## Usage

```javascript
import { useSelection } from '@kalisio/kdk/core.client'

const { selection, selectItem, getSelectedItem, clearSelection } = useSelection('myView')
```

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | `string` | — | Unique selection store name within the application. |
| `options.matches` | `Function` | `_.matches` | Comparator used to determine whether two items are equal. Defaults to Lodash `_.matches`. |

## Exposed

| Name | Type | Description |
|------|------|-------------|
| `selection` | `reactive Object` | The raw selection store (`{ items, mode, enabled, filter }`). |
| `clearSelection()` | `Function` | Empties the selected items array. No-op if selection is disabled. |
| `getSelectionMode()` | `Function` | Returns the current mode (`'single'` or `'multiple'`). |
| `setSelectionMode(mode)` | `Function` | Sets the selection mode. |
| `isSingleSelectionMode()` | `Function` | Returns `true` if current mode is `'single'`. |
| `isMultipleSelectionMode()` | `Function` | Returns `true` if current mode is not `'single'`. |
| `setSelectionEnabled(enabled?)` | `Function` | Enables or disables selection. Defaults to `true`. |
| `isSelectionEnabled()` | `Function` | Returns `true` if selection is currently enabled. |
| `getSelectionFilter()` | `Function` | Returns the current filter function. |
| `setSelectionFilter(filter)` | `Function` | Sets a filter function `(item) => boolean` that prevents certain items from being selected. |
| `selectItem(item)` | `Function` | Adds an item to the selection if it is not already selected and passes the filter. |
| `unselectItem(item)` | `Function` | Removes an item from the selection. |
| `hasSelectedItem()` | `Function` | Returns `true` if at least one item is selected. |
| `hasSelectedItems()` | `Function` | Alias for `hasSelectedItem()`. |
| `getSelectedItem()` | `Function` | Returns the last selected item (useful in single-selection mode). |
| `getSelectedItems()` | `Function` | Returns the full array of selected items. |

::: tip
In single-selection mode, `getSelectedItem()` returns the most recently selected item. To keep true single-selection behaviour, call `clearSelection()` before `selectItem()`.
:::
